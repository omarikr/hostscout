'use client';

import { forwardRef } from 'react';

interface GlassyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const GlassyButton = forwardRef<HTMLButtonElement, GlassyButtonProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          relative
          px-8 py-3
          font-semibold
          text-foreground
          bg-transparent
          rounded-full
          overflow-hidden
          transition-all
          duration-300
          hover:scale-105
          active:scale-95
          backdrop-blur-md
          ${className}
        `}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
        {...props}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            padding: '2px',
            background: 'linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
            backgroundSize: '300% 300%',
            animation: 'rgb-border 3s linear infinite',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

GlassyButton.displayName = 'GlassyButton';
