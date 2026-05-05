"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Home, Briefcase, Mail, BookOpen, GraduationCap, Activity } from 'lucide-react';
import { PixelArrowLeft } from '../icons/PixelArrowLeft';
import { PixelArrowRight } from '../icons/PixelArrowRight';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  isSection?: boolean;
}

interface QuickNavProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { name: 'Home', href: '#home', icon: <Home className="w-4 h-4" />, isSection: true },
  { name: 'Projects', href: '#projects', icon: <BookOpen className="w-4 h-4" />, isSection: true },
  { name: 'Arsenal', href: '#skills', icon: <Briefcase className="w-4 h-4" />, isSection: true },
  { name: 'Timeline', href: '#experience', icon: <GraduationCap className="w-4 h-4" />, isSection: true },
  { name: 'Activity', href: '#activity', icon: <Activity className="w-4 h-4" />, isSection: true },
  { name: 'Contact', href: '#contact', icon: <Mail className="w-4 h-4" />, isSection: true },
];

// ─── Shared hook ─────────────────────────────────────────────────────────────
// Tracks which section is currently most visible in the viewport.
// Works purely from scroll — no button clicks needed.
function useActiveSection(items: NavItem[]) {
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const sectionItems = items.filter(i => i.isSection);
    if (!sectionItems.length) return;

    const ratios = new Map<string, number>();
    let observers: IntersectionObserver[] = [];

    const attach = () => {
      // Disconnect any previous observers first
      observers.forEach(o => o.disconnect());
      observers = [];

      const pickWinner = () => {
        let best = { href: null as string | null, ratio: 0 };
        ratios.forEach((ratio, href) => {
          if (ratio > best.ratio) best = { href, ratio };
        });
        if (best.href) setActiveHref(best.href);
      };

      sectionItems.forEach(item => {
        if (!item.href.startsWith('#')) return; // Skip non-ID links
        const el = document.querySelector(item.href);
        if (!el) return; // skip missing sections — they may not be mounted yet

        ratios.set(item.href, 0);

        const observer = new IntersectionObserver(
          ([entry]) => {
            ratios.set(item.href, entry.intersectionRatio);
            pickWinner();
          },
          {
            threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
            rootMargin: '0px',
          }
        );

        observer.observe(el);
        observers.push(observer);
      });
    };

    // Initial attach — delayed so lazy-mounted sections (like ContributionGraph)
    // have time to render their DOM before we query for them
    const timer = setTimeout(attach, 300);

    return () => {
      clearTimeout(timer);
      observers.forEach(o => o.disconnect());
    };
  }, [items]);

  return { activeHref, setActiveHref };
}

