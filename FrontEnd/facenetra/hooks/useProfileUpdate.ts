'use client'

import { useState } from 'react'
import { authUtils } from '@/lib/utils/auth'

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

export function useProfileUpdate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateProfile = async (profile: ProfileData) => {
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
          coverPhotoUrl: profile.coverPhotoUrl,
          email: profile.email,
          phone: profile.phone,
        }),
      })

      if (!profileResponse.ok) {
        const { error } = await profileResponse.json()
        throw new Error(error || 'Failed to update profile')
      }

      // Update or create Instagram link if provided
      if (profile.instagramUsername) {
        // First, try to update existing link
        const updateResponse = await fetch('/api/profile/social-links', {
          method: 'PATCH',
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

        // If update fails, try to create new
        if (!updateResponse.ok) {
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
      }

      // Delete all existing interests first, then add new ones
      if (profile.interests.length > 0) {
        // Get existing interests
        const existingResponse = await fetch('/api/profile/interests', {
          headers: authUtils.getAuthHeader(),
        })

        if (existingResponse.ok) {
          const { data: existingInterests } = await existingResponse.json()
          
          // Delete all existing interests
          await Promise.all(
            existingInterests.map((interest: any) =>
              fetch(`/api/profile/interests?id=${interest.id}`, {
                method: 'DELETE',
                headers: authUtils.getAuthHeader(),
              })
            )
          )
        }

        // Add new interests
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
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { updateProfile, loading, error, success, setError }
}
