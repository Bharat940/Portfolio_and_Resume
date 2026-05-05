"use client";

interface TerminalFooterProps {
  inputLength: number;
}

export function TerminalFooter({ inputLength }: TerminalFooterProps) {
  return (
    <div className="px-5 py-2 bg-ctp-crust border-t border-ctp-surface0 text-[11px] text-ctp-subtext0 flex justify-between select-none relative z-10">
      <div className="flex gap-3 md:gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ctp-green"></span>
          <span className="hidden xs:inline">Ubuntu 24.04</span>
          <span className="xs:hidden">LTS</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ctp-blue"></span> AI v3.1
        </span>
      </div>
      <div className="flex gap-3 md:gap-4">
        <span className="hidden sm:inline">UTF-8</span>
        <span>Pos: {inputLength}</span>
      </div>
    </div>
  );
}
