import React from 'react';

export const PixelGamepad = ({ className = "w-8 h-8", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    className={className}
    fill="currentColor"
    {...props}
  >
    <title>gamepad-pixel</title>
    <g>
      {/* Body */}
      <path d="M3.81 9.14h24.38v13.72H3.81Z" />
      <path d="M2.29 10.67h1.52v10.67H2.29Z" />
      <path d="M28.19 10.67h1.52v10.67h-1.52Z" />
      <path d="M5.33 7.62h21.34v1.52H5.33Z" />
      <path d="M5.33 22.86h21.34v1.52H5.33Z" />
      
      {/* Buttons */}
      <path d="M21.34 12.19h3.05v3.05h-3.05Z" fill="var(--background)" />
      <path d="M18.29 15.24h3.05v3.05h-3.05Z" fill="var(--background)" />
      
      {/* D-Pad */}
      <path d="M7.62 13.72h3.05v3.05H7.62Z" fill="var(--background)" />
      <path d="M6.1 12.19h1.52v3.05H6.1Z" fill="var(--background)" />
      <path d="M10.67 12.19h1.52v3.05h-1.52Z" fill="var(--background)" />
    </g>
  </svg>
);
