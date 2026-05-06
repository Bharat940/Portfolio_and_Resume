import React from "react";

export const PixelBird = ({
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
    <title>bird-pixel</title>
    <g>
      {/* Body */}
      <path d="M12.2 7.62h9.15v13.72H12.2Z" />
      <path d="M10.67 9.14h1.53v10.67h-1.53Z" />
      <path d="M21.35 9.14h1.52v9.15h-1.52Z" />
      <path d="M13.72 6.1h6.1v1.52h-6.1Z" />
      <path d="M13.72 21.34h6.1v1.52h-6.1Z" />

      {/* Eye */}
      <path d="M18.29 10.67h1.53v1.53h-1.53Z" fill="var(--background)" />

      {/* Beak */}
      <path d="M22.87 13.72h3.05v3.05h-3.05Z" />

      {/* Wing */}
      <path
        d="M7.62 13.72h4.58v4.57H7.62Z"
        fill="var(--background)"
        opacity="0.5"
      />
    </g>
  </svg>
);
