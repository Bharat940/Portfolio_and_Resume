"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { m, AnimatePresence } from "motion/react";
import { useTerminal } from "@/context/TerminalContext";

// ── Grid & sizing ────────────────────────────────────────────────
const COLS = 9;
const ROWS = 4;
const CELL_W = 36;
const CELL_H = 28;
const INVADER_W = 24;
const INVADER_H = 18;
const GRID_OFFSET_X = 60; // left margin for the invader grid
const GRID_OFFSET_Y = 48; // top margin
const PLAYER_W = 36;
const PLAYER_H = 20;
const BULLET_W = 3;
const BULLET_H = 10;
const ENEMY_BULLET_W = 3;
const ENEMY_BULLET_H = 10;
const PLAYER_SPEED = 4;
const PLAYER_BULLET_SPEED = 7;
const ENEMY_BULLET_SPEED = 3.5;

// Color palette is now dynamic inside the component

// ── Pixel-art invader bitmaps (8×6 grid, 0=empty, 1=fill, 2=accent) ──
// Row type 0 — "crab" style
const SPRITE_A = [
  [0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 1, 0],
];
// Row type 1 — "squid" style
const SPRITE_B = [
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0],
];
// Row type 2 — "ufo" style
const SPRITE_C = [
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 0, 1, 0],
];

// Row type 3 (boss row) — larger 10×7
const SPRITE_BOSS = [
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
];

const SPRITES = [SPRITE_BOSS, SPRITE_A, SPRITE_B, SPRITE_C];

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: number[][],
  cx: number,
  cy: number,
  pixW: number,
  pixH: number,
  fill: string,
  accent: string,
  frame: number, // 0 or 1 — alternate animation
) {
  sprite.forEach((row, ry) => {
    row.forEach((v, rx) => {
      if (v === 0) return;
      const x = cx + rx * pixW - (row.length * pixW) / 2;
      const y = cy + ry * pixH - (sprite.length * pixH) / 2;
      // Alternate: shift legs on frame 1
      const shift = frame === 1 && ry === sprite.length - 1 ? pixH : 0;
      ctx.fillStyle = v === 2 ? accent : fill;
      ctx.fillRect(Math.round(x), Math.round(y + shift), pixW, pixH);
    });
  });
}

