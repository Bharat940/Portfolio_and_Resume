"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from "react";
import { m, AnimatePresence } from "motion/react";
import { PixelCPU } from "@/components/icons/PixelCPU";
import { PixelGPU } from "@/components/icons/PixelGPU";
import { PixelRAM } from "@/components/icons/PixelRAM";
import { PixelHDD } from "@/components/icons/PixelHDD";
import { PixelSSD } from "@/components/icons/PixelSSD";
import { PixelBUS } from "@/components/icons/PixelBUS";
import { PixelOS } from "@/components/icons/PixelOS";
import { PixelEXE } from "@/components/icons/PixelEXE";

const CARDS = ["CPU", "GPU", "RAM", "HDD", "SSD", "BUS", "OS", "EXE"];

const IconRenderer = ({ type, color }: { type: string; color: string }) => {
  switch (type) {
    case "CPU":
      return <PixelCPU color={color} size={32} />;
    case "GPU":
      return <PixelGPU color={color} size={32} />;
    case "RAM":
      return <PixelRAM color={color} size={32} />;
    case "HDD":
      return <PixelHDD color={color} size={32} />;
    case "SSD":
      return <PixelSSD color={color} size={32} />;
    case "BUS":
      return <PixelBUS color={color} size={32} />;
    case "OS":
      return <PixelOS color={color} size={32} />;
    case "EXE":
      return <PixelEXE color={color} size={32} />;
    default:
      return null;
  }
};

const CARD_COLORS: Record<string, { bg: string; border: string }> = {
  CPU: { bg: "var(--color-ctp-mauve)", border: "var(--color-ctp-lavender)" },
  GPU: { bg: "var(--color-ctp-blue)", border: "var(--color-ctp-sapphire)" },
  RAM: { bg: "var(--color-ctp-green)", border: "var(--color-ctp-teal)" },
  HDD: { bg: "var(--color-ctp-red)", border: "var(--color-ctp-maroon)" },
  SSD: { bg: "var(--color-ctp-peach)", border: "var(--color-ctp-yellow)" },
  BUS: { bg: "var(--color-ctp-yellow)", border: "var(--color-ctp-peach)" },
  OS: { bg: "var(--color-ctp-sky)", border: "var(--color-ctp-teal)" },
  EXE: { bg: "var(--color-ctp-lavender)", border: "var(--color-ctp-mauve)" },
};

type Card = { id: number; val: string; flipped: boolean; matched: boolean };

