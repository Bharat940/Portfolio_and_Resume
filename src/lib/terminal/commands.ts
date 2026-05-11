import figlet from "figlet";
import { projects } from "@/data/portfolio";

export const GREETING_ART_DESKTOP = `
          _             _            _            _                _        _       
        /\\ \\           /\\ \\         /\\ \\         /\\ \\             /\\ \\     /\\ \\     
       /  \\ \\         /  \\ \\       /  \\ \\____   /  \\ \\            \\ \\ \\    \\_\\ \\    
      / /\\ \\ \\       / /\\ \\ \\     / /\\ \\_____\\ / /\\ \\ \\           / /\\ \\_\\   /\\__ \\   
     / / /\\ \\ \\     / / /\\ \\ \\   / / /\\/___  // / /\\ \\_\\         / /\\/_/  / /_ \\ \\  
    / / /  \\ \\_\\   / / /  \\ \\_\\ / / /   / / // /_/_ \\/_/        / / /    / / /\\ \\ \\ 
   / / /    \\/_/  / / /   / / // / /   / / // /____/\\          / / /    / / /  \\/_/ 
  / / /          / / /   / / // / /   / / // /\\____\\/         / / /    / / /        
 / / /________  / / /___/ / / \\ \\ \\__/ / // / /______     ___/ / /__  / / /         
/ / /_________\\/ / /____\\/ /   \\ \\___\\/ // / /_______\\   /\\__\\/_/___\\/_/ /          
\\/____________/\\/_________/     \\/_____/ \\/__________/   \\/_________/\\_\\/`;

export const GREETING_ART_MOBILE = `
  ____ ___  ____  _____   ___ _____ 
 / ___/ _ \\|  _ \\| ____| |_ _|_   _|
| |  | | | | | | |  _|    | |  | |  
| |__| |_| | |_| | |___   | |  | |  
 \\____\\___/|____/|_____| |___| |_|  
`;

export const MOCK_FILESYSTEM: Record<string, string | Record<string, string>> =
  {
    about:
      "Bharat Dangi: Full Stack Developer & Systems Engineer. Pursuing B.Tech in IT @ UIT RGPV. Focus: Scalable distributed systems and real-time graphics.",
    experience:
      "• Full Stack Intern @ SoundSpire (Aug 2025 - Nov 2025)\n  - Built Artist Hub features using Next.js & Node.js\n  - Integrated Soundcharts API for analytics\n• Web Developer @ E-Cell RGPV (2024-Present)",
    skills:
      "Languages: TypeScript, JavaScript, C++, Python\nFrontend: React 19, Next.js, Tailwind v4\nBackend: Node.js, tRPC, Hono\nDatabase: PostgreSQL, Redis, MongoDB\nTools: Docker, Prisma, CMake, Git",
    contact:
      "Email: bdangi450@gmail.com\nGitHub: https://github.com/Bharat940\nLinkedIn: bharat-dangi-b186b3248",
    projects: Object.fromEntries(
      projects.map((p) => [
        p.id,
        `# ${p.title}\n${p.description}\n\nStack: ${p.tags.join(", ")}\nGitHub: ${p.github || "N/A"}\nLink: ${p.link || "N/A"}`,
      ]),
    ),
    "readme.md":
      'Welcome to my interactive CLI! Try commands like "neofetch" or "cat experience".\nYou can also talk to my AI assistant using "ask [question]".',
  };

export const ARCADE_GAMES = [
  {
    id: "cyberslither",
    name: "CyberSlither",
    description:
      "Navigate a low-level crawler through memory heap segments to collect data packets.",
    inspiration: 'Inspired by the 1997 Nokia 6110 "Snake".',
  },
  {
    id: "binarybound",
    name: "BinaryBound",
    description:
      "A high-speed packet dodging network obstacles in a distributed environment.",
    inspiration: 'Inspired by the Google Chrome "Dino" runner.',
  },
  {
    id: "terminalinvaders",
    name: "TerminalInvaders",
    description:
      "Defend the system firewall against waves of descending script-injection bugs.",
    inspiration: 'Inspired by the 1978 classic "Space Invaders".',
  },
  {
    id: "memorymatch",
    name: "MemoryMatch",
    description:
      "Sync system cache by matching architectural patterns and technology icons.",
    inspiration: "Inspired by classic concentration/memory card games.",
  },
];

