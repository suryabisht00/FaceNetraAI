'use client'

import { Camera } from 'lucide-react'

interface ProfileCoverPhotoProps {
  coverPhotoUrl: string
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploading: boolean
}

export default function ProfileCoverPhoto({
  coverPhotoUrl,
  onUpload,
  uploading,
}: ProfileCoverPhotoProps) {
  return (
    <div className="relative w-full h-32 sm:h-48 bg-gradient-to-br from-primary/20 to-purple-900/20 rounded-lg overflow-hidden group">
      {coverPhotoUrl ? (
        <img
          src={coverPhotoUrl}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-pink-600/30" />
      )}
      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-white">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : (
            <>
              <Camera className="w-8 h-8" />
              <span className="text-sm font-medium">Change Cover Photo</span>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  )
}
