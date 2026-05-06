"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

interface TransitionContextType {
  isTransitioning: boolean;
  navigateTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  navigateTo: () => {},
});

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pendingHref = useRef<string | null>(null);

  const navigateTo = useCallback(
    (href: string) => {
      if (isTransitioning) return;

      // Prevent redundant transitions to the same page
      if (typeof window !== "undefined" && window.location.pathname === href) {
        return;
      }

      pendingHref.current = href;
      setIsTransitioning(true);

      /**
       * Wait for exit animation to finish and hold for readability.
       * Total exit: ~0.75s + 300ms hold = 1.05s
       */
      setTimeout(() => {
        router.push(href);

        /**
         * Reset after enter animation completes.
         */
        setTimeout(() => {
          setIsTransitioning(false);
          pendingHref.current = null;
        }, 1100);
      }, 1050);
    },
    [isTransitioning, router],
  );

  return (
    <TransitionContext.Provider value={{ isTransitioning, navigateTo }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
