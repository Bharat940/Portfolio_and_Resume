export const PixelBUS = ({
  color = "currentColor",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
    <rect x="1" y="5" width="10" height="2" />
    <rect x="1" y="2" width="10" height="1" opacity="0.3" />
    <rect x="1" y="8" width="10" height="1" opacity="0.3" />
  </svg>
);
