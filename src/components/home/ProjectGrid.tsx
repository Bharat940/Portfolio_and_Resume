"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectPreviewModal } from "./ProjectPreviewModal";
import { projects, Project } from "@/data/portfolio";
import { m } from "motion/react";
import { PixelArrowRight } from "@/components/icons/PixelArrowRight";
import Link from "next/link";
import { trackMetric } from "@/lib/actions/analytics";
import { useTerminal } from "@/context/TerminalContext";

export function ProjectGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { recruiterMode } = useTerminal();

  const featuredProjects = projects.slice(0, 3);

  return (
    <section
      id="projects"
      className="w-full py-24 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div className="space-y-4">
            <div className="overflow-hidden">
              <m.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-7xl font-black text-foreground font-heading tracking-tight leading-none uppercase"
              >
                {recruiterMode ? (
                  "Featured Projects"
                ) : (
                  <>
                    Project{" "}
                    <span className="text-ctp-sky italic">Manifest</span>
                  </>
                )}
              </m.h2>
            </div>
            {!recruiterMode && (
              <m.div
                initial={{ width: 0 }}
                whileInView={{ width: "8rem" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1.5 bg-ctp-sky/30 rounded-full"
              />
            )}
          </div>

          <Link
            href="/projects"
            className="group flex items-center gap-3 px-6 py-3 bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-all"
          >
            <span className="font-mono text-sm font-bold uppercase tracking-widest">
              View Full Archive
            </span>
            <PixelArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {recruiterMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-border/80 rounded-2xl p-6 bg-card shadow-xs flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold font-sans text-foreground">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-md text-[10px] font-sans font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-primary text-primary-foreground border border-primary/20 rounded-lg text-xs font-sans font-bold hover:bg-primary/95 transition-all"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-secondary text-foreground border border-border rounded-lg text-xs font-sans font-bold hover:bg-secondary/80 transition-all"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  {project.bulletPoints ? (
                    <ul className="space-y-1.5 text-sm font-sans text-muted-foreground leading-relaxed pl-1">
                      {project.bulletPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary select-none mt-1 shrink-0">
                            •
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                      {project.longDescription || project.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <m.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => {
                    setSelectedProject(project);
                    trackMetric(`project_click_${project.id}`);
                  }}
                />
              </m.div>
            ))}

            {/* Placeholder for "Coming Soon" or Empty Slots to fill the grid look */}
            {!recruiterMode &&
              [...Array(Math.max(0, 3 - featuredProjects.length))].map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="aspect-square bg-ctp-surface0/30 border-2 border-dashed border-ctp-surface2 rounded-2xl flex items-center justify-center opacity-40"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Empty Slot
                    </span>
                  </div>
                ),
              )}
          </div>
        )}

        <ProjectPreviewModal
          key={selectedProject?.id || "none"}
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
}
