"use client";

import { useEffect } from "react";
import { m } from "motion/react";
import { RefreshCcw, ShieldAlert } from "lucide-react";
import { PixelArrowLeft } from "@/components/icons/PixelArrowLeft";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-dvh px-6 py-32 relative overflow-hidden bg-mesh">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#f38ba8_1px,transparent_1px)] bg-size-[40px_40px]" />

      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
      >
        <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-ctp-red/10 border border-ctp-red/20 text-ctp-red font-mono text-[10px] uppercase tracking-widest mb-8 animate-pulse">
          <ShieldAlert className="w-4 h-4" />
          Status: SYSTEM_PANIC
        </div>

        <h1 className="text-5xl md:text-8xl font-black font-heading leading-none tracking-tighter uppercase italic mb-6">
          Fatal <span className="text-ctp-red">Exception</span>
        </h1>

        <div className="space-y-4 mb-12 bg-ctp-base/50 border border-ctp-red/20 rounded-[2rem] p-6 md:p-8 backdrop-blur-md w-full">
          <p className="text-muted-foreground font-mono text-xs md:text-sm leading-relaxed max-w-md mx-auto">
            A critical runtime error has occurred in the core processing unit.
            The current thread has been suspended to prevent data corruption.
          </p>
          {error.digest && (
            <div className="text-[9px] font-mono text-ctp-red/60 uppercase tracking-widest border-t border-ctp-red/10 pt-4 truncate px-4">
              Digest Code: {error.digest}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => reset()}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-ctp-red text-ctp-base rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-ctp-red/20 w-full sm:w-auto"
          >
            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Reboot System
          </button>
          <Link
            href="/"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-ctp-surface0 border border-border/50 text-foreground rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-ctp-surface1 transition-all w-full sm:w-auto"
          >
            <PixelArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Abort & Return
          </Link>
        </div>
      </m.div>

      {/* Technical Metadata Footer */}
      <div className="hidden sm:block absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[9px] text-muted-foreground uppercase tracking-[0.3em] opacity-40 whitespace-nowrap">
        Trace: INTERNAL_SERVER_ERROR // Priority: P0
      </div>
    </div>
  );
}
