import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center items-center transition-all duration-300 hover:border-primary hover:bg-primary/20 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group h-full">
      <div className="flex items-center justify-center size-12 rounded-full border-2 border-primary text-primary group-hover:scale-125 group-hover:rotate-6 transition-all duration-300">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-white text-lg font-bold leading-tight">{title}</h3>
        <p className="text-[#E5E7EB] text-sm font-normal leading-normal">{description}</p>
      </div>
    </div>
  );
}
