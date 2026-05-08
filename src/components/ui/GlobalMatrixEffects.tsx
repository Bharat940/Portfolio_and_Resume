"use client";

import React from "react";
import { useTerminal } from "@/context/TerminalContext";
import { MatrixRain } from "@/components/terminal/MatrixRain";

export function GlobalMatrixEffects() {
  const { matrixMode } = useTerminal();

  if (!matrixMode) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <MatrixRain />
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
