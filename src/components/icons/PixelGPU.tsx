export const PixelGPU = ({
  color = "currentColor",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
    <rect x="1" y="3" width="10" height="6" />
    <rect x="8" y="4" width="2" height="4" fill="white" opacity="0.2" />
    <rect x="2" y="4" width="1" height="1" fill="white" opacity="0.5" />
    <rect x="4" y="5" width="3" height="2" fill="black" opacity="0.3" />
  </svg>
);
