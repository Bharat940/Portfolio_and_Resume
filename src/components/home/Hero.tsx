"use client";

import React, { useRef } from "react";
import { m, Variants, useMotionValue, useSpring } from "motion/react";
import { PixelArrowRight } from "@/components/icons/PixelArrowRight";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 20 },
  },
};

// Tagline animation simplified to avoid word-by-word DOM overhead on lower-end devices
const taglineVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, duration: 0.5, ease: "easeOut" },
  },
};

const techStack = ["Next.js", "tRPC", "PostgreSQL", "C++", "Docker"];

export function Hero() {
  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  // Magnetic button logic directly in component to satisfy strict React 19 linting
  const magnetRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = magnetRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section
      id="home"
      className="relative flex flex-col min-h-dvh px-5 sm:px-8 md:px-12 lg:px-20 overflow-hidden bg-mesh"
    >
      {/* Ambient blobs - Optimized blur and will-change */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <m.div
          className="absolute top-1/3 right-0 w-[60%] h-[40%] bg-ctp-mauve/5 blur-2xl rounded-full"
          animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity" }}
        />
        <m.div
          className="absolute bottom-1/4 -left-16 w-[50%] h-[35%] bg-ctp-blue/5 blur-2xl rounded-full"
          animate={{ scale: [1, 1.03, 1], opacity: [0.03, 0.05, 0.03] }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{ willChange: "transform, opacity" }}
        />
      </div>

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Watermark label — vertical left side */}
      <div
        className="pointer-events-none absolute top-0 left-0 h-full select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-mono font-black uppercase text-foreground/5"
          style={{
            writingMode: "vertical-lr",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            fontSize: "clamp(0.5rem, 1.2vw, 0.7rem)",
            letterSpacing: "0.4em",
            paddingTop: "1.5rem",
            paddingLeft: "0.75rem",
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
          Software Engineering • Distributed Core • v2.0.26
        </span>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-center flex-1">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col justify-center gap-5 md:gap-7"
          style={{
            paddingTop: "clamp(88px, 15vw, 108px)",
            paddingBottom: "clamp(80px, 10vw, 96px)",
          }}
        >
          {/* Status badge */}
          <m.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 60,
              damping: 15,
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ctp-surface0/60 border border-border/30 text-[10px] font-mono text-ctp-peach">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ctp-peach opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ctp-peach" />
              </span>
              System Status: Active
            </div>
          </m.div>

          {/* Title */}
          <div className="flex flex-col gap-0 md:gap-1">
            <div className="overflow-hidden">
              <m.h1
                data-cursor="focus"
                className="font-black tracking-tighter font-heading leading-[0.86] text-foreground block"
                style={{
                  fontSize: "clamp(2.4rem, 9vw, 8rem)",
                  willChange: "transform",
                }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                ENGINEERING
              </m.h1>
            </div>

            <div className="overflow-hidden">
              <m.h1
                data-cursor="focus"
                className="font-black tracking-tighter font-heading leading-[0.86] text-ctp-mauve italic block"
                style={{
                  fontSize: "clamp(2.4rem, 9vw, 8rem)",
                  willChange: "transform",
                }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                DIGITAL
              </m.h1>
            </div>

            <div className="overflow-hidden">
              <m.h1
                data-cursor="focus"
                className="font-black tracking-tight font-mono leading-[0.86] text-ctp-blue block"
                style={{
                  fontSize: "clamp(2.4rem, 9.5vw, 8rem)",
                  willChange: "transform",
                }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.16,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {"SYSTEMS".split("").map((char, i) => (
                  <m.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.03, duration: 0.2 }}
                    className="inline-block"
                  >
                    {char}
                  </m.span>
                ))}
                <m.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1] }}
                  transition={{
                    delay: 1.2,
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                  className="inline-block text-ctp-mauve"
                >
                  _
                </m.span>
              </m.h1>
            </div>
          </div>

          {/* Tagline - Optimized to avoid word-by-word overhead */}
          <m.div
            className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-2xl"
            variants={taglineVariants}
          >
            <m.div
              className="hidden sm:block h-px bg-ctp-mauve/30"
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ delay: 1, duration: 0.6 }}
            />
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              I&apos;m{" "}
              <span className="text-foreground font-black uppercase tracking-tight">
                Bharat Dangi
              </span>
              . Full Stack Developer & Software Architect crafting
              high-performance distributed solutions.
            </p>
          </m.div>

          {/* CTAs */}
          <m.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3"
          >
            <m.a
              ref={magnetRef}
              href="#projects"
              data-cursor="focus"
              style={{ x: springX, y: springY, willChange: "transform" }}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                scrollTo("#projects");
              }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 md:px-8 md:py-3.5 bg-ctp-mauve text-ctp-base rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-ctp-mauve/15 cursor-pointer relative overflow-hidden"
            >
              <m.span
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                whileHover={{ translateX: "200%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative">Explore Archive</span>
              <PixelArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform relative" />
            </m.a>

            <m.a
              href="#contact"
              data-cursor="focus"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                scrollTo("#contact");
              }}
              whileHover={{
                borderColor: "rgba(203,166,247,0.4)",
                backgroundColor: "rgba(49,50,68,0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-5 py-2.5 md:px-8 md:py-3.5 border border-border/40 text-foreground rounded-xl font-black uppercase tracking-widest text-[10px] cursor-pointer backdrop-blur-sm transition-colors"
            >
              Initialize Connection
            </m.a>
          </m.div>

          {/* Tech stack */}
          <m.div
            className="flex flex-wrap items-center gap-1.5 md:gap-2"
            variants={itemVariants}
          >
            {techStack.map((tech, i) => (
              <m.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + i * 0.05 }}
                className="px-2.5 py-1 rounded-md bg-ctp-surface0/30 border border-border/20 text-[10px] font-mono text-muted-foreground/50"
              >
                {tech}
              </m.span>
            ))}
          </m.div>
        </m.div>
      </div>

      {/* Scroll indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[8px] font-mono text-muted-foreground/20 uppercase tracking-widest">
          scroll
        </span>
        <m.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-6 bg-linear-to-b from-muted-foreground/30 to-transparent"
        />
      </m.div>
    </section>
  );
}
