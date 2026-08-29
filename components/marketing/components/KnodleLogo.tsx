import React from 'react';

interface KnodleLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'lime-badge' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  animateOnHover?: boolean;
}

export function KnodleIcon({ 
  className = 'w-9 h-9',
  bgVariant = 'lime',
}: { 
  className?: string;
  bgVariant?: 'lime' | 'black' | 'transparent';
}) {
  const bgClass = 
    bgVariant === 'lime' 
      ? 'bg-[#c1ff72] text-[#000000] shadow-sm' 
      : bgVariant === 'black'
      ? 'bg-[#000000] text-[#c1ff72] border border-[#333333]'
      : 'bg-transparent text-current';

  const nodeColor = bgVariant === 'black' ? '#c1ff72' : '#000000';
  const innerDotColor = bgVariant === 'black' ? '#000000' : '#c1ff72';

  return (
    <div 
      className={`relative inline-flex items-center justify-center rounded-[22%] shrink-0 overflow-hidden select-none transition-transform duration-300 hover:scale-105 active:scale-95 ${bgClass} ${className}`}
      style={{ aspectRatio: '1/1' }}
    >
      {/* 
        Original Knodle Node Graph Logo:
        A central circular hub connected to 5 satellite nodes on a vivid lime canvas.
      */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[82%] h-[82%]"
      >
        {/* Connecting strut lines */}
        <line x1="50" y1="50" x2="24" y2="24" stroke={nodeColor} strokeWidth="6.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="64" y2="25" stroke={nodeColor} strokeWidth="5.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="81" y2="45" stroke={nodeColor} strokeWidth="5.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="76" y2="78" stroke={nodeColor} strokeWidth="7" strokeLinecap="round" />
        <line x1="50" y1="50" x2="23" y2="76" stroke={nodeColor} strokeWidth="6" strokeLinecap="round" />

        {/* Center node */}
        <circle cx="50" cy="50" r="16.5" fill={nodeColor} />
        <circle cx="50" cy="50" r="4.5" fill={innerDotColor} />

        {/* Outer satellite nodes */}
        <circle cx="23" cy="23" r="12.5" fill={nodeColor} />
        <circle cx="64" cy="25" r="9" fill={nodeColor} />
        <circle cx="81" cy="45" r="8.5" fill={nodeColor} />
        <circle cx="76" cy="78" r="13.5" fill={nodeColor} />
        <circle cx="23" cy="76" r="9.5" fill={nodeColor} />
      </svg>
    </div>
  );
}

export default function KnodleLogo({
  className = '',
  variant = 'dark',
  size = 'md',
  showWordmark = true,
}: KnodleLogoProps) {
  const isLightText = variant === 'light';
  const textColor = isLightText ? '#ffffff' : '#000000';

  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg tracking-tight font-extrabold' },
    md: { icon: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-xl sm:text-[22px] tracking-tight font-extrabold' },
    lg: { icon: 'w-10 h-10 sm:w-11 sm:h-11', text: 'text-2xl sm:text-3xl tracking-tight font-extrabold' },
    xl: { icon: 'w-12 h-12 sm:w-14 sm:h-14', text: 'text-3xl sm:text-4xl tracking-tight font-extrabold' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Node Network Mark */}
      <KnodleIcon 
        className={sizeClasses.icon} 
        bgVariant={variant === 'monochrome' ? 'transparent' : 'lime'} 
      />

      {/* Bold Uppercase Wordmark */}
      {showWordmark && (
        <span 
          className={`font-black uppercase tracking-[0.04em] ${sizeClasses.text} transition-colors`}
          style={{ color: textColor }}
        >
          KNODLE
        </span>
      )}
    </div>
  );
}
