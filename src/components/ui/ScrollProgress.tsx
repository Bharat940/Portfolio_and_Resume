"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "motion/react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const currentProgress = (window.scrollY / scrollHeight) * 100;
        setProgress(Math.round(currentProgress));
        setIsVisible(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", updateScroll);
    updateScroll();

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const getBlocks = () => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);
    return {
      filled: "#".repeat(filledBlocks),
      empty: ".".repeat(totalBlocks - filledBlocks),
    };
  };

  const blocks = getBlocks();

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-11 left-1/2 -translate-x-1/2 md:top-auto md:left-auto md:bottom-20 md:right-8 md:translate-x-0 z-120 flex items-center gap-2 pointer-events-none"
        >
          <div className="bg-ctp-mantle/60 backdrop-blur-md border border-ctp-surface1 px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 font-mono text-[9px] md:text-[10px] tracking-widest text-ctp-blue ring-1 ring-white/5">
            <span className="text-ctp-surface2 font-bold">[</span>
            <div className="flex items-center min-w-[10ch]">
              <span className="text-ctp-blue">{blocks.filled}</span>
              <span className="text-ctp-surface0">{blocks.empty}</span>
            </div>
            <span className="w-[4ch] text-right tabular-nums text-ctp-blue font-bold">
              {progress}%
            </span>
            <span className="text-ctp-surface2 font-bold">]</span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
