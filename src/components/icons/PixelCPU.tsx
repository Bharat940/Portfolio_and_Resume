export const PixelCPU = ({
  color = "currentColor",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
    <rect x="2" y="2" width="8" height="8" opacity="0.2" />
    <rect x="3" y="3" width="6" height="6" />
    <rect x="5" y="5" width="2" height="2" fill="white" opacity="0.3" />
    <rect x="5" y="1" width="2" height="1" />
    <rect x="5" y="10" width="2" height="1" />
    <rect x="1" y="5" width="1" height="2" />
    <rect x="10" y="5" width="1" height="2" />
  </svg>
);
