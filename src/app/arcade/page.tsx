"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GameId } from "@/context/ArcadeContext";
import { CyberSlither } from "@/components/easter-eggs/CyberSlither";
import { BinaryBound } from "@/components/easter-eggs/BinaryBound";
import { TerminalInvaders } from "@/components/easter-eggs/TerminalInvaders";
import { MemoryMatch } from "@/components/easter-eggs/MemoryMatch";
import { ARCADE_GAMES } from "@/lib/terminal/commands";
import { ArcadeProvider } from "@/context/ArcadeContext";
import { SectionPlaceholder } from "@/components/layout/SectionPlaceholder";
import { m } from "motion/react";
import { Play, Info } from "lucide-react";
import { useTerminal } from "@/context/TerminalContext";

function ArcadeStandalone() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { matrixMode } = useTerminal();
  const gameId = (searchParams.get("game") as GameId) || "none";
  const game = ARCADE_GAMES.find((g) => g.id === gameId);

  const selectGame = (id: string) => {
    router.push(`/arcade?game=${id}`);
  };

  if (gameId === "none" || !game) {
    return (
      <div
        className={`min-h-screen p-6 md:p-12 flex flex-col items-center transition-colors duration-500 ${
          matrixMode ? "bg-transparent" : "bg-ctp-crust"
        }`}
      >
        <div className="h-24 md:h-32 shrink-0" />
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black font-heading text-ctp-mauve uppercase tracking-tighter mb-4">
            Arcade Center
          </h1>
          <p className="text-ctp-subtext1 font-mono text-sm md:text-base max-w-2xl mx-auto">
            Select a localized simulation module to begin deployment. Each
            module is optimized for high-performance low-latency execution.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          {ARCADE_GAMES.map((g, idx) => (
            <m.div
              key={g.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-ctp-mantle border-2 border-ctp-surface0 p-6 flex flex-col items-center text-center hover:border-ctp-mauve transition-colors shadow-[8px_8px_0_rgba(0,0,0,0.3)]"
            >
              <div className="w-20 h-20 bg-ctp-surface1 mb-6 flex items-center justify-center border-2 border-ctp-surface2 group-hover:bg-ctp-mauve/20 transition-colors">
                <Play className="w-10 h-10 text-ctp-mauve" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white uppercase mb-2 tracking-wide">
                {g.name}
              </h3>
              <p className="text-ctp-subtext0 text-xs font-mono leading-relaxed mb-6 line-clamp-3">
                {g.description}
              </p>

              <div className="mt-auto w-full space-y-3">
                <button
                  onClick={() => selectGame(g.id)}
                  className="w-full py-3 bg-ctp-mauve text-ctp-mantle font-black font-heading uppercase tracking-widest text-sm hover:bg-white transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Launch
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-ctp-surface2 font-mono uppercase font-bold">
                  <span className="shrink-0">
                    <Info className="w-3 h-3" />
                  </span>
                  <span className="truncate">
                    {g.inspiration
                      .replace("Inspired by the ", "")
                      .replace("Inspired by ", "")}
                  </span>
                </div>
              </div>
            </m.div>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-ctp-surface1 font-mono text-[10px] uppercase tracking-[4px]"
        >
          [ SYSTEM READY ] — STANDALONE ARCADE PROTOCOL ACTIVE
        </m.div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen overflow-hidden flex flex-col items-center transition-colors duration-500 ${
        matrixMode ? "bg-transparent" : "bg-ctp-crust"
      }`}
    >
      <div className="h-24 md:h-32 shrink-0" />
      <div className="w-full max-w-5xl h-full flex items-center justify-center relative">
        {gameId === "cyberslither" && <CyberSlither />}
        {gameId === "binarybound" && <BinaryBound />}
        {gameId === "terminalinvaders" && <TerminalInvaders />}
        {gameId === "memorymatch" && <MemoryMatch />}
      </div>
    </div>
  );
}

export default function ArcadePage() {
  return (
    <ArcadeProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-ctp-crust flex items-center justify-center">
            <SectionPlaceholder />
          </div>
        }
      >
        <ArcadeStandalone />
      </Suspense>
    </ArcadeProvider>
  );
}
