"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface DiamondDividerProps {
  color?: string;
  className?: string;
}

const CTP_HEX: Record<string, string> = {
  "ctp-rosewater": "#f5e0dc",
  "ctp-flamingo":  "#f2cdcd",
  "ctp-pink":      "#f5c2e7",
  "ctp-mauve":     "#cba6f7",
  "ctp-red":       "#f38ba8",
  "ctp-maroon":    "#eba0ac",
  "ctp-peach":     "#fab387",
  "ctp-yellow":    "#f9e2af",
  "ctp-green":     "#a6e3a1",
  "ctp-teal":      "#94e2d5",
  "ctp-sky":       "#89dceb",
  "ctp-sapphire":  "#74c7ec",
  "ctp-blue":      "#89b4fa",
  "ctp-lavender":  "#b4befe",
  "ctp-base":      "#1e1e2e",
  "ctp-mantle":    "#181825",
  "ctp-crust":     "#11111b",
  "ctp-surface0":  "#313244",
  "ctp-surface1":  "#45475a",
  "ctp-surface2":  "#585b70",
};

export function DiamondDivider({ color = "ctp-surface2", className }: DiamondDividerProps) {
  const fill = CTP_HEX[color] ?? color;

  const SIZE = 14;
  // A 14×14 square rotated 45° has a diagonal of 14√2 ≈ 19.8px.
  // The container must be this tall so each diamond straddles the seam equally.
  const diagonal = Math.ceil(SIZE * Math.SQRT2); // ~20px
  const COUNT = 64;

  // Adjacent rotated squares touch corner-to-corner when their layout boxes
  // overlap by (diagonal - SIZE) / 2 on each side.
  const overlap = (diagonal - SIZE) / 2;

  return (
    <div
      className={cn("w-full pointer-events-none select-none relative z-10 overflow-hidden", className)}
      style={{
        // Give it just enough height to contain the diamonds without clipping
        height: diagonal + 2,
        // Pull the sections together so the diamonds straddle the seam
        marginTop: -(diagonal + 2) / 2,
        marginBottom: -(diagonal + 2) / 2,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 0,
          width: "max-content",
        }}
      >
        {Array.from({ length: COUNT }).map((_, i) => {
          const mid = (COUNT - 1) / 2;
          const dist = Math.abs(i - mid) / mid;
          const targetOpacity = Math.max(0, 1 - Math.pow(dist, 1.6));

          return (
            <motion.div
              key={i}
              // Use motion's own rotate + scale — DO NOT mix with CSS transform string
              initial={{ opacity: 0, scale: 0, rotate: 45 }}
              whileInView={{ opacity: targetOpacity, scale: 1, rotate: 45 }}
              viewport={{ once: true, margin: "80px" }}
              transition={{
                delay: (i % 32) * 0.006,
                type: "spring",
                stiffness: 320,
                damping: 24,
              }}
              style={{
                width: SIZE,
                height: SIZE,
                flexShrink: 0,
                background: fill,
                // Spacing each layout box so that the rotated visual diagonals touch corner-to-corner
                marginLeft: overlap,
                marginRight: overlap,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
