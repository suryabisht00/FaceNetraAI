'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Testimonials() {
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

  const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Digital Nomad',
    avatar: 'https://i.pravatar.cc/150?img=1',
    text: "FaceNetra changed how I network at conferences. I've made more meaningful connections in a month than I did all last year!",
  },
  {
    name: 'Michael Chen',
    role: 'Startup Founder',
    avatar: 'https://i.pravatar.cc/150?img=13',
    text: 'The face scanning is incredibly fast and accurate. Perfect for networking events and meetups. Highly recommend!',
  },
  {
    name: 'Emma Davis',
    role: 'UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=5',
    text: 'Finally, a social platform that bridges the gap between online and offline interactions. The mini diary feature is genius!',
  },
];

  return (
    <section ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col gap-4 text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-poppins text-white text-3xl font-bold leading-tight sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="text-[#E5E7EB] text-base font-normal leading-normal max-w-2xl mx-auto">
            Discover how FaceNetra is revolutionizing real-world connections
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`flex flex-col gap-5 p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm hover:border-primary/30 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="rounded-full border-2 border-primary/40"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background-dark flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-base">{testimonial.name}</p>
                  <p className="text-[#E5E7EB]/80 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-[#E5E7EB] text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex gap-1 mt-auto">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
