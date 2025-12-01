'use client'

import { Camera } from 'lucide-react'

interface ProfilePictureUploadProps {
  profilePictureUrl: string
  fullName: string
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploading: boolean
}

export default function ProfilePictureUpload({
  profilePictureUrl,
  fullName,
  onUpload,
  uploading,
}: ProfilePictureUploadProps) {
  return (
    <div className="absolute -bottom-12 left-4 sm:left-6">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#0B0F1A] bg-primary/20 overflow-hidden group">
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-pink-600">
            <span className="text-3xl sm:text-4xl font-bold text-white">
              {fullName.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : (
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  )
}
