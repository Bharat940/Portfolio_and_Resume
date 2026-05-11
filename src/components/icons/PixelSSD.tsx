export const PixelSSD = ({
  color = "currentColor",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
    <rect x="2" y="2" width="8" height="8" />
    <rect x="3" y="3" width="2" height="1" fill="white" opacity="0.3" />
    <rect x="3" y="8" width="6" height="1" opacity="0.3" />
  </svg>
);
