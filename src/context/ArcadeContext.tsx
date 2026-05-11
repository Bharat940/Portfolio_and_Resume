"use client";

import React, { createContext, useContext, useState } from "react";

export type GameId =
  | "cyberslither"
  | "binarybound"
  | "terminalinvaders"
  | "memorymatch"
  | "none";

interface ArcadeContextType {
  isArcadeOpen: boolean;
  activeGame: GameId;
  launchGame: (gameId: GameId) => void;
  closeArcade: () => void;
}

const ArcadeContext = createContext<ArcadeContextType | undefined>(undefined);

export function ArcadeProvider({ children }: { children: React.ReactNode }) {
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameId>("none");

  const launchGame = (gameId: GameId) => {
    setActiveGame(gameId);
    setIsArcadeOpen(true);
  };

  const closeArcade = () => {
    setIsArcadeOpen(false);
    setActiveGame("none");
  };

  return (
    <ArcadeContext.Provider
      value={{
        isArcadeOpen,
        activeGame,
        launchGame,
        closeArcade,
      }}
    >
      {children}
    </ArcadeContext.Provider>
  );
}

export function useArcade() {
  const context = useContext(ArcadeContext);
  if (context === undefined) {
    throw new Error("useArcade must be used within an ArcadeProvider");
  }
  return context;
}
