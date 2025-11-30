'use client';

import { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] -top-48 -left-48"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px] top-1/4 -right-32"
        style={{ transform: `translateY(${scrollY * 0.2}px) translateX(${scrollY * 0.1}px)` }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full bg-primary/5 blur-[140px] bottom-0 left-1/3"
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[90px] bottom-1/4 right-1/4"
        style={{ transform: `translateY(${scrollY * 0.25}px) translateX(${scrollY * -0.1}px)` }}
      />
      
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ff6a00 1px, transparent 1px),
                           linear-gradient(to bottom, #ff6a00 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />
    </div>
  );
}
