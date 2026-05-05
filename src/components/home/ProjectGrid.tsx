"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectPreviewModal } from "./ProjectPreviewModal";
import { projects, Project } from "@/data/portfolio";
import { motion } from "motion/react";
import { PixelArrowRight } from "@/components/icons/PixelArrowRight";
import Link from "next/link";

export function ProjectGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Show only top 3 on home page
  const featuredProjects = projects.slice(0, 3);

  return (
    <section id="projects" className="w-full py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-7xl font-black text-foreground font-heading tracking-tight">
              Project <span className="text-ctp-sky italic">Manifest</span>
            </h2>
            <div className="h-1.5 w-32 bg-ctp-sky/30 rounded-full" />
          </div>
          
          <Link 
            href="/projects"
            className="group flex items-center gap-3 px-6 py-3 bg-ctp-surface0 hover:bg-ctp-surface1 border border-border/50 rounded-xl transition-all"
          >
            <span className="font-mono text-sm font-bold uppercase tracking-widest">View Full Archive</span>
            <PixelArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProjectCard 
                project={project} 
                onClick={() => setSelectedProject(project)} 
              />
            </motion.div>
          ))}
          
          {/* Placeholder for "Coming Soon" or Empty Slots to fill the grid look */}
          {[...Array(Math.max(0, 3 - featuredProjects.length))].map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="aspect-square bg-ctp-surface0/30 border-2 border-dashed border-ctp-surface2 rounded-2xl flex items-center justify-center opacity-40"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Empty Slot</span>
            </div>
          ))}
        </div>

        <ProjectPreviewModal 
          key={selectedProject?.id || 'none'}
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      </div>
    </section>
  );
}
