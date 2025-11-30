import React from 'react';
import Image from 'next/image';

interface ProfileCardProps {
  name: string;
  username: string;
  interests: string;
  diary: string;
  imageUrl: string;
}

export default function ProfileCard({ name, username, interests, diary, imageUrl }: ProfileCardProps) {
  return (
    <div className="relative w-full max-w-sm p-8 glassmorphism-card rounded-2xl neon-glow-border">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <Image
            className="size-24 rounded-full border-2 border-primary object-cover neon-glow-subtle"
            src={imageUrl}
            alt={`${name}'s profile`}
            width={96}
            height={96}
          />
          <div className="absolute bottom-0 right-0 size-8 bg-primary rounded-full flex items-center justify-center border-2 border-[#0B0F1A] neon-glow-subtle cursor-pointer">
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold text-white">{name}</p>
          <p className="text-sm text-primary">@{username}</p>
        </div>
        <p className="text-sm text-[#E5E7EB]">{interests}</p>
        <div className="w-full p-3 bg-white/5 rounded-lg text-left">
          <p className="text-xs font-bold text-primary mb-1">Mini Diary</p>
          <p className="text-sm text-[#E5E7EB]">{diary}</p>
        </div>
      </div>
    </div>
  );
}
