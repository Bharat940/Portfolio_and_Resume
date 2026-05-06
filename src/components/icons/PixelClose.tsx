import React from "react";

export const PixelClose = ({
  className = "w-8 h-8",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className={className}
    fill="currentColor"
    {...props}
  >
    <title>close-pixel</title>
    <g>
      {/* Consistent Border with PixelMenu */}
      <path d="M29.71 3.81h1.53v24.38h-1.53Z" />
      <path d="M2.29 28.19h1.52v1.52H2.29Z" />
      <path d="M2.29 2.28h1.52v1.53H2.29Z" />
      <path d="M0.76 3.81h1.53v24.38H0.76Z" />
      <path d="M3.81 0.76h24.38v1.52H3.81Z" />
      <path d="M3.81 29.71h24.38v1.53H3.81Z" />
      <path d="M28.19 28.19h1.52v1.52h-1.52Z" />
      <path d="M28.19 2.28h1.52v1.53h-1.52Z" />

      {/* Symmetrical Pixel X */}
      <path d="M7 7h3v3H7z" />
      <path d="M10 10h3v3h-3z" />
      <path d="M13 13h6v6h-6z" />
      <path d="M19 10h3v3h-3z" />
      <path d="M22 7h3v3h-3z" />
      <path d="M10 19h3v3h-3z" />
      <path d="M7 22h3v3H7z" />
      <path d="M19 19h3v3h-3z" />
      <path d="M22 22h3v3h-3z" />
    </g>
  </svg>
);