export const GENGAR_ART = `
⠀⠀⠀⠀⠀⢸⠓⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⠀⠀⠑⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡆⠀⠀⠀⠙⢤⡷⣤⣦⣀⠤⠖⠚⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣠⡿⠢⢄⡀⠀⡇⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠸⠷⣶⠂⠀⠀⠀⣀⣀⠀⠀⠀
⢸⣃⠀⠀⠉⠳⣷⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⢉⡭⠋
⠀⠘⣆⠀⠀⠀⠁⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀
⠀⠀⠘⣦⠆⠀⠀⢀⡎⢹⡀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⡀⣠⠔⠋⠀⠀⠀⠀
⠀⠀⠀⡏⠀⠀⣆⠘⣄⠸⢧⠀⠀⠀⠀⢀⣠⠖⢻⠀⠀⠀⣿⢥⣄⣀⣀⣀⠀⠀
⠀⠀⢸⠁⠀⠀⡏⢣⣌⠙⠚⠀⠀⠠⣖⡛⠀⣠⠏⠀⠀⠀⠇⠀⠀⠀⠀⢙⣣⠄
⠀⠀⢸⡀⠀⠀⠳⡞⠈⢻⠶⠤⣄⣀⣈⣉⣉⣡⡔⠀⠀⢀⠀⠀⣀⡤⠖⠚⠀⠀
⠀⠀⡼⣇⠀⠀⠀⠙⠦⣞⡀⠀⢀⡏⠀⢸⣣⠞⠀⠀⠀⡼⠚⠋⠁⠀⠀⠀⠀⠀
⠀⢰⡇⠙⠀⠀⠀⠀⠀⠀⠉⠙⠚⠒⠚⠉⠀⠀⠀⠀⡼⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢧⡀⠀⢠⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠙⣶⣶⣿⠢⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠉⠀⠀⠀⠙⢿⣳⠞⠳⡄⠀⠀⠀⢀⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀⠹⣄⣀⡤⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;

export const NEOFETCH_DATA_DESKTOP = `
${GENGAR_ART}
  \x1b[1;34mroot\x1b[0m@\x1b[1;34mwsl-ubuntu\x1b[0m
  ------------
  \x1b[1;33mOS\x1b[0m: Ubuntu 24.04 LTS (WSL2)
  \x1b[1;33mHost\x1b[0m: Bharat-Dangi-Portfolio
  \x1b[1;33mKernel\x1b[0m: 5.15.153.1-microsoft
  \x1b[1;33mUptime\x1b[0m: 12 days, 4 hours
  \x1b[1;33mPackages\x1b[0m: 1420 (dpkg)
  \x1b[1;33mShell\x1b[0m: bash 5.1.16
  \x1b[1;33mResolution\x1b[0m: 1920x1080
  \x1b[1;33mTheme\x1b[0m: Catppuccin Mocha
  \x1b[1;33mCPU\x1b[0m: AMD Ryzen 7 5800H
  \x1b[1;33mMemory\x1b[0m: 4096MiB / 16384MiB
  \x1b[1;33mLocation\x1b[0m: Bhopal, India
  \x1b[1;33mStack\x1b[0m: Next.js, tRPC, PostgreSQL

  \x1b[40m   \x1b[41m   \x1b[42m   \x1b[43m   \x1b[44m   \x1b[45m   \x1b[46m   \x1b[47m   \x1b[0m
`;

export const NEOFETCH_DATA_MOBILE = `
${GENGAR_ART}
  \x1b[1;34mroot\x1b[0m@\x1b[1;34mwsl-ubuntu\x1b[0m
  ------------
  \x1b[1;33mOS\x1b[0m: Ubuntu 24.04 LTS
  \x1b[1;33mHost\x1b[0m: Bharat-Portfolio
  \x1b[1;33mShell\x1b[0m: bash 5.1.16
  \x1b[1;33mUptime\x1b[0m: 12d 4h
  \x1b[1;33mLoc\x1b[0m: Bhopal, India
  \x1b[1;33mEdu\x1b[0m: B.Tech (IT)
  \x1b[1;33mTheme\x1b[0m: Catppuccin
  \x1b[1;33mMemory\x1b[0m: 4GB / 16GB
  \x1b[1;33mStack\x1b[0m: Next.js, tRPC, PSQL

  \x1b[40m   \x1b[41m   \x1b[42m   \x1b[43m   \x1b[44m   \x1b[45m   \x1b[46m   \x1b[47m   \x1b[0m
`;

export const RESUME_CONTENT = `
# BHARAT DANGI
Full Stack Developer & Systems Engineer

## EXPERIENCE
### Full Stack Intern @ SoundSpire (Aug 2025 - Nov 2025)
- Built core features for SoundSpire's Artist Hub platform.
- Developed frontend (Next.js) and backend (Node.js) endpoints for authentication and onboarding.
- Integrated Soundcharts API for artist analytics.

## EDUCATION
- B.Tech in IT @ UIT RGPV (2024 - 2028) | 7.94 CGPA
- High School Diploma (PCM) | 91.6%

## PROJECTS
- NodeWeave: SaaS Automation Platform
- URL Shortener: Analytics-driven service
- Ray Tracer: Photorealistic rendering engine in C++
- Math Plotter: Numerical plotting engine in C++

## SKILLS
- Languages: TypeScript, JavaScript, C++, Python
- Tech: Next.js, React, Node.js, PostgreSQL, Docker, SDL2

## CONTACT
- Email: bdangi450@gmail.com
- GitHub: https://github.com/Bharat940
- LinkedIn: https://linkedin.com/in/bharat-dangi-b186b3248
`;

export function generateAscii(text: string): Promise<string> {
  // Set the font path to point to our public directory
  figlet.defaults({ fontPath: "/fonts" });

  return new Promise((resolve, reject) => {
    figlet.text(
      text,
      {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      },
      (err: Error | null, data: string | undefined) => {
        if (err) reject(err);
        else resolve(data || "");
      },
    );
  });
}