interface Invader {
  id: number;
  col: number;
  row: number;
  alive: boolean;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export function TerminalInvaders() {
  const { matrixMode } = useTerminal();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("ti-high-score");
    if (saved) {
      React.startTransition(() => {
        setHighScore(parseInt(saved, 10));
      });
    }
  }, []);
  const C = React.useMemo(
    () =>
      matrixMode
        ? {
            crust: "#000000",
            mantle: "#030803",
            surface0: "#001a00",
            surface1: "#003b00",
            surface2: "#008f11",
            text: "#00ff41",
            subtext0: "#008f11",
            blue: "#00ff41",
            lavender: "#00ff41",
            mauve: "#00ff41",
            red: "#00ff41",
            maroon: "#00ff41",
            green: "#00ff41",
            yellow: "#00ff41",
            peach: "#00ff41",
            sky: "#00ff41",
            teal: "#00ff41",
          }
        : {
            crust: "#11111b",
            mantle: "#181825",
            surface0: "#313244",
            surface1: "#45475a",
            surface2: "#585b70",
            text: "#cdd6f4",
            subtext0: "#a6adc8",
            blue: "#89b4fa",
            lavender: "#b4befe",
            mauve: "#cba6f7",
            red: "#f38ba8",
            maroon: "#eba0ac",
            green: "#a6e3a1",
            yellow: "#f9e2af",
            peach: "#fab387",
            sky: "#89dceb",
            teal: "#94e2d5",
          },
    [matrixMode],
  );

  const [wave, setWave] = useState(1);
  const [, setRenderTick] = useState(0);

  const SPRITE_COLORS: [string, string][] = React.useMemo(
    () => [
      [C.red, C.maroon], // boss row
      [C.mauve, C.lavender], // row 1
      [C.sky, C.teal], // row 2
      [C.green, C.teal], // row 3
    ],
    [C],
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const frameRef = useRef(0);

  // All mutable game state in refs
  const playerXRef = useRef(0);
  const bulletsRef = useRef<Bullet[]>([]);
  const enemyBulletsRef = useRef<Bullet[]>([]);
  const invadersRef = useRef<Invader[]>([]);
  const invaderOffsetXRef = useRef(0);
  const invaderOffsetYRef = useRef(0);
  const invaderDirRef = useRef(1);
  const invaderSpeedRef = useRef(0.4);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const waveRef = useRef(1);
  const lastShotRef = useRef(0);
  const lastEnemyShotRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const gameOverRef = useRef(false);
  const victorRef = useRef(false);

  const canvasW = 540;
  const canvasH = 480;

  // High score handled by lazy init

  const buildInvaders = () =>
    Array.from({ length: ROWS * COLS }, (_, i) => ({
      id: i,
      col: i % COLS,
      row: Math.floor(i / COLS),
      alive: true,
    }));

  const startGame = useCallback((isNewWave = false) => {
    if (!isNewWave) {
      scoreRef.current = 0;
      livesRef.current = 3;
      waveRef.current = 1;
      setScore(0);
      setWave(1);
    }
    playerXRef.current = canvasW / 2;
    bulletsRef.current = [];
    enemyBulletsRef.current = [];
    invadersRef.current = buildInvaders();
    invaderOffsetXRef.current = 0;
    invaderOffsetYRef.current = 0;
    invaderDirRef.current = 1;
    invaderSpeedRef.current = 0.4 + (waveRef.current - 1) * 0.15;
    particlesRef.current = [];
    gameOverRef.current = false;
    victorRef.current = false;
    frameRef.current = 0;
    lastShotRef.current = 0;
    lastEnemyShotRef.current = 0;
    setGameOver(false);
    setVictory(false);
    setIsPlaying(true);
  }, []);

  const spawnExplosion = useCallback(
    (x: number, y: number, color: string) => {
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14;
        const speed = 1.5 + Math.random() * 3;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: i % 2 === 0 ? color : C.yellow,
          size: 2 + Math.random() * 2,
        });
      }
    },
    [C.yellow],
  );

  // Main game loop on canvas
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      frameRef.current++;
      const f = frameRef.current;
      const animFrame = Math.floor(f / 20) % 2;

      // ── Player movement ──────────────────────────────────────
      if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a"))
        playerXRef.current = Math.max(
          PLAYER_W / 2 + 4,
          playerXRef.current - PLAYER_SPEED,
        );
      if (keysRef.current.has("ArrowRight") || keysRef.current.has("d"))
        playerXRef.current = Math.min(
          canvasW - PLAYER_W / 2 - 4,
          playerXRef.current + PLAYER_SPEED,
        );

      // ── Player shoot ─────────────────────────────────────────
      if (
        (keysRef.current.has(" ") || keysRef.current.has("z")) &&
        f - lastShotRef.current > 18
      ) {
        bulletsRef.current.push({
          id: f + Math.random(),
          x: playerXRef.current,
          y: canvasH - 44,
        });
        lastShotRef.current = f;
      }

      // ── Move player bullets ──────────────────────────────────
      bulletsRef.current = bulletsRef.current
        .map((b) => ({ ...b, y: b.y - PLAYER_BULLET_SPEED }))
        .filter((b) => b.y > 0);

      // ── Move invaders ────────────────────────────────────────
      const alive = invadersRef.current.filter((i) => i.alive);
      if (alive.length === 0) {
        // Wave clear
        waveRef.current++;
        setWave(waveRef.current);
        victorRef.current = true;
        setVictory(true);
        setIsPlaying(false);
        return;
      }

      invaderOffsetXRef.current +=
        invaderDirRef.current * invaderSpeedRef.current;

      // Compute bounds
      const cols = alive.map((i) => i.col);
      const minCol = Math.min(...cols);
      const maxCol = Math.max(...cols);
      const leftEdge =
        GRID_OFFSET_X + minCol * CELL_W + invaderOffsetXRef.current;
      const rightEdge =
        GRID_OFFSET_X + maxCol * CELL_W + INVADER_W + invaderOffsetXRef.current;

      if (rightEdge >= canvasW - 8 || leftEdge <= 8) {
        invaderDirRef.current *= -1;
        invaderOffsetYRef.current += 14;
      }

      // Check invader reach bottom
      const rows = alive.map((i) => i.row);
      const maxRow = Math.max(...rows);
      const bottomEdge =
        GRID_OFFSET_Y + maxRow * CELL_H + invaderOffsetYRef.current + INVADER_H;
      if (bottomEdge >= canvasH - 50) {
        gameOverRef.current = true;
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      // ── Enemy shoot ──────────────────────────────────────────
      const shootInterval = Math.max(40, 120 - waveRef.current * 10);
      if (f - lastEnemyShotRef.current > shootInterval && alive.length > 0) {
        // Pick a random bottom-row invader per column
        const byCol: Record<number, Invader[]> = {};
        alive.forEach((inv) => {
          if (!byCol[inv.col]) byCol[inv.col] = [];
          byCol[inv.col].push(inv);
        });
        const shooterCol =
          Object.keys(byCol)[
            Math.floor(Math.random() * Object.keys(byCol).length)
          ];
        const candidates = byCol[parseInt(shooterCol)].sort(
          (a, b) => b.row - a.row,
        );
        const shooter = candidates[0];
        const sx =
          GRID_OFFSET_X +
          shooter.col * CELL_W +
          CELL_W / 2 +
          invaderOffsetXRef.current;
        const sy =
          GRID_OFFSET_Y +
          shooter.row * CELL_H +
          CELL_H +
          invaderOffsetYRef.current;
        enemyBulletsRef.current.push({ id: f + Math.random(), x: sx, y: sy });
        lastEnemyShotRef.current = f;
      }

      // ── Move enemy bullets ───────────────────────────────────
      enemyBulletsRef.current = enemyBulletsRef.current
        .map((b) => ({ ...b, y: b.y + ENEMY_BULLET_SPEED }))
        .filter((b) => b.y < canvasH);

      // ── Enemy bullet vs player ───────────────────────────────
      const px = playerXRef.current;
      const py = canvasH - 36;
      enemyBulletsRef.current = enemyBulletsRef.current.filter((b) => {
        const hit =
          Math.abs(b.x - px) < PLAYER_W / 2 - 2 &&
          Math.abs(b.y - py) < PLAYER_H / 2 + 4;
        if (hit) {
          spawnExplosion(px, py, C.blue);
          livesRef.current--;
          if (livesRef.current <= 0) {
            gameOverRef.current = true;
            // update high score
            const s = scoreRef.current;
            setHighScore((h) => {
              const next = Math.max(h, s);
              localStorage.setItem("ti-high-score", next.toString());
              return next;
            });
            setGameOver(true);
            setIsPlaying(false);
          }
        }
        return !hit;
      });

      // ── Player bullet vs invaders ────────────────────────────
      const remainingBullets: Bullet[] = [];
      bulletsRef.current.forEach((b) => {
        let hit = false;
        invadersRef.current = invadersRef.current.map((inv) => {
          if (!inv.alive || hit) return inv;
          const ix =
            GRID_OFFSET_X +
            inv.col * CELL_W +
            CELL_W / 2 +
            invaderOffsetXRef.current;
          const iy =
            GRID_OFFSET_Y +
            inv.row * CELL_H +
            CELL_H / 2 +
            invaderOffsetYRef.current;
          if (
            Math.abs(b.x - ix) < INVADER_W / 2 + 2 &&
            Math.abs(b.y - iy) < INVADER_H / 2 + 2
          ) {
            hit = true;
            const points = inv.row === 0 ? 300 : inv.row === 1 ? 200 : 100;
            scoreRef.current += points;
            setScore(scoreRef.current);
            setHighScore((h) => {
              const next = Math.max(h, scoreRef.current);
              localStorage.setItem("ti-high-score", next.toString());
              return next;
            });
            const [fill] = SPRITE_COLORS[inv.row];
            spawnExplosion(ix, iy, fill);
            // Speed up remaining invaders as fewer remain
            const remaining =
              invadersRef.current.filter((i) => i.alive).length - 1;
            invaderSpeedRef.current =
              0.4 +
              (waveRef.current - 1) * 0.15 +
              (ROWS * COLS - remaining) * 0.018;
            return { ...inv, alive: false };
          }
          return inv;
        });
        if (!hit) remainingBullets.push(b);
      });
      bulletsRef.current = remainingBullets;

      // ── Update particles ─────────────────────────────────────
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vx: p.vx * 0.9,
          vy: p.vy * 0.9,
          life: p.life - 0.04,
        }))
        .filter((p) => p.life > 0);

      // ─────────────────────────────────────────────────────────
      // RENDER
      // ─────────────────────────────────────────────────────────
      ctx.fillStyle = C.crust;
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Grid dots
      ctx.fillStyle = "rgba(69,71,90,0.2)";
      for (let gx = 12; gx < canvasW; gx += 20)
        for (let gy = 12; gy < canvasH; gy += 20) ctx.fillRect(gx, gy, 1, 1);

      // Draw invaders
      invadersRef.current.forEach((inv) => {
        if (!inv.alive) return;
        const ix =
          GRID_OFFSET_X +
          inv.col * CELL_W +
          CELL_W / 2 +
          invaderOffsetXRef.current;
        const iy =
          GRID_OFFSET_Y +
          inv.row * CELL_H +
          CELL_H / 2 +
          invaderOffsetYRef.current;
        const sprite = SPRITES[inv.row];
        const [fill, accent] = SPRITE_COLORS[inv.row];
        const pixW = inv.row === 0 ? 2 : 2;
        const pixH = inv.row === 0 ? 2 : 2;
        drawSprite(ctx, sprite, ix, iy, pixW, pixH, fill, accent, animFrame);
      });

      // Player bullets
      bulletsRef.current.forEach((b) => {
        ctx.fillStyle = C.yellow;
        ctx.fillRect(b.x - BULLET_W / 2, b.y - BULLET_H, BULLET_W, BULLET_H);
        // Glow top
        ctx.fillStyle = "rgba(249,226,175,0.3)";
        ctx.fillRect(b.x - 2, b.y - BULLET_H - 2, 5, 4);
      });

      // Enemy bullets — zigzag visual
      enemyBulletsRef.current.forEach((b) => {
        const zz = Math.sin(b.y / 5) * 2;
        ctx.fillStyle = C.red;
        ctx.fillRect(
          b.x + zz - ENEMY_BULLET_W / 2,
          b.y,
          ENEMY_BULLET_W,
          ENEMY_BULLET_H,
        );
      });

      // Player ship (pixel art)
      const shipX = Math.round(playerXRef.current);
      const shipY = canvasH - 36;
      // Base
      ctx.fillStyle = C.green;
      ctx.fillRect(shipX - 18, shipY + 4, 36, 12);
      // Upper body
      ctx.fillRect(shipX - 10, shipY - 2, 20, 8);
      // Cannon
      ctx.fillRect(shipX - 2, shipY - 12, 4, 14);
      // Wings detail
      ctx.fillStyle = C.teal;
      ctx.fillRect(shipX - 18, shipY + 4, 6, 8);
      ctx.fillRect(shipX + 12, shipY + 4, 6, 8);
      // Cockpit
      ctx.fillStyle = C.sky;
      ctx.fillRect(shipX - 4, shipY, 8, 6);

      // Particles
      particlesRef.current.forEach((p) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(
          Math.round(p.x - p.size / 2),
          Math.round(p.y - p.size / 2),
          p.size,
          p.size,
        );
      });
      ctx.globalAlpha = 1;

      // Ground line
      ctx.fillStyle = C.green;
      ctx.fillRect(0, canvasH - 18, canvasW, 2);

      // Lives display (small ships)
      for (let l = 0; l < livesRef.current; l++) {
        const lx = 12 + l * 28;
        const ly = canvasH - 12;
        ctx.fillStyle = C.green;
        ctx.fillRect(lx, ly - 6, 18, 6);
        ctx.fillRect(lx + 4, ly - 10, 10, 6);
        ctx.fillRect(lx + 8, ly - 14, 2, 6);
      }

      // Wave number (right side of ground)
      ctx.fillStyle = C.subtext0;
      ctx.font = `8px monospace`;
      ctx.textAlign = "right";
      ctx.fillText(`WAVE ${waveRef.current}`, canvasW - 8, canvasH - 6);
      ctx.textAlign = "left";

      setRenderTick((t) => t + 1);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, gameOver, matrixMode, C, SPRITE_COLORS, spawnExplosion]);

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " ") e.preventDefault();
      if (
        (e.key === " " || e.key === "Enter") &&
        (!isPlaying || gameOver || victory)
      ) {
        startGame();
      }
      if (e.key === "Escape" && isPlaying) {
        setIsPlaying(false);
        setGameOver(true);
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

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
        window.removeEventListener("keydown", down);
        window.removeEventListener("keyup", up);
        container.removeEventListener("touchmove", preventDefault);
      };
    }

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [isPlaying, gameOver, victory, startGame]);

  const showOverlay = !isPlaying || gameOver || victory;

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-ctp-crust relative overflow-hidden flex flex-col items-center justify-center font-heading select-none touch-none"
    >
      <div className="arcade-scanlines" />

      {/* Binary bg scroll */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2, 3].map((layer) => (
          <div
            key={layer}
            className="pixel-bg-scroll absolute text-ctp-green"
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

      {/* HUD row */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-30 text-right pointer-events-none flex flex-row md:flex-col gap-3 md:gap-1">
        <div className="flex flex-col md:block">
          <div className="text-ctp-subtext0 uppercase tracking-[2px] md:tracking-[3px] text-[5px] md:text-[7px]">
            RECORD
          </div>
          <div className="text-ctp-green font-bold text-[8px] md:text-[14px] tracking-[1px] md:tracking-[2px]">
            {String(highScore).padStart(6, "0")}
          </div>
        </div>
        <div className="flex flex-col md:block">
          <div className="text-ctp-subtext0 uppercase tracking-[2px] md:tracking-[3px] text-[5px] md:text-[7px]">
            SCORE
          </div>
          <div className="text-ctp-text font-bold text-[10px] md:text-[22px] tracking-[1px] md:tracking-[2px]">
            {String(score).padStart(6, "0")}
          </div>
        </div>
      </div>

      {/* Canvas - Responsive scaling */}
      <div className="pixel-card p-0.5 md:p-0.75 z-10 w-full max-w-4xl max-h-full aspect-540/480">
        <canvas
          ref={canvasRef}
          width={canvasW}
          height={canvasH}
          className="w-full h-full object-contain"
          style={{ display: "block", imageRendering: "pixelated" }}
        />
      </div>

      {/* Controls */}
      <div className="mt-2 md:mt-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 z-10 px-4 max-w-full overflow-hidden">
        <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap min-w-0">
          <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] shrink-0">
            ← →
          </span>
          <span className="text-ctp-subtext0 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] truncate">
            MOVE
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap min-w-0">
          <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] shrink-0">
            SPACE / Z
          </span>
          <span className="text-ctp-subtext0 tracking-[1px] md:tracking-[2px] text-[7px] md:text-[8px] truncate">
            FIRE
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

            {/* Pixel invader icon */}
            <div className="shrink-0 mb-4">
              <svg
                width="52"
                height="40"
                viewBox="0 0 13 10"
                style={{ imageRendering: "pixelated" }}
                xmlns="http://www.w3.org/2000/svg"
                className="w-auto h-10 md:h-12 max-h-[15vh] object-contain"
              >
                {/* Antenna */}
                <rect
                  x="2"
                  y="0"
                  width="1"
                  height="2"
                  fill="var(--color-ctp-green)"
                />
                <rect
                  x="10"
                  y="0"
                  width="1"
                  height="2"
                  fill="var(--color-ctp-green)"
                />
                {/* Body */}
                <rect
                  x="1"
                  y="2"
                  width="11"
                  height="6"
                  fill="var(--color-ctp-green)"
                />
                {/* Eyes */}
                <rect
                  x="2"
                  y="3"
                  width="2"
                  height="2"
                  fill="var(--color-ctp-crust)"
                />
                <rect
                  x="9"
                  y="3"
                  width="2"
                  height="2"
                  fill="var(--color-ctp-crust)"
                />
                {/* Mouth */}
                <rect
                  x="3"
                  y="6"
                  width="1"
                  height="1"
                  fill="var(--color-ctp-crust)"
                />
                <rect
                  x="5"
                  y="6"
                  width="1"
                  height="1"
                  fill="var(--color-ctp-crust)"
                />
                <rect
                  x="7"
                  y="6"
                  width="1"
                  height="1"
                  fill="var(--color-ctp-crust)"
                />
                <rect
                  x="9"
                  y="6"
                  width="1"
                  height="1"
                  fill="var(--color-ctp-crust)"
                />
                {/* Legs */}
                <rect
                  x="1"
                  y="8"
                  width="2"
                  height="2"
                  fill="var(--color-ctp-green)"
                />
                <rect
                  x="5"
                  y="8"
                  width="3"
                  height="2"
                  fill="var(--color-ctp-green)"
                />
                <rect
                  x="10"
                  y="8"
                  width="2"
                  height="2"
                  fill="var(--color-ctp-green)"
                />
              </svg>
            </div>

            <div className="text-ctp-green uppercase mb-1 tracking-[5px] text-[9px]">
              &gt;&gt; TERMINAL INVADERS &lt;&lt;
            </div>
            <div
              className="text-ctp-text font-bold uppercase mb-4 md:mb-6 text-[24px] md:text-[34px] tracking-[2px] md:tracking-[4px]"
              style={{ textShadow: "2px 2px 0 var(--color-ctp-green)" }}
            >
              {gameOver
                ? "GAME OVER"
                : victory
                  ? `WAVE ${wave} CLEAR!`
                  : "READY?"}
            </div>

            {/* Score legend on start screen */}
            {!gameOver && !victory && (
              <div className="pixel-card mb-4 md:mb-5 px-3 md:px-8 py-2 md:py-4 flex gap-3 md:gap-8 max-w-full overflow-hidden">
                {[
                  { label: "BOSS", pts: "300", color: "var(--color-ctp-red)" },
                  {
                    label: "ELITE",
                    pts: "200",
                    color: "var(--color-ctp-mauve)",
                  },
                  { label: "DRONE", pts: "100", color: "var(--color-ctp-sky)" },
                ].map(({ label, pts, color }) => (
                  <div key={label} className="text-center shrink-0">
                    <div
                      className="text-[6px] md:text-[8px] tracking-[1px] md:tracking-[3px] mb-0.5"
                      style={{ color }}
                    >
                      {label}
                    </div>
                    <div className="text-ctp-text font-bold text-[10px] md:text-[16px] tracking-[1px] md:tracking-[2px]">
                      {pts}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(gameOver || victory) && (
              <div className="pixel-card mb-4 md:mb-6 px-4 md:px-8 py-3 md:py-5 max-w-full">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-10 items-center">
                  <div className="text-center sm:text-left">
                    <div className="text-ctp-subtext0 uppercase mb-1 tracking-[2px] md:tracking-[4px] text-[7px] md:text-[8px]">
                      {gameOver ? "FINAL SCORE" : "WAVE SCORE"}
                    </div>
                    <div className="text-ctp-green font-bold text-[28px] md:text-[36px] tracking-[2px] md:tracking-[4px]">
                      {String(score).padStart(6, "0")}
                    </div>
                  </div>
                  <div className="hidden sm:block border-l border-ctp-surface1 h-12" />
                  <div className="text-center sm:text-left">
                    <div className="text-ctp-subtext0 uppercase mb-1 tracking-[2px] md:tracking-[4px] text-[7px] md:text-[8px]">
                      BEST DEFENSE
                    </div>
                    <div className="text-ctp-mauve font-bold text-[28px] md:text-[36px] tracking-[2px] md:tracking-[4px]">
                      {String(highScore).padStart(6, "0")}
                    </div>
                  </div>
                </div>
                <div className="text-ctp-subtext0 mt-3 md:mt-4 uppercase tracking-[2px] md:tracking-[3px] text-[7px] md:text-[8px] border-t border-ctp-surface1/30 pt-2">
                  {score >= highScore && score > 0
                    ? "★ NEW SYSTEM RECORD!"
                    : victory
                      ? `▶ PREPARE FOR WAVE ${wave + 1}`
                      : score > 1000
                        ? "▲ IMPRESSIVE DEFENSE!"
                        : "TRY AGAIN!"}
                </div>
              </div>
            )}

            <div className="text-ctp-subtext0 mb-6 uppercase tracking-[3px] text-[9px]">
              {gameOver ? (
                <>
                  <span className="hidden md:inline">PRESS SPACE / CLICK</span>
                  <span className="md:hidden">TAP</span> TO RETRY
                </>
              ) : victory ? (
                <>
                  <span className="hidden md:inline">PRESS SPACE / CLICK</span>
                  <span className="md:hidden">TAP</span> FOR NEXT WAVE
                </>
              ) : (
                "DEFEND THE TERMINAL FROM INVADERS"
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame(victory);
              }}
              className="retro-btn-pixel text-[12px] tracking-[5px] px-9 py-2.5"
              style={{
                borderColor: "var(--color-ctp-green)",
                backgroundColor: "var(--color-ctp-green)",
              }}
            >
              ▶{" "}
              {gameOver
                ? "REINITIALIZE"
                : victory
                  ? `WAVE ${wave + 1}`
                  : "START_FIREWALL"}
            </button>

            <div className="mt-8 hidden md:flex justify-center gap-5">
              {[
                ["← →", "MOVE"],
                ["SPACE / Z", "FIRE"],
              ].map(([k, a]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="text-ctp-subtext0 bg-ctp-surface0 border border-ctp-surface1 px-1.5 py-0.5 tracking-[2px] text-[8px]">
                    {k}
                  </span>
                  <span className="text-ctp-subtext0 tracking-[2px] text-[8px]">
                    {a}
                  </span>
                </div>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Mobile Controls */}
      <div className="md:hidden absolute bottom-12 left-0 right-0 z-50 flex justify-between px-4 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button
            onPointerDown={() => keysRef.current.add("ArrowLeft")}
            onPointerUp={() => keysRef.current.delete("ArrowLeft")}
            onPointerLeave={() => keysRef.current.delete("ArrowLeft")}
            className="w-12 h-12 bg-ctp-surface0/40 border border-ctp-surface1 flex items-center justify-center active:bg-ctp-surface1 transition-colors select-none"
          >
            <span className="text-ctp-text text-lg">←</span>
          </button>
          <button
            onPointerDown={() => keysRef.current.add("ArrowRight")}
            onPointerUp={() => keysRef.current.delete("ArrowRight")}
            onPointerLeave={() => keysRef.current.delete("ArrowRight")}
            className="w-12 h-12 bg-ctp-surface0/40 border border-ctp-surface1 flex items-center justify-center active:bg-ctp-surface1 transition-colors select-none"
          >
            <span className="text-ctp-text text-lg">→</span>
          </button>
        </div>
        <button
          onPointerDown={() => keysRef.current.add(" ")}
          onPointerUp={() => keysRef.current.delete(" ")}
          onPointerLeave={() => keysRef.current.delete(" ")}
          className="w-16 h-12 bg-ctp-green/10 border border-ctp-green/40 flex items-center justify-center active:bg-ctp-green/30 transition-colors pointer-events-auto select-none"
        >
          <span className="text-ctp-green font-bold tracking-widest text-[10px]">
            FIRE
          </span>
        </button>
      </div>
    </div>
  );
}
