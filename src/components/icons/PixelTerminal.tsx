import React from 'react';

export const PixelTerminal = ({ className = "w-8 h-8", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    className={className}
    fill="currentColor"
    {...props}
  >
    <title>terminal-pixel</title>
    <g>
      {/* Terminal box */}
      <path d="M0.76 3.81h1.53v24.38H0.76Z" />
      <path d="M29.71 3.81h1.53v24.38h-1.53Z" />
      <path d="M3.81 0.76h24.38v1.52H3.81Z" />
      <path d="M3.81 29.71h24.38v1.53H3.81Z" />
      
      {/* Prompt > */}
      <path d="M6.1 7.62h3.05v3.05H6.1Z" />
      <path d="M9.15 10.67h3.05v3.05H9.15Z" />
      <path d="M12.2 13.72h3.05v3.05H12.2Z" />
      <path d="M9.15 16.77h3.05v3.05H9.15Z" />
      <path d="M6.1 19.82h3.05v3.05H6.1Z" />
      
      {/* Cursor _ */}
      <path d="M16.77 21.34h7.62v3.05h-7.62Z" />
    </g>
  </svg>
);
