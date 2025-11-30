import React from 'react';

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '50K+', label: 'Face Profiles' },
  { value: '1M+', label: 'Connections Made' },
  { value: '99.9%', label: 'Accuracy Rate' },
];

export default function Stats() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all"
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
