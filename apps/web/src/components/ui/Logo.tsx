import React from 'react';

export interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function Logo({ className = '', variant = 'light', size = 'md', showText = true }: LogoProps) {
  // Dimensions map
  const sizes = {
    sm: { iconWidth: 24, iconHeight: 24, textClass: 'text-xl' },
    md: { iconWidth: 32, iconHeight: 32, textClass: 'text-3xl' },
    lg: { iconWidth: 48, iconHeight: 48, textClass: 'text-4xl' },
    xl: { iconWidth: 64, iconHeight: 64, textClass: 'text-6xl' },
  };

  const { iconWidth, iconHeight, textClass } = sizes[size];

  // Brand colors
  const colors = {
    navy: '#0D2137',
    orange: '#E8532A',
    skyblue: '#2F6B9A',
    white: '#FFFFFF',
  };

  // Determine colors based on variant
  let leftColor = colors.navy;
  let rightColor = colors.orange;
  let tixColor = colors.navy;
  let lyColor = colors.orange;

  if (variant === 'dark') {
    leftColor = colors.orange;
    rightColor = colors.skyblue;
    tixColor = colors.white;
    lyColor = colors.orange;
  } else if (variant === 'icon') {
    leftColor = colors.orange;
    rightColor = colors.skyblue;
  }

  // The Icon SVG
  const IconMark = (
    <div className="shrink-0 relative flex items-center justify-center">
      {variant === 'icon' && (
        <div className="absolute inset-0 bg-[#0D2137] rounded-2xl scale-[1.35] -z-10" />
      )}
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 42 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="ticket-mask">
          <rect width="42" height="40" fill="white" />
          {/* Lightning bolt cutout */}
          <path d="M 28 -2 L 14 18 H 26 L 14 42" stroke="black" strokeWidth="4" fill="none" strokeLinejoin="miter" />
          {/* Football cutout */}
          <ellipse cx="26" cy="20" rx="5" ry="9" fill="black" />
        </mask>
        <g mask="url(#ticket-mask)">
          {/* Left half */}
          <path
            d="M 4 0 H 21 V 40 H 4 C 1.79 40 0 38.21 0 36 V 4 C 0 1.79 1.79 0 4 0 Z"
            fill={leftColor}
          />
          {/* Right half */}
          <path
            d="M 21 0 H 38 C 40.21 0 42 1.79 42 4 V 36 C 42 38.21 40.21 40 38 40 H 21 V 0 Z"
            fill={rightColor}
          />
        </g>
      </svg>
    </div>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {IconMark}
      {showText && variant !== 'icon' && (
        <div className="flex flex-col justify-center">
          <div className={`font-black tracking-tighter leading-none flex ${textClass}`}>
            <span style={{ color: tixColor }}>tix</span>
            <span style={{ color: lyColor }}>ly</span>
          </div>
          {size !== 'sm' && (
            <span className="text-[0.45em] tracking-[0.2em] font-semibold text-brand-mutedgrey mt-1 uppercase">
              World Cup Tickets
            </span>
          )}
        </div>
      )}
    </div>
  );
}
