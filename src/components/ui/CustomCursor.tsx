"use client";

import { useEffect, useState } from 'react';
import { m, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { useCursor, CursorType } from '@/context/CursorContext';

// ── SVG cursor shapes ────────────────────────────────────────────────────────
// Each returns an SVG rendered inside the ring — fully scalable, no image files

function DefaultCursorShape({ hovering }: { hovering: boolean }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <circle
        cx="20" cy="20" r="18"
        stroke="#cba6f7"
        strokeWidth={hovering ? "2" : "1.5"}
        strokeOpacity={hovering ? "0.9" : "0.5"}
        fill={hovering ? "rgba(203,166,247,0.08)" : "none"}
      />
      {hovering && (
        <>
          {/* Four corner ticks — appear on hover */}
          <line x1="4" y1="4" x2="9" y2="4" stroke="#cba6f7" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="4" x2="4" y2="9" stroke="#cba6f7" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="4" x2="31" y2="4" stroke="#cba6f7" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="4" x2="36" y2="9" stroke="#cba6f7" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="36" x2="9" y2="36" stroke="#cba6f7" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="36" x2="4" y2="31" stroke="#cba6f7" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="36" x2="31" y2="36" stroke="#cba6f7" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="36" x2="36" y2="31" stroke="#cba6f7" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function CrosshairCursorShape({ hovering }: { hovering: boolean }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      {/* Outer ring */}
      <circle cx="20" cy="20" r="17" stroke="#89dceb" strokeWidth="1" strokeOpacity="0.6" fill="none" />
      {/* Inner ring */}
      <circle cx="20" cy="20" r="4" stroke="#89dceb" strokeWidth="1.5" fill={hovering ? "rgba(137,220,235,0.3)" : "none"} />
      {/* Cross lines — gap in center */}
      <line x1="2" y1="20" x2="14" y2="20" stroke="#89dceb" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={hovering ? "1" : "0.7"} />
      <line x1="26" y1="20" x2="38" y2="20" stroke="#89dceb" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={hovering ? "1" : "0.7"} />
      <line x1="20" y1="2" x2="20" y2="14" stroke="#89dceb" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={hovering ? "1" : "0.7"} />
      <line x1="20" y1="26" x2="20" y2="38" stroke="#89dceb" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={hovering ? "1" : "0.7"} />
      {/* Tick marks on ring */}
      {[0, 90, 180, 270].map(angle => (
        <line
          key={angle}
          x1="20" y1="3"
          x2="20" y2="7"
          stroke="#89dceb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.5"
          transform={`rotate(${angle} 20 20)`}
        />
      ))}
    </svg>
  );
}

function TextCursorShape({ hovering }: { hovering: boolean }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      {/* I-beam */}
      <line x1="20" y1="6" x2="20" y2="34" stroke="#a6e3a1" strokeWidth="2" strokeLinecap="round" />
      {/* Top serif */}
      <line x1="14" y1="6" x2="26" y2="6" stroke="#a6e3a1" strokeWidth="2" strokeLinecap="round" />
      {/* Bottom serif */}
      <line x1="14" y1="34" x2="26" y2="34" stroke="#a6e3a1" strokeWidth="2" strokeLinecap="round" />
      {/* Blink dot — shown on hover */}
      {hovering && (
        <circle cx="20" cy="20" r="2.5" fill="#a6e3a1" fillOpacity="0.8" />
      )}
    </svg>
  );
}

function BlockCursorShape({ hovering }: { hovering: boolean }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      {/* Terminal block cursor */}
      <rect
        x="8" y="10" width="24" height="20" rx="2"
        fill={hovering ? "rgba(243,139,168,0.25)" : "rgba(243,139,168,0.12)"}
        stroke="#f38ba8"
        strokeWidth={hovering ? "2" : "1.5"}
      />
      {/* Underscore line inside */}
      <line x1="10" y1="28" x2="30" y2="28" stroke="#f38ba8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
      {/* Scan lines inside block — decorative */}
      <line x1="10" y1="17" x2="30" y2="17" stroke="#f38ba8" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="10" y1="21" x2="30" y2="21" stroke="#f38ba8" strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
  );
}

function FocusCursorShape({ hovering }: { hovering: boolean }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      {/* Outer ring — dashed */}
      <circle
        cx="20" cy="20" r="17"
        stroke="#fab387"
        strokeWidth="1.5"
        strokeOpacity={hovering ? "0.8" : "0.4"}
        strokeDasharray="4 3"
        fill="none"
      />
      {/* Inner solid ring */}
      <circle
        cx="20" cy="20" r="10"
        stroke="#fab387"
        strokeWidth="1.5"
        strokeOpacity={hovering ? "0.9" : "0.5"}
        fill={hovering ? "rgba(250,179,135,0.1)" : "none"}
      />
      {/* Center dot */}
      <circle cx="20" cy="20" r="2.5" fill="#fab387" fillOpacity={hovering ? "1" : "0.6"} />
    </svg>
  );
}

