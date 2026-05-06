"use client";

import { m } from "motion/react";
import { experiences, education, clubs } from "@/data/portfolio";
import { PixelCalendarIcon } from "@/components/icons/PixelCalendarIcon";
import { Briefcase, GraduationCap, Users } from "lucide-react";

export function ExperienceTimeline() {
  // Combine and sort
  const allMilestones = [
    ...experiences.map((e) => ({ ...e, type: "work" })),
    ...education.map((ed) => ({ ...ed, type: "education" })),
    ...clubs.map((c) => ({ ...c, type: "club", company: c.organization })),
  ];

  return (
    <section
      id="experience"
      className="w-full py-24 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start mb-16 space-y-4 text-left">
          <h2 className="text-4xl md:text-7xl font-black text-foreground font-heading tracking-tight">
            Career <span className="text-ctp-peach italic">Log</span>
          </h2>
          <div className="h-1.5 w-32 bg-ctp-peach/30 rounded-full" />
        </div>

        <div className="relative space-y-12">
          {/* The Vertical Line - Now visible on mobile */}
          <div className="absolute left-6 md:left-1/2 top-2 bottom-2 w-0.5 bg-border/40 -translate-x-1/2 block" />

          {allMilestones.map((item, idx) => (
            <m.div
              key={item.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* The Node Point */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-ctp-base border-4 border-ctp-peach md:-translate-x-1/2 z-10" />

              {/* Content Card */}
              <div
                className={`w-full md:w-1/2 pl-16 md:pl-0 ${
                  idx % 2 === 0
                    ? "md:pr-12 md:text-right"
                    : "md:pl-12 md:text-left"
                }`}
              >
                <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl hover:border-ctp-peach/50 transition-colors group">
                  <div
                    className={`flex items-center gap-3 mb-2 ${idx % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}
                  >
                    <span className="p-2 bg-ctp-surface0 rounded-lg text-ctp-peach">
                      {item.type === "work" ? (
                        <Briefcase className="w-4 h-4" />
                      ) : item.type === "education" ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                    </span>
                    <span className="font-mono text-xs font-bold text-ctp-peach uppercase tracking-widest">
                      {item.type === "work"
                        ? "Experience"
                        : item.type === "education"
                          ? "Education"
                          : "Club Activity"}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black font-heading text-foreground group-hover:text-ctp-peach transition-colors">
                    {"role" in item ? item.role : item.degree}
                  </h3>
                  <p className="text-ctp-mauve font-bold text-sm mb-4">
                    {"company" in item ? item.company : item.institution}
                  </p>

                  <div
                    className={`flex items-center gap-2 text-muted-foreground text-xs font-mono mb-4 ${idx % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}
                  >
                    <PixelCalendarIcon className="w-3 h-3" />
                    <span>{item.period}</span>
                    {"grade" in item && item.grade && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-ctp-green font-bold">
                          {item.grade}
                        </span>
                      </>
                    )}
                  </div>

                  {"description" in item && Array.isArray(item.description) && (
                    <ul
                      className={`space-y-2 ${idx % 2 === 0 ? "md:items-end" : "md:items-start"} flex flex-col`}
                    >
                      {item.description.map((bullet, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground leading-relaxed"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Spacer for the other side */}
              <div className="hidden md:block md:w-1/2" />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
