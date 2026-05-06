"use client";

import { useEffect, useRef } from "react";
import { useTransition } from "@/context/TransitionContext";

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
  const { isTransitioning } = useTransition();
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const configRef = useRef(getDeviceConfig());

  useEffect(() => {
    if (!isTransitioning) return;

    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const { reducedMotion, lowEnd } = configRef.current;

    if (reducedMotion || lowEnd) {
      panels.forEach((p) => {
        p.style.transform = "translateY(0%)";
        p.style.transition = "transform 0.2s ease";
      });
      setTimeout(() => {
        panels.forEach((p) => {
          p.style.transform = "translateY(-100%)";
        });
      }, 300);
      return;
    }

    panels.forEach((panel, i) => {
      panel.style.transition = `transform 0.55s ${EASE} ${0.04 * i}s`;
      panel.style.transform = "translateY(0)";
    });

    letters.forEach((letter, i) => {
      setTimeout(
        () => {
          letter.style.opacity = "1";
          setTimeout(() => {
            letter.style.opacity = "0";
          }, 600);
        },
        40 * i + 350,
      );
    });

    setTimeout(() => {
      panels.forEach((panel, i) => {
        panel.style.transition = `transform 0.6s ${EASE} ${0.04 * i}s`;
        panel.style.transform = "translateY(-100vh)";
      });

      const totalEnterDuration = 600 + 40 * (STEPS - 1) + 100;
      setTimeout(() => {
        panels.forEach((panel) => {
          panel.style.transition = "none";
          panel.style.transform = "translateY(100vh)";
        });
      }, totalEnterDuration);
    }, 1080);
  }, [isTransitioning]);

  return (
    <div className="fixed inset-0 z-110 pointer-events-none flex flex-col overflow-hidden">
      {[...Array(STEPS)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          className={`relative flex-1 flex items-center justify-center ${COLORS[i % COLORS.length]}`}
          style={{ transform: "translateY(100vh)" }}
        >
          <span
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="text-ctp-base font-black font-heading text-5xl md:text-8xl select-none pointer-events-none"
            style={{ opacity: 0, transition: "opacity 0.15s ease" }}
          >
            {LETTERS[i]}
          </span>
        </div>
      ))}
    </div>
  );
}
