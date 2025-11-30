'use client';

import { useEffect, useState } from 'react';

export default function MouseGradient() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-30 w-96 h-96 rounded-full opacity-20 blur-[100px] transition-all duration-300 ease-out"
      style={{
        background: 'radial-gradient(circle, rgba(255,106,0,0.4) 0%, transparent 70%)',
        left: `${position.x - 192}px`,
        top: `${position.y - 192}px`,
      }}
    />
  );
}
