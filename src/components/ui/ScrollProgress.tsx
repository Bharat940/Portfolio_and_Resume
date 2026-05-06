"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "motion/react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
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

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-6 md:top-auto md:bottom-8 md:right-8 z-[55] flex items-center gap-2 pointer-events-none"
        >
          <div className="bg-ctp-mantle/60 backdrop-blur-md border border-ctp-surface1 px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-xl flex items-center gap-2 md:gap-3 font-mono text-[9px] md:text-[10px] tracking-widest text-ctp-blue ring-1 ring-white/5">
            <span className="text-ctp-surface2 font-bold">[</span>
            <span className="min-w-[3ch] text-center">{progress}%</span>
            <div className="w-8 md:w-12 h-1 bg-ctp-surface0 rounded-full overflow-hidden">
              <m.div 
                className="h-full bg-ctp-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>
            <span className="text-ctp-surface2 font-bold">]</span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
