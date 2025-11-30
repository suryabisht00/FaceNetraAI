import React from 'react';
import Button from '../ui/Button';
import ProfileCard from '../ui/ProfileCard';

export default function Hero() {
  return (
    <main className="flex flex-1 flex-col py-10 md:py-20">
      <div className="flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex w-full flex-col gap-6 text-left lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 w-fit">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm text-primary font-medium">AI-Powered Face Recognition</span>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-poppins text-white text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Meet People. Scan Faces. Connect Instantly.
            </h1>
            <h2 className="text-[#E5E7EB] text-base font-normal leading-relaxed sm:text-lg">
              Real-life social media powered by face recognition. Turn every encounter into a lasting connection with just a scan.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" className="h-12 px-5 text-base">
              Scan a Face
            </Button>
            <Button variant="secondary" className="h-12 px-5 text-base">
              Create Your Face Profile
            </Button>
          </div>
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-[#E5E7EB]">100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-[#E5E7EB]">Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-[#E5E7EB]">Free to Use</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <ProfileCard
            name="Alex Ray"
            username="alexray"
            interests="AI, Design, Sci-Fi"
            diary="Exploring the neon-lit alleys of Neo-Tokyo. The future is now."
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBLujdPP2v8G3HDXF25yWqXUPVt5K-EsHjhapUynLgMyivvSQHoqQY8SxndqbDwGi4HYQVDC5D2kkraweQlx3QSTHalU2zzMSmEYjhi8Norx-C5b1Ph_3t8sK7_wOW6mjDKtj9YisWpG54YMGF6hLBVh6jucrJNT-9YMvP8Q7pcrMThGBeIACmHD8LQjwXaN-uGERGvWZpPecdUx_8E1LSVgcrbUTVeS3q_fVDcv1r2vy57IYWIyTaffxPxI6-miSR-j131HTTUFAc"
          />
        </div>
      </div>
    </main>
  );
}
