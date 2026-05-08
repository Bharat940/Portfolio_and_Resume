"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useCursor, CursorType } from "@/context/CursorContext";
import { useTerminal } from "@/context/TerminalContext";

// ── SVG cursor shapes ──────────────────────────────────────────────
const COLOR_MAP: Record<CursorType, string> = {
  default: "#cba6f7",
  crosshair: "#89dceb",
  text: "#a6e3a1",
  block: "#f38ba8",
  focus: "#fab387",
  hidden: "transparent",
};

function DefaultCursorShape({
  hovering,
  color,
}: {
  hovering: boolean;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className="w-full h-full overflow-visible"
    >
      {/* Primary ring */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke={color}
        strokeWidth={hovering ? "2" : "1.5"}
        strokeOpacity={hovering ? "0.9" : "0.4"}
        fill={hovering ? `${color}0D` : "none"}
      />
      {/* Inner thin accent ring */}
      <circle
        cx="20"
        cy="20"
        r="14"
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity={hovering ? "0.3" : "0.1"}
      />
      {/* Corner Brackets */}
      <m.g
        initial={{ scale: 0.9, opacity: 0.3 }}
        animate={{ scale: hovering ? 1.1 : 0.9, opacity: hovering ? 1 : 0.3 }}
        style={{ transformOrigin: "center" }}
      >
        <path
          d="M 6 11 L 6 6 L 11 6"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 29 6 L 34 6 L 34 11"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 34 29 L 34 34 L 29 34"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 11 34 L 6 34 L 6 29"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </m.g>
    </svg>
  );
}

function CrosshairCursorShape({
  hovering,
  color,
}: {
  hovering: boolean;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className="w-full h-full overflow-visible"
    >
      {/* Rotating outer compass ring */}
      <m.circle
        cx="20"
        cy="20"
        r="18"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.4"
        strokeDasharray="1 6"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />

      {/* Main crosshair circle */}
      <circle
        cx="20"
        cy="20"
        r="15"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity={hovering ? "0.8" : "0.5"}
        fill={hovering ? `${color}1A` : "none"}
      />

      {/* Cross lines with gap */}
      <m.g
        initial={{ scale: 1 }}
        animate={{ scale: hovering ? 1.2 : 1 }}
        style={{ transformOrigin: "center" }}
      >
        <line
          x1="4"
          y1="20"
          x2="12"
          y2="20"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="28"
          y1="20"
          x2="36"
          y2="20"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="4"
          x2="20"
          y2="12"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="28"
          x2="20"
          y2="36"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </m.g>

      {/* Targeting dot */}
      <circle cx="20" cy="20" r="2" fill={color} />
    </svg>
  );
}

function TextCursorShape({
  hovering,
  color,
}: {
  hovering: boolean;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className="w-full h-full overflow-visible"
    >
      {/* Outer focus brackets */}
      <m.g
        initial={{ opacity: 0.4, scale: 1 }}
        animate={{ opacity: hovering ? 1 : 0.4, scale: hovering ? 1.05 : 1 }}
      >
        <path
          d="M 12 8 L 16 8 M 12 8 L 12 32 M 12 32 L 16 32"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 28 8 L 24 8 M 28 8 L 28 32 M 28 32 L 24 32"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </m.g>

      {/* Main I-beam */}
      <m.line
        x1="20"
        y1="10"
        x2="20"
        y2="30"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* Top/Bottom serifs */}
      <line
        x1="17"
        y1="10"
        x2="23"
        y2="10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="30"
        x2="23"
        y2="30"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BlockCursorShape({
  hovering,
  matrixMode,
  color,
}: {
  hovering: boolean;
  matrixMode?: boolean;
  color: string;
}) {
  const finalColor = matrixMode ? "#00FF41" : color;
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className="w-full h-full overflow-visible"
    >
      {/* Main block rect */}
      <m.rect
        x="8"
        y="10"
        width="24"
        height="20"
        rx="1"
        fill={hovering ? `${finalColor}4D` : `${finalColor}26`}
        stroke={finalColor}
        strokeWidth="1.5"
        initial={{ strokeOpacity: 0.4, fillOpacity: 0.2 }}
        animate={{
          strokeOpacity: [0.4, 0.8, 0.4],
          fillOpacity: hovering ? 1 : [0.2, 0.5, 0.2],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />

      {/* Underscore indicator */}
      <m.line
        x1="12"
        y1="26"
        x2="28"
        y2="26"
        stroke={finalColor}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />

      {/* Digital bits/particles */}
      <m.g initial={{ opacity: 0.4 }} animate={{ opacity: hovering ? 1 : 0.4 }}>
        <rect x="34" y="12" width="2" height="2" fill={finalColor} />
        <rect x="34" y="26" width="2" height="2" fill={finalColor} />
        <rect x="4" y="18" width="2" height="2" fill={finalColor} />
      </m.g>
    </svg>
  );
}

function FocusCursorShape({
  hovering,
  color,
}: {
  hovering: boolean;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className="w-full h-full overflow-visible"
    >
      {/* Outer rotating brackets */}
      <m.g
        initial={{ rotate: 0 }}
        animate={{ rotate: hovering ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformOrigin: "center" }}
      >
        <path
          d="M 6 12 L 6 6 L 12 6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 28 6 L 34 6 L 34 12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 34 28 L 34 34 L 28 34"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 12 34 L 6 34 L 6 28"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </m.g>

      {/* Inner HUD ring */}
      <circle
        cx="20"
        cy="20"
        r="14"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeDasharray="2 4"
      />

      {/* Crosshair ticks */}
      <m.g
        initial={{ scale: 1 }}
        animate={{ scale: hovering ? 1.2 : 1 }}
        style={{ transformOrigin: "center" }}
      >
        <line
          x1="20"
          y1="12"
          x2="20"
          y2="8"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <line
          x1="20"
          y1="28"
          x2="20"
          y2="32"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <line
          x1="12"
          y1="20"
          x2="8"
          y2="20"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <line
          x1="28"
          y1="20"
          x2="32"
          y2="20"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
      </m.g>

      {/* Scanning line */}
      <m.line
        x1="10"
        x2="30"
        y1="20"
        y2="20"
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.4"
        initial={{ y: -10, opacity: 0.2 }}
        animate={{
          y: [-8, 8, -8],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        }}
      />

      {/* Center lock dot */}
      <circle
        cx="20"
        cy="20"
        r={hovering ? 3 : 2}
        fill={color}
        className="transition-all duration-300"
      />

      {/* Fake technical text snippet */}
      {hovering && (
        <m.text
          x="20"
          y="45"
          fill={color}
          fontSize="4"
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.8, y: 0 }}
        >
          LOCK_ON
        </m.text>
      )}
    </svg>
  );
}

// ── Config ───────────────────────────────────────────────────────────────────

const CURSOR_SIZE: Record<
  CursorType,
  { idle: number; hover: number; dot: number }
> = {
  default: { idle: 36, hover: 52, dot: 5 },
  crosshair: { idle: 40, hover: 56, dot: 3 },
  text: { idle: 32, hover: 32, dot: 0 }, // I-beam stays same size
  block: { idle: 36, hover: 44, dot: 0 },
  focus: { idle: 44, hover: 56, dot: 4 },
  hidden: { idle: 0, hover: 0, dot: 0 },
};

function CursorShape({
  type,
  hovering,
  matrixMode,
  color,
}: {
  type: CursorType;
  hovering: boolean;
  matrixMode?: boolean;
  color: string;
}) {
  switch (type) {
    case "default":
      return <DefaultCursorShape hovering={hovering} color={color} />;
    case "crosshair":
      return <CrosshairCursorShape hovering={hovering} color={color} />;
    case "text":
      return <TextCursorShape hovering={hovering} color={color} />;
    case "block":
      return (
        <BlockCursorShape
          hovering={hovering}
          matrixMode={matrixMode}
          color={color}
        />
      );
    case "focus":
      return <FocusCursorShape hovering={hovering} color={color} />;
    default:
      return null;
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export function CustomCursor() {
  const {
    cursorType,
    pageCursorType,
    isHovering,
    setIsHovering,
    setTemporaryType,
  } = useCursor();
  const { matrixMode } = useTerminal();
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const ringX = useSpring(mouseX, { stiffness: 160, damping: 20 });
  const ringY = useSpring(mouseY, { stiffness: 160, damping: 20 });
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 32 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 32 });

  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = window.matchMedia("(pointer: coarse)").matches;
      if (hasTouch) {
        queueMicrotask(() => setIsMobile(true));
      }
    };
    checkMobile();

    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.style.setProperty("cursor", "none", "important");

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };
    const hide = () => setVisible(false);
    const show = () => setVisible(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    // Auto-detect interactives for hover state
    const attachHover = () => {
      document
        .querySelectorAll<HTMLElement>(
          'a, button, [role="button"], input, textarea, select, label, [tabindex], [data-cursor]',
        )
        .forEach((el) => {
          const customType = el.getAttribute(
            "data-cursor",
          ) as CursorType | null;

          el.addEventListener("mouseenter", () => {
            setIsHovering(true);
            if (customType) setTemporaryType(customType);
          });
          el.addEventListener("mouseleave", () => {
            setIsHovering(false);
            if (customType) setTemporaryType(null);
          });
        });
    };
    const t = setTimeout(attachHover, 400);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      clearTimeout(t);
    };
  }, [mouseX, mouseY, setIsHovering, setTemporaryType]);

  if (isMobile) return null;

  const themeColor = COLOR_MAP[pageCursorType];
  const activeType = matrixMode ? "block" : cursorType;
  const cfg = CURSOR_SIZE[activeType];
  const size = isHovering ? cfg.hover : cfg.idle;

  return (
    <>
      {/* SVG ring — lags slightly */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none z-9999"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      >
        <AnimatePresence mode="wait">
          <m.div
            key={activeType}
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <CursorShape
              type={activeType}
              hovering={isHovering}
              matrixMode={matrixMode}
              color={themeColor}
            />
          </m.div>
        </AnimatePresence>
      </m.div>

      {/* Dot — snappy, instant */}
      {cfg.dot > 0 && (
        <m.div
          className="fixed top-0 left-0 pointer-events-none z-9999 rounded-full"
          style={{
            x: dotX,
            y: dotY,
            translateX: "-50%",
            translateY: "-50%",
            width: cfg.dot,
            height: cfg.dot,
            backgroundColor: matrixMode ? "#00FF41" : themeColor,
            opacity: visible ? 1 : 0,
          }}
        />
      )}
    </>
  );
}
