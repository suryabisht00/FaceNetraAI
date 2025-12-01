'use client'

interface PrivacyToggleProps {
  checked: boolean
  onChange: () => void
}

export default function PrivacyToggle({ checked, onChange }: PrivacyToggleProps) {
  return (
    <div className="bg-[#1a1f2e] rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-medium">Show in Search</p>
          <p className="text-sm text-gray-400">Allow others to find your profile</p>
        </div>
        <button
          type="button"
          onClick={onChange}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            checked ? 'bg-primary' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )
}