// ── Config ───────────────────────────────────────────────────────────────────

const CURSOR_SIZE: Record<CursorType, { idle: number; hover: number; dot: number; dotColor: string }> = {
  default: { idle: 36, hover: 52, dot: 5, dotColor: '#cba6f7' },
  crosshair: { idle: 40, hover: 56, dot: 3, dotColor: '#89dceb' },
  text: { idle: 32, hover: 32, dot: 0, dotColor: 'transparent' }, // I-beam stays same size
  block: { idle: 36, hover: 44, dot: 0, dotColor: 'transparent' },
  focus: { idle: 44, hover: 56, dot: 4, dotColor: '#fab387' },
  hidden: { idle: 0, hover: 0, dot: 0, dotColor: 'transparent' },
};

function CursorShape({ type, hovering }: { type: CursorType; hovering: boolean }) {
  switch (type) {
    case 'default': return <DefaultCursorShape hovering={hovering} />;
    case 'crosshair': return <CrosshairCursorShape hovering={hovering} />;
    case 'text': return <TextCursorShape hovering={hovering} />;
    case 'block': return <BlockCursorShape hovering={hovering} />;
    case 'focus': return <FocusCursorShape hovering={hovering} />;
    default: return null;
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export function CustomCursor() {
  const { cursorType, isHovering, setIsHovering } = useCursor();
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
      const hasTouch = window.matchMedia('(pointer: coarse)').matches;
      if (hasTouch) {
        queueMicrotask(() => setIsMobile(true));
      }
    };
    checkMobile();

    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.documentElement.style.setProperty('cursor', 'none', 'important');

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };
    const hide = () => setVisible(false);
    const show = () => setVisible(true);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);

    // Auto-detect interactives for hover state
    const attachHover = () => {
      document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], input, textarea, select, label, [tabindex]'
      ).forEach(el => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };
    const t = setTimeout(attachHover, 400);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
      clearTimeout(t);
    };
  }, [mouseX, mouseY, setIsHovering]);

  if (isMobile) return null;

  const cfg = CURSOR_SIZE[cursorType];
  const size = isHovering ? cfg.hover : cfg.idle;

  return (
    <>
      {/* SVG ring — lags slightly */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        animate={{ width: size, height: size }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      >
        <AnimatePresence mode="wait">
          <m.div
            key={cursorType}
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <CursorShape type={cursorType} hovering={isHovering} />
          </m.div>
        </AnimatePresence>
      </m.div>

      {/* Dot — snappy, instant */}
      {cfg.dot > 0 && (
        <m.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
          style={{
            x: dotX,
            y: dotY,
            translateX: '-50%',
            translateY: '-50%',
            width: cfg.dot,
            height: cfg.dot,
            backgroundColor: cfg.dotColor,
            opacity: visible ? 1 : 0,
          }}
        />
      )}
    </>
  );
}
