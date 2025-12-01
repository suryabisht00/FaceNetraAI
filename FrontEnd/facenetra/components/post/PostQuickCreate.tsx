'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function PostQuickCreate() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <button
      onClick={() => router.push('/add-post')}
      className="w-full p-4 bg-[#0B0F1A] border border-primary/20 rounded-2xl hover:bg-[#1a1f2e] transition-all flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center overflow-hidden">
        {user?.profilePictureUrl ? (
          <img src={user.profilePictureUrl} alt={user.fullName} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>
      <span className="text-gray-400">What's on your mind?</span>
    </button>
  );
}
