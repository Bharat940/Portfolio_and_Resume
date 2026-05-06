"use client";

import React from "react";

export function BlogContent() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col items-start space-y-4 mb-16">
        <h1 className="text-4xl md:text-7xl font-black text-foreground font-heading tracking-tight">
          Technical <span className="text-ctp-peach italic">Journal</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Deep dives into system architecture, distributed systems, and
          low-level engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="p-8 border border-border/30 bg-card/50 rounded-2xl backdrop-blur-sm group hover:border-ctp-peach/50 transition-colors">
          <span className="text-xs font-mono text-ctp-peach uppercase tracking-widest">
            May 04, 2026 • 12 min read
          </span>
          <h2 className="text-2xl font-bold mt-2 mb-4 group-hover:text-ctp-peach transition-colors cursor-none">
            Building a Distributed Job Processor with Next.js and Inngest
          </h2>
          <p className="text-muted-foreground mb-6">
            An exploration of fault-tolerant background processing, retries, and
            real-time state synchronization in a serverless environment...
          </p>
          <button className="text-sm font-black uppercase tracking-widest border-b-2 border-ctp-peach pb-1 hover:text-ctp-peach transition-colors">
            Read Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
