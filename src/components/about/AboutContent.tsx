"use client";

import React from "react";
import Image from "next/image";
import { m } from "motion/react";
import { PixelTerminal } from "@/components/icons/PixelTerminal";
import { PixelGitHub } from "@/components/icons/PixelGitHub";
import { PixelLinkedIn } from "@/components/icons/PixelLinkedIn";
import { PixelFileText } from "@/components/icons/PixelFileText";
import { PixelMapPin } from "@/components/icons/PixelMapPin";
import { Mail, Download, Home, User, FileText, Share2 } from "lucide-react";
import {
  QuickNav,
  MobileBottomNav,
  NavItem,
} from "@/components/layout/QuickNav";
import { DiamondDivider } from "@/components/layout/DiamondDivider";

const skillsWithLogos = [
  { name: "TypeScript", logo: "TypeScript_Pixel_Logo.png" },
  { name: "JavaScript", logo: "JavaScript_Pixel_Logo.png" },
  { name: "C++", logo: "C++_Pixel_Logo.png" },
  { name: "Python", logo: "Python_Pixel_Logo.png" },
  { name: "React", logo: "React_Pixel_Logo.png" },
  { name: "Next.js", logo: "Next.js_Pixel_Logo.png" },
  { name: "Node.js", logo: "Node.js_Pixel_Logo.png" },
  { name: "PostgreSQL", logo: "PostgreSQL_Pixel_Logo.png" },
  { name: "MongoDB", logo: "MongoDB_Pixel_Logo.png" },
  { name: "Redis", logo: "Redis_Pixel_Logo.png" },
  { name: "Docker", logo: "Docker_Pixel_Logo.png" },
  { name: "Prisma", logo: "Prisma_Pixel_Logo.png" },
  { name: "tRPC", logo: "tRPC_Pixel_Logo.png" },
  { name: "Tailwind", logo: "Tailwind CSS_Pixel_Logo.png" },
  { name: "shadcn/ui", logo: "shadcnui_Pixel_Logo.png" },
];

const aboutNavItems: NavItem[] = [
  {
    name: "Back",
    href: "/",
    icon: <Home className="w-4 h-4" />,
    isSection: false,
  },
  {
    name: "Philosophy",
    href: "#philosophy",
    icon: <User className="w-4 h-4" />,
    isSection: true,
  },
  {
    name: "Origin",
    href: "#origin",
    icon: <PixelTerminal className="w-4 h-4" />,
    isSection: true,
  },
  {
    name: "CV",
    href: "#cv",
    icon: <FileText className="w-4 h-4" />,
    isSection: true,
  },
];