export function MemoryMatch() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("mm-best-moves");
    if (saved) {
      startTransition(() => {
        setBestMoves(parseInt(saved, 10));
      });
    }
  }, []);
  const [cards, setCards] = useState<Card[]>([]);
  const flippedRef = useRef<number[]>([]);
  const lockedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startGame = useCallback(() => {
    const deck = [...CARDS, ...CARDS]
      .sort(() => Math.random() - 0.5)
      .map((val, id) => ({ id, val, flipped: false, matched: false }));
    setCards(deck);
    flippedRef.current = [];
    setMoves(0);
    setGameOver(false);
    setIsPlaying(true);
    lockedRef.current = false;
  }, []);

  const handleFlip = useCallback(
    (id: number) => {
      if (lockedRef.current) return;
      if (
        flippedRef.current.length >= 2 ||
        cards[id].flipped ||
        cards[id].matched
      )
        return;

      const nextFlipped = [...flippedRef.current, id];
      flippedRef.current = nextFlipped;

      setCards((prevCards) =>
        prevCards.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
      );

      if (nextFlipped.length === 2) {
        lockedRef.current = true;
        setMoves((m) => m + 1);
        const [first, second] = nextFlipped;

        if (cards[first].val === cards[second].val) {
          setTimeout(() => {
            setCards((prev) => {
              const next = prev.map((c) =>
                c.id === first || c.id === second ? { ...c, matched: true } : c,
              );
              if (next.every((c) => c.matched)) {
                setGameOver(true);
                setBestMoves((oldBest) => {
                  const currentMoves = moves + 1;
                  const newBest =
                    oldBest === 0 || currentMoves < oldBest
                      ? currentMoves
                      : oldBest;
                  localStorage.setItem("mm-best-moves", newBest.toString());
                  return newBest;
                });
              }
              return next;
            });
            flippedRef.current = [];
            lockedRef.current = false;
          }, 500);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second
                  ? { ...c, flipped: false }
                  : c,
              ),
            );
            flippedRef.current = [];
            lockedRef.current = false;
          }, 1000);
        }
      }
    },
    [cards, moves],
  );

  // Keyboard listeners
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isPlaying) {
          setIsPlaying(false);
          setGameOver(false);
        }
      }
    };
    window.addEventListener("keydown", handleKey);

    // Prevent default touch behaviors (scrolling, zooming)
    const container = containerRef.current;
    if (container) {
      const preventDefault = (e: TouchEvent) => {
        if (e.cancelable) e.preventDefault();
      };
      container.addEventListener("touchmove", preventDefault, {
        passive: false,
      });
      return () => {
        window.removeEventListener("keydown", handleKey);
        container.removeEventListener("touchmove", preventDefault);
      };
    }

    return () => window.removeEventListener("keydown", handleKey);
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-ctp-crust relative overflow-hidden flex flex-col items-center justify-center font-heading select-none p-2 md:p-8 touch-none"
    >
      <div className="arcade-scanlines" />

      {/* Binary bg scroll */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2, 3].map((layer) => (
          <div
            key={layer}
            className="pixel-bg-scroll absolute text-ctp-mauve"
            style={{
              top: `${8 + layer * 22}%`,
              fontSize: 8,
              letterSpacing: "2px",
              opacity: 0.04,
              animationDuration: `${20 - layer * 3}s`,
            }}
          >
            {"10110010 01101101 11010010 00101101 10100110 10011010 ".repeat(
              40,
            )}
          </div>
        ))}
      </div>

      {/* HUD */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-30 text-right pointer-events-none flex flex-col gap-1">
        <div>
          <div className="text-ctp-subtext0 uppercase tracking-[2px] md:tracking-[3px] text-[6px] md:text-[7px]">
            BEST EFFICIENCY
          </div>
          <div className="text-ctp-mauve font-bold text-[10px] md:text-[14px] tracking-[1px] md:tracking-[2px]">
            {bestMoves === 0 ? "---" : `${bestMoves} OPS`}
          </div>
        </div>
        <div>
          <div className="text-ctp-subtext0 uppercase tracking-[2px] md:tracking-[3px] text-[6px] md:text-[7px]">
            CURRENT CYCLE
          </div>
          <div className="text-ctp-text font-bold text-[16px] md:text-[22px] tracking-[1px] md:tracking-[2px]">
            {moves} OPS
          </div>
        </div>
      </div>

      {/* Card Grid - Responsive sizing */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 w-full max-w-85 md:max-w-2xl max-h-full aspect-square z-10">
        {cards.map((card) => (
          <div
            key={card.id}
            className="aspect-square cursor-pointer pixel-card-3d"
            onClick={() => handleFlip(card.id)}
          >
            <div
              className={`pixel-card-inner ${card.flipped || card.matched ? "pixel-card-flipped" : ""}`}
            >
              {/* Card Back */}
              <div className="pixel-card-face bg-ctp-surface0 border-2 border-ctp-surface1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 7 7"
                  style={{ imageRendering: "pixelated" }}
                >
                  <rect
                    x="3"
                    y="0"
                    width="1"
                    height="1"
                    fill="var(--color-ctp-surface2)"
                  />
                  <rect
                    x="2"
                    y="1"
                    width="3"
                    height="1"
                    fill="var(--color-ctp-surface2)"
                  />
                  <rect
                    x="1"
                    y="2"
                    width="5"
                    height="1"
                    fill="var(--color-ctp-surface2)"
                  />
                  <rect
                    x="2"
                    y="3"
                    width="3"
                    height="1"
                    fill="var(--color-ctp-surface2)"
                  />
                  <rect
                    x="3"
                    y="4"
                    width="1"
                    height="1"
                    fill="var(--color-ctp-surface2)"
                  />
                </svg>
              </div>

              {/* Card Front */}
              <div
                className="pixel-card-face pixel-card-front"
                style={{
                  background: card.matched
                    ? (CARD_COLORS[card.val]?.bg ?? "var(--color-ctp-green)")
                    : "var(--color-ctp-mauve)",
                  border: `2px solid ${card.matched ? (CARD_COLORS[card.val]?.border ?? "var(--color-ctp-teal)") : "var(--color-ctp-lavender)"}`,
                }}
              >
                <div className="absolute top-1 left-1 w-4 h-1 bg-white/20" />
                <div className="flex flex-col items-center justify-center gap-1">
                  <IconRenderer
                    type={card.val}
                    color="var(--color-ctp-crust)"
                  />
                  <span className="text-ctp-crust font-bold text-[8px] tracking-tighter uppercase">
                    {card.val}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {(!isPlaying || gameOver) && (
          <m.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-ctp-crust/95 flex flex-col items-center justify-center p-8 text-center"
          >
            {/* Corner brackets */}
            {[
              "top-3 left-3",
              "top-3 right-3",
              "bottom-3 left-3",
              "bottom-3 right-3",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-5 h-5 border-ctp-surface1`}
                style={{
                  borderTopWidth: i < 2 ? 2 : 0,
                  borderBottomWidth: i >= 2 ? 2 : 0,
                  borderLeftWidth: i % 2 === 0 ? 2 : 0,
                  borderRightWidth: i % 2 === 1 ? 2 : 0,
                  borderStyle: "solid",
                }}
              />
            ))}

            <div className="shrink-0 mb-6 flex justify-center">
              <div className="max-h-[15vh]">
                <PixelCPU color="var(--color-ctp-mauve)" size={48} />
              </div>
            </div>

            <div className="text-ctp-mauve uppercase mb-1 tracking-[3px] md:tracking-[5px] text-[7px] md:text-[9px]">
              &gt;&gt; MEMORY_CACHE_CORRUPTION &lt;&lt;
            </div>
            <div
              className="text-ctp-text font-bold uppercase mb-4 md:mb-6 text-[22px] md:text-[32px] tracking-[2px] md:tracking-[4px]"
              style={{ textShadow: "2px 2px 0 var(--color-ctp-mauve)" }}
            >
              {gameOver ? "DEFRAGMENT_COMPLETE" : "INITIALIZE_SCAN"}
            </div>

            {gameOver && (
              <div className="pixel-card mb-4 md:mb-6 px-4 md:px-10 py-3 md:py-5 max-w-full">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-10 items-center">
                  <div className="text-center sm:text-left">
                    <div className="text-ctp-subtext0 uppercase mb-1 tracking-[2px] md:tracking-[4px] text-[7px] md:text-[8px]">
                      TOTAL CYCLES
                    </div>
                    <div className="text-ctp-green font-bold text-[28px] md:text-[36px] tracking-[2px] md:tracking-[4px]">
                      {moves} OPS
                    </div>
                  </div>
                  <div className="hidden sm:block border-l border-ctp-surface1 h-12" />
                  <div className="text-center sm:text-left">
                    <div className="text-ctp-subtext0 uppercase mb-1 tracking-[2px] md:tracking-[4px] text-[7px] md:text-[8px]">
                      OPTIMAL CYCLE
                    </div>
                    <div className="text-ctp-mauve font-bold text-[28px] md:text-[36px] tracking-[2px] md:tracking-[4px]">
                      {bestMoves === Infinity ? "---" : bestMoves} OPS
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="retro-btn-pixel text-[12px] tracking-[5px] px-9 py-2.5"
            >
              ▶ {gameOver ? "RE-SCAN" : "START_DEFRAG"}
            </button>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 z-10 px-4">
              <div className="flex items-center gap-1.5 whitespace-nowrap min-w-0">
                <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] shrink-0">
                  <span className="hidden md:inline">CLICK / </span>TAP
                </span>
                <span className="text-ctp-subtext0 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] truncate">
                  FLIP
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap min-w-0">
                <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] shrink-0">
                  ESC
                </span>
                <span className="text-ctp-subtext0 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] truncate">
                  QUIT
                </span>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
