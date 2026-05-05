import React from 'react';

export const PixelFileText = ({ className = "w-8 h-8", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M4 2h18v4h2v2h2v22H4V2zm2 2v24h18V10h-6V4H6zm14 0.828V8h3.172L20 4.828zM8 12h14v2H8v-2zm0 4h14v2H8v-2zm0 4h10v2H8v-2z" />
  </svg>
);
