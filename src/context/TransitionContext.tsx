"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type TransitionPhase =
  | "idle" // Nothing happening
  | "entering" // Panels sliding in
  | "holding" // Panels fully in, waiting for page load
  | "exiting"; // Panels sliding out

interface TransitionContextType {
  isTransitioning: boolean;
  phase: TransitionPhase;
  elapsed: number; // ms since navigation started (for progress bar)
  navigateTo: (href: string) => void;
  onEnterComplete: () => void; // Called by StaircaseTransition when panels are in
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  phase: "idle",
  elapsed: 0,
  navigateTo: () => {},
  onEnterComplete: () => {},
});

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const targetHref = useRef<string | null>(null);
  const startTime = useRef<number>(0);
  const elapsedTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pageReadyRef = useRef(false); // did pathname change already?
  const enterDoneRef = useRef(false); // did enter animation finish?

  // Clear the elapsed ticker
  const clearElapsedTimer = useCallback(() => {
    if (elapsedTimer.current) {
      clearInterval(elapsedTimer.current);
      elapsedTimer.current = null;
    }
  }, []);

  // Begin exit once BOTH conditions are true: panels are in + page is loaded
  const maybeExit = useCallback(() => {
    if (!pageReadyRef.current || !enterDoneRef.current) return;
    // Brief hold so the user can read the letters (min 200ms after both ready)
    setTimeout(() => {
      setPhase("exiting");
      // Give exit animation time to complete before going fully idle
      setTimeout(() => {
        setPhase("idle");
        setElapsed(0);
        targetHref.current = null;
        clearElapsedTimer();
      }, 900);
    }, 200);
  }, [clearElapsedTimer]);

  // Called by StaircaseTransition when the enter animation finishes (~600ms)
  const onEnterComplete = useCallback(() => {
    enterDoneRef.current = true;
    setPhase("holding");
    maybeExit();
  }, [maybeExit]);

  // Watch pathname — when it changes, the new page is ready
  useEffect(() => {
    if (phase === "idle") return;
    if (targetHref.current === null) return;

    // Normalize: strip origin, compare path only
    const target = targetHref.current.split("?")[0].split("#")[0];
    if (pathname === target || pathname !== target.replace(/\/$/, "")) {
      // Pathname changed → page committed
      if (pathname !== window.location.pathname.split("?")[0]) return; // not yet
      pageReadyRef.current = true;
      maybeExit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const navigateTo = useCallback(
    (href: string) => {
      if (phase !== "idle") return;
      if (typeof window !== "undefined" && window.location.pathname === href)
        return;

      // Reset state
      pageReadyRef.current = false;
      enterDoneRef.current = false;
      targetHref.current = href;
      startTime.current = Date.now();
      setElapsed(0);
      setPhase("entering");

      // Start elapsed ticker (for the progress bar)
      elapsedTimer.current = setInterval(() => {
        setElapsed(Date.now() - startTime.current);
      }, 50);

      // Kick off the route change immediately — don't wait for animation
      // The overlay is already covering the screen, so the user sees nothing
      router.push(href);
    },
    [phase, router],
  );

  // Safety valve: if something goes wrong, auto-exit after 8s
  useEffect(() => {
    if (phase === "idle") return;
    const bail = setTimeout(() => {
      clearElapsedTimer();
      setPhase("exiting");
      setTimeout(() => {
        setPhase("idle");
        setElapsed(0);
        targetHref.current = null;
      }, 900);
    }, 8000);
    return () => clearTimeout(bail);
  }, [phase, clearElapsedTimer]);

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning: phase !== "idle",
        phase,
        elapsed,
        navigateTo,
        onEnterComplete,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
