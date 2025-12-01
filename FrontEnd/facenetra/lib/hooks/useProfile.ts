/**
 * Custom hook for profile management
 */

import { useState, useEffect } from 'react'
import { authUtils } from '@/lib/utils/auth'

interface ProfileData {
  id: string
  fullName: string
  username: string | null
  email: string | null
  phone: string | null
  bio: string | null
  profilePictureUrl: string | null
  coverPhotoUrl: string | null
  isVerified: boolean
  socialLinks: Array<{
    id: string
    platform: string
    username: string
    profileUrl: string
    isVisible: boolean
  }>
  interests: Array<{
    id: string
    interest: string
    category: string | null
  }>
  stats: {
    postsCount: number
    friendsCount: number
    followersCount: number
    followingCount: number
  }
  privacySettings: {
    showInSearch: boolean
    allowScanDiscovery: boolean
    showSocialLinks: boolean
  } | null
}

interface UpdateProfileData {
  fullName?: string
  username?: string
  bio?: string
  profilePictureUrl?: string
  coverPhotoUrl?: string
  email?: string
  phone?: string
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile', {
        headers: authUtils.getAuthHeader(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const { data } = await response.json()
      setProfile(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeader(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to update profile')
      }

      const { data: updatedProfile } = await response.json()
      setProfile(updatedProfile)
      return updatedProfile
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addSocialLink = async (platform: string, username: string, isVisible = true) => {
    setError(null)

    try {
      const response = await fetch('/api/profile/social-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeader(),
        },
        body: JSON.stringify({ platform, username, isVisible }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to add social link')
      }

      await fetchProfile() // Refresh profile
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateSocialLink = async (id: string, username?: string, isVisible?: boolean) => {
    setError(null)

    try {
      const response = await fetch('/api/profile/social-links', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeader(),
        },
        body: JSON.stringify({ id, username, isVisible }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to update social link')
      }

      await fetchProfile() // Refresh profile
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteSocialLink = async (id: string) => {
    setError(null)

    try {
      const response = await fetch(`/api/profile/social-links?id=${id}`, {
        method: 'DELETE',
        headers: authUtils.getAuthHeader(),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to delete social link')
      }

      await fetchProfile() // Refresh profile
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const addInterests = async (interests: string[]) => {
    setError(null)

    try {
      const response = await fetch('/api/profile/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeader(),
        },
        body: JSON.stringify({ interests }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to add interests')
      }

      await fetchProfile() // Refresh profile
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteInterest = async (id: string) => {
    setError(null)

    try {
      const response = await fetch(`/api/profile/interests?id=${id}`, {
        method: 'DELETE',
        headers: authUtils.getAuthHeader(),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to delete interest')
      }

      await fetchProfile() // Refresh profile
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      fetchProfile()
    }
  }, [])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    addInterests,
    deleteInterest,
  }
}
