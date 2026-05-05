"use client";

import React, { useRef } from "react";
import { motion, Variants, useMotionValue, useSpring } from "motion/react";
import { PixelArrowRight } from "@/components/icons/PixelArrowRight";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 18 }
  }
};

// Each word in the tagline animates in individually
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 16, rotateX: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.9 + i * 0.06,
      type: "spring",
      stiffness: 100,
      damping: 20,
    }
  })
};



const tagline = "Full Stack Developer & Software Architect crafting high-performance distributed solutions.";
const words = tagline.split(" ");

const techStack = ['Next.js', 'tRPC', 'PostgreSQL', 'C++', 'Docker'];

export function Hero() {
  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  // Magnetic button logic directly in component to satisfy strict React 19 linting
  const magnetRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = magnetRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };

  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <section
      id="home"
      className="relative flex flex-col min-h-[100dvh] px-5 sm:px-8 md:px-12 lg:px-20 overflow-hidden bg-mesh"
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/3 right-0 w-[60%] h-[40%] bg-ctp-mauve/[0.07] blur-[120px] rounded-full"
          animate={{ scale: [1, 1.08, 1], opacity: [0.07, 0.11, 0.07] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-16 w-[50%] h-[35%] bg-ctp-blue/[0.07] blur-[120px] rounded-full"
          animate={{ scale: [1, 1.05, 1], opacity: [0.07, 0.1, 0.07] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Watermark label — vertical left side */}
      <div
        className="pointer-events-none absolute top-0 left-0 h-full select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-mono font-black uppercase text-foreground/[0.06]"
          style={{
            writingMode: 'vertical-lr',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            fontSize: 'clamp(0.5rem, 1.2vw, 0.7rem)',
            letterSpacing: '0.3em',
            paddingTop: '1.5rem',
            paddingLeft: '0.75rem',
            display: 'block',
            whiteSpace: 'nowrap',
          }}
        >
          Software Engineering • Distributed Core • v2.0.26
        </span>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-center flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col justify-center gap-5 md:gap-7"
          style={{
            paddingTop: 'clamp(88px, 15vw, 108px)',
            paddingBottom: 'clamp(80px, 10vw, 96px)'
          }}
        >
          {/* Status badge — slides in from left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 80, damping: 18 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ctp-surface0/60 border border-border/30 text-[10px] font-mono text-ctp-peach backdrop-blur-md">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ctp-peach opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ctp-peach" />
              </span>
              System Status: Active &amp; Available
            </div>
          </motion.div>

          {/* Title — each line reveals from below its overflow clip */}
          <div className="flex flex-col gap-0 md:gap-1">
            {/* Line 1 */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-black tracking-tighter font-heading leading-[0.86] text-foreground block"
                style={{ fontSize: 'clamp(2.4rem, 9.5vw, 8rem)' }}
                initial={{ y: "110%", skewY: 4 }}
                animate={{ y: 0, skewY: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                ENGINEERING
              </motion.h1>
            </div>

            {/* Line 2 */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-black tracking-tighter font-heading leading-[0.86] text-ctp-mauve italic block"
                style={{ fontSize: 'clamp(2.4rem, 9.5vw, 8rem)' }}
                initial={{ y: "110%", skewY: 4 }}
                animate={{ y: 0, skewY: 0 }}
                transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                DIGITAL
              </motion.h1>
            </div>

            {/* Line 3 — draws in letter by letter */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-black tracking-tight font-mono leading-[0.86] text-ctp-blue block"
                style={{ fontSize: 'clamp(2.4rem, 9.5vw, 8rem)' }}
                initial={{ y: "110%", skewY: 4 }}
                animate={{ y: 0, skewY: 0 }}
                transition={{ duration: 0.8, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
              >
                {"SYSTEMS".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(6px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.7 + i * 0.04, duration: 0.3 }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
                {/* Terminal cursor — flickers after all letters have appeared */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1] }}
                  transition={{
                    delay: 0.7 + "SYSTEMS".length * 0.04 + 0.1,
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                  className="inline-block text-ctp-mauve"
                >
                  _
                </motion.span>
              </motion.h1>
            </div>
          </div>

          {/* Animated divider line */}
          <motion.div
            className="flex items-center gap-4 max-w-2xl"
            variants={itemVariants}
          >
            <motion.div
              className="h-px bg-ctp-mauve/40"
              initial={{ width: 0 }}
              animate={{ width: '4rem' }}
              transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
            />
            {/* Word-by-word tagline */}
            <p
              className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
              style={{ perspective: '600px' }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="inline"
              >
                I&apos;m{' '}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.88 }}
                className="text-foreground font-black uppercase tracking-tight"
              >
                Bharat Dangi
              </motion.span>
              {'. '}
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>

          {/* CTAs — primary is magnetic on desktop */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.a
              ref={magnetRef}
              href="#projects"
              style={{ x: springX, y: springY }}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                scrollTo('#projects');
              }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 md:px-8 md:py-3.5 bg-ctp-mauve text-ctp-base rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-ctp-mauve/20 cursor-pointer relative overflow-hidden"
            >
              {/* Shimmer sweep on hover */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                whileHover={{ translateX: "200%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative">Explore Archive</span>
              <PixelArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform relative" />
            </motion.a>

            <motion.a
              href="#contact"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                scrollTo('#contact');
              }}
              whileHover={{ borderColor: 'rgba(203,166,247,0.5)', backgroundColor: 'rgba(49,50,68,0.6)' }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center px-5 py-2.5 md:px-8 md:py-3.5 border border-border/50 text-foreground rounded-xl font-black uppercase tracking-widest text-[10px] cursor-pointer backdrop-blur-sm transition-colors"
            >
              Initialize Connection
            </motion.a>
          </motion.div>

          {/* Tech stack — staggered pop-in */}
          <motion.div
            className="flex flex-wrap items-center gap-1.5 md:gap-2"
            variants={itemVariants}
          >
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.7, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 1.2 + i * 0.08,
                  type: "spring",
                  stiffness: 200,
                  damping: 16,
                }}
                whileHover={{ scale: 1.08, borderColor: 'rgba(203,166,247,0.4)' }}
                className="px-2.5 py-1 rounded-md bg-ctp-surface0/40 border border-border/20 text-[10px] font-mono text-muted-foreground/60 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[8px] font-mono text-muted-foreground/25 uppercase tracking-widest">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-muted-foreground/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}