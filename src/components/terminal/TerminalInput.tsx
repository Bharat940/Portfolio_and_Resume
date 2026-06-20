"use client";

import React, { ForwardedRef, forwardRef } from "react";

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (command: string) => void;
  currentDir: string;
  disabled?: boolean;
}

export const TerminalInput = forwardRef(function TerminalInput(
  {
    value,
    onChange,
    onSubmit,
    currentDir,
    disabled = false,
  }: TerminalInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const displayDir = currentDir ? `/${currentDir}` : "~";

  return (
    <div className="flex items-start gap-1 text-ctp-text pt-2">
      <span className="text-ctp-green font-bold shrink-0">
        bharat@wsl-ubuntu:
      </span>
      <span className="text-ctp-blue font-bold shrink-0">{displayDir}$</span>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) {
            onSubmit(value);
          }
        }}
        className={`flex-1 bg-transparent border-none outline-none text-ctp-text caret-ctp-blue w-full p-0 ml-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        autoComplete="off"
        spellCheck="false"
        autoFocus
      />
    </div>
  );
});
