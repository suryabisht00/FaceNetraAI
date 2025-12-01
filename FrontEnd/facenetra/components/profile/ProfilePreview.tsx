interface ProfilePreviewProps {
  fullName: string
  username: string
  bio: string
  profilePictureUrl: string
  interests: string[]
}

export default function ProfilePreview({
  fullName,
  username,
  bio,
  profilePictureUrl,
  interests,
}: ProfilePreviewProps) {
  const defaultProfileImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDXPf3aYPA_MpIaCnmuu456R1QPLSGEplK1aaHH8nqTy6BlFjz4wZnIaW37yV293VrsAgsAJ8p8fPmJw_t4CiTG5kPuEorLtyvgDH7dA4ogNPbzrK9RLat-d3zYaQJclrOqalIllOABBemEiV0Um1SFZBIh3uObIyynS1Oe786TevBrmqwrm0pZzGjm1WcB9ikQU_EUX1E7_3Q1NxCV9F2LUJBvtkEE5J5J3KBZczYoGxgh1uSoq4lpeQpf-FHmryI07E1-wg1nnEA'

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-2xl font-semibold text-white">Live Preview</h2>
      <div className="glass-card flex w-full flex-col items-center gap-6 rounded-2xl p-8">
        {/* Profile Header */}
        <div className="flex w-full flex-col items-center gap-4">
          <div className="relative">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 neon-glow-subtle"
              style={{
                backgroundImage: `url("${profilePictureUrl || defaultProfileImage}")`,
              }}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
              {fullName || 'Your Name'}
            </p>
            <p className="text-[#bca89a] text-base font-normal leading-normal text-center">
              @{username || 'username'}
            </p>
            <p className="text-[#bca89a] text-base font-normal leading-normal text-center">
              {bio || 'Your profession or business'}
            </p>
          </div>
        </div>

        {/* Interests/Hobbies */}
        {interests.length > 0 && (
          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex gap-3 flex-wrap justify-center">
              {interests.map((interest, index) => (
                <div
                  key={index}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 px-4"
                >
                  <p className="text-primary text-sm font-medium leading-normal">{interest}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diary Highlights Placeholder */}
        <div className="flex w-full flex-col items-center gap-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-400">
            Diary Highlights
          </h3>
          <div className="flex min-h-min flex-row items-start justify-center gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-1 flex-col justify-center gap-2 w-16 text-center">
                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full border-2 border-primary/50 bg-gray-800" />
                <p className="text-white text-[13px] font-normal leading-normal">Memory {item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background-color: rgba(229, 231, 235, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(229, 231, 235, 0.15);
        }
        .neon-glow-subtle {
          box-shadow: 0 0 8px rgba(255, 106, 0, 0.4), 0 0 16px rgba(255, 106, 0, 0.3);
        }
      `}</style>
    </div>
  )
}
