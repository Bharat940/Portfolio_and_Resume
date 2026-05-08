"use client";

import { m, useInView } from "motion/react";
import { useRef } from "react";
import { experiences, education, clubs } from "@/data/portfolio";
import { PixelCalendarIcon } from "@/components/icons/PixelCalendarIcon";
import { Briefcase, GraduationCap, Users, ChevronRight } from "lucide-react";

type MilestoneType = "work" | "education" | "club";

interface Milestone {
  id: string;
  type: MilestoneType;
  title: string;
  subtitle: string;
  period: string;
  grade?: string;
  bullets?: string[];
  index: number;
}

const TYPE_CONFIG: Record<
  MilestoneType,
  {
    icon: React.ReactNode;
    label: string;
    accent: string;
    tag: string;
    glowColor: string;
  }
> = {
  work: {
    icon: <Briefcase className="w-3.5 h-3.5" />,
    label: "MISSION",
    accent: "text-ctp-peach",
    tag: "bg-ctp-peach/10 border-ctp-peach/30 text-ctp-peach",
    glowColor: "rgba(250,179,135,0.06)",
  },
  education: {
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    label: "TRAINING",
    accent: "text-ctp-blue",
    tag: "bg-ctp-blue/10 border-ctp-blue/30 text-ctp-blue",
    glowColor: "rgba(137,180,250,0.06)",
  },
  club: {
    icon: <Users className="w-3.5 h-3.5" />,
    label: "UNIT",
    accent: "text-ctp-green",
    tag: "bg-ctp-green/10 border-ctp-green/30 text-ctp-green",
    glowColor: "rgba(166,227,161,0.06)",
  },
};

// Animated number counter for the mission index
function MissionIndex({ index, accent }: { index: number; accent: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <span
      ref={ref}
      className={`font-mono text-[10px] font-bold ${accent} opacity-60`}
    >
      {inView ? `0${index + 1}`.slice(-2) : "00"}
    </span>
  );
}

function MissionCard({ milestone }: { milestone: Milestone }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cfg = TYPE_CONFIG[milestone.type];

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.6,
        delay: milestone.index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
      data-cursor="crosshair"
    >
      {/* Scanline glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${cfg.glowColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative border border-border/30 rounded-2xl overflow-hidden bg-ctp-mantle/40 backdrop-blur-sm hover:border-border/60 transition-colors duration-300">
        {/* Top metadata bar — looks like a file header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-border/20 bg-ctp-crust/30">
          <div className="flex items-center gap-3">
            <MissionIndex index={milestone.index} accent={cfg.accent} />
            <span className="w-px h-3 bg-border/50" />
            <div
              className={`flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest ${cfg.accent}`}
            >
              {cfg.icon}
              {cfg.label}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Animated status dot */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-mono uppercase tracking-widest ${cfg.tag}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              LOGGED
            </span>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
          {/* Left: title block */}
          <div className="p-5 md:p-6 space-y-4">
            <div>
              <h3
                className={`text-xl md:text-2xl font-black font-heading uppercase tracking-tight leading-tight ${cfg.accent}`}
              >
                {milestone.title}
              </h3>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                {milestone.subtitle}
              </p>
            </div>

            {/* Bullet points as "mission objectives" */}
            {milestone.bullets && milestone.bullets.length > 0 && (
              <ul className="space-y-2">
                {milestone.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                  >
                    <ChevronRight
                      className={`w-3.5 h-3.5 mt-1 shrink-0 ${cfg.accent} opacity-70`}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {milestone.grade && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-mono font-bold ${cfg.tag}`}
              >
                GPA / Score: {milestone.grade}
              </div>
            )}
          </div>

          {/* Right: vertical period strip */}
          <div
            className={`hidden md:flex flex-col items-center justify-center px-6 border-l border-border/20 gap-1 bg-ctp-crust/20 min-w-27.5`}
          >
            <PixelCalendarIcon
              className={`w-4 h-4 ${cfg.accent} opacity-50 mb-2`}
            />
            {milestone.period.split(" - ").map((p, i) => (
              <span
                key={i}
                className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center leading-tight"
              >
                {p}
              </span>
            ))}
            {/* Vertical text label */}
            <span
              className={`font-mono text-[8px] uppercase tracking-[0.3em] opacity-30 mt-3 ${cfg.accent}`}
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
            >
              PERIOD
            </span>
          </div>
        </div>

        {/* Mobile period bar */}
        <div className="md:hidden flex items-center gap-2 px-5 pb-4">
          <PixelCalendarIcon
            className={`w-3.5 h-3.5 ${cfg.accent} opacity-50`}
          />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {milestone.period}
          </span>
          {milestone.grade && (
            <>
              <span className="text-border/60">·</span>
              <span className={`text-[10px] font-mono font-bold ${cfg.accent}`}>
                {milestone.grade}
              </span>
            </>
          )}
        </div>

        {/* Bottom scan line — subtle decoration */}
        <m.div
          className={`h-px w-0 group-hover:w-full transition-none`}
          initial={{ width: 0 }}
          animate={inView ? { width: "100%" } : {}}
          transition={{
            duration: 0.8,
            delay: milestone.index * 0.08 + 0.4,
            ease: "easeOut",
          }}
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.glowColor.replace("0.06", "0.5")}, transparent)`,
          }}
        />
      </div>
    </m.div>
  );
}

export function ExperienceTimeline() {
  const allMilestones: Milestone[] = [
    ...experiences.map((e, i) => ({
      id: e.id,
      type: "work" as MilestoneType,
      title: `${e.role} @ ${e.company}`,
      subtitle: e.company,
      period: e.period,
      bullets: e.description,
      index: i,
    })),
    ...clubs.map((c, i) => ({
      id: c.id,
      type: "club" as MilestoneType,
      title: `${c.role} @ ${c.organization}`,
      subtitle: c.organization,
      period: c.period,
      bullets: c.description,
      index: experiences.length + i,
    })),
    ...education.map((ed, i) => ({
      id: ed.id,
      type: "education" as MilestoneType,
      title: ed.degree,
      subtitle: ed.institution,
      period: ed.period,
      grade: ed.grade,
      index: experiences.length + clubs.length + i,
    })),
  ];

  return (
    <section
      id="experience"
      className="w-full py-24 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <m.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start mb-16 space-y-4"
        >
          {/* File classification tag */}
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/50">
            <span className="w-6 h-px bg-ctp-peach/40" />
            Classified Archive
            <span className="w-6 h-px bg-ctp-peach/40" />
          </div>

          <h2
            data-cursor="focus"
            className="text-4xl md:text-7xl font-black text-foreground font-heading tracking-tight leading-none"
          >
            Career <span className="text-ctp-peach italic">Log</span>
          </h2>

          {/* Animated progress bar */}
          <m.div
            className="h-px bg-ctp-peach/20 w-full max-w-xs relative"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ transformOrigin: "left" }}
          >
            <m.div
              className="absolute left-0 top-0 h-full bg-ctp-peach/60"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              style={{ transformOrigin: "left", width: "40%" }}
            />
          </m.div>

          <p className="text-xs font-mono text-muted-foreground/40 uppercase tracking-[0.25em]">
            {allMilestones.length} entries · Mission-critical Intel
          </p>
        </m.div>

        {/* Mission cards — stacked, full width, no zigzag */}
        <div className="flex flex-col gap-4 md:gap-5">
          {allMilestones.map((milestone) => (
            <MissionCard key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>
    </section>
  );
}
