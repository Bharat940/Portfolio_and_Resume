"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

export type WindowType = "terminal" | "arcade" | "browser" | "about";

export interface WindowState {
  id: string;
  type: WindowType;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  gameId?: string;
}

interface WindowManagerContextType {
  windows: WindowState[];
  openWindow: (type: WindowType, title: string, gameId?: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
}

const WindowManagerContext = createContext<
  WindowManagerContextType | undefined
>(undefined);

export function WindowManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = useCallback(
    (type: WindowType, title: string, gameId?: string) => {
      setWindows((prev) => {
        // Check if this specific window is already open
        const existing = prev.find(
          (w) => w.type === type && (type !== "arcade" || w.gameId === gameId),
        );
        if (existing) {
          // If it exists, just bring it to focus
          const maxZ =
            prev.length > 0 ? Math.max(...prev.map((w) => w.zIndex)) : 100;
          if (existing.zIndex === maxZ) return prev;
          return prev.map((w) =>
            w.id === existing.id
              ? { ...w, zIndex: maxZ + 1, isMinimized: false }
              : w,
          );
        }

        const id = `${type}-${Date.now()}`;
        const maxZ =
          prev.length > 0 ? Math.max(...prev.map((w) => w.zIndex)) : 100;

        return [
          ...prev,
          {
            id,
            type,
            title,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: maxZ + 1,
            gameId,
          },
        ];
      });
    },
    [],
  ); // Empty dependency array ensures this function never changes

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const win = prev.find((w) => w.id === id);
      if (!win) return prev;

      const maxZ =
        prev.length > 0 ? Math.max(...prev.map((w) => w.zIndex)) : 100;
      if (win.zIndex === maxZ && !win.isMinimized) return prev;

      return prev.map((w) =>
        w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w,
      );
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      maximizeWindow,
    }),
    [
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      maximizeWindow,
    ],
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (context === undefined) {
    throw new Error(
      "useWindowManager must be used within a WindowManagerProvider",
    );
  }
  return context;
}
