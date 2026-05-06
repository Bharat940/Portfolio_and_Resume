export function PixelMail({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      {/* Outer envelope body */}
      <path d="M2 4h20v16H2V4z" />
      {/* Top flap line */}
      <path d="M22 4l-10 8L2 4" />
      {/* Decorative inner corners for pixel look */}
      <path d="M2 16l5-4" />
      <path d="M22 16l-5-4" />
    </svg>
  );
}
