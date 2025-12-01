'use client';

import React, { useState } from 'react';
import { Post } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike?.(post.id);
  };

  const getTimeAgo = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="bg-[#0B0F1A] border border-primary/20 rounded-2xl overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center overflow-hidden">
          {post.user.profilePictureUrl ? (
            <img src={post.user.profilePictureUrl} alt={post.user.fullName} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold">{post.user.fullName}</h3>
            {post.user.isVerified && (
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            {post.user.username ? `@${post.user.username}` : ''} · {getTimeAgo(post.createdAt)}
          </p>
        </div>
        {post.visibility !== 'PUBLIC' && (
          <div className="px-2 py-1 bg-primary/10 border border-primary/30 rounded text-xs text-primary">
            {post.visibility === 'PRIVATE' ? '🔒 Private' : '👥 Friends'}
          </div>
        )}
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-white whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className={`${post.media.length === 1 ? '' : 'grid grid-cols-2 gap-1'}`}>
          {post.media.map((media, index) => (
            <div key={media.id} className={`relative bg-black ${index === 0 && post.media.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
              {media.mediaType === 'VIDEO' ? (
                <video
                  src={media.mediaUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster={media.mediaUrl}
                />
              ) : (
                <img
                  src={media.mediaUrl}
                  alt="Post media"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 border-t border-primary/10">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          <span>{post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}</span>
          {post.sharesCount > 0 && <span>{post.sharesCount} shares</span>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
              isLiked
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'bg-[#1a1f2e] text-gray-400 hover:bg-[#252b3d] border border-transparent'
            }`}
          >
            <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-medium">Like</span>
          </button>

          <button
            onClick={() => {
              setShowComments(!showComments);
              onComment?.(post.id);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#1a1f2e] text-gray-400 hover:bg-[#252b3d] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button
            onClick={() => onShare?.(post.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#1a1f2e] text-gray-400 hover:bg-[#252b3d] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
