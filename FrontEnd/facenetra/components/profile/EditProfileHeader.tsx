'use client'

import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EditProfileHeaderProps {
  onSave: () => void
  loading: boolean
}

export default function EditProfileHeader({ onSave, loading }: EditProfileHeaderProps) {
  const router = useRouter()

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-[#0B0F1A] border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white transition-colors"
          type="button"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-white">Edit Profile</h1>
        <div className="w-6"></div>
      </div>
    </div>
  )
}
