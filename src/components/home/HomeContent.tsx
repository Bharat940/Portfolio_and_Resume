"use client";

import { SkillsSection } from "@/components/home/SkillsSection";
import { ContributionGraph } from "@/components/home/ContributionGraph";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { ContactSection } from "@/components/home/ContactSection";
import { QuickNav, MobileBottomNav } from "@/components/layout/QuickNav";
import { Hero } from "@/components/home/Hero";
import { DiamondDivider } from "@/components/layout/DiamondDivider";

export function HomeContent() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <QuickNav />
      <MobileBottomNav />

      {/* Hero — base background */}
      <div className="bg-[var(--section-1)] relative z-0">
        <Hero />
      </div>

      <DiamondDivider color="ctp-lavender" />

      {/* Projects — mantle tint */}
      <div className="bg-[var(--section-2)] relative z-0">
        <ProjectGrid />
      </div>

      <DiamondDivider color="ctp-mauve" />

      {/* Skills — slight purple tint */}
      <div className="bg-[var(--section-3)] relative z-0">
        <SkillsSection />
      </div>

      <DiamondDivider color="ctp-peach" />

      {/* Timeline — blue tint */}
      <div className="bg-[var(--section-4)] relative z-0">
        <ExperienceTimeline />
      </div>

      <DiamondDivider color="ctp-yellow" />

      {/* Activity — near-base */}
      <div className="bg-[var(--section-5)] relative z-0">
        <ContributionGraph />
      </div>

      <DiamondDivider color="ctp-green" />

      {/* Contact — cool tint */}
      <div className="bg-[var(--section-6)] relative z-0">
        <ContactSection />
      </div>
    </main>
  );
}
