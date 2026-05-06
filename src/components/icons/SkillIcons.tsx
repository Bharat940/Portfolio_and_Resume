import Image from 'next/image';
export const getSkillAbbreviation = (skill: string) => {
  const abbreviations: Record<string, string> = {
    "React": "Re",
    "JavaScript": "Js",
    "TypeScript": "Ts",
    "C++": "C++",
    "Python": "Py",
    "Docker": "Dk",
    "Next.js": "Nx",
    "Tailwind CSS": "Tw",
    "shadcn/ui": "sh",
    "HTML": "Ht",
    "CSS": "Cs",
    "Node.js": "No",
    "tRPC": "tR",
    "PostgreSQL": "Pg",
    "MongoDB": "Mg",
    "Redis": "Rd",
    "Express.js": "Ex",
    "Prisma": "Pr",
    "Git": "Gt",
    "REST APIs": "API",
    "JWT": "JWT",
    "BetterAuth": "BA",
    "Inngest": "Ig",
    "Pydantic": "Pd",
    "RAG": "RAG",
    "MCP": "MCP",
    "LangChain": "Lc",
    "LangGraph": "Lg",
    "DSA": "DSA",
    "Algorithms": "Al",
    "OOP": "OOP",
    "System Design": "SD",
    "OS": "OS",
    "DBMS": "DB",
  };

  return abbreviations[skill] || skill.substring(0, 2);
};

// Map skill names to their logo filename (without _Pixel_Logo extension)
// Useful for names with characters like "/" that are invalid in filenames.
const logoFilenameMap: Record<string, string> = {
  "shadcn/ui": "shadcnui",
  "Tailwind CSS": "Tailwind CSS", // Matches the SVG filename I created
};

export const completedPixelLogos = [
  "JavaScript",
  "TypeScript",
  "C++",
  "Python",
  "React",
  "Next.js",
  "Tailwind CSS",
  "shadcn/ui",
  "HTML",
  "CSS",
  "Node.js",
  "Express.js",
  "tRPC",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Git",
  "Docker",
  "Prisma",
  "Inngest"
];

export const SkillIcon = ({ skill }: { skill: string }) => {
  if (completedPixelLogos.includes(skill)) {
    const filename = logoFilenameMap[skill] || skill;
    return (
      <Image
        src={`/logos/${filename}_Pixel_Logo.png`}
        alt={`${skill} Logo`}
        width={96}
        height={96}
        className="w-16 h-16 md:w-24 md:h-24 object-contain opacity-80 group-hover/skill:-translate-y-2 group-hover/skill:opacity-100 group-hover/skill:scale-110 transition-all duration-300 drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] dark:drop-shadow-[4px_4px_0_rgba(0,0,0,0.8)]"
        style={{ imageRendering: 'pixelated' }}
        unoptimized
      />
    );
  }

  // Fallback: fixed-size pixel-art tile that matches the PNG logo dimensions
  return (
    <div
      className={[
        // Same size as the PNG logos
        "w-16 h-16 md:w-24 md:h-24",
        // Pixel-art tile look: dark surface, chunky border, inner bevel shadow
        "bg-ctp-surface0",
        "border-[3px] md:border-4 border-ctp-surface2",
        "shadow-[inset_-3px_-3px_0_0_rgba(0,0,0,0.45),inset_2px_2px_0_0_rgba(255,255,255,0.06)]",
        // Centering + font
        "flex items-center justify-center",
        "font-heading font-bold",
        "text-2xl md:text-4xl",
        "text-ctp-text",
        // Hover: lift + colour shift (handled by parent transform-gpu wrapper on desktop)
        "group-hover/skill:border-ctp-mauve/60 group-hover/skill:text-ctp-mauve",
        "transition-colors duration-300",
      ].join(" ")}
    >
      {getSkillAbbreviation(skill)}
    </div>
  );
};

// Exporting empty object so old imports don't crash
export const SkillIcons: Record<string, never> = {};
