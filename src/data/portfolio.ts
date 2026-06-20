export interface CaseStudy {
  challenge: string;
  approach: string;
  whatBroke: string;
  howFixed: string;
  outcome: string;
  techDecisions: { decision: string; why: string }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  bulletPoints?: string[];
  tags: string[];
  type: "web" | "native";
  link?: string;
  github?: string;
  logo: string; // Filename in /public/logos
  screenshots?: string[];
  readmeUrl?: string;
  caseStudy?: CaseStudy;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade?: string;
  details?: string;
}

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "Technical Portfolio & Resume",
    description:
      "High-performance developer portfolio with AI Terminal and Catppuccin aesthetic.",
    longDescription:
      "A premium developer portfolio built with Next.js 16 and Framer Motion. Features a RAG-powered AI terminal emulator using Gemini 3.0, custom section transitions, and real-time data integrations.",
    bulletPoints: [
      "High-performance developer portfolio platform combining AI search, blogging, and analytics into a cohesive system.",
      "Features a RAG-powered AI terminal emulator using Gemini 3.0, custom section transitions, and real-time data integrations.",
      "Integrated interactive AI Terminal with suggested, fun, and agent-like command systems.",
      "Built dynamic blogging system with markdown support and secure comment validation via Better Auth.",
      "Created custom retro arcade suite featuring multiple classic browser games.",
      "Developed database-driven visitor tracking dashboard (/stats) for real-time analytics aggregation.",
    ],
    tags: ["Next.js", "TypeScript", "Gemini AI", "Framer Motion", "PostgreSQL"],
    type: "web",
    link: "https://bharat-dangi.vercel.app/",
    github: "https://github.com/Bharat940/Portfolio_and_Resume",
    logo: "Next.js",
    readmeUrl:
      "https://raw.githubusercontent.com/Bharat940/Portfolio_and_Resume/main/README.md",
    screenshots: ["/screenshots/Portfolio.png"],
  },
  {
    id: "node-weave",
    title: "NodeWeave",
    description: "SaaS Automation Platform with distributed execution engine.",
    longDescription:
      "Built a scalable workflow automation platform featuring a fault-tolerant job processing engine, sandboxed execution for dynamic user workflows, and real-time tracking.",
    bulletPoints: [
      "Built a node-based workflow automation platform with a visual editor and scalable execution engine.",
      "Developed a drag-and-drop workflow builder using XYFlow.",
      "Added a template system for reusable automations.",
      "Architected an event-driven execution engine (Inngest) with scheduling, background jobs, and replay support.",
      "Implemented conditional logic, data transformers, and sandboxed JS execution for dynamic workflows.",
      "Integrated secure authentication, encrypted credentials, real-time tracking, and SaaS billing for production-ready deployment.",
    ],
    tags: ["Next.js", "tRPC", "Prisma", "PostgreSQL", "Inngest"],
    type: "web",
    link: "https://node-weave.vercel.app/",
    github: "https://github.com/Bharat940/nodeweave",
    logo: "Next.js",
    readmeUrl:
      "https://raw.githubusercontent.com/Bharat940/nodeweave/main/README.md",
    screenshots: ["/screenshots/NodeWeave.png"],
    caseStudy: {
      challenge:
        "Sandboxing dynamic user-defined workflows without breaking the host process.",
      approach:
        "Built a sandboxed JavaScript runtime environment that allows users to write custom transformers and conditional logic inside automation steps.",
      whatBroke:
        "User-defined scripts containing infinite loops or resource-heavy operations blocked the main Node.js event loop, halting the entire distributed job queue.",
      howFixed:
        "Implemented a per-job timeout combined with isolated execution contexts via Node's native vm module (specifically vm.runInNewContext) with strict memory and CPU runtime constraints.",
      outcome:
        "Ensured 100% host isolation where malformed or malicious scripts fail gracefully within their micro-sandbox, leaving other worker tasks completely unaffected.",
      techDecisions: [
        {
          decision: "Node.js vm Module",
          why: "Provides lightweight context isolation suitable for processing rapid data transformations without the cold-start overhead of micro-VMs.",
        },
        {
          decision: "Inngest Event Engine",
          why: "Decouples workflow scheduling from execution, ensuring step-level retries and state resilience when sandbox jobs fail.",
        },
      ],
    },
  },
  {
    id: "url-shortener",
    title: "URL Shortener",
    description: "Analytics-driven URL shortener with Redis rate limiting.",
    longDescription:
      "Developed a URL shortener with custom links, click-tracking analytics, and JWT-based authentication. Implemented Redis for high-performance rate limiting.",
    bulletPoints: [
      "Developed a URL shortener with custom links, analytics, and click-tracking.",
      "Implemented Redis rate limiting and JWT-based user authentication.",
      "Created dashboards with real-time usage visualizations. Implemented analytics pipeline for click tracking and insights.",
    ],
    tags: ["Node.js", "Redis", "JWT", "Tailwind CSS"],
    type: "web",
    link: "https://bharat-url-shortener.vercel.app/",
    github: "https://github.com/Bharat940/url-shortener-analytics",
    logo: "Node.js",
    readmeUrl:
      "https://raw.githubusercontent.com/Bharat940/url-shortener-analytics/main/README.md",
    screenshots: ["/screenshots/URL_Shortener.png"],
    caseStudy: {
      challenge:
        "Handling high concurrency rate limiting under burst traffic without penalizing real users.",
      approach:
        "Used Redis as a centralized high-speed cache and rate limiter to track IP requests in a rolling window.",
      whatBroke:
        "Standard check-then-set Redis logic caused race conditions under high concurrency, leading to rate limit bypasses and excessive DB connections.",
      howFixed:
        "Implemented a Lua script for atomic check-and-increment operations directly within the Redis instance in a single round trip.",
      outcome:
        "Reduced request latency and prevented race conditions, successfully sustaining thousands of concurrent API requests.",
      techDecisions: [
        {
          decision: "Redis Lua Scripting",
          why: "Ensures atomic execution of multi-step validation logic, eliminating concurrency race conditions.",
        },
        {
          decision: "Rolling Window Rate Limiter",
          why: "Avoids request spikes at boundary resets compared to simpler fixed-window algorithms.",
        },
      ],
    },
  },
  {
    id: "finance-dashboard",
    title: "Finance Dashboard",
    description:
      "Modern financial analytics dashboard with transaction tracking.",
    longDescription:
      "A high-performance financial management dashboard featuring account aggregation, category-based transaction tracking, and interactive data visualization. Built with Next.js and Hono.js.",
    bulletPoints: [
      "Developed a finance dashboard with wallets, invoices, and transaction insights using Next.js + TS.",
      "Added secure authentication, protected routes, and automated invoice workflows.",
      "Designed modular UI with shadcn/Radix, improving reusability and consistency.",
    ],
    tags: ["Next.js", "TypeScript", "shadcn", "NextAuth"],
    type: "web",
    link: "https://bharat-finance-dashboard.vercel.app/",
    github: "https://github.com/Bharat940/Nextjs-Finance-Dashboard",
    logo: "Next.js",
    readmeUrl:
      "https://raw.githubusercontent.com/Bharat940/Nextjs-Finance-Dashboard/main/README.md",
    screenshots: ["/screenshots/Finance.png"],
  },
  {
    id: "math-plotter",
    title: "Math Plotter",
    description: "Real-time function plotting engine with custom parser.",
    longDescription:
      "Built with SDL2 and CMake. Features a custom expression parser using the Shunting-Yard algorithm and numerical methods for root finding and derivatives.",
    bulletPoints: [
      "Built real-time function plotting engine with custom expression parser and evaluator.",
      "Implemented Shunting-Yard algorithm and postfix evaluation pipeline.",
      "Designed numerical methods for root finding and derivatives.",
      "Developed adaptive rendering and discontinuity detection for accurate visualization.",
      "Built unit test suite covering parsing and numerical modules.",
    ],
    tags: ["C++", "SDL2", "CMake"],
    type: "native",
    github: "https://github.com/Bharat940/Simple-math-calculator-and-plotter",
    logo: "C++",
    readmeUrl:
      "https://raw.githubusercontent.com/Bharat940/Simple-math-calculator-and-plotter/main/README.md",
    screenshots: ["/screenshots/Plotter.png"],
    caseStudy: {
      challenge:
        "Preventing silent parsing and evaluation failures on malformed math expressions.",
      approach:
        "Used the Shunting-Yard algorithm to parse mathematical expressions in infix notation and convert them into Reverse Polish Notation (RPN) for evaluation.",
      whatBroke:
        "Expressions with mismatched parentheses or consecutive operators (such as 'sin(' or 'x + * 5') caused undefined stack behavior, resulting in crashes or silent evaluation failures.",
      howFixed:
        "Implemented a robust token validation and grammar checking pass before starting the Shunting-Yard transformation, capturing operator placement issues and mismatched braces early.",
      outcome:
        "Ensured reliable error tracking with descriptive visual feedback to the user on syntax errors, guaranteeing that evaluation is safe.",
      techDecisions: [
        {
          decision: "Shunting-Yard Parser",
          why: "Provides an efficient stack-based mechanism to evaluate mathematical expressions with standard precedence without the overhead of heavy compiler generators.",
        },
        {
          decision: "SDL2 Graphic Layer",
          why: "Delivers direct low-level GPU acceleration for drawing high-frequency function plots smoothly at 60 FPS.",
        },
      ],
    },
  },
  {
    id: "ray-tracer",
    title: "Ray Tracer",
    description: "CPU-based Monte Carlo path tracing engine in C++.",
    longDescription:
      "Built a photorealistic rendering engine from scratch. Implemented ray-object intersection, light scattering, and materials like metal and dielectric. Optimized with OpenMP.",
    bulletPoints: [
      "Built CPU-based Monte Carlo path tracing engine for photorealistic rendering.",
      "Implemented ray-object intersection, materials (diffuse, metal, dielectric), and light scattering.",
      "Applied vector mathematics and recursion for multi-bounce ray tracing.",
      "Optimized rendering using OpenMP for parallel execution across CPU cores.",
      "Implemented anti-aliasing, gamma correction, and depth-of-field simulation.",
    ],
    tags: ["C++", "OpenMP", "Graphics"],
    type: "native",
    github: "https://github.com/Bharat940/Raytracing-Cpp",
    logo: "C++",
    readmeUrl:
      "https://raw.githubusercontent.com/Bharat940/Raytracing-Cpp/main/README.md",
    screenshots: ["/screenshots/Raytracer.png"],
    caseStudy: {
      challenge:
        "CPU cache thrashing during recursive ray bounce calculations in a Monte Carlo path tracer.",
      approach:
        "Implemented a pure C++ multi-threaded ray tracing engine using recursive ray tracing and diffuse/metal/dielectric material interactions.",
      whatBroke:
        "Performance collapsed above 4 bounces due to severe L1/L2 CPU cache misses, caused by standard object-oriented array-of-structures (AoS) layouts for vectors and geometries.",
      howFixed:
        "Restructured core Vec3 vector representations to leverage a cache-friendly structure-of-arrays (SoA) data design and configured OpenMP thread affinity to keep ray jobs on the same core.",
      outcome:
        "Improved rendering throughput by over 40% and reduced cache misses, allowing higher samples per pixel in less time.",
      techDecisions: [
        {
          decision: "OpenMP Multithreading",
          why: "Provides simple and efficient parallel loop schedule management across multi-core CPU architectures without thread pooling overhead.",
        },
        {
          decision: "Structure of Arrays (SoA)",
          why: "Enhances cache line utilization by grouping coordinates sequentially in memory, enabling auto-vectorization by the compiler.",
        },
      ],
    },
  },
  {
    id: "quiz-app",
    title: "Interactive Quiz App",
    description: "Full-stack real-time quiz platform for interactive learning.",
    longDescription:
      "A comprehensive quiz application featuring separate dashboards for Teachers and Students, real-time interactive gameplay, and persistent leaderboard tracking. Built with React 19, Node.js, and MongoDB.",
    bulletPoints: [
      "Built a comprehensive full-stack real-time quiz platform with separate dashboards for Teachers and Students.",
      "Implemented real-time interactive gameplay and persistent leaderboard tracking.",
      "Developed user-friendly responsive interface using React 19 and Tailwind CSS.",
    ],
    tags: ["React 19", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    type: "web",
    link: "https://quiz-app-six-rust-67.vercel.app/",
    github: "https://github.com/Bharat940/Quiz-app",
    logo: "React",
    readmeUrl:
      "https://raw.githubusercontent.com/Bharat940/Quiz-app/main/README.md",
    screenshots: ["/screenshots/Quiz.png"],
  },
];

