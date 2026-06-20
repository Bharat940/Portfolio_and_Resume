"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTerminal } from "@/context/TerminalContext";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useWindowManager } from "@/context/WindowManagerContext";
import { trackMetric, getAnalytics } from "@/lib/actions/analytics";

import { MatrixRain } from "./MatrixRain";
import { TerminalFooter } from "./TerminalFooter";
import { TerminalOutput, LogEntry } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";
import { GameId } from "@/context/ArcadeContext";

import {
  GREETING_ART_DESKTOP,
  GREETING_ART_MOBILE,
  MOCK_FILESYSTEM,
  RESUME_CONTENT,
  NEOFETCH_DATA_DESKTOP,
  NEOFETCH_DATA_MOBILE,
  generateAscii,
  ARCADE_GAMES,
} from "@/lib/terminal/commands";

export function TerminalOverlay() {
  const { closeTerminal, matrixMode, toggleMatrixMode } = useTerminal();
  const { openWindow } = useWindowManager();
  const [isMobile, setIsMobile] = useState(false);

  const [history, setHistory] = useState<LogEntry[]>([]);
  const [currentDir, setCurrentDir] = useState(""); // Empty string is root
  const hasInitialized = useRef(false);

  // Track mobile state and initialize history
  useEffect(() => {
    if (!hasInitialized.current) {
      const checkMobile = () => window.innerWidth < 768;
      const initialMobile = checkMobile();
      setIsMobile(initialMobile);

      setHistory([
        {
          type: "output",
          content: initialMobile ? GREETING_ART_MOBILE : GREETING_ART_DESKTOP,
        },
        {
          type: "output",
          content:
            "Welcome to Bharat's Linux Environment (WSL: Ubuntu 24.04 LTS)",
        },
        { type: "output", content: 'Type "help" to see available commands.' },
      ]);

      const handleResize = () => setIsMobile(checkMobile());
      window.addEventListener("resize", handleResize);
      hasInitialized.current = true;

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: ({ message }) => {
      const content = message.parts
        .filter((p) => p.type === "text")
        .map((p) => {
          if ("text" in p) return p.text;
          return "";
        })
        .join("")
        .trim();

      if (content) {
        setHistory((prev) => [...prev, { type: "ai", content }]);
      }
    },
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const isLoading = status === "submitted" || status === "streaming";
  const lastAiMessage = messages.filter((m) => m.role === "assistant").pop();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, lastAiMessage, isLoading]);

  // Refocus input once loading/executing completes
  useEffect(() => {
    if (!isLoading && !isExecuting) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isLoading, isExecuting]);

  // Focus input on mount and whenever the window might have been clicked
  useEffect(() => {
    const focusInput = () => {
      // Small delay to ensure any other focus transitions have finished
      setTimeout(() => inputRef.current?.focus(), 10);
    };

    const handleRetroFocus = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      // If our window was focused, focus the input
      if (customEvent.detail?.id?.startsWith("terminal")) {
        focusInput();
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeTerminal();
      }
    };

    focusInput();
    window.addEventListener("focus", focusInput);
    window.addEventListener("retro-window-focus", handleRetroFocus);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("focus", focusInput);
      window.removeEventListener("retro-window-focus", handleRetroFocus);
      window.removeEventListener("keydown", handleKey);
    };
  }, [closeTerminal]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setHistory((prev) => [
      ...prev,
      { type: "input", content: `bharat@wsl-ubuntu:~$ ${trimmedCmd}` },
    ]);
    setInput("");

    // Track command execution metric
    trackMetric("terminal_commands");

    const parts = trimmedCmd.split(" ");
    let command = parts[0].toLowerCase();
    if (command.startsWith("/") && command.length > 1) {
      command = command.slice(1);
    }
    const args = parts.slice(1);

    interface FileSystemNode {
      [key: string]: string | FileSystemNode;
    }

    // Helper to get relative path contents
    const getDirContents = (dirPath: string): FileSystemNode | null => {
      if (!dirPath) return MOCK_FILESYSTEM as FileSystemNode;
      const pathParts = dirPath.split("/");
      let current: string | FileSystemNode = MOCK_FILESYSTEM as FileSystemNode;
      for (const p of pathParts) {
        if (typeof current === "object" && current !== null && p in current) {
          current = current[p];
        } else {
          return null;
        }
      }
      return typeof current === "object" ? current : null;
    };

    const currentContents = getDirContents(currentDir);

    switch (command) {
      case "help":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2 text-ctp-subtext1">
                <div>
                  <span className="text-ctp-blue font-bold">ls [dir]</span> -
                  List files
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">cd [dir]</span> -
                  Change directory
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">pwd</span> - Print
                  working directory
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">cat [file]</span> -
                  View file contents
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">ask [q]</span> -
                  Query AI Knowledge Base
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">./resume</span> -
                  View full resume
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">neofetch</span> -
                  Show system stats
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">figlet [text]</span>{" "}
                  - Generate ASCII art
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">whoami</span> -
                  Display user info
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">socials</span> -
                  List social links
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">game</span> - Launch
                  arcade center
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">matrix</span> -
                  Toggle digital rain
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">stats</span> - Show
                  real portfolio analytics
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">architecture</span>{" "}
                  - View system architecture
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">joke</span> - Print
                  a developer joke
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">easteregg</span> -
                  List system easter eggs
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">
                    recommend-project
                  </span>{" "}
                  - Suggest custom projects
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">
                    explain-skill [name]
                  </span>{" "}
                  - Explain technical skills
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">
                    show-experience
                  </span>{" "}
                  - Print career timeline
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">clear</span> - Clear
                  screen
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">exit</span> - Close
                  shell
                </div>
              </div>
            ),
          },
        ]);
        break;

      case "ls":
        const dirArg = args[0]?.toLowerCase();
        let targetContents = currentContents;

        if (dirArg) {
          const targetPath = currentDir ? `${currentDir}/${dirArg}` : dirArg;
          targetContents = getDirContents(targetPath);
        }

        if (targetContents && typeof targetContents === "object") {
          const contents = Object.keys(targetContents as object)
            .map((k) =>
              typeof (targetContents as FileSystemNode)[k] === "object"
                ? `${k}/`
                : k,
            )
            .join("  ");
          setHistory((prev) => [
            ...prev,
            { type: "output", content: contents },
          ]);
        } else {
          setHistory((prev) => [
            ...prev,
            { type: "error", content: `ls: ${dirArg}: No such directory` },
          ]);
        }
        break;

      case "cd":
        const targetDir = args[0]?.toLowerCase();
        if (!targetDir || targetDir === "~" || targetDir === "/") {
          setCurrentDir("");
        } else if (targetDir === "..") {
          const parts = currentDir.split("/");
          setCurrentDir(parts.slice(0, -1).join("/"));
        } else {
          const newPath = currentDir ? `${currentDir}/${targetDir}` : targetDir;
          if (
            getDirContents(newPath) &&
            typeof getDirContents(newPath) === "object"
          ) {
            setCurrentDir(newPath);
          } else {
            setHistory((prev) => [
              ...prev,
              { type: "error", content: `cd: ${targetDir}: No such directory` },
            ]);
          }
        }
        break;

      case "pwd":
        setHistory((prev) => [
          ...prev,
          { type: "output", content: `/${currentDir}` },
        ]);
        break;

      case "cat":
        const fileName = args[0]?.toLowerCase();
        if (!fileName) {
          const available = Object.keys(currentContents as object).join(", ");
          setHistory((prev) => [
            ...prev,
            {
              type: "error",
              content: `Usage: cat [file]\nAvailable: ${available}`,
            },
          ]);
        } else {
          const targetPath = fileName.includes("/")
            ? fileName
            : currentDir
              ? `${currentDir}/${fileName}`
              : fileName;
          const pathParts = targetPath.split("/");
          const file = pathParts.pop() || "";
          const dirPath = pathParts.join("/");
          const dirObj = getDirContents(dirPath);

          if (dirObj && typeof dirObj === "object" && dirObj[file]) {
            if (typeof dirObj[file] === "object") {
              setHistory((prev) => [
                ...prev,
                { type: "error", content: `cat: ${fileName}: Is a directory` },
              ]);
            } else {
              // Use 'ai' type for markdown if it looks like markdown
              const isMd = fileName.endsWith(".md") || dirPath === "projects";
              setHistory((prev) => [
                ...prev,
                {
                  type: isMd ? "ai" : "output",
                  content: dirObj[file] as string,
                },
              ]);
            }
          } else {
            setHistory((prev) => [
              ...prev,
              { type: "error", content: `cat: ${fileName}: No such file` },
            ]);
          }
        }
        break;

      case "./resume":
      case ".\\resume":
        setHistory((prev) => [
          ...prev,
          { type: "output", content: RESUME_CONTENT },
        ]);
        break;

      case "neofetch":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: isMobile ? NEOFETCH_DATA_MOBILE : NEOFETCH_DATA_DESKTOP,
          },
        ]);
        break;

      case "whoami":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content:
              "Bharat Dangi: A passionate Full Stack Developer & Systems Engineer. Currently pursuing B.Tech in IT @ UIT RGPV. I love building high-performance systems and exploring the intersection of graphics and AI.",
          },
        ]);
        break;

      case "socials":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: (
              <div className="flex flex-col gap-1 mt-1">
                <div>
                  <span className="text-ctp-mauve font-bold">GitHub:</span>{" "}
                  https://github.com/Bharat940
                </div>
                <div>
                  <span className="text-ctp-blue font-bold">LinkedIn:</span>{" "}
                  https://linkedin.com/in/bharat-dangi-b186b3248
                </div>
                <div>
                  <span className="text-ctp-sky font-bold">Twitter:</span>{" "}
                  @Bharat940
                </div>
                <div>
                  <span className="text-ctp-red font-bold">Email:</span>{" "}
                  bdangi450@gmail.com
                </div>
              </div>
            ),
          },
        ]);
        break;

      case "repo":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content:
              "Source Code: https://github.com/Bharat940/Portfolio_and_Resume",
          },
        ]);
        break;

      case "figlet":
        const text = args.join(" ");
        if (!text) {
          setHistory((prev) => [
            ...prev,
            { type: "error", content: "Usage: figlet [text]" },
          ]);
        } else {
          try {
            const art = await generateAscii(text);
            setHistory((prev) => [...prev, { type: "output", content: art }]);
          } catch {
            setHistory((prev) => [
              ...prev,
              { type: "error", content: "Error generating ASCII art" },
            ]);
          }
        }
        break;

      case "clear":
        setHistory([]);
        break;

      case "exit":
        closeTerminal();
        break;

      case "ask":
        const query = args.join(" ");
        if (!query) {
          setHistory((prev) => [
            ...prev,
            { type: "error", content: "Usage: ask [your question]" },
          ]);
        } else {
          sendMessage({ text: query });
        }
        break;

      case "matrix":
        toggleMatrixMode();
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: `Matrix rain ${!matrixMode ? "enabled" : "disabled"}.`,
          },
        ]);
        break;

      case "game":
        const gameAction = args[0]?.toLowerCase();
        const gameId = args[1]?.toLowerCase() as GameId;

        if (gameAction === "launch" && gameId) {
          const game = ARCADE_GAMES.find((g) => g.id === gameId);
          if (game) {
            setHistory((prev) => [
              ...prev,
              {
                type: "output",
                content: `Initializing Standalone Kernel... Spawning ${game.name} in separate thread.`,
              },
            ]);
            openWindow("arcade", game.name, gameId);
          } else {
            setHistory((prev) => [
              ...prev,
              { type: "error", content: `game: ${gameId}: Module not found.` },
            ]);
          }
        } else {
          setHistory((prev) => [
            ...prev,
            {
              type: "output",
              content: (
                <div className="mt-2 p-3 md:p-4 border border-ctp-surface2 rounded-xl bg-ctp-mantle/50 backdrop-blur-sm max-w-full overflow-hidden">
                  <div className="text-ctp-yellow font-bold mb-2 flex items-center gap-2 text-xs md:text-sm">
                    <span className="animate-pulse">🎮</span> ARCADE KERNEL
                    v2.0.0
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {ARCADE_GAMES.map((game) => (
                      <div
                        key={game.id}
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-2 rounded-lg hover:bg-ctp-surface0/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-ctp-blue font-bold text-xs md:text-sm truncate">
                              {game.name}
                            </span>
                            <span className="text-[8px] md:text-[10px] text-ctp-overlay0 uppercase tracking-widest bg-ctp-surface0 px-1.5 py-0.5 rounded shrink-0">
                              {game.id}
                            </span>
                          </div>
                          <div className="text-[10px] md:text-xs text-ctp-subtext0 mt-0.5 line-clamp-2 md:line-clamp-none">
                            {game.description}
                          </div>
                          <div className="hidden md:block text-[9px] text-ctp-overlay1 italic mt-0.5 truncate">
                            {game.inspiration}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openWindow("arcade", game.name, game.id);
                          }}
                          className="w-full sm:w-auto px-3 py-1.5 sm:py-1 bg-ctp-surface1 hover:bg-ctp-blue hover:text-ctp-mantle text-ctp-blue text-[9px] md:text-[10px] font-bold rounded uppercase tracking-tighter transition-all shrink-0 text-center"
                        >
                          Initialize
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 md:mt-4 pt-3 border-t border-ctp-surface1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-[9px] md:text-[11px]">
                    <div className="text-ctp-subtext1">
                      Usage:{" "}
                      <span className="text-ctp-green font-mono">
                        game launch [id]
                      </span>
                    </div>
                    <div className="text-ctp-overlay0 italic">
                      Click initialize to spawn process
                    </div>
                  </div>
                </div>
              ),
            },
          ]);
        }
        break;

      case "joke":
        const jokes = [
          "Why do programmers wear glasses? Because they can't C#.",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
          "There are 10 types of people in the world: those who understand binary, and those who don't.",
          "A SQL query goes into a bar, walks up to two tables and asks, 'Can I join you?'",
          "['hip', 'hip'] (hip hip array!)",
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        setHistory((prev) => [
          ...prev,
          { type: "output", content: randomJoke },
        ]);
        break;

      case "easteregg":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: `System Easter Eggs:\n------------------\n1. Run the "matrix" command to convert the portfolio theme into a glowing CRT monitor interface.\n2. Press Escape at any time to instantly exit the terminal shell.\n3. Try command "figlet [text]" to render large ASCII titles.\n4. Open the standalone retro arcade center under the /arcade path to play custom web games.`,
          },
        ]);
        break;

      case "stats":
        setIsExecuting(true);
        // Show temporary loading indicator in terminal output
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: "Retrieving real-time analytics from kernel database...",
          },
        ]);
        try {
          const stats = await getAnalytics();
          const pageViews =
            stats.find((d) => d.metricName === "page_views")?.value || 0;
          const terminalCommandsCount =
            stats.find((d) => d.metricName === "terminal_commands")?.value || 0;
          const blogReads =
            stats.find((d) => d.metricName === "blog_reads")?.value || 0;

          // Remove the temporary loading message and add the result
          setHistory((prev) => [
            ...prev.filter(
              (entry) =>
                entry.content !==
                "Retrieving real-time analytics from kernel database...",
            ),
            {
              type: "output",
              content: `System Analytics Report:\n-----------------------\nTotal Page Views: ${pageViews}\nCommands Run: ${terminalCommandsCount}\nArticles Read: ${blogReads}\nTo see the full stats dashboard, visit https://bharat-dangi.vercel.app/stats`,
            },
          ]);
        } catch (error) {
          console.error("Failed to fetch analytics inside terminal:", error);
          setHistory((prev) => [
            ...prev.filter(
              (entry) =>
                entry.content !==
                "Retrieving real-time analytics from kernel database...",
            ),
            {
              type: "error",
              content: "Failed to retrieve real-time system stats.",
            },
          ]);
        } finally {
          setIsExecuting(false);
        }
        break;

      case "recommend-project":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: `I recommend checking out these key projects:\n\n1. NodeWeave: SaaS Automation Platform featuring a distributed job runner.\n   - Stack: Next.js, tRPC, PostgreSQL, Inngest\n   - GitHub: https://github.com/Bharat940/nodeweave\n\n2. Ray Tracer: CPU-based Monte Carlo path tracing engine in native C++.\n   - Stack: C++, OpenMP, CMake\n   - GitHub: https://github.com/Bharat940/Raytracing-Cpp\n\n3. URL Shortener: High-performance click tracker with Redis rate limiting.\n   - Stack: Node.js, Redis, JWT\n   - GitHub: https://github.com/Bharat940/url-shortener-analytics`,
          },
        ]);
        break;

      case "architecture":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content:
              "Retrieving system design specs... Redirecting to /architecture",
          },
        ]);
        setTimeout(() => {
          window.location.href = "/architecture";
        }, 1000);
        break;

      case "explain-skill":
        const skillArg = args[0]?.toLowerCase();
        if (!skillArg) {
          setHistory((prev) => [
            ...prev,
            {
              type: "error",
              content:
                "Usage: explain-skill [react|nextjs|typescript|postgresql|trpc|drizzle|cpp|docker]",
            },
          ]);
        } else {
          // To add custom CLI explanations for new skills added to your portfolio in the future,
          // simply append the skill name (lowercase) and description to this dictionary:
          const SKILL_EXPLANATIONS: Record<string, string> = {
            nextjs:
              "Next.js: React framework for production. Used for server side rendering, routing, static page generation, and optimized image rendering in this portfolio.",
            "next.js":
              "Next.js: React framework for production. Used for server side rendering, routing, static page generation, and optimized image rendering in this portfolio.",
            react:
              "React: Declarative component-based UI library. Leveraged to build highly interactive, concurrent client interfaces with optimized render lifecycles.",
            typescript:
              "TypeScript: Typed superset of JavaScript. Used project-wide to enforce structural typing, minimize runtime bugs, and provide strict editor autocomplete.",
            ts: "TypeScript: Typed superset of JavaScript. Used project-wide to enforce structural typing, minimize runtime bugs, and provide strict editor autocomplete.",
            javascript:
              "JavaScript: Core runtime of the modern web. Used for client-side interactions, asynchronous state management, and Node.js backend pipelines.",
            js: "JavaScript: Core runtime of the modern web. Used for client-side interactions, asynchronous state management, and Node.js backend pipelines.",
            postgresql:
              "PostgreSQL: Advanced open-source relational database. Used with Neon Serverless Postgres for data persistence, indexing, and vector similarity search.",
            postgres:
              "PostgreSQL: Advanced open-source relational database. Used with Neon Serverless Postgres for data persistence, indexing, and vector similarity search.",
            tailwindcss:
              "Tailwind CSS: Utility-first CSS framework. Used in combination with Shadcn UI to design modern, high-contrast, and responsive interfaces.",
            tailwind:
              "Tailwind CSS: Utility-first CSS framework. Used in combination with Shadcn UI to design modern, high-contrast, and responsive interfaces.",
            trpc: "tRPC: End-to-end typesafe APIs. Ensures full type safety between backend router and frontend client without schemas or code generation.",
            drizzle:
              "Drizzle ORM: Next-generation TypeScript ORM. Used in this project with Neon Serverless Postgres for structured querying and schema management.",
            "drizzle-orm":
              "Drizzle ORM: Next-generation TypeScript ORM. Used in this project with Neon Serverless Postgres for structured querying and schema management.",
            cpp: "C++: Used for low-level systems and graphics programming, including the CPU ray tracer (Monte Carlo path tracing) and math plotter (SDL2 rendering).",
            "c++":
              "C++: Used for low-level systems and graphics programming, including the CPU ray tracer (Monte Carlo path tracing) and math plotter (SDL2 rendering).",
            docker:
              "Docker: Containerization platform. Used to containerize Node.js and C++ projects, ensuring consistent runtimes across staging and production.",
            nodejs:
              "Node.js: JavaScript runtime built on Chrome's V8 engine. Used to power microservices, REST APIs, and backend automation runners.",
            "node.js":
              "Node.js: JavaScript runtime built on Chrome's V8 engine. Used to power microservices, REST APIs, and backend automation runners.",
            node: "Node.js: JavaScript runtime built on Chrome's V8 engine. Used to power microservices, REST APIs, and backend automation runners.",
            redis:
              "Redis: In-memory data store. Used in URL shortener projects for high-frequency caching, session management, and rate limiting.",
            prisma:
              "Prisma: Modern database toolkit. Used to model schemas, write type-safe queries, and handle database migrations securely.",
            inngest:
              "Inngest: Event-driven execution platform. Used in NodeWeave to schedule cron jobs, handle retries, and coordinate complex backend workflows.",
            betterauth:
              "BetterAuth: Complete authentication library. Used for secure user registration, session tokens, and comments authentication in the blogging system.",
            rag: "RAG (Retrieval-Augmented Generation): AI framework that combines search engines with LLMs. Used in this terminal shell's 'ask' command to inject relevant developer knowledge documents into Gemini's context window.",
            mcp: "Model Context Protocol (MCP): Open standard for AI agents to access data sources. Used to connect LLMs with custom system tools and filesystem databases.",
            dsa: "DSA (Data Structures & Algorithms): Core problem-solving patterns. Used to optimize computational bottlenecks, memory usage, and execution efficiency across all systems.",
          };

          const explanation = SKILL_EXPLANATIONS[skillArg];
          if (explanation) {
            setHistory((prev) => [
              ...prev,
              { type: "output", content: explanation },
            ]);
          } else {
            // Dynamic fallback: Query the AI database directly!
            setHistory((prev) => [
              ...prev,
              {
                type: "output",
                content: `[AI Query] Analyzing database for "${args[0]}"...`,
              },
            ]);
            sendMessage({
              text: `Explain my experience and projects using ${args[0]} in a brief, professional terminal output format.`,
            });
          }
        }
        break;

      case "show-experience":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: `Professional Experience:\n---------------------\n• Full Stack Intern @ SoundSpire (Aug 2025 - Nov 2025)\n  - Built features for the Artist Hub onboarding platform.\n  - Integrated third-party analytical APIs (Soundcharts).\n  - Leveraged Next.js Server Actions and Node.js backend pipelines.\n\n• Web Developer @ E-Cell RGPV (2024 - Present)\n  - Lead frontend developer for entrepreneurial events and registration systems.`,
          },
        ]);
        break;

      default:
        setHistory((prev) => [
          ...prev,
          { type: "error", content: `sh: command not found: ${command}` },
        ]);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, lastAiMessage, isLoading]);

  return (
    <div className="w-full h-full flex flex-col bg-ctp-mantle text-ctp-text font-mono relative overflow-hidden">
      {matrixMode && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-50">
          <MatrixRain />
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-ctp-surface0 scrollbar-track-transparent relative z-10"
        onClick={() => inputRef.current?.focus()}
      >
        <TerminalOutput history={history} status={status} messages={messages} />
        {!(isExecuting || isLoading) && (
          <TerminalInput
            ref={inputRef}
            value={input}
            onChange={setInput}
            onSubmit={handleCommand}
            currentDir={currentDir}
          />
        )}
      </div>

      <TerminalFooter inputLength={input.length} />
    </div>
  );
}
