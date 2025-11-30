'use client';

import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold
        setIsVisible(false);
        setIsMenuOpen(false); // Close mobile menu when hiding
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`flex w-full items-center justify-between whitespace-nowrap backdrop-blur-md bg-[#0B0F1A]/80 border border-primary/20 rounded-2xl px-6 py-2 fixed left-1/2 -translate-x-1/2 z-50 max-w-[calc(100%-2rem)] lg:max-w-[1280px] transition-all duration-300 ${
      isVisible ? 'top-5 opacity-100' : '-top-24 opacity-0'
    }`}>
      <div className="flex items-center gap-3 py-1">
        <img 
          src="/logo.png" 
          alt="FaceNetraAI Logo" 
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-1 justify-end">
        <ul className="flex items-center gap-1 text-[#E5E7EB]">
          <li>
            <a
              className="relative text-sm font-medium leading-normal px-5 py-2.5 rounded-xl transition-all hover:text-white hover:bg-primary/10 group"
              href="#scan"
            >
              Scan
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all group-hover:w-8"></span>
            </a>
          </li>
          <li>
            <a
              className="text-sm font-medium leading-normal px-5 py-2.5 rounded-xl transition-all hover:text-white hover:bg-primary/10"
              href="#profile"
            >
              My Profile
            </a>
          </li>
          <li>
            <a
              className="text-sm font-medium leading-normal px-5 py-2.5 rounded-xl transition-all hover:text-white hover:bg-primary/10"
              href="#diary"
            >
              Diary
            </a>
          </li>
          <li>
            <a
              className="text-sm font-medium leading-normal px-5 py-2.5 rounded-xl transition-all hover:text-white hover:bg-primary/10"
              href="#logout"
            >
              Logout
            </a>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#E5E7EB] hover:bg-primary/10 hover:text-white transition-all"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 right-0 mt-3 backdrop-blur-md bg-[#0B0F1A]/90 border border-primary/20 rounded-2xl p-3 md:hidden shadow-lg">
          <ul className="flex flex-col gap-1 text-[#E5E7EB]">
            <li>
              <a
                className="block text-sm font-medium leading-normal px-4 py-3 rounded-xl transition-all hover:bg-primary/10 hover:text-white"
                href="#scan"
                onClick={() => setIsMenuOpen(false)}
              >
                Scan
              </a>
            </li>
            <li>
              <a
                className="block text-sm font-medium leading-normal px-4 py-3 rounded-xl transition-all hover:bg-primary/10 hover:text-white"
                href="#profile"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </a>
            </li>
            <li>
              <a
                className="block text-sm font-medium leading-normal px-4 py-3 rounded-xl transition-all hover:bg-primary/10 hover:text-white"
                href="#diary"
                onClick={() => setIsMenuOpen(false)}
              >
                Diary
              </a>
            </li>
            <li>
              <a
                className="block text-sm font-medium leading-normal px-4 py-3 rounded-xl transition-all hover:bg-primary/10 hover:text-white"
                href="#logout"
                onClick={() => setIsMenuOpen(false)}
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
