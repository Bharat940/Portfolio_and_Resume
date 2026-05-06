"use client";

import React from "react";
import { useTransition } from "@/context/TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
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
}: TransitionLinkProps) {
  const { navigateTo } = useTransition();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only handle left clicks and prevent default behavior
    if (
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();
      onClick?.();
      navigateTo(href);
    }
  };

  return (
    <a href={href} className={className} onClick={handleNavigation}>
      {children}
    </a>
  );
}
