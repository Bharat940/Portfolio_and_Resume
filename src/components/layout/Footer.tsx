"use client";

import Image from "next/image";
import { m, useMotionValue, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { PixelGitHub } from "@/components/icons/PixelGitHub";
import { PixelLinkedIn } from "@/components/icons/PixelLinkedIn";
import { PixelTerminal } from "@/components/icons/PixelTerminal";
import { PixelX } from "@/components/icons/PixelX";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { useTerminal } from "@/context/TerminalContext";

// ── Magnetic Social Button ────────────────────────────────────────────────────

function MagneticSocial({
  href,
  title,
  hoverBg,
  hoverBorder,
  children,
}: {
  href: string;
  title: string;
  hoverBg: string;
  hoverBorder: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.92 }}
      className={`group relative w-11 h-11 rounded-[14px] bg-ctp-surface0 border border-border/40 flex items-center justify-center transition-all duration-300 shadow-sm ${hoverBg} ${hoverBorder} hover:scale-110 hover:shadow-lg cursor-pointer`}
    >
      {children}
    </m.a>
  );
}

// ── Glitch text effect ────────────────────────────────────────────────────────

function GlitchText({ text }: { text: string }) {
  const [glitching, setGlitching] = useState(false);

  return (
    <span
      className="relative inline-block cursor-default select-none"
      onMouseEnter={() => setGlitching(true)}
      onAnimationEnd={() => setGlitching(false)}
    >
      <span
        className={`font-heading font-black tracking-tighter text-foreground/90 transition-all ${
          glitching ? "animate-[glitch_0.3s_steps(2)_1]" : ""
        }`}
      >
        {text}
      </span>
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-ctp-mauve font-heading font-black tracking-tighter pointer-events-none"
            style={{
              clipPath: "inset(30% 0 40% 0)",
              transform: "translateX(-2px)",
            }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-ctp-sky font-heading font-black tracking-tighter pointer-events-none"
            style={{
              clipPath: "inset(60% 0 10% 0)",
              transform: "translateX(2px)",
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}

// ── Nav link with pixel underline ─────────────────────────────────────────────

function FooterLink({
  href,
  label,
  accent,
}: {
  href: string;
  label: string;
  accent: string;
}) {
  return (
    <TransitionLink
      href={href}
      className={`group relative font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer`}
    >
      <span>{label}</span>
      <span
        className={`absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ${accent}`}
      />
    </TransitionLink>
  );
}

// ── Terminal CTA Button ───────────────────────────────────────────────────────

function TerminalCTA() {
  const { toggleTerminal } = useTerminal();
  const [pressed, setPressed] = useState(false);

  return (
    <m.button
      onClick={() => {
        setPressed(true);
        setTimeout(() => setPressed(false), 400);
        toggleTerminal();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex items-center gap-3 px-5 py-3 bg-ctp-surface0/60 hover:bg-ctp-surface0 border border-border/40 hover:border-ctp-mauve/40 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Shimmer */}
      <m.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-ctp-mauve/5 to-transparent -translate-x-full"
        animate={pressed ? { translateX: "200%" } : {}}
        transition={{ duration: 0.5 }}
      />

      <div className="relative flex items-center justify-center w-8 h-8 rounded-[10px] bg-ctp-mauve/10 border border-ctp-mauve/20 group-hover:bg-ctp-mauve/20 transition-colors">
        <PixelTerminal className="w-4 h-4 text-ctp-mauve" />
      </div>

      <div className="relative text-left">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground leading-none mb-0.5">
          Launch Shell
        </p>
        <p className="font-mono text-xs font-bold text-foreground leading-none">
          ⌘K to open
        </p>
      </div>

      {/* Blink cursor */}
      <m.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="relative ml-auto text-ctp-mauve font-mono text-base font-bold leading-none"
      >
        _
      </m.span>
    </m.button>
  );
}

// ── Main Footer ───────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/", label: "Home", accent: "bg-ctp-blue" },
  { href: "/about", label: "About", accent: "bg-ctp-green" },
  { href: "/projects", label: "Projects", accent: "bg-ctp-peach" },
  { href: "/blog", label: "Blog", accent: "bg-ctp-pink" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="main-footer"
      className="relative overflow-hidden border-t border-border/30"
      style={{ background: "var(--section-2)" }}
    >
      {/* Dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #cba6f7 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top accent line — rainbow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-ctp-mauve via-ctp-sky to-ctp-green opacity-60" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* ── Main Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-14 md:py-16 border-b border-border/20">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-border/40 shadow-md shrink-0">
                <Image
                  src="/logo.png"
                  alt="Bharat Dangi"
                  fill
                  sizes="44px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p className="font-heading font-black text-lg leading-none tracking-tight text-foreground">
                  BHARAT<span className="text-ctp-mauve">.</span>DEV
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 mt-0.5">
                  Full Stack · Systems
                </p>
              </div>
            </div>

            <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-xs">
              Engineering high-performance distributed systems and beautiful web
              experiences. B.Tech IT @ UIT RGPV.
            </p>

            <TerminalCTA />
          </div>

          {/* Nav column */}
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ctp-mauve font-bold">
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </nav>
          </div>

          {/* Connect column */}
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ctp-mauve font-bold">
              Connect
            </p>

            <div className="flex gap-3">
              <MagneticSocial
                href="https://github.com/Bharat940"
                title="GitHub"
                hoverBg="hover:bg-ctp-lavender/10"
                hoverBorder="hover:border-ctp-lavender/40"
              >
                <PixelGitHub className="w-5 h-5 text-muted-foreground group-hover:text-ctp-lavender transition-colors" />
              </MagneticSocial>

              <MagneticSocial
                href="https://twitter.com/Bharatdangi322"
                title="Twitter / X"
                hoverBg="hover:bg-ctp-sky/10"
                hoverBorder="hover:border-ctp-sky/40"
              >
                <PixelX className="w-4 h-4 text-muted-foreground group-hover:text-ctp-sky transition-colors" />
              </MagneticSocial>

              <MagneticSocial
                href="https://linkedin.com/in/bharat-dangi-b186b3248"
                title="LinkedIn"
                hoverBg="hover:bg-ctp-blue/10"
                hoverBorder="hover:border-ctp-blue/40"
              >
                <PixelLinkedIn className="w-5 h-5 text-muted-foreground group-hover:text-ctp-blue transition-colors" />
              </MagneticSocial>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
                Direct Channel
              </p>
              <a
                href="mailto:bdangi450@gmail.com"
                className="font-mono text-xs text-muted-foreground hover:text-ctp-mauve transition-colors group flex items-center gap-1.5"
              >
                bdangi450@gmail.com
                <span className="opacity-0 group-hover:opacity-100 text-ctp-mauve transition-opacity">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/40">
              © {year}
            </span>
            <span className="text-border/40 text-xs">·</span>
            <GlitchText text="BHARAT DANGI" />
          </div>

          <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-ctp-green animate-pulse inline-block" />
            <span>All Systems Operational</span>
            <span className="text-border/40 mx-1">·</span>
            <span>Next.js · Tailwind v4 · Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
