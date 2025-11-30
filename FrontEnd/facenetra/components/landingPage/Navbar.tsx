'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const pathname = usePathname();

  // Hide bottom navbar on landing, login, and register pages
  const hideBottomNav = pathname === '/' || pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at top - show mobile top bar
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - hide mobile top bar
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* Desktop Header */}
      <header className={`hidden md:flex w-full items-center justify-between whitespace-nowrap backdrop-blur-md bg-[#0B0F1A]/80 border border-primary/20 rounded-2xl px-6 py-2 fixed left-1/2 -translate-x-1/2 z-50 max-w-[calc(100%-2rem)] lg:max-w-[1280px] transition-all duration-300 ${
        isVisible ? 'top-5 opacity-100' : '-top-24 opacity-0'
      }`}>
        <div className="flex items-center gap-3 py-1">
          <img 
            src="/logo.png" 
            alt="FaceNetraAI Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>

        <nav className="flex flex-1 justify-end">
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
      </header>

      {/* Mobile Top Bar - Instagram Style */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0B0F1A]/80 border-b border-primary/20 px-4 py-3 shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'cursive' }}>FaceNetraAI</h1>
          <div className="flex items-center gap-3">
            {pathname === '/' ? (
              <a 
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-all active:scale-95 border border-primary/20"
              >
                Login
              </a>
            ) : (
              <>
                <button className="p-2 hover:bg-primary/10 rounded-xl transition-all active:scale-95 border border-primary/20 backdrop-blur-sm bg-[#0B0F1A]/60">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-primary/10 rounded-xl transition-all active:scale-95 border border-primary/20 backdrop-blur-sm bg-[#0B0F1A]/60">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Instagram Style */}
      {!hideBottomNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0B0F1A]/80 border-t border-primary/20 shadow-xl">
          <ul className="flex justify-around items-center py-2 px-2">
          <li className="flex-1">
            <a
              className="flex flex-col items-center py-1.5 px-2 text-white hover:text-primary transition-all active:scale-95 rounded-xl hover:bg-primary/10"
              href="#home"
              onClick={() => setActiveTab('home')}
            >
              <svg className="w-6 h-6" fill={activeTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>
          </li>
          <li className="flex-1">
            <a
              className="flex flex-col items-center py-1.5 px-2 text-white hover:text-primary transition-all active:scale-95 rounded-xl hover:bg-primary/10"
              href="#scan"
              onClick={() => setActiveTab('scan')}
            >
              <svg className="w-6 h-6" fill={activeTab === 'scan' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
          </li>
          <li className="flex-1">
            <a
              className="flex flex-col items-center py-1.5 px-2 text-white hover:text-primary transition-all active:scale-95 rounded-xl hover:bg-primary/10"
              href="#add"
              onClick={() => setActiveTab('add')}
            >
              <svg className="w-6 h-6" fill={activeTab === 'add' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </li>
          <li className="flex-1">
            <a
              className="flex flex-col items-center py-1.5 px-2 text-white hover:text-primary transition-all active:scale-95 rounded-xl hover:bg-primary/10"
              href="#diary"
              onClick={() => setActiveTab('diary')}
            >
              <svg className="w-6 h-6" fill={activeTab === 'diary' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </a>
          </li>
          <li className="flex-1">
            <a
              className="flex flex-col items-center py-1.5 px-2 text-white hover:text-primary transition-all active:scale-95 rounded-xl hover:bg-primary/10"
              href="#profile"
              onClick={() => setActiveTab('profile')}
            >
              <svg className="w-6 h-6" fill={activeTab === 'profile' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
      )}
    </>
  );
}
