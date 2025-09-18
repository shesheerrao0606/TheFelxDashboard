// FlexLogo component - "the flex." brand logo with house icon
import React from 'react';

interface FlexLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function FlexLogo({ size = 'md', showText = true, className = '' }: FlexLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 40 40" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-foreground"
        >
          <path 
            d="M5 25 L20 10 L35 25 L35 35 L5 35 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinejoin="round"
          />
          <g transform="translate(12, 15)">
            <line 
              x1="8" 
              y1="0" 
              x2="8" 
              y2="15" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            <line 
              x1="8" 
              y1="2" 
              x2="14" 
              y2="2" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            <line 
              x1="8" 
              y1="8" 
              x2="11" 
              y2="8" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
      
      {showText && (
        <span className={`font-serif font-light text-foreground ${textSizes[size]}`}>
          the flex.
        </span>
      )}
    </div>
  );
}
