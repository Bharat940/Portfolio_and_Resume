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
