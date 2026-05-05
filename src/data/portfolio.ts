export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  type: 'web' | 'native';
  link?: string;
  github?: string;
  logo: string; // Filename in /public/logos
  screenshots?: string[];
  readmeUrl?: string;
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
    id: 'node-weave',
    title: 'NodeWeave',
    description: 'SaaS Automation Platform with distributed execution engine.',
    longDescription: 'Built a scalable workflow automation platform featuring a fault-tolerant job processing engine, sandboxed execution for dynamic user workflows, and real-time tracking.',
    tags: ['Next.js', 'tRPC', 'Prisma', 'PostgreSQL', 'Inngest'],
    type: 'web',
    link: 'https://node-weave.vercel.app/',
    github: 'https://github.com/Bharat940/nodeweave',
    logo: 'Next.js',
    readmeUrl: 'https://raw.githubusercontent.com/Bharat940/nodeweave/main/README.md',
    screenshots: ['/screenshots/NodeWeave.png'],
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description: 'Analytics-driven URL shortener with Redis rate limiting.',
    longDescription: 'Developed a URL shortener with custom links, click-tracking analytics, and JWT-based authentication. Implemented Redis for high-performance rate limiting.',
    tags: ['Node.js', 'Redis', 'JWT', 'Tailwind CSS'],
    type: 'web',
    link: 'https://bharat-url-shortener.vercel.app/',
    github: 'https://github.com/Bharat940/url-shortener-analytics',
    logo: 'Node.js',
    readmeUrl: 'https://raw.githubusercontent.com/Bharat940/url-shortener-analytics/main/README.md',
    screenshots: ['/screenshots/URL_Shortener.png'],
  },
  {
    id: 'math-plotter',
    title: 'Math Plotter',
    description: 'Real-time function plotting engine with custom parser.',
    longDescription: 'Built with SDL2 and CMake. Features a custom expression parser using the Shunting-Yard algorithm and numerical methods for root finding and derivatives.',
    tags: ['C++', 'SDL2', 'CMake'],
    type: 'native',
    github: 'https://github.com/Bharat940/Simple-math-calculator-and-plotter',
    logo: 'C++',
    readmeUrl: 'https://raw.githubusercontent.com/Bharat940/Simple-math-calculator-and-plotter/main/README.md',
    screenshots: ['/screenshots/Plotter.png'],
  },
  {
    id: 'ray-tracer',
    title: 'Ray Tracer',
    description: 'CPU-based Monte Carlo path tracing engine in C++.',
    longDescription: 'Built a photorealistic rendering engine from scratch. Implemented ray-object intersection, light scattering, and materials like metal and dielectric. Optimized with OpenMP.',
    tags: ['C++', 'OpenMP', 'Graphics'],
    type: 'native',
    github: 'https://github.com/Bharat940/Raytracing-Cpp',
    logo: 'C++',
    readmeUrl: 'https://raw.githubusercontent.com/Bharat940/Raytracing-Cpp/main/README.md',
    screenshots: ['/screenshots/Raytracer.png'],
  },
  {
    id: 'quiz-app',
    title: 'Interactive Quiz App',
    description: 'Full-stack real-time quiz platform for interactive learning.',
    longDescription: 'A comprehensive quiz application featuring separate dashboards for Teachers and Students, real-time interactive gameplay, and persistent leaderboard tracking. Built with React 19, Node.js, and MongoDB.',
    tags: ['React 19', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    type: 'web',
    link: 'https://quiz-app-six-rust-67.vercel.app/',
    github: 'https://github.com/Bharat940/Quiz-app',
    logo: 'React',
    readmeUrl: 'https://raw.githubusercontent.com/Bharat940/Quiz-app/main/README.md',
    screenshots: ['/screenshots/Quiz.png'],
  },
  {
    id: 'finance-dashboard',
    title: 'Next.js Finance Dashboard',
    description: 'Modern financial analytics dashboard with transaction tracking.',
    longDescription: 'A high-performance financial management dashboard featuring account aggregation, category-based transaction tracking, and interactive data visualization. Built with Next.js and Hono.js.',
    tags: ['Next.js', 'Hono.js', 'Lucide', 'Tailwind CSS'],
    type: 'web',
    link: 'https://bharat-finance-dashboard.vercel.app/',
    github: 'https://github.com/Bharat940/Nextjs-Finance-Dashboard',
    logo: 'Next.js',
    readmeUrl: 'https://raw.githubusercontent.com/Bharat940/Nextjs-Finance-Dashboard/main/README.md',
    screenshots: ['/screenshots/Finance.png'],
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
    id: 'soundspire-intern',
    role: 'Full Stack Intern',
    company: 'SoundSpire',
    period: 'Aug 2025 - Nov 2025',
    description: [
      'Built core features for SoundSpire’s Artist Hub platform, focusing on authentication and onboarding flows.',
      'Developed frontend (Next.js), backend endpoints (Node.js), and PostgreSQL schema for Sign-up and Preference Selection.',
      'Implemented Google & Email authentication, Sign-out, Forgot password, and preference logic.',
      'Integrated Soundcharts API for artist analytics and profile insights.',
      'Improved UI/UX in collaboration with design and engineering teams.',
    ],
  },
];

export const clubs: ClubActivity[] = [
  {
    id: 'ecell-rgpv',
    role: 'Web Developer',
    organization: 'E-Cell RGPV',
    period: '2024 - Present',
    description: [
      'Improved web platforms for event management and student engagement.',
      'Focused on UI refinements and robust API integration.',
    ],
  },
  {
    id: 'doit-coding-club',
    role: 'Frontend Developer',
    organization: 'DoIT Coding Club',
    period: 'August 2025 - November 2025',
    description: [
      'Built responsive frontend for CodeAdept event.',
      'Integrated Firebase-based registration system.',
    ],
  },
];

export const education: Education[] = [
  {
    id: 'btech-it',
    degree: 'B.Tech, Information Technology',
    institution: 'University Institute of Technology, RGPV',
    period: '2024 - 2028',
    grade: '7.94 / 10 CGPA',
  },
  {
    id: 'class-12',
    degree: 'Class 12 (PCM)',
    institution: 'Deepmala Pagarani H.S. Public School',
    period: '2024',
    grade: '91.6%',
  },
  {
    id: 'class-10',
    degree: 'Class 10',
    institution: 'Deepmala Pagarani H.S. Public School',
    period: '2022',
    grade: '85%',
  },
];
