"use client";

import dynamic from "next/dynamic";
import { QuickNav, MobileBottomNav } from "@/components/layout/QuickNav";
import { Hero } from "@/components/home/Hero";
import { DiamondDivider } from "@/components/layout/DiamondDivider";
import { SectionPlaceholder } from "@/components/layout/SectionPlaceholder";
import { useTerminal } from "@/context/TerminalContext";

const ProjectGrid = dynamic(
  () => import("@/components/home/ProjectGrid").then((mod) => mod.ProjectGrid),
  { ssr: false, loading: () => <SectionPlaceholder /> },
);

const SkillsSection = dynamic(
  () =>
    import("@/components/home/SkillsSection").then((mod) => mod.SkillsSection),
  { ssr: false, loading: () => <SectionPlaceholder /> },
);

const ExperienceTimeline = dynamic(
  () =>
    import("@/components/home/ExperienceTimeline").then(
      (mod) => mod.ExperienceTimeline,
    ),
  { ssr: false, loading: () => <SectionPlaceholder /> },
);

const ContributionGraph = dynamic(
  () =>
    import("@/components/home/ContributionGraph").then(
      (mod) => mod.ContributionGraph,
    ),
  { ssr: false, loading: () => <SectionPlaceholder /> },
);

const ContactSection = dynamic(
  () =>
    import("@/components/home/ContactSection").then(
      (mod) => mod.ContactSection,
    ),
  { ssr: false, loading: () => <SectionPlaceholder /> },
);

export function HomeContent() {
  const { recruiterMode } = useTerminal();

  if (recruiterMode) {
    return (
      <main className="flex flex-col min-h-screen bg-background overflow-x-hidden transition-colors duration-500">
        {/* Hero / Summary (Header) */}
        <div className="bg-(--section-1) relative">
          <Hero />
        </div>

        <hr className="border-border/50 max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-12 lg:px-20" />

        {/* Experience Timeline first */}
        <div className="bg-(--section-4) relative">
          <ExperienceTimeline />
        </div>

        <hr className="border-border/50 max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-12 lg:px-20" />

        {/* Projects second */}
        <div className="bg-(--section-2) relative">
          <ProjectGrid />
        </div>

        <hr className="border-border/50 max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-12 lg:px-20" />

        {/* Skills third */}
        <div className="bg-(--section-3) relative">
          <SkillsSection />
        </div>

        <hr className="border-border/50 max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-12 lg:px-20" />

        {/* Contact last */}
        <div className="bg-(--section-6) relative">
          <ContactSection />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <QuickNav />
      <MobileBottomNav />

      {/* Hero — base background */}
      <div className="bg-(--section-1) relative">
        <Hero />
      </div>

      <DiamondDivider color="ctp-lavender" />

      {/* Projects — mantle tint */}
      <div className="bg-(--section-2) relative">
        <ProjectGrid />
      </div>

      <DiamondDivider color="ctp-mauve" />

      {/* Skills — slight purple tint */}
      <div className="bg-(--section-3) relative">
        <SkillsSection />
      </div>

      <DiamondDivider color="ctp-peach" />

      {/* Timeline — blue tint */}
      <div className="bg-(--section-4) relative">
        <ExperienceTimeline />
      </div>

      <DiamondDivider color="ctp-yellow" />

      {/* Activity — near-base */}
      <div className="bg-(--section-5) relative">
        <ContributionGraph />
      </div>

      <DiamondDivider color="ctp-green" />

      {/* Contact — cool tint */}
      <div className="bg-(--section-6) relative">
        <ContactSection />
      </div>
    </main>
  );
}
