"use client";

import dynamic from "next/dynamic";
import { CursorProvider } from "@/context/CursorContext";
import { TerminalProvider, useTerminal } from "@/context/TerminalContext";
import { LazyMotion, domAnimation } from "motion/react";
import { TransitionProvider } from "@/context/TransitionContext";
import { ArcadeProvider } from "@/context/ArcadeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WindowManagerProvider } from "@/context/WindowManagerContext";
import { DesktopArea } from "@/components/layout/DesktopArea";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { StaircaseTransition } from "@/components/ui/StaircaseTransition";

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
      <WindowManagerProvider>
        <TerminalProvider>
          <ArcadeProvider>
            <CursorProvider>
              <TransitionProvider>
                <GlobalMatrixEffects />
                <CustomCursor />
                <TooltipProvider>
                  <Navbar />
                  <StaircaseTransition />
                  <ShellContent>{children}</ShellContent>
                  <Footer />
                  <DesktopArea />
                  <ScrollProgress />
                </TooltipProvider>
              </TransitionProvider>
            </CursorProvider>
          </ArcadeProvider>
        </TerminalProvider>
      </WindowManagerProvider>
    </LazyMotion>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const { matrixMode } = useTerminal();
  return (
    <main
      className={`flex-1 flex flex-col transition-colors duration-500 ${
        matrixMode ? "bg-black/30" : ""
      }`}
    >
      {children}
    </main>
  );
}
