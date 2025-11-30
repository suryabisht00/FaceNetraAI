import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export default function Button({ children, variant = 'primary', onClick, className = '' }: ButtonProps) {
  const baseStyles = 'flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-all';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-opacity-90 h-10',
    secondary: 'bg-primary/20 text-white border border-primary hover:bg-primary/30 h-10',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <span className="truncate">{children}</span>
    </button>
  );
}
