'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreatePost from '@/components/post/CreatePost';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AddPostPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Show success message and redirect
    router.push('/feed');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-[#050810] to-[#0B0F1A] pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
            <p className="text-gray-400">Share your thoughts, photos, or videos with your network</p>
          </div>

          {/* Create Post Component */}
          <CreatePost onSuccess={handleSuccess} />

          {/* Tips Section */}
          <div className="mt-6 bg-[#0B0F1A] border border-primary/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Posting Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Upload up to 10 images or videos per post</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Image size limit: 10MB per file</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Video size limit: 50MB per file</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Choose visibility: Public, Friends Only, or Private</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Supported formats: JPG, PNG, GIF, MP4, MOV, AVI</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/feed')}
              className="p-4 bg-[#0B0F1A] border border-primary/20 rounded-xl hover:bg-[#1a1f2e] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-white font-medium">View Feed</h4>
                  <p className="text-gray-400 text-sm">See what's new</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/profile-setup')}
              className="p-4 bg-[#0B0F1A] border border-primary/20 rounded-xl hover:bg-[#1a1f2e] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-white font-medium">My Profile</h4>
                  <p className="text-gray-400 text-sm">Edit profile</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
