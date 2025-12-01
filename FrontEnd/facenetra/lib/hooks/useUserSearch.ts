import { useState } from 'react';
import { Post, ProfileResponse } from '@/lib/types';

interface UserSearchData {
  profile: ProfileResponse;
  posts: Post[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const useUserSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserSearchData | null>(null);

  const fetchUserByVectorId = async (vectorId: string, limit = 12, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/users/by-vector/${vectorId}?limit=${limit}&offset=${offset}`
      );
      
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch user data');
      }

      setUserData(data.data);
      return data.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch user profile';
      setError(errorMessage);
      setUserData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async (vectorId: string) => {
    if (!userData || !userData.pagination.hasMore || loading) return;

    const nextOffset = userData.pagination.offset + userData.pagination.limit;
    
    try {
      const newData = await fetchUserByVectorId(
        vectorId,
        userData.pagination.limit,
        nextOffset
      );

      // Append new posts to existing ones
      setUserData({
        ...newData,
        posts: [...userData.posts, ...newData.posts],
      });
    } catch (err) {
      // Error is already set in fetchUserByVectorId
      console.error('Failed to load more posts:', err);
    }
  };

  const reset = () => {
    setUserData(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    userData,
    fetchUserByVectorId,
    loadMorePosts,
    reset,
  };
};
