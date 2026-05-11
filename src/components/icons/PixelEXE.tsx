export const PixelEXE = ({
  color = "currentColor",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
    <path
      d="M2 2h8v8H2zM4 4l4 4M8 4L4 8"
      stroke={color}
      strokeWidth="1"
      fill="none"
    />
  </svg>
);
