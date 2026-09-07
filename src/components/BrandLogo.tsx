import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  // Sizes
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-sm font-black tracking-tight',
    md: 'text-base sm:text-lg font-black tracking-tight',
    lg: 'text-xl sm:text-2xl font-black tracking-tight',
  };

  const subSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[10px] tracking-widest',
    lg: 'text-xs tracking-widest',
  };

  // Variant styles: 'dark' means dark text on light background (for our white design), 'light' means white text on dark
  const isLightText = variant === 'light';
  const primaryTextColor = isLightText ? 'text-white' : 'text-[#0F172A]';
  const subtitleColor = isLightText ? 'text-white/60' : 'text-[#64748B]';
  const stoneBorderColor = isLightText ? '#FFFFFF' : '#0F172A';
  const stoneFillColor = isLightText ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)';
  const stoneAccentColor = isLightText ? '#FFFFFF' : '#1E293B';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none group ${className}`}>
      {/* Precision Monolithic Stone & Miter Monogram Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Background Drafting Square */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            stroke={stoneBorderColor}
            strokeWidth="2"
            strokeDasharray="3 3"
            strokeOpacity={isLightText ? "0.3" : "0.2"}
            fill={stoneFillColor}
          />

          {/* Left Block (Monolithic Stone Pillar - Stylized 'I' Stem) */}
          <path
            d="M10 10H22V38H10V10Z"
            fill={stoneAccentColor}
            stroke={stoneBorderColor}
            strokeWidth="2.5"
            strokeLinejoin="miter"
          />

          {/* Precision 45-Degree Miter Diagonal Cut */}
          <line
            x1="22"
            y1="10"
            x2="38"
            y2="26"
            stroke="#DC2626"
            strokeWidth="2.5"
            strokeLinecap="square"
          />

          {/* Interlocking Marble Slab Keystone (Upper Right Triangle) */}
          <path
            d="M22 10L38 10V26L22 10Z"
            fill="#DC2626"
            fillOpacity={isLightText ? "0.9" : "0.95"}
          />

          {/* Bookmatched Vein / Tolerance Hairline */}
          <path
            d="M14 16L18 24L14 32"
            stroke={isLightText ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.7)"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Lower Right Secondary Tile Block */}
          <rect
            x="26"
            y="26"
            width="12"
            height="12"
            fill={stoneFillColor}
            stroke={stoneBorderColor}
            strokeWidth="2"
          />

          {/* Center Precision Laser Registration Point */}
          <circle cx="22" cy="22" r="2" fill="#DC2626" />
          <circle cx="22" cy="22" r="4.5" stroke="#DC2626" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
        </svg>
      </div>

      {/* Typographic Lockup */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSizes[size]} ${primaryTextColor} font-black uppercase tracking-tight`}>
            ISAAC
          </span>
          <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full inline-block animate-pulse" />
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`${subSizes[size]} ${subtitleColor} font-mono font-bold uppercase`}>
              STONE &amp; TILE LLC
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
