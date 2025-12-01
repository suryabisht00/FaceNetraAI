'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authUtils } from '@/lib/utils/auth'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import EditProfileHeader from '@/components/profile/EditProfileHeader'
import ProfileCoverPhoto from '@/components/profile/ProfileCoverPhoto'
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload'
import ProfileFormFields from '@/components/profile/ProfileFormFields'
import InterestTags from '@/components/profile/InterestTags'
import PrivacyToggle from '@/components/profile/PrivacyToggle'
import { useProfileUpdate } from '@/hooks/useProfileUpdate'
import { useImageUpload } from '@/hooks/useImageUpload'

interface ProfileData {
  fullName: string
  username: string
  bio: string
  profilePictureUrl: string
  coverPhotoUrl: string
  interests: string[]
  instagramUsername: string
  email: string
  phone: string
  showDiaryPublicly: boolean
}

export default function ProfileSetupPage() {
  return (
    <ProtectedRoute>
      <ProfileSetupContent />
    </ProtectedRoute>
  )
}

function ProfileSetupContent() {
  const router = useRouter()
  const { updateProfile, loading, error, success, setError } = useProfileUpdate()
  const { uploadImage, uploadingProfile, uploadingCover } = useImageUpload()

  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    username: '',
    bio: '',
    profilePictureUrl: '',
    coverPhotoUrl: '',
    interests: [],
    instagramUsername: '',
    email: '',
    phone: '',
    showDiaryPublicly: false,
  })

  // Fetch existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          headers: authUtils.getAuthHeader(),
        })

        if (response.ok) {
          const { data } = await response.json()
          setProfile({
            fullName: data.fullName || '',
            username: data.username || '',
            bio: data.bio || '',
            profilePictureUrl: data.profilePictureUrl || '',
            coverPhotoUrl: data.coverPhotoUrl || '',
            interests: data.interests?.map((i: any) => i.interest) || [],
            instagramUsername:
              data.socialLinks?.find((s: any) => s.platform === 'INSTAGRAM')?.username || '',
            email: data.email || '',
            phone: data.phone || '',
            showDiaryPublicly: data.privacySettings?.showInSearch || false,
          })
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }

    if (authUtils.isAuthenticated()) {
      fetchProfile()
    }
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await uploadImage(file, type)
    
    if (url) {
      if (type === 'profile') {
        setProfile(prev => ({ ...prev, profilePictureUrl: url }))
      } else {
        setProfile(prev => ({ ...prev, coverPhotoUrl: url }))
      }
    } else {
      setError('Failed to upload image')
    }
  }

  const handleInterestsChange = (value: string) => {
    const interestsArray = value
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0)
    setProfile((prev) => ({ ...prev, interests: interestsArray }))
  }

  const handleFieldChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleTogglePrivacy = () => {
    setProfile((prev) => ({ ...prev, showDiaryPublicly: !prev.showDiaryPublicly }))
  }

  const handleRemoveInterest = (index: number) => {
    const newInterests = profile.interests.filter((_, i) => i !== index)
    setProfile(prev => ({ ...prev, interests: newInterests }))
  }

  const handleAddInterest = (interest: string) => {
    if (interest && !profile.interests.includes(interest)) {
      setProfile(prev => ({ ...prev, interests: [...prev.interests, interest] }))
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const isSuccess = await updateProfile(profile)
    
    if (isSuccess) {
      setTimeout(() => {
        router.push('/feed')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] pt-16">
      <EditProfileHeader onSave={handleSubmit} loading={loading} />

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Photo Section */}
          <div className="relative">
            <ProfileCoverPhoto
              coverPhotoUrl={profile.coverPhotoUrl}
              onUpload={(e) => handleImageUpload(e, 'cover')}
              uploading={uploadingCover}
            />

            <ProfilePictureUpload
              profilePictureUrl={profile.profilePictureUrl}
              fullName={profile.fullName}
              onUpload={(e) => handleImageUpload(e, 'profile')}
              uploading={uploadingProfile}
            />
          </div>

          {/* Spacer for profile picture */}
          <div className="h-12 sm:h-16"></div>

          {/* Form Fields */}
          <ProfileFormFields
            profile={profile}
            onFieldChange={handleFieldChange}
            onInterestsChange={handleInterestsChange}
          />

          {/* Interest Tags Display */}
          <InterestTags
            interests={profile.interests}
            onRemove={handleRemoveInterest}
            onAdd={handleAddInterest}
          />

          {/* Privacy Toggle */}
          <PrivacyToggle
            checked={profile.showDiaryPublicly}
            onChange={handleTogglePrivacy}
          />

          {/* Submit Button - Fixed at Bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#0B0F1A] border-t border-white/10 p-4 z-10">
            <div className="max-w-4xl mx-auto">
              <button
                type="submit"
                disabled={loading || uploadingProfile || uploadingCover}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
