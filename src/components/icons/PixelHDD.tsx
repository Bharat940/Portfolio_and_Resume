export const PixelHDD = ({
  color = "currentColor",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
    <rect x="3" y="1" width="6" height="10" />
    <circle cx="6" cy="4" r="2" fill="white" opacity="0.2" />
    <rect x="4" y="8" width="4" height="1" opacity="0.5" />
  </svg>
);
