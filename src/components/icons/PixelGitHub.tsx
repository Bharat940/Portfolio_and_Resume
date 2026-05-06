import Image from "next/image";

export const PixelGitHub = ({
  className = "w-8 h-8",
}: {
  className?: string;
}) => (
  <Image
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAwElEQVR4nO3USwrEMAwEUS37fL5bHzFzDWc9YWASf7CDqkBLg/QWjiAiIiIalIrrzIndEwAGQJkANPng7UEEgAFQJgDdXOxzHF/z9LDW9wDMTgA4F4AaPqZfB/RO6x4A9CYADIAWHDwKBIDeBIABEAAGQAAYAAFgAASAAdACkNY9AOhNABgAPTh0FEjrwQAUACoAZSBAL8jrPr1/AVAAqKkBrt1dbBZArE4AGABlBrg2GyB2TwAYAGUGICIionhLJ8XCrxbMBHxWAAAAAElFTkSuQmCC"
    alt="GitHub"
    width={32}
    height={32}
    className={className}
    unoptimized
  />
);
