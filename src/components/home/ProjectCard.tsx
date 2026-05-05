"use client";

import { motion, Variants } from "motion/react";
import { Project } from "@/data/portfolio";
import { PixelGitHub } from "@/components/icons/PixelGitHub";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  className?: string;
}

export function ProjectCard({ project, onClick, className }: ProjectCardProps) {
  const containerVariants: Variants = {
    initial: {},
    hover: {}
  };

  const contentVariants: Variants = {
    initial: { x: 100, opacity: 0 },
    hover: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        delay: 0.1 
      }
    }
  };

  return (
    <motion.div
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      animate="initial"
      className={cn("group relative cursor-pointer overflow-hidden rounded-[2rem] border-4 border-ctp-surface2 shadow-2xl bg-ctp-mantle aspect-square", className)}
      variants={containerVariants}
      whileTap={{ scale: 0.98 }}
    >
      {/* Main Screenshot Background */}
      {project.screenshots && project.screenshots[0] ? (
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.screenshots[0]})` }}
          variants={{
            initial: { scale: 1 },
            hover: { scale: 1.1 }
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
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-ctp-base via-ctp-base/20 to-transparent"
        variants={{
          initial: { opacity: 0.4 },
          hover: { opacity: 0.9 }
        }}
      />

      {/* Slide-in Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 overflow-hidden">
        <motion.div 
          variants={contentVariants}
          className="space-y-3"
        >
          <div className="space-y-1">
            <h3 className="font-heading font-black text-2xl md:text-4xl text-ctp-mauve uppercase tracking-tighter italic leading-none">
              {project.title}
            </h3>
            <div className="h-1.5 w-16 bg-ctp-mauve rounded-full" />
          </div>
          
          <p className="text-sm md:text-base font-mono text-ctp-text leading-relaxed line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-ctp-mauve/10 border border-ctp-mauve/30 rounded-lg font-mono text-[10px] md:text-xs uppercase text-ctp-mauve font-bold">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Badge (Always visible) */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-1 bg-ctp-base/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-ctp-green animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-ctp-text uppercase tracking-widest">{project.id}</span>
        </div>
      </div>
    </motion.div>
  );
}
