"use client";

import React from "react";
import { useTransition } from "@/context/TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  "data-testid"?: string;
}

/**
 * Custom link component that triggers the imperative page transition
 * before navigating to the new route.
 */
export function TransitionLink({
  href,
  children,
  className,
  onClick,
  "data-testid": testId,
}: TransitionLinkProps) {
  const { navigateTo, isTransitioning } = useTransition();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only handle standard left clicks without modifiers
    if (
      e.button === 0 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !e.shiftKey
    ) {
      e.preventDefault();

      // If already transitioning, don't trigger again but allow the click to be "handled"
      if (isTransitioning) return;

      onClick?.();
      navigateTo(href);
    }
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleNavigation}
      data-testid={testId}
    >
      {children}
    </a>
  );
}
