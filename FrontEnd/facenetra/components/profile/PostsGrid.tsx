'use client';

import React, { useState } from 'react';
import { Post } from '@/lib/types';
import { Heart, MessageCircle, Play } from 'lucide-react';
import PostCard from '@/components/post/PostCard';

interface PostsGridProps {
  posts: Post[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export default function PostsGrid({ posts, onLoadMore, hasMore, loading }: PostsGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <svg className="w-20 h-20 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">No posts yet</p>
        <p className="text-sm">When this user shares photos or videos, they'll appear here.</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid View */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {posts.map((post) => {
          const firstMedia = post.media?.[0];
          const hasMultipleMedia = post.media && post.media.length > 1;

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="relative aspect-square bg-[#1a1f2e] cursor-pointer group overflow-hidden"
            >
              {/* Post Media or Placeholder */}
              {firstMedia ? (
                <>
                  {firstMedia.mediaType === 'VIDEO' ? (
                    <>
                      <video
                        src={firstMedia.mediaUrl}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg" fill="white" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={firstMedia.mediaUrl}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {hasMultipleMedia && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3zm0 2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1H6zm9 2h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V8a1 1 0 011-1z" />
                      </svg>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-pink-600/20 p-3 sm:p-4">
                  <p className="text-white text-xs sm:text-sm text-center line-clamp-4">
                    {post.content}
                  </p>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1 sm:gap-2 text-white">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                  <span className="font-semibold text-sm sm:text-base">{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-white">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                  <span className="font-semibold text-sm sm:text-base">{post.commentsCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="w-full max-w-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <PostCard post={selectedPost} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
