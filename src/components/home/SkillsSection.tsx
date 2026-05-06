"use client";

import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence, Variants } from "motion/react";
import { SkillIcon } from "@/components/icons/SkillIcons";

interface Category {
  title: string;
  skills: string[];
}

const skillCategories: Category[] = [
  { title: "Languages", skills: ["JavaScript", "TypeScript", "C++", "Python"] },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "shadcn/ui", "HTML", "CSS"],
  },
  { title: "Backend", skills: ["Node.js", "Express.js", "tRPC"] },
  { title: "Databases", skills: ["PostgreSQL", "MongoDB", "Redis"] },
  { title: "DevOps & Tools", skills: ["Git", "Docker", "Prisma", "Inngest"] },
  {
    title: "Auth & APIs",
    skills: ["REST APIs", "JWT", "BetterAuth", "Pydantic"],
  },
  { title: "AI", skills: ["RAG", "MCP", "LangChain", "LangGraph"] },
  {
    title: "Core Concepts",
    skills: ["DSA", "Algorithms", "OOP", "System Design", "OS", "DBMS"],
  },
];

export function SkillsSection() {
  // Hoisted so only one can be active at a time (used on mobile too)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      id="skills"
      className="w-full py-24 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start mb-16 space-y-4">
          <h2 className="text-4xl md:text-7xl font-black text-foreground font-heading text-left tracking-tight">
            Technical <span className="text-ctp-mauve italic">Arsenal</span>
          </h2>
          <div className="h-1.5 w-32 bg-primary/30 rounded-full" />
        </div>

        <div className="flex flex-col border-y border-border/30">
          {skillCategories.map((category, idx) => (
            <CategoryRow
              key={category.title}
              category={category}
              index={idx}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryRow({
  category,
  index,
  activeIndex,
  setActiveIndex,
}: {
  category: Category;
  index: number;
  activeIndex: number | null;
  setActiveIndex: (idx: number | null) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isActive = activeIndex === index;

  // Auto-scroll on mobile when this row opens
  useEffect(() => {
    if (isActive) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const timer = setTimeout(() => {
          rowRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isActive]);

  return (
    <div
      ref={rowRef}
      className="relative border-b border-border/20 last:border-0"
    >
      <div
        className="hidden md:block relative overflow-hidden"
        onMouseEnter={() => setActiveIndex(index)}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {/* Keeps the row at least 220px tall, but grows with content */}
        <div className="relative min-h-55 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {!isActive ? (
              <m.div
                key="title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex">
                  {category.title.split("").map((letter, i) => {
                    const letterVariants: Variants = {
                      hidden: { y: -120, opacity: 0 },
                      visible: (i: number) => ({
                        y: 0,
                        opacity: 1,
                        transition: {
                          duration: 0.4,
                          delay: i * 0.03,
                          ease: "easeOut",
                        },
                      }),
                      exit: (i: number) => ({
                        y: -120,
                        opacity: 0,
                        transition: {
                          duration: 0.4,
                          delay: i * 0.03,
                          ease: "easeOut",
                        },
                      }),
                    };

                    return (
                      <m.span
                        key={`${letter}-${i}`}
                        custom={i}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-2xl md:text-5xl font-black font-heading uppercase tracking-[0.2em] text-foreground/80 inline-block"
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </m.span>
                    );
                  })}
                </div>
              </m.div>
            ) : (
              <m.div
                key="skills"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // ← removed absolute + inset-0, now uses normal flow so height grows
                className="relative flex flex-wrap items-center justify-center gap-x-10 md:gap-x-16 gap-y-8 px-12 py-10"
              >
                {category.skills.map((skill, i) => {
                  const skillVariants: Variants = {
                    hidden: { y: 120, opacity: 0 },
                    visible: (i: number) => ({
                      y: 0,
                      opacity: 1,
                      transition: {
                        duration: 0.4,
                        delay: i * 0.05,
                        ease: "easeOut",
                      },
                    }),
                    exit: (i: number) => ({
                      y: 120,
                      opacity: 0,
                      transition: {
                        duration: 0.4,
                        delay: i * 0.05,
                        ease: "easeOut",
                      },
                    }),
                  };

                  return (
                    <m.div
                      key={skill}
                      custom={i}
                      variants={skillVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex flex-col items-center gap-3 md:gap-4 group/skill cursor-default"
                    >
                      <SkillIcon skill={skill} />
                      <span className="text-sm md:text-base font-bold font-mono text-muted-foreground group-hover/skill:text-ctp-mauve transition-colors">
                        {skill}
                      </span>
                    </m.div>
                  );
                })}
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className="absolute inset-0 -z-10 bg-primary/5 transition-opacity duration-400"
          style={{ opacity: isActive ? 1 : 0 }}
        />
      </div>

      <div className="md:hidden">
        {/* Tappable header */}
        <button
          className="w-full flex items-center justify-between px-5 py-5"
          onClick={() => setActiveIndex(isActive ? null : index)}
        >
          <span className="text-lg font-black font-heading uppercase tracking-widest text-foreground/80">
            {category.title}
          </span>
          <m.span
            animate={{ rotate: isActive ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-ctp-mauve text-2xl font-light leading-none"
          >
            +
          </m.span>
        </button>

        {/* Skills drawer */}
        <AnimatePresence initial={false}>
          {isActive && (
            <m.div
              key="mobile-skills"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-8 px-5 pb-8">
                {category.skills.map((skill, i) => (
                  <m.div
                    key={skill}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.04, duration: 0.28 },
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <SkillIcon skill={skill} />
                    <span className="text-[10px] font-bold font-mono text-muted-foreground text-center">
                      {skill}
                    </span>
                  </m.div>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
