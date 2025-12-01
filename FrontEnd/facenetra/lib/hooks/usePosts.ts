'use client';

import { useState, useCallback } from 'react';
import { Post } from '@/lib/types';

interface UsePostsOptions {
  initialPosts?: Post[];
  userId?: string;
}

interface CreatePostData {
  content: string;
  postType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK';
  visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
  media?: Array<{
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'GIF';
    width?: number;
    height?: number;
    fileSize?: number;
  }>;
}

export function usePosts({ initialPosts = [], userId }: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch posts (feed or user posts)
   */
  const fetchPosts = useCallback(async (options?: { limit?: number; offset?: number; publicFeed?: boolean }) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // User not logged in - silently return without error
        setIsLoading(false);
        return null;
      }

      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      // Determine which endpoint to use
      let endpoint = '/api/posts';
      if (options?.publicFeed) {
        // Public feed - all public posts from all users
        endpoint = '/api/posts/public-feed';
      } else if (userId) {
        // User-specific posts
        params.append('userId', userId);
      }

      const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Check if it's an auth error (401) - silently return
        if (response.status === 401) {
          setIsLoading(false);
          return null;
        }
        // Only log error, don't throw for other errors when not authenticated
        console.warn('Failed to fetch posts:', response.status);
        setIsLoading(false);
        return null;
      }

      const data = await response.json();

      if (data.success) {
        setPosts(data.data);
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch posts');
      }
    } catch (err) {
      // Silently handle errors for unauthenticated users
      console.warn('Fetch posts error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * Create a new post
   */
  const createPost = useCallback(async (data: CreatePostData) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const result = await response.json();

      if (result.success) {
        // Add new post to the beginning of the list
        setPosts((prev) => [result.data, ...prev]);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create post');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Create post error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Like or unlike a post
   */
  const toggleLike = useCallback(async (postId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const result = await response.json();

      if (result.success) {
        // Update the post in the list
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likesCount: result.data.liked
                    ? post.likesCount + 1
                    : post.likesCount - 1,
                }
              : post
          )
        );
        return result.data.liked;
      }
    } catch (err) {
      console.error('Toggle like error:', err);
      return null;
    }
  }, []);

  /**
   * Delete a post
   */
  const deletePost = useCallback(async (postId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      const result = await response.json();

      if (result.success) {
        // Remove the post from the list
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Delete post error:', err);
      return false;
    }
  }, []);

  /**
   * Update a post
   */
  const updatePost = useCallback(
    async (postId: string, data: { content?: string; visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY' }) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`/api/posts/${postId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update post');
        }

        const result = await response.json();

        if (result.success) {
          // Update the post in the list
          setPosts((prev) =>
            prev.map((post) => (post.id === postId ? result.data : post))
          );
          return result.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        console.error('Update post error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Add a comment to a post
   */
  const addComment = useCallback(async (postId: string, content: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const result = await response.json();

      if (result.success) {
        // Update the post's comment count
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, commentsCount: post.commentsCount + 1 }
              : post
          )
        );
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('Add comment error:', err);
      return null;
    }
  }, []);

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    createPost,
    toggleLike,
    deletePost,
    updatePost,
    addComment,
  };
}
