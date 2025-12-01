'use client';

import React from 'react';
import { ProfileResponse, Post } from '@/lib/types';
import ProfileHeader from './ProfileHeader';
import PostsGrid from './PostsGrid';
import { ArrowLeft } from 'lucide-react';

interface UserProfileViewProps {
  profile: ProfileResponse;
  posts: Post[];
  onBack?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export default function UserProfileView({
  profile,
  posts,
  onBack,
  onLoadMore,
  hasMore,
  loading,
}: UserProfileViewProps) {
  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      {/* Header with Back Button */}
      {onBack && (
        <div className="sticky top-0 z-10 bg-[#0B0F1A]/95 backdrop-blur-sm border-b border-primary/20">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white">{profile.fullName}</h2>
              <p className="text-xs text-gray-400">{profile.stats.postsCount} posts</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Posts Section */}
      <div className="border-t border-primary/20">
        {/* Section Header */}
        <div className="flex items-center justify-center py-3 border-b border-primary/20">
          <div className="flex items-center gap-2 text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 11a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <span className="font-semibold text-sm uppercase tracking-wide">Posts</span>
          </div>
        </div>

        {/* Posts Grid */}
        <PostsGrid
          posts={posts}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          loading={loading}
        />
      </div>
    </div>
  );
}
