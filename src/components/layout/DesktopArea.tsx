"use client";

import { useEffect } from "react";
import { m, AnimatePresence } from "motion/react";
import { useWindowManager } from "@/context/WindowManagerContext";
import { useTerminal } from "@/context/TerminalContext";
import { RetroWindow } from "@/components/ui/RetroWindow";
import dynamic from "next/dynamic";

const TerminalOverlay = dynamic(
  () =>
    import("@/components/terminal/TerminalOverlay").then(
      (mod) => mod.TerminalOverlay,
    ),
  { ssr: false },
);
const CyberSlither = dynamic(
  () =>
    import("@/components/easter-eggs/CyberSlither").then(
      (mod) => mod.CyberSlither,
    ),
  { ssr: false },
);
const BinaryBound = dynamic(
  () =>
    import("@/components/easter-eggs/BinaryBound").then(
      (mod) => mod.BinaryBound,
    ),
  { ssr: false },
);
const TerminalInvaders = dynamic(
  () =>
    import("@/components/easter-eggs/TerminalInvaders").then(
      (mod) => mod.TerminalInvaders,
    ),
  { ssr: false },
);
const MemoryMatch = dynamic(
  () =>
    import("@/components/easter-eggs/MemoryMatch").then(
      (mod) => mod.MemoryMatch,
    ),
  { ssr: false },
);

export function DesktopArea() {
  const { windows, openWindow, focusWindow } = useWindowManager();
  const { isOpen } = useTerminal();

  // Sync TerminalContext with WindowManager
  useEffect(() => {
    if (isOpen) {
      openWindow("terminal", "Terminal (WSL: Ubuntu)");
    }
  }, [isOpen, openWindow]);

  const anyMaximized = windows.some((win) => win.isMaximized);

  return (
    <div className="fixed inset-0 pointer-events-none z-2000 overflow-hidden">
      <AnimatePresence>
        {windows.map((win) => (
          <RetroWindow
            key={`win-${win.id}`}
            id={win.id}
            title={win.title}
            zIndex={win.zIndex}
            isMaximized={win.isMaximized}
            type={win.type}
          >
            {win.type === "terminal" && <TerminalOverlay />}
            {win.type === "arcade" && (
              <div className="w-full h-full">
                {win.gameId === "cyberslither" && <CyberSlither />}
                {win.gameId === "binarybound" && <BinaryBound />}
                {win.gameId === "terminalinvaders" && <TerminalInvaders />}
                {win.gameId === "memorymatch" && <MemoryMatch />}
              </div>
            )}
          </RetroWindow>
        ))}
      </AnimatePresence>

      {/* Pixelated Floating Dock */}
      <AnimatePresence>
        {windows.length > 0 && !anyMaximized && (
          <m.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-ctp-mantle border-2 border-ctp-surface0 pointer-events-auto z-5000 shadow-[8px_8px_0_rgba(0,0,0,0.4)]"
          >
            {windows.map((win) => {
              const isFocused =
                win.zIndex >= Math.max(...windows.map((w) => w.zIndex));
              return (
                <m.button
                  key={`dock-${win.id}`}
                  whileHover={{ scale: 1.2, y: -8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => focusWindow(win.id)}
                  className="group relative flex flex-col items-center"
                >
                  {/* Active Indicator Line (Blinking) */}
                  <div className="absolute -top-2 left-0 right-0 h-1 flex justify-center">
                    <div
                      className={`w-8 h-full bg-ctp-mauve ${isFocused ? "animate-pulse" : "opacity-0"}`}
                    />
                  </div>

                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-sm border-2 transition-all duration-200 ${
                      isFocused
                        ? "bg-ctp-mauve border-white text-ctp-mantle"
                        : "bg-ctp-crust border-ctp-surface0 text-ctp-subtext1 hover:border-ctp-overlay0"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {win.type === "terminal" ? "TERM" : "ARCADE"}
                    </span>
                  </div>

                  {/* Pixel Tooltip */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-1 bg-ctp-mantle text-white text-[10px] font-black uppercase tracking-[0.2em] pointer-events-none border-2 border-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                    {win.title}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-ctp-mantle border-r-2 border-b-2 border-white rotate-45" />
                  </div>
                </m.button>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
