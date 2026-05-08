"use client";

import { useSyncExternalStore } from "react";
import { m, Variants } from "motion/react";
import { Project } from "@/data/portfolio";
import { PixelGitHub } from "@/components/icons/PixelGitHub";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  className?: string;
}

export function ProjectCard({ project, onClick, className }: ProjectCardProps) {
  // Safe media query hook using useSyncExternalStore to avoid cascading renders
  const isMobile = useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia("(max-width: 768px)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia("(max-width: 768px)").matches,
    () => false, // Server-side default
  );

  const containerVariants: Variants = {
    initial: {},
    hover: {},
  };

  const contentVariants: Variants = {
    initial: { x: 40, opacity: 0 },
    hover: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <m.div
      onClick={onClick}
      data-cursor="crosshair"
      variants={containerVariants}
      initial={isMobile ? "hover" : "initial"}
      whileHover="hover"
      animate={isMobile ? "hover" : "initial"}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-[2rem] border-4 border-ctp-surface2 shadow-2xl bg-ctp-mantle aspect-square",
        className,
      )}
      whileTap={{ scale: 0.98 }}
    >
      {/* Main Screenshot Background */}
      {project.screenshots && project.screenshots[0] ? (
        <m.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${project.screenshots[0]})`,
            willChange: "transform",
          }}
          variants={{
            initial: { scale: 1 },
            hover: { scale: 1.1 },
          }}
          transition={{ duration: 0.7 }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-ctp-surface0">
          <div className="text-ctp-surface2 opacity-20 transform -rotate-12">
            <PixelGitHub className="w-48 h-48" />
          </div>
        </div>
      )}

      {/* Dark Overlay Gradient */}
      <m.div
        className="absolute inset-0 bg-linear-to-t from-ctp-base via-ctp-base/40 to-transparent"
        variants={{
          initial: { opacity: 0.6 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Slide-in Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8 overflow-hidden">
        <m.div
          variants={contentVariants}
          className={cn(
            "space-y-3 p-4 md:p-6 rounded-2xl md:bg-transparent transition-colors duration-500",
            "bg-ctp-base/60 backdrop-blur-md border border-white/5 md:border-0 md:backdrop-blur-none", // Mobile default
            "group-hover:md:bg-ctp-base/40 group-hover:md:backdrop-blur-md group-hover:md:border group-hover:md:border-white/5", // Desktop hover
          )}
        >
          <div className="space-y-1">
            <h3
              className={cn(
                "font-heading font-black text-xl text-ctp-mauve uppercase tracking-tighter italic leading-none",
                project.title.length > 20
                  ? "md:text-2xl"
                  : project.title.length > 12
                    ? "md:text-3xl"
                    : "md:text-4xl",
              )}
            >
              {project.title}
            </h3>
            <div className="h-1.5 w-16 bg-ctp-mauve rounded-full" />
          </div>

          <p className="text-xs md:text-base font-mono text-ctp-text leading-relaxed line-clamp-2 md:line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1 md:pt-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 md:px-2.5 md:py-1 bg-ctp-mauve/10 border border-ctp-mauve/30 rounded-lg font-mono text-[9px] md:text-xs uppercase text-ctp-mauve font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        </m.div>
      </div>

      {/* Top Badge (Always visible) */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-1 bg-ctp-base/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-ctp-green animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-ctp-text uppercase tracking-widest">
            {project.id}
          </span>
        </div>
      </div>
    </m.div>
  );
}
