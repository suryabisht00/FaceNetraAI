'use client'

import { useState } from 'react'
import { authUtils } from '@/lib/utils/auth'

export function useImageUpload() {
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [error, setError] = useState('')

  const uploadImage = async (file: File, type: 'profile' | 'cover'): Promise<string | null> => {
    if (type === 'profile') {
      setUploadingProfile(true)
    } else {
      setUploadingCover(true)
    }
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: authUtils.getAuthHeader(),
        body: formData,
      })

      if (response.ok) {
        const { data } = await response.json()
        return data.url
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      console.error('Upload failed:', err)
      setError('Failed to upload image')
      return null
    } finally {
      if (type === 'profile') {
        setUploadingProfile(false)
      } else {
        setUploadingCover(false)
      }
    }
  }

  return { uploadImage, uploadingProfile, uploadingCover, error }
}