export function AboutContent() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <QuickNav items={aboutNavItems} />
      <MobileBottomNav items={aboutNavItems} />

      {/* Philosophy Section */}
      <section
        id="philosophy"
        className="bg-(--section-1) min-h-dvh flex flex-col justify-center px-6 md:px-12 lg:px-20 relative z-0"
      >
        <div className="max-w-7xl mx-auto w-full">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8 md:gap-12"
            style={{
              paddingTop: "clamp(100px, 15vw, 120px)",
              paddingBottom: "40px",
            }}
          >
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-ctp-green/10 border border-ctp-green/20 text-ctp-green font-mono text-[10px] uppercase tracking-widest w-fit backdrop-blur-md">
                <PixelTerminal className="w-3.5 h-3.5" />
                Entity Profile: Bharat Dangi
              </div>
              <h1
                data-cursor="focus"
                className="text-5xl md:text-8xl lg:text-9xl font-black text-foreground font-heading tracking-tighter uppercase leading-[0.85] italic"
              >
                Technical <br />
                <span className="text-ctp-green">Philosophy</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
                I bridge the gap between low-level efficiency and distributed
                system architecture. Currently focused on crafting
                high-performance full-stack solutions with Next.js and C++.
              </p>
            </div>
          </m.div>
        </div>
      </section>

      <DiamondDivider color="ctp-green" />

      {/* Origin Section */}
      <section
        id="origin"
        className="bg-(--section-2) py-24 px-6 md:px-12 lg:px-20 relative z-0"
      >
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <h2
                    data-cursor="focus"
                    className="text-3xl font-black font-heading flex items-center gap-4 uppercase tracking-tight"
                  >
                    <span className="w-12 h-1 bg-ctp-green rounded-full" />
                    Origin Sequence
                  </h2>
                  <p className="text-sm font-mono text-ctp-green uppercase tracking-[0.3em]">
                    Init: 2026_Core_Boot
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    My engineering journey is defined by a relentless curiosity
                    for system internals. From implementing
                    <span className="text-foreground font-bold">
                      {" "}
                      anti-aliasing and light scattering
                    </span>{" "}
                    in a custom CPU-based Ray Tracer to engineering{" "}
                    <span className="text-foreground font-bold">
                      fault-tolerant async processing
                    </span>
                    at scale, I view every project as a distributed puzzle.
                  </p>
                </div>
                <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    I thrive in the space where{" "}
                    <span className="text-ctp-blue italic">
                      concurrency meets consistency
                    </span>
                    . My focus remains on designing systems that are not just
                    visually stunning, but mathematically sound and
                    production-ready.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-12 border-t border-border/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <PixelMapPin className="w-5 h-5 text-ctp-green" />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      Base_Ops
                    </span>
                  </div>
                  <p className="text-xl font-bold">Bhopal, India</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-ctp-green animate-pulse" />
                    <span className="text-[10px] font-mono text-ctp-green uppercase font-bold tracking-widest">
                      Active_Available
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-ctp-blue" />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      Sync_Links
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a
                      href="https://github.com/Bharat940"
                      target="_blank"
                      className="group flex items-center gap-3 p-4 bg-ctp-surface0/30 border border-border/30 rounded-2xl hover:bg-ctp-surface1 transition-all"
                    >
                      <PixelGitHub className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold font-mono">
                        GitHub
                      </span>
                    </a>
                    <a
                      href="https://linkedin.com/in/bharat-dangi-b186b3248"
                      target="_blank"
                      className="group flex items-center gap-3 p-4 bg-ctp-surface0/30 border border-border/30 rounded-2xl hover:bg-ctp-surface1 transition-all"
                    >
                      <PixelLinkedIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold font-mono">
                        LinkedIn
                      </span>
                    </a>
                    <a
                      href="mailto:bdangi450@gmail.com"
                      className="group flex items-center gap-3 p-4 bg-ctp-surface0/30 border border-border/30 rounded-2xl hover:bg-ctp-surface1 transition-all"
                    >
                      <Mail className="w-4 h-4 text-ctp-peach" />
                      <span className="text-[10px] font-bold font-mono italic truncate">
                        bdangi450@gmail.com
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      <DiamondDivider color="ctp-mauve" />

      {/* Curriculum Vitae Section */}
      <section
        id="cv"
        className="bg-(--section-3) py-24 px-6 md:px-12 lg:px-20 relative z-0"
      >
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/30 border border-border/50 rounded-3xl p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <PixelFileText className="w-32 h-32" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black font-heading tracking-tight mb-2 uppercase">
                  Curriculum Vitae
                </h2>
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                  Distributed Core
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/Bharat_Dangi_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-ctp-surface0 text-foreground border border-border/50 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-ctp-surface1 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  View CV
                </a>
                <a
                  href="/Bharat_Dangi_Resume.pdf"
                  download="Bharat_Dangi_Resume.pdf"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-ctp-green text-background rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-ctp-green/20"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>

            <div className="space-y-12">
              {/* Experience Block */}
              <div className="space-y-6">
                <h3 className="text-xs font-mono text-ctp-green uppercase tracking-[0.4em] border-b border-ctp-green/20 pb-2">
                  01_Experience
                </h3>
                <div className="space-y-8">
                  <div className="relative pl-6 border-l-2 border-border/30">
                    <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-ctp-green/20 border-2 border-ctp-green" />
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">
                        Full Stack Intern @ SoundSpire
                      </h4>
                      <span className="text-xs font-mono text-muted-foreground">
                        Aug 2025 - Nov 2025
                      </span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li>
                        Built core features for SoundSpire&apos;s Artist Hub
                        platform, focusing on authentication and onboarding
                        flows.
                      </li>
                      <li>
                        Developed frontend (Next.js), backend endpoints
                        (Node.js), and PostgreSQL schema for Sign-up and
                        Preference Selection.
                      </li>
                      <li>
                        Implemented Google & Email authentication, Sign-out,
                        Forgot password, and preference logic.
                      </li>
                      <li>
                        Integrated Soundcharts API for artist analytics and
                        profile insights.
                      </li>
                      <li>
                        Improved UI/UX in collaboration with design and
                        engineering teams.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education Block */}
              <div className="space-y-6">
                <h3 className="text-xs font-mono text-ctp-blue uppercase tracking-[0.4em] border-b border-ctp-blue/20 pb-2">
                  02_Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <h4 className="font-bold">
                      B.Tech in Information Technology
                    </h4>
                    <p className="text-xs text-muted-foreground uppercase">
                      UIT RGPV · 2024 - 2028
                    </p>
                    <p className="text-sm text-ctp-blue font-mono mt-2">
                      CGPA: 7.94 / 10
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">High School Diploma (PCM)</h4>
                    <p className="text-xs text-muted-foreground uppercase">
                      Deepmala Pagarani School
                    </p>
                    <p className="text-sm text-ctp-blue font-mono mt-2">
                      Score: 91.6%
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Proficiencies */}
              <div className="space-y-6">
                <h3 className="text-xs font-mono text-ctp-mauve uppercase tracking-[0.4em] border-b border-ctp-mauve/20 pb-2">
                  03_Stack_Overflow
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {skillsWithLogos.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex flex-col items-center p-4 bg-ctp-surface0/50 border border-border/30 rounded-xl hover:border-ctp-mauve/50 transition-colors group"
                    >
                      <div className="w-10 h-10 relative mb-3 group-hover:scale-110 transition-transform">
                        <Image
                          src={`/logos/${skill.logo}`}
                          alt={skill.name}
                          fill
                          sizes="40px"
                          className="object-contain image-rendering-pixelated"
                        />
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-tighter text-muted-foreground group-hover:text-foreground transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </section>
    </main>
  );
}
