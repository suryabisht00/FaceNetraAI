'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PostQuickCreate from '@/components/post/PostQuickCreate';
import MyPostCard from '@/components/post/MyPostCard';
import { usePosts } from '@/lib/hooks/usePosts';
import { useAuth } from '@/lib/hooks/useAuth';

export default function MyPostsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { posts, isLoading, error, fetchPosts, toggleLike, deletePost, updatePost } = usePosts({
    userId: user?.id,
  });
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch posts if user is authenticated
    if (isAuthenticated && !authLoading && user?.id) {
      fetchPosts({ limit: 50 });
    }
  }, [isAuthenticated, authLoading, user?.id, fetchPosts]);

  const handleEdit = (postId: string) => {
    // Navigate to edit page (you can create this later)
    console.log('Edit post:', postId);
    // router.push(`/edit-post/${postId}`);
  };

  const handleDelete = async (postId: string) => {
    setDeletingPostId(postId);
    const success = await deletePost(postId);
    if (success) {
      // Post deleted successfully
      console.log('Post deleted');
    } else {
      console.error('Failed to delete post');
    }
    setDeletingPostId(null);
  };

  const handleTogglePin = async (postId: string) => {
    // You'll need to implement this in your API
    console.log('Toggle pin:', postId);
    // await togglePinPost(postId);
  };

  const handleLike = async (postId: string) => {
    await toggleLike(postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
    // Implement comment functionality
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
    // Implement share functionality
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-[#050810] to-[#0B0F1A] pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">My Posts</h1>
            <p className="text-gray-400">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>

          {/* Quick Create Post */}
          <div className="mb-6">
            <PostQuickCreate />
          </div>

          {/* Loading State */}
          {isLoading && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading your posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && posts.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">
                Share your first post with the community!
              </p>
              <button
                onClick={() => router.push('/add-post')}
                className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium transition-all"
              >
                Create Your First Post
              </button>
            </div>
          )}

          {/* Posts List */}
          {posts.length > 0 && (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className={deletingPostId === post.id ? 'opacity-50 pointer-events-none' : ''}>
                  <MyPostCard
                    post={post}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTogglePin={handleTogglePin}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Stats Card */}
          {posts.length > 0 && (
            <div className="mt-6 bg-[#0B0F1A] border border-primary/20 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Post Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {posts.reduce((sum, post) => sum + post.likesCount, 0)}
                  </div>
                  <div className="text-sm text-gray-400">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {posts.reduce((sum, post) => sum + post.commentsCount, 0)}
                  </div>
                  <div className="text-sm text-gray-400">Total Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {posts.filter(post => post.visibility === 'PUBLIC').length}
                  </div>
                  <div className="text-sm text-gray-400">Public Posts</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
