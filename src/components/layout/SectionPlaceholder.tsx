"use client";

export function SectionPlaceholder() {
  return (
    <div className="min-h-[40vh] w-full flex items-center justify-center bg-background/50">
      <div className="flex flex-col items-center gap-4 opacity-20">
        <div className="w-12 h-12 border-2 border-t-ctp-mauve border-r-transparent border-b-ctp-mauve border-l-transparent rounded-full animate-spin" />
        <div className="font-mono text-[10px] tracking-[4px] uppercase animate-pulse text-ctp-subtext0">
          [ Loading_Module... ]
        </div>
      </div>
    </div>
  );
}
