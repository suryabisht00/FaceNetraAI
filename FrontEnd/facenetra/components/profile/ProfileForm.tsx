import FormInput from './FormInput'
import ToggleSwitch from './ToggleSwitch'
import Alert from './Alert'

interface ProfileData {
  fullName: string
  username: string
  bio: string
  profilePictureUrl: string
  interests: string[]
  instagramUsername: string
  showDiaryPublicly: boolean
}

interface ProfileFormProps {
  profile: ProfileData
  onProfileChange: (field: keyof ProfileData, value: any) => void
  onInterestsChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  success: string
}

export default function ProfileForm({
  profile,
  onProfileChange,
  onInterestsChange,
  onSubmit,
  loading,
  error,
  success,
}: ProfileFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-heading text-white text-4xl font-semibold leading-tight tracking-[-0.033em]">
          Set Up Your Profile
        </p>
        <p className="text-[#bca89a] text-base font-normal leading-normal">
          Your profile is a reflection of you. Make it shine.
        </p>
      </div>

      <div className="glass-card flex w-full flex-col gap-6 rounded-2xl p-8">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <FormInput
            id="name"
            label="Name"
            placeholder="Alex Nova"
            value={profile.fullName}
            onChange={(value) => onProfileChange('fullName', value)}
            required
          />

          <FormInput
            id="username"
            label="Username"
            placeholder="alexnova"
            value={profile.username}
            onChange={(value) => onProfileChange('username', value)}
            prefix="@"
          />

          <FormInput
            id="instagram"
            label="Instagram Username"
            placeholder="alexnova"
            value={profile.instagramUsername}
            onChange={(value) => onProfileChange('instagramUsername', value)}
            prefix="@"
          />

          <FormInput
            id="profession"
            label="Profession / Business"
            placeholder="Cybernetic Artist"
            value={profile.bio}
            onChange={(value) => onProfileChange('bio', value)}
          />

          <FormInput
            id="hobbies"
            label="Hobbies (comma-separated)"
            placeholder="AI Art, Synthwave, Bio-hacking"
            value={profile.interests.join(', ')}
            onChange={onInterestsChange}
          />

          <FormInput
            id="profilePicture"
            label="Profile Picture URL"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={profile.profilePictureUrl}
            onChange={(value) => onProfileChange('profilePictureUrl', value)}
          />

          <ToggleSwitch
            id="toggle"
            label="Show diary highlights publicly"
            checked={profile.showDiaryPublicly}
            onChange={() => onProfileChange('showDiaryPublicly', !profile.showDiaryPublicly)}
          />

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center rounded-lg bg-primary py-3 text-base font-bold text-background-dark transition-all duration-300 ease-in-out neon-glow-hover hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .glass-card {
          background-color: rgba(229, 231, 235, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(229, 231, 235, 0.15);
        }
        .neon-glow-hover:hover {
          box-shadow: 0 0 8px #ff6a00, 0 0 20px #ff6a00;
        }
      `}</style>
    </div>
  )
}
