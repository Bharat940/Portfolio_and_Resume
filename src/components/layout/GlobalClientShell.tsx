"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { trackMetric } from "@/lib/actions/analytics";
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

import { useRouter, usePathname } from "next/navigation";

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
  useEffect(() => {
    try {
      const hasVisited = sessionStorage.getItem("portfolio-session-visited");
      if (!hasVisited) {
        sessionStorage.setItem("portfolio-session-visited", "true");
        trackMetric("page_views");
      }
    } catch (error) {
      console.error("Failed to track session visitor:", error);
    }
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <WindowManagerProvider>
        <TerminalProvider>
          <ArcadeProvider>
            <CursorProvider>
              <TransitionProvider>
                <GlobalEffects />
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

function GlobalEffects() {
  const { recruiterMode } = useTerminal();
  if (recruiterMode) return null;
  return (
    <>
      <GlobalMatrixEffects />
      <CustomCursor />
    </>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const { matrixMode, recruiterMode } = useTerminal();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (recruiterMode && pathname !== "/") {
      router.replace("/");
    }
  }, [recruiterMode, pathname, router]);

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
