'use client';

import React from 'react';
import { ProfileResponse } from '@/lib/types';
import { MapPin, Link as LinkIcon, Calendar, Mail, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileHeaderProps {
  profile: ProfileResponse;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const socialPlatformIcons: Record<string, string> = {
    INSTAGRAM: '📷',
    TWITTER: '🐦',
    LINKEDIN: '💼',
    FACEBOOK: '👥',
    GITHUB: '🐙',
    TIKTOK: '🎵',
    YOUTUBE: '📺',
  };

  return (
    <div className="bg-[#0B0F1A] border-b border-primary/20">
      {/* Cover Photo */}
      <div className="relative w-full h-32 sm:h-48 bg-linear-to-br from-primary/20 to-purple-900/20">
        {profile.coverPhotoUrl ? (
          <img
            src={profile.coverPhotoUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary/30 to-pink-600/30" />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-16 mb-4">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#0B0F1A] bg-primary/20 overflow-hidden">
              {profile.profilePictureUrl ? (
                <img
                  src={profile.profilePictureUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-pink-600">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {profile.isVerified && (
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full border-2 border-[#0B0F1A] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>

          {/* Stats - Mobile */}
          <div className="flex gap-4 mt-3 sm:hidden">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{profile.stats.postsCount}</div>
              <div className="text-xs text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{profile.stats.followersCount}</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{profile.stats.followingCount}</div>
              <div className="text-xs text-gray-400">Following</div>
            </div>
          </div>
        </div>

        {/* Name and Username */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white">{profile.fullName}</h1>
          </div>
          {profile.username && (
            <p className="text-gray-400 text-sm">@{profile.username}</p>
          )}
        </div>

        {/* Stats - Desktop */}
        <div className="hidden sm:flex gap-6 mb-4">
          <div className="flex items-center gap-1">
            <span className="font-bold text-white">{profile.stats.postsCount}</span>
            <span className="text-gray-400 text-sm">posts</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-white">{profile.stats.followersCount}</span>
            <span className="text-gray-400 text-sm">followers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-white">{profile.stats.followingCount}</span>
            <span className="text-gray-400 text-sm">following</span>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-white mb-3 text-sm sm:text-base whitespace-pre-wrap">{profile.bio}</p>
        )}

        {/* Contact Info */}
        {(profile.email || profile.phone) && (
          <div className="flex flex-wrap gap-3 mb-3">
            {profile.email && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {profile.interests.slice(0, 5).map((interest) => (
                <span
                  key={interest.id}
                  className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs text-primary"
                >
                  {interest.interest}
                </span>
              ))}
              {profile.interests.length > 5 && (
                <span className="px-3 py-1 bg-primary/5 border border-primary/20 rounded-full text-xs text-gray-400">
                  +{profile.interests.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1f2e] hover:bg-[#252b3d] border border-primary/20 rounded-lg text-sm text-gray-300 hover:text-primary transition-all"
              >
                <span>{socialPlatformIcons[link.platform] || '🔗'}</span>
                <span>@{link.username}</span>
              </a>
            ))}
          </div>
        )}

        {/* Member Since */}
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Calendar className="w-3 h-3" />
          <span>
            Member since {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}
