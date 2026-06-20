"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useWindowManager } from "./WindowManagerContext";

interface TerminalContextType {
  isOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  matrixMode: boolean;
  toggleMatrixMode: () => void;
  recruiterMode: boolean;
  toggleRecruiterMode: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined,
);

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const { windows, openWindow, closeWindow } = useWindowManager();
  const [matrixMode, setMatrixMode] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Derive isOpen from window manager windows list
  const isOpen = useMemo(() => {
    return windows.some((w) => w.type === "terminal");
  }, [windows]);

  // Handle mount-only initialization
  useEffect(() => {
    const savedMatrix = localStorage.getItem("matrix-mode-active") === "true";
    if (savedMatrix) {
      setTimeout(() => setMatrixMode(true), 0);
    }

    const savedRecruiter =
      localStorage.getItem("recruiter-mode-active") === "true";
    if (savedRecruiter) {
      setTimeout(() => setRecruiterMode(true), 0);
    }
    setTimeout(() => setMounted(true), 0);
  }, []);

  // Save to localStorage and handle class toggle
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("matrix-mode-active", String(matrixMode));
    if (matrixMode) {
      document.documentElement.classList.add("matrix-mode");
    } else {
      document.documentElement.classList.remove("matrix-mode");
    }
  }, [matrixMode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("recruiter-mode-active", String(recruiterMode));
    if (recruiterMode) {
      document.documentElement.classList.add("recruiter-mode");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("recruiter-mode");
      document.documentElement.classList.add("dark");
    }
  }, [recruiterMode, mounted]);

  const openTerminal = useCallback(() => {
    if (!recruiterMode) {
      openWindow("terminal", "Terminal (WSL: Ubuntu)");
    }
  }, [recruiterMode, openWindow]);

  const closeTerminal = useCallback(() => {
    const terminalWindow = windows.find((w) => w.type === "terminal");
    if (terminalWindow) {
      closeWindow(terminalWindow.id);
    }
  }, [windows, closeWindow]);

  const toggleTerminal = useCallback(() => {
    if (recruiterMode) return;
    const terminalWindow = windows.find((w) => w.type === "terminal");
    if (terminalWindow) {
      closeWindow(terminalWindow.id);
    } else {
      openWindow("terminal", "Terminal (WSL: Ubuntu)");
    }
  }, [recruiterMode, windows, openWindow, closeWindow]);

  const toggleMatrixMode = useCallback(
    () => setMatrixMode((prev) => !prev),
    [],
  );

  const toggleRecruiterMode = useCallback(() => {
    setRecruiterMode((prev) => !prev);
  }, []);

  // Sync recruiter mode with terminal closure to ensure no terminal remains open
  useEffect(() => {
    if (recruiterMode) {
      const terminalWindow = windows.find((w) => w.type === "terminal");
      if (terminalWindow) {
        closeWindow(terminalWindow.id);
      }
    }
  }, [recruiterMode, windows, closeWindow]);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (recruiterMode) return;
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
  }, [isOpen, recruiterMode, toggleTerminal, closeTerminal]);

  return (
    <TerminalContext.Provider
      value={{
        isOpen,
        openTerminal,
        closeTerminal,
        toggleTerminal,
        matrixMode,
        toggleMatrixMode,
        recruiterMode,
        toggleRecruiterMode,
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
