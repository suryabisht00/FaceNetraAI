'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authUtils } from '@/lib/utils/auth'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ProfilePreview from '@/components/profile/ProfilePreview'
import ProfileForm from '@/components/profile/ProfileForm'

interface ProfileData {
  fullName: string
  username: string
  bio: string
  profilePictureUrl: string
  interests: string[]
  instagramUsername: string
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    username: '',
    bio: '',
    profilePictureUrl: '',
    interests: [],
    instagramUsername: '',
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
            interests: data.interests?.map((i: any) => i.interest) || [],
            instagramUsername:
              data.socialLinks?.find((s: any) => s.platform === 'INSTAGRAM')?.username || '',
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

  const handleInterestsChange = (value: string) => {
    const interestsArray = value
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0)
    setProfile((prev) => ({ ...prev, interests: interestsArray }))
  }

  const handleProfileChange = (field: keyof ProfileData, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Update basic profile
      const profileResponse = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeader(),
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          username: profile.username,
          bio: profile.bio,
          profilePictureUrl: profile.profilePictureUrl,
        }),
      })

      if (!profileResponse.ok) {
        const { error } = await profileResponse.json()
        throw new Error(error || 'Failed to update profile')
      }

      // Update Instagram link if provided
      if (profile.instagramUsername) {
        await fetch('/api/profile/social-links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authUtils.getAuthHeader(),
          },
          body: JSON.stringify({
            platform: 'INSTAGRAM',
            username: profile.instagramUsername,
            isVisible: true,
          }),
        })
      }

      // Update interests if provided
      if (profile.interests.length > 0) {
        await fetch('/api/profile/interests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authUtils.getAuthHeader(),
          },
          body: JSON.stringify({
            interests: profile.interests,
          }),
        })
      }

      setSuccess('Profile updated successfully!')
      
      // Redirect to profile page after 1.5 seconds
      setTimeout(() => {
        router.push('/feed')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background-dark font-display text-[#E5E7EB]">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 my-8 sm:my-12 lg:my-16">
        <ProfilePreview
          fullName={profile.fullName}
          username={profile.username}
          bio={profile.bio}
          profilePictureUrl={profile.profilePictureUrl}
          interests={profile.interests}
        />

        <ProfileForm
          profile={profile}
          onProfileChange={handleProfileChange}
          onInterestsChange={handleInterestsChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          success={success}
        />
      </div>
    </div>
  )
}
