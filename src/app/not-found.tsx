"use client";

import Link from "next/link";
import { m } from "motion/react";
import { PixelTerminal } from "@/components/icons/PixelTerminal";
import { PixelArrowLeft } from "@/components/icons/PixelArrowLeft";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-dvh px-6 py-32 relative overflow-hidden bg-mesh">
      {/* Background Decorative Elements */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#cba6f7 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
      >
        <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-ctp-red/10 border border-ctp-red/20 text-ctp-red font-mono text-[10px] uppercase tracking-widest mb-8">
          <AlertTriangle className="w-4 h-4" />
          Error: SEGMENT_MISSING
        </div>

        <h1 className="text-7xl sm:text-8xl md:text-[12rem] font-black font-heading leading-none tracking-tighter uppercase italic mb-8 flex items-baseline justify-center">
          4<span className="text-ctp-red animate-pulse">0</span>4
        </h1>

        <div className="space-y-4 mb-12">
          <h2 className="text-xl md:text-3xl font-bold font-heading uppercase tracking-tight">
            Node Not Found
          </h2>
          <p className="text-muted-foreground font-mono text-xs md:text-sm leading-relaxed max-w-md mx-auto">
            The requested technical segment could not be located in the current
            workspace. It may have been relocated or purged from the core.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-ctp-mauve text-ctp-base rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-ctp-mauve/20 w-full sm:w-auto"
          >
            <PixelArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Base
          </Link>
          <Link
            href="/projects"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-ctp-surface0 border border-border/50 text-foreground rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-ctp-surface1 transition-all w-full sm:w-auto"
          >
            <PixelTerminal className="w-4 h-4" />
            Browse Arsenal
          </Link>
        </div>
      </m.div>

      {/* Technical Metadata Footer - Hidden on very small screens to avoid squishing */}
      <div className="hidden sm:block absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[9px] text-muted-foreground uppercase tracking-[0.3em] opacity-40 whitespace-nowrap">
        Status: 404_NOT_FOUND // Thread: CRITICAL
      </div>
    </div>
  );
}
