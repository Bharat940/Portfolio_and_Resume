"use client";

import React, { useRef, useState, useEffect } from "react";
import { m } from "motion/react";
import { PixelClose } from "@/components/icons/PixelClose";
import { useWindowManager } from "@/context/WindowManagerContext";
import { useCursor, CursorType } from "@/context/CursorContext";
import { useTerminal } from "@/context/TerminalContext";

interface RetroWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  zIndex: number;
  isMaximized: boolean;
  type?: string;
}

type InteractionMode =
  | "none"
  | "move"
  | "n"
  | "s"
  | "e"
  | "w"
  | "nw"
  | "ne"
  | "sw"
  | "se";

export function RetroWindow({
  id,
  title,
  children,
  zIndex,
  isMaximized,
}: RetroWindowProps) {
  const { closeWindow, focusWindow, maximizeWindow } = useWindowManager();
  const { setTemporaryType } = useCursor();
  const { matrixMode } = useTerminal();

  const [geometry, setGeometry] = useState({
    width: 800,
    height: 600,
    x: 100,
    y: 100,
    isInitialized: false,
  });
  const [interaction, setInteraction] = useState<InteractionMode>("none");
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
    winX: 0,
    winY: 0,
    winW: 0,
    winH: 0,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timeoutId = setTimeout(() => {
      const w = Math.min(1000, window.innerWidth * 0.8);
      const h = Math.min(700, window.innerHeight * 0.7);
      const x = (window.innerWidth - w) / 2;
      const y = (window.innerHeight - h) / 2;
      setGeometry({ width: w, height: h, x, y, isInitialized: true });
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // Sync custom cursor with interaction state
  useEffect(() => {
    if (interaction === "none") return;

    const cursorMap: Record<string, CursorType> = {
      move: "move",
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      nw: "nwse-resize",
      se: "nwse-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
    };

    setTemporaryType(cursorMap[interaction] || null);
    return () => setTemporaryType(null);
  }, [interaction, setTemporaryType]);

  // Handle global mouse move for sizing/moving
  useEffect(() => {
    if (interaction === "none") return;

    const handleGlobalMove = (e: PointerEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      if (interaction === "move") {
        const newX = dragStart.winX + deltaX;
        const newY = dragStart.winY + deltaY;

        // Clamp to screen
        setGeometry((prev) => ({
          ...prev,
          x: Math.max(
            -prev.width + 100,
            Math.min(window.innerWidth - 100, newX),
          ),
          y: Math.max(0, Math.min(window.innerHeight - 40, newY)),
        }));
      } else {
        let newWidth = dragStart.winW;
        let newHeight = dragStart.winH;
        let newX = dragStart.winX;
        let newY = dragStart.winY;

        if (interaction.includes("e"))
          newWidth = Math.max(
            320,
            Math.min(
              window.innerWidth - dragStart.winX,
              dragStart.winW + deltaX,
            ),
          );
        if (interaction.includes("w")) {
          const possibleWidth = dragStart.winW - deltaX;
          if (possibleWidth >= 320) {
            newWidth = possibleWidth;
            newX = Math.max(0, dragStart.winX + deltaX);
          }
        }
        if (interaction.includes("s"))
          newHeight = Math.max(
            300,
            Math.min(
              window.innerHeight - dragStart.winY,
              dragStart.winH + deltaY,
            ),
          );
        if (interaction.includes("n")) {
          const possibleHeight = dragStart.winH - deltaY;
          if (possibleHeight >= 300) {
            newHeight = possibleHeight;
            newY = Math.max(0, dragStart.winY + deltaY);
          }
        }

        setGeometry((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        }));
      }
    };

    const handleGlobalUp = () => {
      setInteraction("none");
    };

    window.addEventListener("pointermove", handleGlobalMove);
    window.addEventListener("pointerup", handleGlobalUp);

    return () => {
      window.removeEventListener("pointermove", handleGlobalMove);
      window.removeEventListener("pointerup", handleGlobalUp);
    };
  }, [interaction, dragStart]);

  const startInteraction = (mode: InteractionMode, e: React.PointerEvent) => {
    if (isMaximized && mode !== "none") return;
    e.preventDefault();
    setInteraction(mode);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      winX: geometry.x,
      winY: geometry.y,
      winW: geometry.width,
      winH: geometry.height,
    });
    focusWindow(id);
  };

  const handleHandleHover = (mode: InteractionMode, entering: boolean) => {
    if (interaction !== "none") return; // Don't override if already dragging

    const cursorMap: Record<string, CursorType> = {
      move: "move",
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      nw: "nwse-resize",
      se: "nwse-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
    };

    setTemporaryType(entering ? cursorMap[mode] : null);
  };

  return (
    <m.div
      ref={windowRef}
      onPointerDown={() => focusWindow(id)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        x: isMaximized ? 0 : geometry.x,
        y: isMaximized ? 0 : geometry.y,
        width: isMaximized ? "100vw" : geometry.width,
        height: isMaximized ? "100dvh" : geometry.height,
        zIndex,
        scale: 1,
        opacity: geometry.isInitialized ? 1 : 0,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={
        interaction === "none"
          ? { type: "spring", damping: 25, stiffness: 300 }
          : { duration: 0 }
      }
      className={`fixed flex flex-col bg-ctp-mantle border-2 shadow-[8px_8px_0_rgba(0,0,0,0.4)] overflow-hidden ${
        isMaximized ? "border-none" : "border-ctp-surface0"
      } ${interaction !== "none" ? "border-ctp-blue" : ""} ${
        zIndex > 2000 ? "border-ctp-mauve" : ""
      } ${matrixMode ? "matrix-glow" : ""}`}
      style={{ pointerEvents: "auto" }}
    >
      {/* Title Bar */}
      <div
        className={`h-10 flex items-center justify-between px-3 shrink-0 select-none cursor-default border-b ${
          zIndex > 2000
            ? "bg-ctp-crust border-ctp-mauve/50"
            : "bg-ctp-crust border-ctp-surface0"
        }`}
      >
        <div
          onPointerDown={(e) => startInteraction("move", e)}
          onMouseEnter={() => handleHandleHover("move", true)}
          onMouseLeave={() => handleHandleHover("move", false)}
          className="flex-1 h-full flex items-center gap-3 min-w-0"
        >
          <div className="flex gap-1.5 shrink-0">
            <div
              className="w-3 h-3 rounded-full bg-ctp-red shadow-inner hover:brightness-125 transition-all cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(id);
              }}
            />
            <div className="w-3 h-3 rounded-full bg-ctp-yellow shadow-inner" />
            <div
              className="w-3 h-3 rounded-full bg-ctp-green shadow-inner hover:brightness-125 transition-all cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(id);
              }}
            />
          </div>
          <span className="text-[10px] md:text-[12px] font-bold text-ctp-subtext1 uppercase tracking-widest md:tracking-[0.2em] truncate pr-4">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            className="p-1.5 md:p-2 hover:bg-ctp-surface1 rounded-lg text-ctp-subtext0 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 md:w-4 md:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="p-1.5 md:p-2 hover:bg-ctp-red/20 text-ctp-subtext1 hover:text-ctp-red transition-colors rounded-lg"
          >
            <PixelClose className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-ctp-mantle relative">
        {children}
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <div
            onPointerDown={(e) => startInteraction("n", e)}
            onMouseEnter={() => handleHandleHover("n", true)}
            onMouseLeave={() => handleHandleHover("n", false)}
            className="absolute top-0 left-4 right-4 h-2 z-100 hover:bg-ctp-blue/20"
          />
          <div
            onPointerDown={(e) => startInteraction("s", e)}
            onMouseEnter={() => handleHandleHover("s", true)}
            onMouseLeave={() => handleHandleHover("s", false)}
            className="absolute bottom-0 left-4 right-4 h-2 z-100 hover:bg-ctp-blue/20"
          />
          <div
            onPointerDown={(e) => startInteraction("e", e)}
            onMouseEnter={() => handleHandleHover("e", true)}
            onMouseLeave={() => handleHandleHover("e", false)}
            className="absolute top-4 bottom-4 right-0 w-2 z-100 hover:bg-ctp-blue/20"
          />
          <div
            onPointerDown={(e) => startInteraction("w", e)}
            onMouseEnter={() => handleHandleHover("w", true)}
            onMouseLeave={() => handleHandleHover("w", false)}
            className="absolute top-4 bottom-4 left-0 w-2 z-100 hover:bg-ctp-blue/20"
          />

          <div
            onPointerDown={(e) => startInteraction("nw", e)}
            onMouseEnter={() => handleHandleHover("nw", true)}
            onMouseLeave={() => handleHandleHover("nw", false)}
            className="absolute top-0 left-0 w-4 h-4 z-110 hover:bg-ctp-blue/40"
          />
          <div
            onPointerDown={(e) => startInteraction("ne", e)}
            onMouseEnter={() => handleHandleHover("ne", true)}
            onMouseLeave={() => handleHandleHover("ne", false)}
            className="absolute top-0 right-0 w-4 h-4 z-110 hover:bg-ctp-blue/40"
          />
          <div
            onPointerDown={(e) => startInteraction("sw", e)}
            onMouseEnter={() => handleHandleHover("sw", true)}
            onMouseLeave={() => handleHandleHover("sw", false)}
            className="absolute bottom-0 left-0 w-4 h-4 z-110 hover:bg-ctp-blue/40"
          />
          <div
            onPointerDown={(e) => startInteraction("se", e)}
            onMouseEnter={() => handleHandleHover("se", true)}
            onMouseLeave={() => handleHandleHover("se", false)}
            className="absolute bottom-0 right-0 w-4 h-4 z-110 hover:bg-ctp-blue/40"
          />
        </>
      )}
    </m.div>
  );
}
