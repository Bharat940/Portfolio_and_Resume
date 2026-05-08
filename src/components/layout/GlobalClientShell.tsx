"use client";

import dynamic from "next/dynamic";
import { CursorProvider } from "@/context/CursorContext";
import { TerminalProvider } from "@/context/TerminalContext";
import { LazyMotion, domAnimation } from "motion/react";
import { TransitionProvider } from "@/context/TransitionContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { StaircaseTransition } from "@/components/ui/StaircaseTransition";

const TerminalOverlay = dynamic(
  () =>
    import("@/components/terminal/TerminalOverlay").then(
      (mod) => mod.TerminalOverlay,
    ),
  { ssr: false },
);

const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

const GlobalMatrixEffects = dynamic(
  () =>
    import("@/components/ui/GlobalMatrixEffects").then(
      (mod) => mod.GlobalMatrixEffects,
    ),
  { ssr: false },
);

export function GlobalClientShell({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <TerminalProvider>
        <CursorProvider>
          <TransitionProvider>
            <GlobalMatrixEffects />
            <CustomCursor />
            <TooltipProvider>
              <Navbar />
              <StaircaseTransition />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
              <TerminalOverlay />
              <ScrollProgress />
            </TooltipProvider>
          </TransitionProvider>
        </CursorProvider>
      </TerminalProvider>
    </LazyMotion>
  );
}
