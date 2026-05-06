"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  Home,
  Briefcase,
  Mail,
  BookOpen,
  GraduationCap,
  Activity,
} from "lucide-react";
import { PixelArrowLeft } from "../icons/PixelArrowLeft";
import { PixelArrowRight } from "../icons/PixelArrowRight";
import { TransitionLink } from "../ui/TransitionLink";

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
  {
    name: "Home",
    href: "#home",
    icon: <Home className="w-4 h-4" />,
    isSection: true,
  },
  {
    name: "Projects",
    href: "#projects",
    icon: <BookOpen className="w-4 h-4" />,
    isSection: true,
  },
  {
    name: "Arsenal",
    href: "#skills",
    icon: <Briefcase className="w-4 h-4" />,
    isSection: true,
  },
  {
    name: "Timeline",
    href: "#experience",
    icon: <GraduationCap className="w-4 h-4" />,
    isSection: true,
  },
  {
    name: "Activity",
    href: "#activity",
    icon: <Activity className="w-4 h-4" />,
    isSection: true,
  },
  {
    name: "Contact",
    href: "#contact",
    icon: <Mail className="w-4 h-4" />,
    isSection: true,
  },
];

function useActiveSection(items: NavItem[]) {
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const sectionItems = items.filter((i) => i.isSection);
    if (!sectionItems.length) return;

    const ratios = new Map<string, number>();
    let observers: IntersectionObserver[] = [];

    const attach = () => {
      observers.forEach((o) => o.disconnect());
      observers = [];

      const pickWinner = () => {
        let best = { href: null as string | null, ratio: 0 };
        ratios.forEach((ratio, href) => {
          if (ratio > best.ratio) best = { href, ratio };
        });
        if (best.href) setActiveHref(best.href);
      };

      sectionItems.forEach((item) => {
        if (!item.href.startsWith("#")) return;
        const el = document.querySelector(item.href);
        if (!el) return;

        ratios.set(item.href, 0);

        const observer = new IntersectionObserver(
          ([entry]) => {
            ratios.set(item.href, entry.intersectionRatio);
            pickWinner();
          },
          {
            threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
            rootMargin: "0px",
          },
        );

        observer.observe(el);
        observers.push(observer);
      });
    };

    const timer = setTimeout(attach, 300);

    return () => {
      clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, [items]);

  return { activeHref, setActiveHref };
}

