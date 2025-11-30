'use client';

import React, { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className={`relative overflow-hidden rounded-3xl border border-primary/30 bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className={`relative z-10 flex flex-col gap-6 items-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-poppins text-white text-3xl md:text-4xl font-bold leading-tight max-w-2xl">
              Ready to Transform Your Social Experience?
            </h2>
            <p className="text-[#E5E7EB] text-base md:text-lg font-normal leading-normal max-w-xl">
              Join thousands of users already connecting in the real world with FaceNetra
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <Button variant="primary" className="h-14 px-8 text-lg">
                Get Started Free
              </Button>
              <Button variant="secondary" className="h-14 px-8 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className={`absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl z-0 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className={`absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>
      </div>
    </section>
  );
}
