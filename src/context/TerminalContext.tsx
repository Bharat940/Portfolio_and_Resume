"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface TerminalContextType {
  isOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  matrixMode: boolean;
  toggleMatrixMode: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined,
);

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);

  // Handle mount-only initialization
  useEffect(() => {
    const saved = localStorage.getItem("matrix-mode-active") === "true";
    if (saved) {
      React.startTransition(() => {
        setMatrixMode(true);
      });
    }
  }, []);

  // Save to localStorage and handle class toggle
  useEffect(() => {
    localStorage.setItem("matrix-mode-active", String(matrixMode));
    if (matrixMode) {
      document.documentElement.classList.add("matrix-mode");
    } else {
      document.documentElement.classList.remove("matrix-mode");
    }
  }, [matrixMode]);

  const openTerminal = () => setIsOpen(true);
  const closeTerminal = () => setIsOpen(false);
  const toggleTerminal = () => setIsOpen((prev) => !prev);
  const toggleMatrixMode = () => setMatrixMode((prev) => !prev);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleTerminal();
      }
      if (e.key === "Escape" && isOpen) {
        closeTerminal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <TerminalContext.Provider
      value={{
        isOpen,
        openTerminal,
        closeTerminal,
        toggleTerminal,
        matrixMode,
        toggleMatrixMode,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
}
