'use client'

import { User, AtSign, FileText, Tag, Instagram, Globe, Phone } from 'lucide-react'

interface ProfileFormFieldsProps {
  profile: {
    fullName: string
    username: string
    bio: string
    email: string
    phone: string
    instagramUsername: string
    interests: string[]
  }
  onFieldChange: (field: string, value: string) => void
  onInterestsChange: (value: string) => void
}

export default function ProfileFormFields({
  profile,
  onFieldChange,
  onInterestsChange,
}: ProfileFormFieldsProps) {
  return (
    <div className="bg-[#1a1f2e] rounded-lg divide-y divide-white/10">
      {/* Full Name */}
      <div className="flex items-center p-4">
        <label className="w-24 sm:w-32 text-sm text-gray-400 flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Name</span>
        </label>
        <input
          type="text"
          value={profile.fullName}
          onChange={(e) => onFieldChange('fullName', e.target.value)}
          placeholder="Full Name"
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
          required
        />
      </div>

      {/* Username */}
      <div className="flex items-center p-4">
        <label className="w-24 sm:w-32 text-sm text-gray-400 flex items-center gap-2">
          <AtSign className="w-4 h-4" />
          <span>Username</span>
        </label>
        <input
          type="text"
          value={profile.username}
          onChange={(e) => onFieldChange('username', e.target.value)}
          placeholder="username"
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Bio */}
      <div className="flex items-start p-4">
        <label className="w-24 sm:w-32 pt-2 text-sm text-gray-400 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Bio</span>
        </label>
        <textarea
          value={profile.bio}
          onChange={(e) => onFieldChange('bio', e.target.value)}
          placeholder="Tell us about yourself..."
          rows={3}
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
        />
      </div>

      {/* Email */}
      <div className="flex items-center p-4">
        <label className="w-24 sm:w-32 text-sm text-gray-400 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>Email</span>
        </label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          placeholder="email@example.com"
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Phone */}
      <div className="flex items-center p-4">
        <label className="w-24 sm:w-32 text-sm text-gray-400 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>Phone</span>
        </label>
        <input
          type="tel"
          value={profile.phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          placeholder="+1234567890"
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Instagram */}
      <div className="flex items-center p-4">
        <label className="w-24 sm:w-32 text-sm text-gray-400 flex items-center gap-2">
          <Instagram className="w-4 h-4" />
          <span>Instagram</span>
        </label>
        <input
          type="text"
          value={profile.instagramUsername}
          onChange={(e) => onFieldChange('instagramUsername', e.target.value)}
          placeholder="instagram_username"
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Interests */}
      <div className="flex items-start p-4">
        <label className="w-24 sm:w-32 pt-2 text-sm text-gray-400 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <span>Interests</span>
        </label>
        <div className="flex-1">
          <input
            type="text"
            value={profile.interests.join(', ')}
            onChange={(e) => onInterestsChange(e.target.value)}
            placeholder="Art, Music, Tech..."
            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
        </div>
      </div>
    </div>
  )
}
