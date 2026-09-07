import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  theme?: 'light' | 'dark'; // 'light' means for white backgrounds (dark text), 'dark' means for dark backgrounds
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true,
  theme = 'light'
}) => {
  const iconDimensions = {
    sm: { width: 34, height: 34 },
    md: { width: 44, height: 44 },
    lg: { width: 56, height: 56 },
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  const isDarkCanvas = theme === 'dark';
  const textColor = isDarkCanvas ? 'text-white' : 'text-[#0F172A]';
  const subTextColor = isDarkCanvas ? 'text-white/60' : 'text-[#64748B]';
  const strokeColor = isDarkCanvas ? '#FFFFFF' : '#0F172A';
  const blockFill = isDarkCanvas ? '#1E293B' : '#0F172A';
  const gridLineColor = isDarkCanvas ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.15)';

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Precision Monolithic Stone & Miter Monogram Icon */}
      <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg 
          width={iconDimensions.width} 
          height={iconDimensions.height} 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Architectural Drafting Frame / Registration Boundary */}
          <rect 
            x="3" 
            y="3" 
            width="42" 
            height="42" 
            stroke={gridLineColor} 
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Corner Precision Crosshairs */}
          <line x1="3" y1="8" x2="3" y2="3" stroke="#DC2626" strokeWidth="2" />
          <line x1="3" y1="3" x2="8" y2="3" stroke="#DC2626" strokeWidth="2" />
          <line x1="45" y1="40" x2="45" y2="45" stroke="#DC2626" strokeWidth="2" />
          <line x1="40" y1="45" x2="45" y2="45" stroke="#DC2626" strokeWidth="2" />

          {/* Heavy Monolithic Stone Pillar - Stylized "I" (Left Half) */}
          <rect 
            x="9" 
            y="9" 
            width="14" 
            height="30" 
            fill={blockFill}
            stroke={strokeColor}
            strokeWidth="2"
          />

          {/* Precision 45-Degree Diamond Miter Bevel (Upper Right Wedge) */}
          <path 
            d="M23 9L39 9V25L23 9Z" 
            fill="#DC2626"
            stroke={strokeColor}
            strokeWidth="1.5"
          />

          {/* Bookmatched Veining Cut Line */}
          <path 
            d="M13 15L17 24L13 33" 
            stroke="rgba(255,255,255,0.7)" 
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Secondary Precision Tile Block (Lower Right) */}
          <rect 
            x="27" 
            y="27" 
            width="12" 
            height="12" 
            fill={isDarkCanvas ? 'rgba(255,255,255,0.1)' : '#F1F5F9'}
            stroke={strokeColor}
            strokeWidth="2"
          />

          {/* Laser Registration Alignment Pin */}
          <circle cx="23" cy="23" r="2.5" fill="#DC2626" />
          <circle cx="23" cy="23" r="5" stroke="#DC2626" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none justify-center">
        <div className={`font-black tracking-tight font-mono ${textColor} ${titleSizes} flex items-center gap-1.5`}>
          <span>ISAAC</span>
          <span className="text-[#DC2626]">STONE</span>
          <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full inline-block animate-pulse" />
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1 mt-1 font-mono">
            <span className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold ${subTextColor}`}>
              AND TILE LLC &bull; NY
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
