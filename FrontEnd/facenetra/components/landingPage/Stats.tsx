'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '50K+', label: 'Face Profiles' },
  { value: '1M+', label: 'Connections Made' },
  { value: '99.9%', label: 'Accuracy Rate' },
];

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:scale-105 hover:border-primary/40 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-primary font-poppins">
                {stat.value}
              </h3>
              <p className="text-sm md:text-base text-[#E5E7EB] mt-2 text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