export interface ClubActivity {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string[];
}

export const experiences: Experience[] = [
  {
    id: "soundspire-intern",
    role: "Full Stack Intern",
    company: "SoundSpire",
    period: "Aug 2025 - Nov 2025",
    description: [
      "Built core features for SoundSpire's Artist Hub platform, focusing on authentication and onboarding flows.",
      "Developed frontend (Next.js), backend endpoints (Node.js), and PostgreSQL schema for Sign-up and Preference Selection.",
      "Implemented Google & Email authentication, Sign-out, Forgot password, and preference logic.",
      "Integrated Soundcharts API for artist analytics and profile insights.",
      "Improved UI/UX in collaboration with design and engineering teams.",
    ],
  },
];

export const clubs: ClubActivity[] = [
  {
    id: "ecell-rgpv",
    role: "Web Developer",
    organization: "E-Cell RGPV",
    period: "2024 - Present",
    description: [
      "Improved web platforms for event management and student engagement.",
      "Focused on UI refinements and robust API integration.",
    ],
  },
  {
    id: "doit-coding-club",
    role: "Frontend Developer",
    organization: "DoIT Coding Club",
    period: "Aug 2025 - Nov 2025",
    description: [
      "Built responsive frontend for CodeAdept event.",
      "Integrated Firebase-based registration system.",
    ],
  },
];

export const education: Education[] = [
  {
    id: "btech-it",
    degree: "B.Tech, Information Technology",
    institution: "University Institute of Technology, RGPV",
    period: "2024 - 2028",
    grade: "7.94 / 10 CGPA",
  },
  {
    id: "class-12",
    degree: "Class 12 (PCM)",
    institution: "Deepmala Pagarani H.S. Public School",
    period: "2024",
    grade: "91.6%",
  },
  {
    id: "class-10",
    degree: "Class 10",
    institution: "Deepmala Pagarani H.S. Public School",
    period: "2022",
    grade: "85%",
  },
];