export function QuickNav({ items = defaultItems }: QuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeHref, setActiveHref } = useActiveSection(items);

  const scrollTo = useCallback(
    (href: string) => {
      if (!href.startsWith("#")) return;
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setActiveHref(href);
      setIsOpen(false);
    },
    [setActiveHref],
  );

  return (
    <div className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="relative flex items-center pointer-events-auto">
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <m.button
                key="open"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                onClick={() => setIsOpen(true)}
                className="bg-card border-l border-y border-border/50 p-3 pr-2 rounded-l-2xl shadow-lg hover:bg-muted/50 transition-colors group cursor-pointer"
              >
                <PixelArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
              </m.button>
            ) : (
              <m.div
                key="card"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="relative flex items-center"
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute left-0 -translate-x-full bg-card border-l border-y border-border/50 p-3 pr-2 rounded-l-2xl shadow-xl hover:bg-muted/50 transition-colors group z-20 cursor-pointer"
                >
                  <PixelArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="bg-card border border-border/50 rounded-l-3xl p-6 shadow-2xl min-w-55">
                  <div className="flex flex-col gap-1">
                    {items.map((item) => {
                      const isActive = activeHref === item.href;
                      const isSection =
                        item.isSection || item.href.startsWith("#");

                      const linkProps = {
                        href: item.href,
                        className: `flex items-center gap-4 px-4 py-3 rounded-xl transition-all group cursor-pointer ${isActive ? "bg-primary/10" : "hover:bg-primary/10"}`,
                      };

                      const content = (
                        <>
                          <div className="relative flex items-center justify-center">
                            {isActive && (
                              <span className="absolute -left-2 w-1 h-4 rounded-full bg-primary" />
                            )}
                            <div
                              className={`transition-colors group-hover:scale-110 duration-300
                              ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
                            >
                              {item.icon}
                            </div>
                          </div>
                          <span
                            className={`text-sm font-heading font-bold transition-colors
                            ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}
                          >
                            {item.name}
                          </span>
                        </>
                      );

                      if (isSection) {
                        return (
                          <a
                            key={item.name}
                            {...linkProps}
                            onClick={(e) => {
                              if (item.href.startsWith("#")) {
                                e.preventDefault();
                                scrollTo(item.href);
                              }
                            }}
                          >
                            {content}
                          </a>
                        );
                      }

                      return (
                        <TransitionLink key={item.name} {...linkProps}>
                          {content}
                        </TransitionLink>
                      );
                    })}
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function MobileBottomNav({ items = defaultItems }: QuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const { activeHref, setActiveHref } = useActiveSection(items);
  const [footerOffset, setFooterOffset] = useState(0);

  const TRIGGER_SIZE = 56;
  const ITEM_SIZE = 44;
  const RADIUS = 95;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: TouchEvent) => {
      const nav = document.getElementById("mobile-arc-nav");
      if (nav?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    const timer = setTimeout(() => {
      document.addEventListener("touchstart", handler, { passive: true });
    }, 300);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("touchstart", handler);
    };
  }, [isOpen]);

  useEffect(() => {
    const checkFooter = () => {
      const footer = document.getElementById("main-footer");
      if (!footer) return;
      const footerTop = footer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const navBottomGap = 24;
      if (footerTop < windowHeight - navBottomGap) {
        const push = Math.max(0, windowHeight - navBottomGap - footerTop);
        setFooterOffset(push);
      } else {
        setFooterOffset(0);
      }
    };
    window.addEventListener("scroll", checkFooter, { passive: true });
    window.addEventListener("resize", checkFooter);
    checkFooter();
    return () => {
      window.removeEventListener("scroll", checkFooter);
      window.removeEventListener("resize", checkFooter);
    };
  }, []);

  const getArcPos = (index: number, total: number) => {
    const spreadDeg = 170;
    const startDeg = -(90 + spreadDeg / 2);
    const step = spreadDeg / (total - 1);
    const angleDeg = startDeg + step * index;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: TRIGGER_SIZE / 2 - ITEM_SIZE / 2 + Math.cos(angleRad) * RADIUS,
      y: TRIGGER_SIZE / 2 - ITEM_SIZE / 2 + Math.sin(angleRad) * RADIUS,
    };
  };

  const scrollTo = useCallback(
    (href: string) => {
      if (!href.startsWith("#")) return;
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setActiveHref(href);
      setIsOpen(false);
    },
    [setActiveHref],
  );

  const centerX = TRIGGER_SIZE / 2 - ITEM_SIZE / 2;
  const centerY = TRIGGER_SIZE / 2 - ITEM_SIZE / 2;

  return (
    <m.div
      id="mobile-arc-nav"
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-100"
      animate={{ y: -footerOffset }}
      transition={{ type: "spring", stiffness: 400, damping: 40, mass: 0.8 }}
    >
      <AnimatePresence>
        {isOpen && (hoveredLabel ?? activeHref) && (
          <m.div
            key={hoveredLabel ?? activeHref}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-ctp-surface0 text-ctp-mauve text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-ctp-surface2 whitespace-nowrap pointer-events-none"
          >
            {hoveredLabel ?? items.find((i) => i.href === activeHref)?.name}
          </m.div>
        )}
      </AnimatePresence>

      <div
        className="relative"
        style={{ width: TRIGGER_SIZE, height: TRIGGER_SIZE }}
      >
        <AnimatePresence>
          {isOpen &&
            items.map((item, i) => {
              const pos = getArcPos(i, items.length);
              const isActive = activeHref === item.href;
              const isSection = item.isSection || item.href.startsWith("#");
              return (
                <m.div
                  key={item.name}
                  initial={{ scale: 0, opacity: 0, x: centerX, y: centerY }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: pos.x,
                    y: pos.y,
                    transition: {
                      delay: i * 0.045,
                      type: "spring",
                      stiffness: 300,
                      damping: 28,
                    },
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    x: centerX,
                    y: centerY,
                    transition: {
                      delay: (items.length - 1 - i) * 0.03,
                      duration: 0.15,
                    },
                  }}
                  style={{
                    position: "absolute",
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                  }}
                >
                  {isSection ? (
                    <a
                      href={item.href}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        if (item.href.startsWith("#")) {
                          e.preventDefault();
                          scrollTo(item.href);
                        }
                      }}
                      onPointerEnter={() => setHoveredLabel(item.name)}
                      onPointerLeave={() => setHoveredLabel(null)}
                      className={`w-full h-full rounded-full flex items-center justify-center border transition-colors duration-200 shadow-md
                      ${isActive ? "bg-ctp-mauve border-ctp-mauve text-ctp-base" : "bg-ctp-mantle border-ctp-surface1 text-ctp-subtext1 active:border-ctp-mauve active:text-ctp-mauve"}`}
                    >
                      {item.icon}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ctp-mauve border border-ctp-mantle" />
                      )}
                    </a>
                  ) : (
                    <TransitionLink
                      href={item.href}
                      onClick={() => { }}
                      className={`w-full h-full rounded-full flex items-center justify-center border transition-colors duration-200 shadow-md
                      ${isActive ? "bg-ctp-mauve border-ctp-mauve text-ctp-base" : "bg-ctp-mantle border-ctp-surface1 text-ctp-subtext1 active:border-ctp-mauve active:text-ctp-mauve"}`}
                    >
                      {item.icon}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ctp-mauve border border-ctp-mantle" />
                      )}
                    </TransitionLink>
                  )}
                </m.div>
              );
            })}
        </AnimatePresence>

        <m.button
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((p) => !p);
          }}
          style={{ width: TRIGGER_SIZE, height: TRIGGER_SIZE }}
          className="absolute top-0 left-0 rounded-full bg-ctp-mauve text-ctp-base flex items-center justify-center shadow-lg shadow-ctp-mauve/25 active:scale-95 transition-[transform] cursor-pointer z-10"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </m.button>
      </div>
    </m.div>
  );
}
