export const PixelOS = ({
  color = "currentColor",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
    <rect
      x="2"
      y="2"
      width="8"
      height="8"
      fill="none"
      stroke={color}
      strokeWidth="1"
    />
    <rect x="4" y="4" width="4" height="4" />
  </svg>
);