// ─── Desktop side drawer ──────────────────────────────────────────────────────
export function QuickNav({ items = defaultItems }: QuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeHref, setActiveHref } = useActiveSection(items);

  const scrollTo = useCallback((href: string) => {
    if (!href.startsWith('#')) return;
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setActiveHref(href);
    setIsOpen(false);
  }, [setActiveHref]);

  return (
    <div className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="relative flex items-center pointer-events-auto">
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.button
                key="open"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                onClick={() => setIsOpen(true)}
                className="bg-card border-l border-y border-border/50 p-3 pr-2 rounded-l-2xl shadow-lg hover:bg-muted/50 transition-colors group cursor-pointer"
              >
                <PixelArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
              </motion.button>
            ) : (
              <motion.div
                key="card"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="relative flex items-center"
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute left-0 -translate-x-full bg-card border-l border-y border-border/50 p-3 pr-2 rounded-l-2xl shadow-xl hover:bg-muted/50 transition-colors group z-20 cursor-pointer"
                >
                  <PixelArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="bg-card border border-border/50 rounded-l-3xl p-6 shadow-2xl min-w-[220px]">
                  <div className="flex flex-col gap-1">
                    {items.map((item) => {
                      const isActive = activeHref === item.href;
                      const LinkComponent = item.isSection ? 'a' : Link;
                      return (
                        <LinkComponent
                          key={item.name}
                          href={item.href}
                          onClick={(e) => {
                            if (item.isSection && item.href.startsWith('#')) {
                              e.preventDefault();
                              scrollTo(item.href);
                            }
                          }}
                          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group cursor-pointer
                            ${isActive ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
                        >
                          {/* Active indicator dot */}
                          <div className="relative flex items-center justify-center">
                            {isActive && (
                              <span className="absolute -left-2 w-1 h-4 rounded-full bg-primary" />
                            )}
                            <div className={`transition-colors group-hover:scale-110 duration-300
                              ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                              {item.icon}
                            </div>
                          </div>
                          <span className={`text-sm font-heading font-bold transition-colors
                            ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                            {item.name}
                          </span>
                        </LinkComponent>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile radial arc nav ────────────────────────────────────────────────────
export function MobileBottomNav({ items = defaultItems }: QuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const { activeHref, setActiveHref } = useActiveSection(items);

  // Close on outside tap — delayed so the opening tap doesn't immediately close
  useEffect(() => {
    if (!isOpen) return;
    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: TouchEvent) => {
      const nav = document.getElementById('mobile-arc-nav');
      if (nav?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    timer = setTimeout(() => {
      document.addEventListener('touchstart', handler, { passive: true });
    }, 300);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', handler);
    };
  }, [isOpen]);

  const TRIGGER_SIZE = 56;
  const ITEM_SIZE = 44;
  const RADIUS = 95;

  const getArcStyle = (index: number, total: number): React.CSSProperties => {
    const spreadDeg = 170;
    const startDeg = -(90 + spreadDeg / 2);
    const step = spreadDeg / (total - 1);
    const angleDeg = startDeg + step * index;
    const angleRad = (angleDeg * Math.PI) / 180;
    const cx = TRIGGER_SIZE / 2 - ITEM_SIZE / 2;
    const cy = TRIGGER_SIZE / 2 - ITEM_SIZE / 2;
    return {
      left: cx + Math.cos(angleRad) * RADIUS,
      top: cy + Math.sin(angleRad) * RADIUS,
    };
  };

  const scrollTo = useCallback((href: string) => {
    if (!href.startsWith('#')) return;
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setActiveHref(href);
    setIsOpen(false);
  }, [setActiveHref]);

  return (
    <div id="mobile-arc-nav" className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">

      {/* Hovered/active label badge */}
      <AnimatePresence>
        {isOpen && (hoveredLabel ?? activeHref) && (
          <motion.div
            key={hoveredLabel ?? activeHref}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-ctp-surface0 text-ctp-mauve text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-ctp-surface2 whitespace-nowrap pointer-events-none"
          >
            {hoveredLabel ?? items.find(i => i.href === activeHref)?.name}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative" style={{ width: TRIGGER_SIZE, height: TRIGGER_SIZE }}>

        {/* Arc items */}
        <AnimatePresence>
          {isOpen && items.map((item, i) => {
            const pos = getArcStyle(i, items.length);
            const isActive = activeHref === item.href;
            return (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: i * 0.045, type: 'spring', stiffness: 420, damping: 26 }
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  transition: { delay: (items.length - 1 - i) * 0.03, duration: 0.18 }
                }}
                style={{ position: 'absolute', width: ITEM_SIZE, height: ITEM_SIZE, ...pos }}
                onClick={(e) => { 
                  if (item.isSection && item.href.startsWith('#')) {
                    e.preventDefault(); 
                    scrollTo(item.href); 
                  }
                }}
                onPointerEnter={() => setHoveredLabel(item.name)}
                onPointerLeave={() => setHoveredLabel(null)}
                className={`rounded-full flex items-center justify-center border transition-colors duration-200 shadow-md
                  ${isActive
                    ? 'bg-ctp-mauve border-ctp-mauve text-ctp-base'
                    : 'bg-ctp-mantle border-ctp-surface1 text-ctp-subtext1 active:border-ctp-mauve active:text-ctp-mauve'
                  }`}
              >
                {item.icon}

                {/* Active dot indicator */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ctp-mauve border border-ctp-mantle" />
                )}
              </motion.a>
            );
          })}
        </AnimatePresence>

        {/* Trigger — shows active section icon when closed */}
        <motion.button
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          onClick={(e) => { e.stopPropagation(); setIsOpen(p => !p); }}
          style={{ width: TRIGGER_SIZE, height: TRIGGER_SIZE }}
          className="absolute top-0 left-0 rounded-full bg-ctp-mauve text-ctp-base flex items-center justify-center shadow-lg shadow-ctp-mauve/25 active:scale-95 transition-[transform] cursor-pointer z-10"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.button>
      </div>

      {/* Closed-state active section label — sits BELOW the trigger button */}
      <AnimatePresence>
        {!isOpen && activeHref && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-ctp-mauve/60 whitespace-nowrap pointer-events-none uppercase tracking-widest"
          >
            {items.find(i => i.href === activeHref)?.name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}