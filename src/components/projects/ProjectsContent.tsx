"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/home/ProjectCard";
import { ProjectPreviewModal } from "@/components/home/ProjectPreviewModal";
import { projects, Project } from "@/data/portfolio";
import { motion } from "motion/react";
import { PixelArrowLeft } from "@/components/icons/PixelArrowLeft";
import Link from "next/link";
import { QuickNav, MobileBottomNav, NavItem } from "@/components/layout/QuickNav";
import { DiamondDivider } from "@/components/layout/DiamondDivider";
import { Home, Target, Globe, Cpu } from "lucide-react";

export function ProjectsContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const stats = {
    total: projects.length,
    web: projects.filter(p => p.type === 'web').length,
    native: projects.filter(p => p.type === 'native').length,
    uniqueTags: Array.from(new Set(projects.flatMap(p => p.tags))).length
  };

  const projectsNavItems: NavItem[] = [
    { name: 'Home', href: '/', icon: <Home className="w-4 h-4" />, isSection: false },
    { name: 'Arsenal', href: '#arsenal', icon: <Target className="w-4 h-4" />, isSection: true },
    { name: 'Web', href: '#web-nodes', icon: <Globe className="w-4 h-4" />, isSection: true },
    { name: 'Native', href: '#native-nodes', icon: <Cpu className="w-4 h-4" />, isSection: true },
  ];

  const webProjects = projects.filter(p => p.type === 'web');
  const nativeProjects = projects.filter(p => p.type === 'native');

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <QuickNav items={projectsNavItems} />
      <MobileBottomNav items={projectsNavItems} />

      {/* Header / Arsenal Section */}
      <section id="arsenal" className="bg-[var(--section-1)] pt-32 pb-24 px-6 relative z-0">
        {/* Background Technical Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#cba6f7 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col gap-12">
            <Link
              href="/"
              className="group flex items-center gap-2 text-muted-foreground hover:text-ctp-mauve transition-all w-fit px-4 py-2 bg-ctp-surface0/50 rounded-full border border-border/30 backdrop-blur-sm"
            >
              <PixelArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Return to Base</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-end">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-0.5 w-8 md:w-12 bg-ctp-mauve" />
                  <span className="font-mono text-[10px] md:text-xs font-bold text-ctp-mauve uppercase tracking-[0.2em] md:tracking-[0.3em]">Full Archive</span>
                </div>
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-foreground font-heading tracking-tighter uppercase italic leading-[0.85] md:leading-[0.8]">
                  Technical <br />
                  <span className="text-ctp-mauve">Arsenal</span>
                </h1>
              </div>

              {/* Archive Intelligence Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6 bg-ctp-surface0/30 border border-border/20 rounded-2xl md:rounded-[2rem] backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black font-heading text-ctp-mauve">{stats.total}</span>
                  <span className="text-[8px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Total Nodes</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black font-heading text-ctp-sky">{stats.web}</span>
                  <span className="text-[8px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Web Systems</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black font-heading text-ctp-peach">{stats.native}</span>
                  <span className="text-[8px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Native Core</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black font-heading text-ctp-green">{stats.uniqueTags}</span>
                  <span className="text-[8px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Tech Stacks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DiamondDivider color="ctp-sky" />

      {/* Web Systems Section */}
      <section id="web-nodes" className="bg-[var(--section-2)] py-24 px-6 relative z-0">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black font-heading uppercase tracking-tighter text-ctp-sky">01_Web_Systems</h2>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Distributed Frontend & Backend Architectures</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {webProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DiamondDivider color="ctp-peach" />

      {/* Native Core Section */}
      <section id="native-nodes" className="bg-[var(--section-3)] py-24 px-6 relative z-0">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black font-heading uppercase tracking-tighter text-ctp-peach">02_Native_Core</h2>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">System Internals, C++, & Low-Level Logic</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {nativeProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ProjectPreviewModal
        key={selectedProject?.id || 'none'}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}
