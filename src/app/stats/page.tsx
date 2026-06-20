import React from "react";
import { getAnalytics } from "@/lib/actions/analytics";
import { QuickNav, MobileBottomNav } from "@/components/layout/QuickNav";
import {
  ChevronLeft,
  Eye,
  Terminal,
  BookOpen,
  BarChart3,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "System Stats",
  description:
    "Real-time visitor analytics, blog reads, and terminal command execution stats for Bharat Dangi's portfolio.",
  alternates: {
    canonical: "/stats",
  },
};

export const revalidate = 0; // Disable caching to always show live stats

export default async function StatsPage() {
  const data = await getAnalytics();

  // Parse stats into standard names
  const pageViews = data.find((d) => d.metricName === "page_views")?.value || 0;
  const terminalCommands =
    data.find((d) => d.metricName === "terminal_commands")?.value || 0;
  const blogReads = data.find((d) => d.metricName === "blog_reads")?.value || 0;

  // Filter project click metrics
  const projectStats = data
    .filter((d) => d.metricName.startsWith("project_click_"))
    .map((d) => {
      const id = d.metricName.replace("project_click_", "");
      const displayName = id
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      return {
        id,
        name: displayName,
        clicks: d.value,
        updatedAt: d.updatedAt,
      };
    })
    .sort((a, b) => b.clicks - a.clicks);

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    {
      name: "Stats",
      href: "#top",
      icon: <BarChart3 className="w-4 h-4" />,
      isSection: true,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground" id="top">
      <QuickNav items={navItems} />
      <MobileBottomNav items={navItems} />

      <div className="pt-32 px-6 md:px-12 lg:px-20 max-w-4xl mx-auto pb-32">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-ctp-mauve transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-ctp-mauve/10 border border-ctp-mauve/20 text-xs font-mono text-ctp-mauve">
            <BarChart3 className="w-3.5 h-3.5" />
            System Diagnostic
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tighter uppercase leading-none">
            System Stats
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Real-time tracking of portfolio engagements, article reads, and
            shell commands. Database-driven metrics demonstrating product-level
            instrumentation.
          </p>
        </div>

        {/* Aggregated Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="p-6 bg-ctp-mantle border border-border/40 rounded-2xl flex flex-col justify-between h-44 shadow-lg shadow-black/5 hover:border-ctp-mauve/30 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Total Visitors
              </span>
              <Eye className="w-5 h-5 text-ctp-mauve group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-4xl font-black font-mono tracking-tight text-foreground block">
                {pageViews}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/50">
                Session-validated hits
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-ctp-mantle border border-border/40 rounded-2xl flex flex-col justify-between h-44 shadow-lg shadow-black/5 hover:border-ctp-blue/30 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Shell Commands
              </span>
              <Terminal className="w-5 h-5 text-ctp-blue group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-4xl font-black font-mono tracking-tight text-foreground block">
                {terminalCommands}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/50">
                AI and shell executions
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-ctp-mantle border border-border/40 rounded-2xl flex flex-col justify-between h-44 shadow-lg shadow-black/5 hover:border-ctp-peach/30 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Article Reads
              </span>
              <BookOpen className="w-5 h-5 text-ctp-peach group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-4xl font-black font-mono tracking-tight text-foreground block">
                {blogReads}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/50">
                Technical deep dives read
              </span>
            </div>
          </div>
        </div>

        {/* Project Interest Breakdown */}
        <div className="p-6 md:p-8 bg-ctp-mantle border border-border/40 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-5 h-5 text-ctp-mauve" />
            <h2 className="text-xl font-bold tracking-tight">
              Project Engagement
            </h2>
          </div>

          {projectStats.length === 0 ? (
            <p className="text-sm text-muted-foreground font-mono italic">
              No project clicks logged yet. Click projects on the homepage to
              register activity.
            </p>
          ) : (
            <div className="space-y-6">
              {projectStats.map((proj) => {
                // Determine a percentage based on max clicks
                const maxClicks = Math.max(
                  ...projectStats.map((p) => p.clicks),
                  1,
                );
                const percent = Math.round((proj.clicks / maxClicks) * 100);

                return (
                  <div key={proj.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-foreground">
                        {proj.name}
                      </span>
                      <span className="text-muted-foreground">
                        {proj.clicks} {proj.clicks === 1 ? "click" : "clicks"}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-ctp-surface0 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ctp-mauve rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-[9px] font-mono text-muted-foreground/40 text-right">
                      Last Activity:{" "}
                      {new Date(proj.updatedAt).toLocaleString("en-US", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
