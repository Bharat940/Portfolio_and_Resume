"use client";

import { PixelClose } from '@/components/icons/PixelClose';

interface TerminalHeaderProps {
  onClose: () => void;
}

export function TerminalHeader({ onClose }: TerminalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-ctp-crust border-b border-ctp-surface0 select-none relative z-10">
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-ctp-red opacity-80" />
          <div className="w-3 h-3 rounded-full bg-ctp-yellow opacity-80" />
          <div className="w-3 h-3 rounded-full bg-ctp-green opacity-80" />
        </div>
        <span className="ml-2 md:ml-4 text-[11px] md:text-[13px] font-medium text-ctp-subtext1 flex items-center gap-2 truncate">
          <span className="opacity-70 truncate max-w-[150px] md:max-w-none">bharat@wsl-ubuntu: /mnt/c/Users/Bharat/portfolio</span>
          <span className="opacity-30 hidden md:block">|</span>
          <span className="hidden md:block">bash</span>
        </span>
      </div>
      <button
        onClick={onClose}
        className="text-ctp-subtext0 hover:text-ctp-red transition-colors p-1"
      >
        <PixelClose className="w-4 h-4" />
      </button>
    </div>
  );
}
