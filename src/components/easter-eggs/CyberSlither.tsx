"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, m } from "motion/react";
import { useTerminal } from "@/context/TerminalContext";

const GRID_SIZE = 20;
const CELL = 20; // pixels per cell on the 400×400 canvas

type Dir = { x: number; y: number };
type Point = { x: number; y: number };

export function CyberSlither() {
  const { matrixMode } = useTerminal();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("cs-high-score");
    if (saved) {
      React.startTransition(() => {
        setHighScore(parseInt(saved, 10));
      });
    }
  }, []);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(145);
  const [speedBars, setSpeedBars] = useState(0);
  const [, setRenderTick] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 15, y: 15 });
  const dirRef = useRef<Dir>({ x: 1, y: 0 });
  const nextDirRef = useRef<Dir>({ x: 1, y: 0 });
  const scoreRef = useRef(0);
  const particles = useRef<
    {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }[]
  >([]);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // High score handled by lazy init

  const touchStartRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    const touch = "touches" in e ? e.touches[0] : (e as TouchEvent).touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent | TouchEvent) => {
    const touch =
      "changedTouches" in e
        ? e.changedTouches[0]
        : (e as TouchEvent).changedTouches[0];
    const touchEnd = { x: touch.clientX, y: touch.clientY };
    const dx = touchEnd.x - touchStartRef.current.x;
    const dy = touchEnd.y - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) {
        if (dx > 0 && dirRef.current.x === 0)
          nextDirRef.current = { x: 1, y: 0 };
        else if (dx < 0 && dirRef.current.x === 0)
          nextDirRef.current = { x: -1, y: 0 };
      }
    } else {
      if (Math.abs(dy) > 30) {
        if (dy > 0 && dirRef.current.y === 0)
          nextDirRef.current = { x: 0, y: 1 };
        else if (dy < 0 && dirRef.current.y === 0)
          nextDirRef.current = { x: 0, y: -1 };
      }
    }
  }, []);

  const spawnFood = useCallback((snake: Point[]) => {
    let f: Point;
    do {
      f = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((s) => s.x === f.x && s.y === f.y));
    foodRef.current = f;
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    foodRef.current = { x: 15, y: 15 };
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    setSpeed(145);
    particles.current = [];
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setStarted(true);
  }, []);

  // Game tick
  const tick = useCallback(() => {
    if (!started || isPaused) return;

    // Commit buffered direction
    dirRef.current = nextDirRef.current;

    const snake = snakeRef.current;
    const head: Point = {
      x: snake[0].x + dirRef.current.x,
      y: snake[0].y + dirRef.current.y,
    };

    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      setGameOver(true);
      setStarted(false);
      const s = scoreRef.current;
      setHighScore((h) => {
        const next = Math.max(h, s);
        localStorage.setItem("cs-high-score", next.toString());
        return next;
      });
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      setGameOver(true);
      setStarted(false);
      const s = scoreRef.current;
      setHighScore((h) => {
        const next = Math.max(h, s);
        localStorage.setItem("cs-high-score", next.toString());
        return next;
      });
      return;
    }

    const newSnake = [head, ...snake];
    const ate = head.x === foodRef.current.x && head.y === foodRef.current.y;

    if (ate) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      setSpeed((s) => {
        const next = Math.max(55, s - 3);
        setSpeedBars(Math.round(((145 - next) / (145 - 55)) * 8));
        return next;
      });
      spawnFood(newSnake);

      // Burst particles on eat
      for (let i = 0; i < 16; i++) {
        particles.current.push({
          x: head.x * CELL + CELL / 2,
          y: head.y * CELL + CELL / 2,
          vx: (Math.random() - 0.5) * 7,
          vy: (Math.random() - 0.5) * 7,
          life: 1.0,
          color: i % 2 === 0 ? "#cba6f7" : "#f38ba8",
        });
      }
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    setRenderTick((t) => t + 1);
  }, [started, isPaused, spawnFood]);

  // Start / restart interval when tick or speed changes
  useEffect(() => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (started && !isPaused && !gameOver) {
      gameLoopRef.current = setInterval(tick, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [tick, started, isPaused, gameOver, speed]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const cur = dirRef.current;
      switch (e.key) {
        case "ArrowUp":
          if (cur.y === 0) nextDirRef.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (cur.y === 0) nextDirRef.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (cur.x === 0) nextDirRef.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (cur.x === 0) nextDirRef.current = { x: 1, y: 0 };
          break;
        case " ":
          e.preventDefault();
          if (!started && !gameOver) {
            resetGame();
            break;
          }
          if (gameOver) {
            resetGame();
            break;
          }
          setIsPaused((p) => !p);
          break;
        case "Escape":
          if (started) {
            setStarted(false);
            setGameOver(false);
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKey);

    // Prevent default touch behaviors (scrolling, zooming)
    const container = containerRef.current;
    if (container) {
      const preventMove = (e: TouchEvent) => {
        if (e.cancelable) e.preventDefault();
      };
      container.addEventListener("touchmove", preventMove, { passive: false });
      return () => {
        window.removeEventListener("keydown", handleKey);
        container.removeEventListener("touchmove", preventMove);
      };
    }

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [started, gameOver, resetGame]);

  // Canvas render loop (RAF — independent of game tick)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const snake = snakeRef.current;
      const food = foodRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#11111b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = "rgba(69,71,90,0.25)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL, 0);
        ctx.lineTo(i * CELL, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL);
        ctx.lineTo(canvas.width, i * CELL);
        ctx.stroke();
        ctx.stroke();
      }

      // Snake body
      snake.forEach((s, i) => {
        const alpha = Math.max(0.15, 1 - i / snake.length);
        if (i === 0) {
          // Head — bright mauve with pixel "face"
          ctx.fillStyle = matrixMode ? "#00ff41" : "#cba6f7";
          ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
          // Eyes
          ctx.fillStyle = matrixMode ? "#000000" : "#11111b";
          const ex = dirRef.current.x;
          const ey = dirRef.current.y;
          // offset eyes based on direction
          const eyeOffX = ex !== 0 ? ex * 5 : 0;
          const eyeOffY = ey !== 0 ? ey * 5 : 0;
          ctx.fillRect(
            s.x * CELL + 5 + eyeOffX - (ey !== 0 ? 3 : 0),
            s.y * CELL + 5 + eyeOffY - (ex !== 0 ? 3 : 0),
            3,
            3,
          );
          ctx.fillRect(
            s.x * CELL + 5 + eyeOffX + (ey !== 0 ? 3 : 0),
            s.y * CELL + 5 + eyeOffY + (ex !== 0 ? 3 : 0),
            3,
            3,
          );
        } else if (i === snake.length - 1 && snake.length > 2) {
          // Tail — tapered
          ctx.fillStyle = matrixMode
            ? `rgba(0, 255, 65, ${alpha * 0.6})`
            : `rgba(180, 190, 254, ${alpha * 0.6})`;
          const margin = 3;
          ctx.fillRect(
            s.x * CELL + margin,
            s.y * CELL + margin,
            CELL - margin * 2,
            CELL - margin * 2,
          );
        } else {
          // Body segment — pixel block with slight inner shade
          ctx.fillStyle = matrixMode
            ? `rgba(0, 143, 17, ${alpha * 0.85})`
            : `rgba(203, 166, 247, ${alpha * 0.85})`;
          ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
          // pixel highlight
          ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.15})`;
          ctx.fillRect(s.x * CELL + 2, s.y * CELL + 2, CELL - 4, 2);
        }
      });

      // Food — pixel cross / gem shape
      const fx = food.x * CELL;
      const fy = food.y * CELL;
      // Pulsing glow ring (canvas doesn't need motion)
      const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
      ctx.fillStyle = matrixMode
        ? `rgba(0, 255, 65, ${0.1 + pulse * 0.1})`
        : `rgba(243,139,168,${0.12 + pulse * 0.12})`;
      ctx.fillRect(fx, fy, CELL, CELL);
      // Gem body
      ctx.fillStyle = matrixMode ? "#00ff41" : "#f38ba8";
      ctx.fillRect(fx + 6, fy + 2, 8, 16);
      ctx.fillRect(fx + 2, fy + 6, 16, 8);
      // Gem highlight
      ctx.fillStyle = matrixMode ? "#ffffff" : "#f5c2e7";
      ctx.fillRect(fx + 7, fy + 3, 3, 3);

      // Particles
      particles.current.forEach((p) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = matrixMode ? "#00ff41" : p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 3, 3);
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.life -= 0.035;
      });
      particles.current = particles.current.filter((p) => p.life > 0);
      ctx.globalAlpha = 1;

      // Pause vignette
      if (isPaused) {
        ctx.fillStyle = matrixMode ? "rgba(0,0,0,0.85)" : "rgba(17,17,27,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused, matrixMode]);

  const showOverlay = !started || gameOver || isPaused;

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-ctp-crust relative overflow-hidden flex flex-col items-center justify-center font-heading select-none p-2 md:p-8 touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
              animationDuration: `${18 - layer * 3}s`,
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

      {/* Speed indicator — left HUD */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30 pointer-events-none">
        <div className="text-ctp-subtext0 uppercase tracking-[2px] md:tracking-[3px] text-[6px] md:text-[7px] mb-1">
          SPD
        </div>
        <div className="flex items-end gap-0.5 md:gap-0.75">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 3 + i * 2,
                background:
                  i < speedBars
                    ? "var(--color-ctp-green)"
                    : "var(--color-ctp-surface1)",
              }}
              className="md:w-5"
            />
          ))}
        </div>
      </div>

      {/* Canvas Wrapper - Responsive scaling */}
      <div className="pixel-card p-0.5 md:p-0.75 z-10 w-full max-w-3xl max-h-full aspect-square">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full object-contain"
          style={{ display: "block", imageRendering: "pixelated" }}
        />
      </div>

      {/* Controls row */}
      <div className="mt-2 md:mt-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 z-10 px-4 max-w-full">
        <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap min-w-0">
          <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] shrink-0">
            ARROWS
          </span>
          <span className="text-ctp-subtext0 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] truncate">
            MOVE
          </span>
        </div>
        <div className="flex md:hidden items-center gap-1.5 whitespace-nowrap min-w-0">
          <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] text-[7px] shrink-0">
            SWIPE
          </span>
          <span className="text-ctp-subtext0 tracking-[1px] text-[7px] truncate">
            MOVE
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap min-w-0">
          <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] shrink-0">
            SPACE
          </span>
          <span className="text-ctp-subtext0 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] truncate">
            PAUSE
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap min-w-0">
          <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] shrink-0">
            ESC
          </span>
          <span className="text-ctp-subtext0 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] truncate">
            RESET
          </span>
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <m.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center p-8 text-center bg-ctp-crust/95"
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

            {/* Pixel snake head icon — SVG for crisp pixel art */}
            <div className="shrink-0 mb-4 flex justify-center">
              <svg
                width="48"
                height="60"
                viewBox="0 0 12 15"
                style={{ imageRendering: "pixelated" }}
                xmlns="http://www.w3.org/2000/svg"
                className="w-auto h-12 md:h-14 max-h-[15vh] object-contain"
              >
                {/* Head body */}
                <rect
                  x="0"
                  y="0"
                  width="12"
                  height="12"
                  fill="var(--color-ctp-mauve)"
                />
                {/* Border top */}
                <rect
                  x="0"
                  y="0"
                  width="12"
                  height="1"
                  fill="var(--color-ctp-lavender)"
                />
                {/* Border sides */}
                <rect
                  x="0"
                  y="0"
                  width="1"
                  height="12"
                  fill="var(--color-ctp-lavender)"
                />
                <rect
                  x="11"
                  y="0"
                  width="1"
                  height="12"
                  fill="var(--color-ctp-lavender)"
                />
                {/* Border bottom (no tongue area) */}
                <rect
                  x="0"
                  y="11"
                  width="4"
                  height="1"
                  fill="var(--color-ctp-lavender)"
                />
                <rect
                  x="8"
                  y="11"
                  width="4"
                  height="1"
                  fill="var(--color-ctp-lavender)"
                />
                {/* Left eye */}
                <rect
                  x="2"
                  y="3"
                  width="3"
                  height="3"
                  fill="var(--color-ctp-crust)"
                />
                <rect
                  x="2"
                  y="3"
                  width="1"
                  height="1"
                  fill="var(--color-ctp-lavender)"
                />
                {/* Right eye */}
                <rect
                  x="7"
                  y="3"
                  width="3"
                  height="3"
                  fill="var(--color-ctp-crust)"
                />
                <rect
                  x="7"
                  y="3"
                  width="1"
                  height="1"
                  fill="var(--color-ctp-lavender)"
                />
                {/* Nostril dots */}
                <rect
                  x="3"
                  y="7"
                  width="1"
                  height="1"
                  fill="var(--color-ctp-crust)"
                />
                <rect
                  x="8"
                  y="7"
                  width="1"
                  height="1"
                  fill="var(--color-ctp-crust)"
                />
                {/* Tongue stem */}
                <rect
                  x="5"
                  y="11"
                  width="2"
                  height="3"
                  fill="var(--color-ctp-red)"
                />
                {/* Tongue fork — left tip */}
                <rect
                  x="3"
                  y="13"
                  width="2"
                  height="2"
                  fill="var(--color-ctp-red)"
                />
                {/* Tongue fork — right tip */}
                <rect
                  x="7"
                  y="13"
                  width="2"
                  height="2"
                  fill="var(--color-ctp-red)"
                />
              </svg>
            </div>

            <div className="text-ctp-mauve uppercase mb-1 tracking-[5px] text-[9px]">
              &gt;&gt; CYBER SLITHER &lt;&lt;
            </div>
            <div
              className="text-ctp-text font-bold uppercase mb-4 md:mb-6 text-[24px] md:text-[34px] tracking-[2px] md:tracking-[4px]"
              style={{ textShadow: "2px 2px 0 var(--color-ctp-mauve)" }}
            >
              {gameOver ? "GAME OVER" : isPaused ? "SUSPENDED" : "READY?"}
            </div>

            {gameOver && (
              <div className="pixel-card mb-4 md:mb-6 px-4 md:px-8 py-3 md:py-5 max-w-full">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-10 items-center">
                  <div className="text-center sm:text-left">
                    <div className="text-ctp-subtext0 uppercase mb-1 tracking-[2px] md:tracking-[4px] text-[7px] md:text-[8px]">
                      FINAL SCORE
                    </div>
                    <div className="text-ctp-green font-bold text-[28px] md:text-[36px] tracking-[2px] md:tracking-[4px]">
                      {String(score).padStart(5, "0")}
                    </div>
                  </div>
                  <div className="hidden sm:block border-l border-ctp-surface1 h-12" />
                  <div className="text-center sm:text-left">
                    <div className="text-ctp-subtext0 uppercase mb-1 tracking-[2px] md:tracking-[4px] text-[7px] md:text-[8px]">
                      BEST LINK
                    </div>
                    <div className="text-ctp-mauve font-bold text-[28px] md:text-[36px] tracking-[2px] md:tracking-[4px]">
                      {String(highScore).padStart(5, "0")}
                    </div>
                  </div>
                </div>
                <div className="text-ctp-subtext0 mt-3 md:mt-4 uppercase tracking-[2px] md:tracking-[3px] text-[7px] md:text-[8px] border-t border-ctp-surface1/30 pt-2">
                  {score >= highScore && score > 0
                    ? "★ NEW SYSTEM RECORD!"
                    : score > 100
                      ? "▲ IMPRESSIVE RUN!"
                      : "TRY AGAIN!"}
                </div>
              </div>
            )}

            {isPaused && !gameOver && (
              <div className="pixel-card mb-4 md:mb-6 px-6 md:px-8 py-3 md:py-4">
                <div className="text-ctp-subtext0 uppercase tracking-[2px] md:tracking-[4px] text-[7px] md:text-[8px] mb-1">
                  CURRENT SCORE
                </div>
                <div className="text-ctp-green font-bold text-[24px] md:text-[32px] tracking-[2px] md:tracking-[4px]">
                  {String(score).padStart(5, "0")}
                </div>
              </div>
            )}

            <div className="text-ctp-subtext0 mb-6 uppercase tracking-[3px] text-[9px]">
              {gameOver ? (
                <>
                  <span className="hidden md:inline">PRESS SPACE / CLICK</span>
                  <span className="md:hidden">TAP</span> TO RETRY
                </>
              ) : isPaused ? (
                <>
                  <span className="hidden md:inline">PRESS SPACE / CLICK</span>
                  <span className="md:hidden">TAP</span> TO RESUME
                </>
              ) : (
                <span className="text-[8px] md:text-[9px]">
                  EAT DATA PACKETS — AVOID WALLS & SELF
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isPaused && !gameOver) setIsPaused(false);
                else resetGame();
              }}
              className="retro-btn-pixel text-[12px] tracking-[5px] px-9 py-2.5"
            >
              ▶ {gameOver ? "REBOOT" : isPaused ? "RESUME" : "START"}
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
