'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PostCard from '@/components/post/PostCard';
import { usePosts } from '@/lib/hooks/usePosts';
import { useAuth } from '@/lib/hooks/useAuth';

export default function FeedPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { posts, isLoading, error, fetchPosts, toggleLike, addComment } = usePosts();

  useEffect(() => {
    // Only fetch posts if user is authenticated
    if (isAuthenticated && !authLoading) {
      // Fetch public feed - all public posts from all users
      fetchPosts({ limit: 20, publicFeed: true });
    }
  }, [isAuthenticated, authLoading, fetchPosts]);

  const handleLike = async (postId: string) => {
    await toggleLike(postId);
  };

  const handleComment = async (postId: string) => {
    // Navigate to post detail or open comment modal
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    // Implement share functionality
    console.log('Share post:', postId);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-b from-[#050810] to-[#0B0F1A] pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          {/* <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Public Feed</h1>
            <p className="text-gray-400">Discover and connect with posts from the community</p>
          </div> */}

          {/* Quick Create Post Button */}
          {/* <button
            onClick={() => router.push('/add-post')}
            className="w-full mb-6 p-4 bg-[#0B0F1A] border border-primary/20 rounded-2xl hover:bg-[#1a1f2e] transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-gray-400">What's on your mind?</span>
          </button> */}

          {/* Loading State */}
          {isLoading && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6">
              {error}
            </div>
          )}

          {/* Posts List */}
          {!isLoading && posts.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">Be the first to share something!</p>
              <button
                onClick={() => router.push('/add-post')}
                className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium transition-all"
              >
                Create Post
              </button>
            </div>
          )}

          {posts.length > 0 && (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {posts.length > 0 && !isLoading && (
            <div className="mt-6 text-center">
              <button
                onClick={() => fetchPosts({ limit: 20, offset: posts.length, publicFeed: true })}
                className="px-6 py-3 bg-[#0B0F1A] border border-primary/20 rounded-xl text-white hover:bg-[#1a1f2e] transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}