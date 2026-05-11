"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, m } from "motion/react";

const GRAVITY = 0.55;
const JUMP_FORCE = -13;
const PLAYER_X = 60;
const PLAYER_W = 36;
const PLAYER_H = 36;

interface Obstacle {
  id: number;
  x: number;
  width: number;
  height: number;
  type: "spike" | "block" | "double";
}

// Barycentric point-in-triangle test
function pointInTriangle(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): boolean {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

// Tests multiple sample points of the player hitbox against a triangle
function spikeCollision(
  pLeft: number,
  pRight: number,
  pTop: number,
  pBottom: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): boolean {
  const midX = (pLeft + pRight) / 2;
  const midY = (pTop + pBottom) / 2;
  const pts: [number, number][] = [
    [pLeft + 5, pTop + 5],
    [pRight - 5, pTop + 5],
    [pLeft + 5, pBottom - 3],
    [pRight - 5, pBottom - 3],
    [midX, midY],
    [midX, pBottom - 3],
  ];
  return pts.some(([px, py]) =>
    pointInTriangle(px, py, ax, ay, bx, by, cx, cy),
  );
}

export function BinaryBound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("bb-high-score");
    if (saved) {
      React.startTransition(() => {
        setHighScore(parseInt(saved, 10));
      });
    }
  }, []);
  const [gameState, setGameState] = useState<{
    playerY: number;
    groundY: number;
    obstacles: Obstacle[];
    isAirborne: boolean;
    speedBars: number;
  }>({
    playerY: 0,
    groundY: 0,
    obstacles: [],
    isAirborne: false,
    speedBars: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const scoreRawRef = useRef<number>(0);
  const playerYRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const gameSpeedRef = useRef<number>(4.5);
  const groundYRef = useRef<number>(0);
  const isAirborneRef = useRef<boolean>(false);

  const getGroundY = useCallback(() => {
    const height = containerRef.current?.clientHeight ?? 400;
    return height * 0.75;
  }, []);

  const startGame = useCallback(() => {
    const groundY = getGroundY();
    groundYRef.current = groundY;
    playerYRef.current = groundY;
    velocityRef.current = 0;
    obstaclesRef.current = [];
    gameSpeedRef.current = 4.5;
    scoreRawRef.current = 0;
    lastSpawnRef.current = 0;
    isAirborneRef.current = false;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, [getGroundY]);

  const jump = useCallback(() => {
    if (playerYRef.current >= groundYRef.current - 2) {
      velocityRef.current = JUMP_FORCE;
      isAirborneRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const loop = (ts: number) => {
      const groundY = getGroundY();
      groundYRef.current = groundY;

      // Physics
      velocityRef.current += GRAVITY;
      playerYRef.current += velocityRef.current;
      if (playerYRef.current >= groundY) {
        playerYRef.current = groundY;
        velocityRef.current = 0;
        isAirborneRef.current = false;
      }

      const speed = gameSpeedRef.current;
      const containerW = containerRef.current?.clientWidth ?? 800;

      // Move & cull obstacles
      obstaclesRef.current = obstaclesRef.current
        .map((o) => ({ ...o, x: o.x - speed }))
        .filter((o) => o.x + o.width > -80);

      // Spawn
      const spawnInterval = Math.max(950, 2100 / (speed / 4.5));
      if (
        lastSpawnRef.current === 0 ||
        ts - lastSpawnRef.current > spawnInterval
      ) {
        const r = Math.random();
        const type: Obstacle["type"] =
          r > 0.6 ? "spike" : r > 0.25 ? "block" : "double";
        obstaclesRef.current.push({
          id: ts + Math.random(),
          x: containerW + 20,
          width: type === "double" ? 26 : 26 + Math.random() * 22,
          height:
            type === "block"
              ? 28 + Math.random() * 36
              : 44 + Math.random() * 28,
          type,
        });
        lastSpawnRef.current = ts;
      }

      // Collision
      const pLeft = PLAYER_X + 4;
      const pRight = PLAYER_X + PLAYER_W - 4;
      const pTop = playerYRef.current + 4;
      const pBottom = playerYRef.current + PLAYER_H - 2;
      const groundTop = groundY + PLAYER_H;

      for (const o of obstaclesRef.current) {
        const oTop = groundTop - o.height;
        const oBottom = groundTop;
        const horizontalClose = pRight > o.x + 2 && pLeft < o.x + o.width - 2;
        if (!horizontalClose) continue;

        if (o.type === "spike") {
          const ax = o.x + o.width / 2,
            ay = oTop;
          const bx = o.x,
            by = oBottom;
          const cx = o.x + o.width,
            cy = oBottom;
          if (
            spikeCollision(pLeft, pRight, pTop, pBottom, ax, ay, bx, by, cx, cy)
          ) {
            setGameOver(true);
            setIsPlaying(false);
            return;
          }
        } else if (o.type === "double") {
          const hw = o.width;
          const ax1 = o.x + hw / 2,
            ay1 = oTop;
          const ax2 = o.x + hw + hw / 2,
            ay2 = oTop;
          if (
            spikeCollision(
              pLeft,
              pRight,
              pTop,
              pBottom,
              ax1,
              ay1,
              o.x,
              oBottom,
              o.x + hw,
              oBottom,
            ) ||
            spikeCollision(
              pLeft,
              pRight,
              pTop,
              pBottom,
              ax2,
              ay2,
              o.x + hw,
              oBottom,
              o.x + hw * 2,
              oBottom,
            )
          ) {
            setGameOver(true);
            setIsPlaying(false);
            return;
          }
        } else {
          if (pBottom > oTop) {
            setGameOver(true);
            setIsPlaying(false);
            return;
          }
        }
      }

      // Score & difficulty
      scoreRawRef.current += 1;
      if (scoreRawRef.current % 6 === 0) {
        const newScore = Math.floor(scoreRawRef.current / 6);
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem("bb-high-score", newScore.toString());
        }
      }
      if (scoreRawRef.current > 0 && scoreRawRef.current % 700 === 0) {
        gameSpeedRef.current = Math.min(15, gameSpeedRef.current + 0.7);
      }

      const speedPct = Math.min(1, (gameSpeedRef.current - 4.5) / (15 - 4.5));
      setGameState({
        playerY: playerYRef.current,
        groundY: groundYRef.current,
        obstacles: [...obstaclesRef.current],
        isAirborne: playerYRef.current < groundYRef.current - 2,
        speedBars: Math.round(speedPct * 8),
      });
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, gameOver, getGroundY, highScore, jump, startGame]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        if (!isPlaying || gameOver) startGame();
        else jump();
      } else if (e.key === "Escape") {
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
  }, [isPlaying, gameOver, startGame, jump]);

  const { playerY, groundY, obstacles, isAirborne, speedBars } = gameState;
  const groundTop = groundY + PLAYER_H;
  const containerHeight = containerRef.current?.clientHeight ?? 400;

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-ctp-crust relative overflow-hidden select-none cursor-pointer font-heading touch-none"
      style={{ imageRendering: "pixelated" }}
      onPointerDown={() => {
        if (!isPlaying || gameOver) startGame();
        else jump();
      }}
    >
      <div className="arcade-scanlines" />

      {/* Binary bg scroll */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2, 3].map((layer) => (
          <div
            key={layer}
            className="pixel-bg-scroll absolute text-ctp-blue"
            style={{
              top: `${8 + layer * 22}%`,
              fontSize: 8,
              letterSpacing: "2px",
              opacity: 0.055,
              animationDuration: `${16 - layer * 2.5}s`,
            }}
          >
            {"10110010 01101101 11010010 00101101 10100110 10011010 ".repeat(
              40,
            )}
          </div>
        ))}
      </div>

      {/* Grid Floor */}
      <div className="absolute left-0 right-0 bottom-0" style={{ top: groundTop }}>
        <div className="w-full bg-ctp-surface2 h-1 md:h-1.5" />
        <div className="w-full h-full bg-ctp-surface0/50" />
      </div>

      {/* Player */}
      <div
        className="absolute z-20"
        style={{
          left: PLAYER_X,
          top: playerY,
          width: PLAYER_W,
          height: PLAYER_H,
        }}
      >
        {isAirborne && (
          <div className="absolute bg-ctp-peach left-1/2 -translate-x-1/2 w-0.75 h-1.75 -top-1.75" />
        )}
        <div className="absolute inset-0 bg-ctp-blue border-2 border-ctp-lavender">
          <div className="absolute flex top-2 left-1.75 gap-1.25">
            <div className="w-1.5 h-1.5 bg-ctp-crust" />
            <div className="w-1.5 h-1.5 bg-ctp-crust" />
          </div>
          <div className="absolute bg-ctp-mauve bottom-1.75 left-2 w-4.5 h-0.75" />
          <div className="absolute bg-ctp-lavender/30 top-5 left-1 right-1 h-px" />
        </div>
        <div className="absolute flex -bottom-0.75 left-1 gap-1.5">
          <div className="w-2 h-0.75 bg-ctp-blue" />
          <div className="w-2 h-0.75 bg-ctp-blue" />
        </div>
        {isAirborne && (
          <div
            className="absolute bg-ctp-mauve/20 left-1 h-1"
            style={{
              width: PLAYER_W - 8,
              bottom: -(groundY - playerY) - PLAYER_H,
            }}
          />
        )}
      </div>

      {/* Obstacles */}
      {obstacles.map((o) => {
        const oTop = groundTop - o.height;
        if (o.type === "spike") {
          return (
            <svg
              key={o.id}
              className="absolute"
              style={{
                left: o.x,
                top: oTop,
                width: o.width,
                height: o.height,
                overflow: "visible",
              }}
              viewBox={`0 0 ${o.width} ${o.height}`}
              preserveAspectRatio="none"
            >
              <polygon
                points={`${o.width / 2},2 2,${o.height} ${o.width - 2},${o.height}`}
                fill="var(--color-ctp-red)"
                stroke="var(--color-ctp-maroon)"
                strokeWidth="2"
              />
            </svg>
          );
        }
        if (o.type === "double") {
          const hw = o.width;
          return (
            <svg
              key={o.id}
              className="absolute"
              style={{
                left: o.x,
                top: oTop,
                width: hw * 2,
                height: o.height,
                overflow: "visible",
              }}
              viewBox={`0 0 ${hw * 2} ${o.height}`}
              preserveAspectRatio="none"
            >
              <polygon
                points={`${hw / 2},2 2,${o.height} ${hw - 2},${o.height}`}
                fill="var(--color-ctp-red)"
                stroke="var(--color-ctp-maroon)"
                strokeWidth="2"
              />
              <polygon
                points={`${hw + hw / 2},2 ${hw + 2},${o.height} ${hw * 2 - 2},${o.height}`}
                fill="var(--color-ctp-red)"
                stroke="var(--color-ctp-maroon)"
                strokeWidth="2"
              />
            </svg>
          );
        }
        return (
          <div
            key={o.id}
            className="absolute bg-ctp-mauve border-2 border-ctp-lavender"
            style={{ left: o.x, top: oTop, width: o.width, height: o.height }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[55%] h-0.5 bg-black/25" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-[55%] bg-black/25" />
            </div>
          </div>
        );
      })}

      {/* HUD */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-30 text-right pointer-events-none flex flex-col gap-1">
        <div>
          <div className="text-ctp-subtext0 uppercase tracking-[2px] md:tracking-[3px] text-[6px] md:text-[7px]">
            RECORD
          </div>
          <div className="text-ctp-mauve font-bold text-[10px] md:text-[14px] tracking-[1px] md:tracking-[2px]">
            {String(highScore).padStart(5, "0")}
          </div>
        </div>
        <div>
          <div className="text-ctp-subtext0 uppercase tracking-[2px] md:tracking-[3px] text-[6px] md:text-[7px]">
            SCORE
          </div>
          <div className="text-ctp-text font-bold text-[16px] md:text-[22px] tracking-[1px] md:tracking-[2px]">
            {String(score).padStart(5, "0")}
          </div>
        </div>
      </div>

      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30 pointer-events-none">
        <div className="text-ctp-subtext0 uppercase mb-1 tracking-[2px] md:tracking-[3px] text-[7px] md:text-[8px]">
          SPD
        </div>
        <div className="flex items-end gap-0.5 md:gap-0.75">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-1 md:w-1.25"
              style={{
                height: 3 + i * 2,
                background:
                  i < speedBars
                    ? "var(--color-ctp-green)"
                    : "var(--color-ctp-surface1)",
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {(!isPlaying || gameOver) && (
          <m.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center p-8 text-center bg-ctp-crust/95"
          >
            {[
              "top-3 left-3",
              "top-3 right-3",
              "bottom-3 left-3",
              "bottom-3 right-3",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-5 h-5 border-ctp-surface1 ${i < 2 ? "border-t-2" : "border-b-2"} ${i % 2 === 0 ? "border-l-2" : "border-r-2"}`}
              />
            ))}

            <div className="relative mb-2 md:mb-4 w-10 h-10 md:w-13 md:h-13 shrink-0">
              <div className="absolute bg-ctp-peach left-1/2 -translate-x-1/2 w-0.5 md:w-1 h-1.5 md:h-2 -top-1.5 md:-top-2" />
              <div className="absolute inset-0 bg-ctp-blue border-2 border-ctp-lavender">
                <div className="absolute flex top-2 md:top-3 left-1.75 md:left-2.25 gap-1 md:gap-1.5">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-ctp-crust" />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-ctp-crust" />
                </div>
                <div className="absolute bg-ctp-mauve bottom-1.75 md:bottom-2.5 left-2 md:left-2.75 w-5 md:w-6.5 h-0.5 md:h-1" />
              </div>
            </div>

            <div className="text-ctp-blue uppercase mb-1 tracking-[3px] md:tracking-[5px] text-[7px] md:text-[9px]">
              &gt;&gt; BINARY BOUND &lt;&lt;
            </div>
            <div className="text-ctp-text font-bold uppercase mb-4 md:mb-6 text-[24px] md:text-[34px] tracking-[2px] md:tracking-[4px] [text-shadow:2px_2px_0_var(--color-ctp-mauve)] md:[text-shadow:3px_3px_0_var(--color-ctp-mauve)]">
              {gameOver ? "GAME OVER" : "READY?"}
            </div>

            {gameOver && (
              <div className="pixel-card mb-4 md:mb-6 px-4 md:px-10 py-3 md:py-5 max-w-full">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-12 items-center">
                  <div className="text-center sm:text-left">
                    <div className="text-ctp-subtext0 uppercase mb-1 tracking-[2px] md:tracking-[4px] text-[7px] md:text-[8px]">
                      FINAL SCORE
                    </div>
                    <div className="text-ctp-green font-bold text-[28px] md:text-[38px] tracking-[2px] md:tracking-[4px]">
                      {String(score).padStart(5, "0")}
                    </div>
                  </div>
                  <div className="hidden sm:block border-l border-ctp-surface1 h-12" />
                  <div className="text-center sm:text-left">
                    <div className="text-ctp-subtext0 uppercase mb-1 tracking-[2px] md:tracking-[4px] text-[7px] md:text-[8px]">
                      BEST LINK
                    </div>
                    <div className="text-ctp-mauve font-bold text-[28px] md:text-[38px] tracking-[2px] md:tracking-[4px]">
                      {String(highScore).padStart(5, "0")}
                    </div>
                  </div>
                </div>
                <div className="text-ctp-subtext0 mt-3 md:mt-4 uppercase tracking-[2px] md:tracking-[3px] text-[7px] md:text-[8px] border-t border-ctp-surface1/30 pt-2">
                  {score >= highScore && score > 0
                    ? "★ NEW SYSTEM RECORD!"
                    : score > 200
                      ? "▲ IMPRESSIVE RUN!"
                      : "TRY AGAIN!"}
                </div>
              </div>
            )}

            <div className="text-ctp-subtext0 mb-4 md:mb-6 uppercase tracking-[2px] md:tracking-[3px] text-[8px] md:text-[9px] px-2">
              {gameOver ? (
                <>
                  <span className="hidden md:inline">PRESS SPACE / CLICK</span>
                  <span className="md:hidden">TAP</span> TO RETRY
                </>
              ) : (
                "JUMP OVER OBSTACLES TO SURVIVE"
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="retro-btn-pixel text-[12px] tracking-[5px] px-9 py-2.5"
            >
              ▶ {gameOver ? "RETRY" : "START"}
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 z-10 px-4">
              <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap min-w-0">
                <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] shrink-0">
                  SPACE / ↑
                </span>
                <span className="text-ctp-subtext0 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] truncate">
                  JUMP
                </span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap min-w-0">
                <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] shrink-0">
                  <span className="hidden md:inline">CLICK / </span>TAP
                </span>
                <span className="text-ctp-subtext0 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] truncate">
                  JUMP
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
