"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

export type CursorType =
  | "default"
  | "crosshair"
  | "text"
  | "block"
  | "focus"
  | "hidden";

interface CursorContextType {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
  pageCursorType: CursorType;
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
  onEnterLink: () => void;
  onLeaveLink: () => void;
  onEnterText: () => void;
  onLeaveText: () => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

const ROUTE_CURSOR_MAP: Record<string, CursorType> = {
  "/": "default",
  "/projects": "crosshair",
  "/blog": "text",
  "/about": "focus",
  "/terminal": "block",
};

function getRouteCursor(pathname: string): CursorType {
  // Exact match first, then prefix match
  if (ROUTE_CURSOR_MAP[pathname]) return ROUTE_CURSOR_MAP[pathname];
  const prefix = Object.keys(ROUTE_CURSOR_MAP).find(
    (key) => key !== "/" && pathname.startsWith(key),
  );
  return prefix ? ROUTE_CURSOR_MAP[prefix] : "default";
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageCursorType = getRouteCursor(pathname);
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [isHovering, setIsHovering] = useState(false);

  // Sync cursorType with page default when route changes
  useEffect(() => {
    queueMicrotask(() => {
      setCursorType(pageCursorType);
    });
  }, [pageCursorType]);

  const onEnterLink = useCallback(() => {
    setIsHovering(true);
    // Don't change cursor type — the CustomCursor handles hover state visually
  }, []);

  const onLeaveLink = useCallback(() => {
    setIsHovering(false);
  }, []);

  const onEnterText = useCallback(() => {
    setCursorType("text");
    setIsHovering(true);
  }, []);

  const onLeaveText = useCallback(() => {
    setCursorType(pageCursorType);
    setIsHovering(false);
  }, [pageCursorType]);

  return (
    <CursorContext.Provider
      value={{
        cursorType,
        setCursorType,
        pageCursorType,
        isHovering,
        setIsHovering,
        onEnterLink,
        onLeaveLink,
        onEnterText,
        onLeaveText,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
}
