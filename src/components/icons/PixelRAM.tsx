export const PixelRAM = ({
  color = "currentColor",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
    <rect x="1" y="4" width="10" height="4" />
    <rect x="2" y="3" width="1" height="1" />
    <rect x="4" y="3" width="1" height="1" />
    <rect x="6" y="3" width="1" height="1" />
    <rect x="8" y="3" width="1" height="1" />
    <rect x="2" y="8" width="1" height="1" opacity="0.5" />
  </svg>
);
