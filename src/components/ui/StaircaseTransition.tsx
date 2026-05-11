"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTransition } from "@/context/TransitionContext";
import { useTerminal } from "@/context/TerminalContext";
import { m, AnimatePresence } from "motion/react";

const STEPS = 6;
const LETTERS = ["B", "H", "A", "R", "A", "T"];
const COLORS = [
  "bg-ctp-mauve",
  "bg-ctp-pink",
  "bg-ctp-lavender",
  "bg-ctp-blue",
  "bg-ctp-sky",
  "bg-ctp-teal",
];
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

// How long until we consider the page "probably loaded" for the progress bar cap
const EXPECTED_LOAD_MS = 3000;

function getDeviceConfig() {
  if (typeof window === "undefined")
    return { reducedMotion: false, lowEnd: false };
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const cpus = navigator.hardwareConcurrency ?? 4;
  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  const lowEnd = cpus < 4 || (conn?.saveData ?? false);
  return { reducedMotion, lowEnd };
}

export function StaircaseTransition() {
  const { phase, elapsed, onEnterComplete } = useTransition();
  const { matrixMode } = useTerminal();
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const configRef = useRef(getDeviceConfig());
  const enterFiredRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    React.startTransition(() => {
      setMounted(true);
    });
  }, []);

  // --- Enter animation: fires when phase becomes "entering" ---
  useEffect(() => {
    if (phase !== "entering") {
      enterFiredRef.current = false;
      return;
    }
    if (enterFiredRef.current) return;
    enterFiredRef.current = true;

    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const { reducedMotion, lowEnd } = configRef.current;

    // Reset panels to start position first
    panels.forEach((p) => {
      p.style.transition = "none";
      p.style.transform = "translateY(100vh)";
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (reducedMotion || lowEnd) {
          panels.forEach((p) => {
            p.style.transition = "transform 0.2s ease";
            p.style.transform = "translateY(0%)";
          });
          setTimeout(() => onEnterComplete(), 250);
          return;
        }

        // Staggered entrance
        panels.forEach((panel, i) => {
          panel.style.transition = `transform 0.55s ${EASE} ${0.04 * i}s`;
          panel.style.transform = "translateY(0)";
        });

        // Letters fade in sequentially
        letters.forEach((letter, i) => {
          setTimeout(
            () => {
              letter.style.opacity = "1";
            },
            40 * i + 200,
          );
        });

        // Signal enter complete after all panels are in
        const enterDuration = 550 + 40 * (STEPS - 1) + 50;
        setTimeout(() => onEnterComplete(), enterDuration);
      });
    });
  }, [phase, onEnterComplete]);

  // --- Exit animation: fires when phase becomes "exiting" ---
  useEffect(() => {
    if (phase !== "exiting") return;

    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const { reducedMotion, lowEnd } = configRef.current;

    // Fade out letters
    letters.forEach((l) => {
      l.style.opacity = "0";
    });

    if (reducedMotion || lowEnd) {
      panels.forEach((p) => {
        p.style.transition = "transform 0.2s ease";
        p.style.transform = "translateY(-100%)";
      });
      return;
    }

    panels.forEach((panel, i) => {
      panel.style.transition = `transform 0.6s ${EASE} ${0.04 * i}s`;
      panel.style.transform = "translateY(-100vh)";
    });

    // After exit completes, snap back to below viewport (ready for next time)
    const totalExitDuration = 600 + 40 * (STEPS - 1) + 100;
    setTimeout(() => {
      panels.forEach((p) => {
        p.style.transition = "none";
        p.style.transform = "translateY(100vh)";
      });
    }, totalExitDuration);
  }, [phase]);

  // Progress: map elapsed time to 0–100, capped at 95 until page is actually ready
  // When phase is "exiting" we snap to 100
  const getProgress = () => {
    if (phase === "idle") return 0;
    if (phase === "exiting") return 100;
    // Ease-out curve: fast early, slows near 95%
    const raw = Math.min(elapsed / EXPECTED_LOAD_MS, 1);
    const eased = 1 - Math.pow(1 - raw, 2); // ease-out quad
    return Math.min(eased * 95, 95);
  };

  const progress = getProgress();
  const filledBars = Math.floor(progress / 10);

  return (
    <div className="fixed inset-0 z-110 pointer-events-none flex flex-col overflow-hidden">
      {[...Array(STEPS)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          className={`relative flex-1 flex items-center justify-center transition-colors duration-500 ${
            mounted && matrixMode ? "bg-[#030803]" : COLORS[i % COLORS.length]
          }`}
          style={{ transform: "translateY(100vh)" }}
        >
          {mounted && matrixMode && (
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] opacity-10 pointer-events-none" />
          )}
          <span
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className={`font-black font-heading text-5xl md:text-8xl select-none pointer-events-none ${
              mounted && matrixMode
                ? "text-[#00FF41] drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]"
                : "text-ctp-base"
            }`}
            style={{ opacity: 0, transition: "opacity 0.15s ease" }}
          >
            {LETTERS[i]}
          </span>
        </div>
      ))}

      {/* Unified Progress Bar — handles all phases */}
      <AnimatePresence>
        {(phase === "entering" ||
          phase === "holding" ||
          phase === "exiting") && (
          <m.div
            key="unified-progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 z-50 flex flex-col items-center md:items-start gap-2 pointer-events-none"
          >
            <div className="bg-ctp-mantle/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-ctp-base/60 uppercase font-black">
              <span>
                {phase === "exiting"
                  ? "Ready"
                  : phase === "holding"
                    ? "Rendering"
                    : "Decrypting"}
              </span>
              <div className="flex items-center gap-1 w-32">
                {[...Array(10)].map((_, i) => {
                  const isFilled = phase === "exiting" || i < filledBars;
                  return (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-sm transition-colors duration-300 ${
                        isFilled
                          ? mounted && matrixMode
                            ? "bg-[#00FF41]"
                            : "bg-ctp-base"
                          : "bg-white/10"
                      }`}
                    />
                  );
                })}
              </div>
              <span className="w-[4ch] text-right tabular-nums">
                {phase === "exiting" ? "100" : Math.round(progress)}%
              </span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
