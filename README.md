<div align="center">
  <img src="./public/logo.png" alt="Product Logo" width="120" height="120" />
  <h1>Developer Operating System</h1>
  <p><strong>A full-stack portfolio platform combining AI search, blogging, analytics, gaming, and content management into a single production-grade application.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM" />
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer" alt="Motion" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  </p>

  <p>
    <a href="https://bharat-dangi.vercel.app/">Live Demo</a> •
    <a href="#why-i-built-this">Why I Built This</a> •
    <a href="#system-architecture">Architecture</a> •
    <a href="#technical-challenges">Technical Challenges</a> •
    <a href="#case-studies">Case Studies</a> •
    <a href="#performance">Performance</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

<br />

---

## Why I Built This

Most developer portfolios are static websites. I wanted to create a platform that demonstrates my software engineering capabilities directly through visitor interaction.

Instead of reading about my skills, visitors can:
- Query an AI assistant directly inside a mock shell
- Explore native C++ and web projects through interactive terminal commands
- Read technical articles on distributed systems
- Play custom-built browser games compiled for retro arcade systems
- View real-time developer metrics tracked via database instrumentation

The portfolio itself acts as a production-grade demonstration of my abilities.

---

## Core Features

- **Dual-Mode Layout**: Features an interactive Developer Mode (with terminal emulation, CRT themes, custom cursor, and games) and a streamlined Recruiter Mode (a high-contrast single-page interactive resume featuring automatic developer subpage redirection, direct resume downloads, and smooth anchor scrolling). A hidden **Matrix Mode** easter egg is also available.
- **Interactive AI Terminal**: A complete terminal emulator (trigger with `Ctrl+K` or `Cmd+K` in Developer Mode) supporting custom CLI commands like `neofetch`, `stats`, `recommend-project`, `explain-skill <skill>`, `show-experience`, `joke`, `easteregg`, and AI queries via `ask [question]`.
- **Dynamic Blogging**: Write and edit technical articles inside a secure admin portal. Readers can write nested comments authenticated via Better Auth. Blog posts support Markdown, GFM, syntax highlighting, and Mermaid diagrams. Comment avatars are auto-generated via DiceBear.
- **System Stats Dashboard**: A dedicated dashboard at `/stats` showing database-tracked metrics including page views, terminal execution counts, and project clicks. Integrates live GitHub contributions and LeetCode activity with server-side caching.
- **Retro Arcade Suite**: Standalone web arcade featuring classic titles: TerminalInvaders, CyberSlither, BinaryBound, and MemoryMatch.
- **System Architecture Visualizations**: A dedicated page at `/architecture` displaying interactive, dynamic Mermaid.js system maps (Request flow, RAG pipeline, Auth lifecycle, Deployment topology) along with tech stacks, database schemas, and anchor navigation.
- **Contact API**: A `/api/contact` endpoint with server-side email delivery via Nodemailer SMTP.
- **SEO & Structured Data**: Auto-generated `sitemap.xml`, `robots.txt`, full Open Graph / Twitter card metadata, and JSON-LD `Person` + `WebSite` schema on every page.
- **View Transitions**: Native browser View Transition API enabled for smooth page-to-page animations.

---

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Home page — dual-mode landing |
| `/about` | About page with experience timeline |
| `/projects` | Filterable project showcase |
| `/blog` | Blog index |
| `/blog/[slug]` | Individual blog post with nested comments |
| `/arcade` | Retro arcade game hub |
| `/stats` | Live analytics dashboard |
| `/architecture` | Detailed system engine specs & Mermaid visualizations |
| `/admin` | Admin portal for blog management (admin-only) |
| `/api/chat` | AI RAG chat endpoint (Gemini + pgvector) |
| `/api/contact` | Email contact form endpoint |
| `/api/auth/[...]` | Better Auth handler |
| `/api/github-contributions` | Cached GitHub contribution data |
| `/api/leetcode` | Cached LeetCode stats |
| `/api/blog` | Blog CRUD endpoints |

---

## System Architecture

### Application Stack Layout

```mermaid
graph TD
    User[User / Client Browser]
    NextJS[Next.js App Router]
    ClientComponents[Client Components]
    ServerComponents[Server Components]
    ServerActions[Server Actions]
    APIRoutes[API Routes]
    Drizzle[Drizzle ORM]
    Postgres[(Neon PostgreSQL)]
    BetterAuth[Better Auth]
    VercelAI[Vercel AI SDK]
    Gemini[Google Gemini API]

    User --> NextJS
    NextJS --> ClientComponents
    NextJS --> ServerComponents
    ClientComponents --> ServerActions
    ClientComponents --> APIRoutes
    ServerComponents --> Drizzle
    ServerActions --> Drizzle
    APIRoutes --> Drizzle
    Drizzle --> Postgres
    ClientComponents --> BetterAuth
    ServerActions --> BetterAuth
    ServerActions --> VercelAI
    VercelAI --> Gemini
```

### AI RAG Pipeline

```mermaid
graph TD
    Input[Terminal /ask Command]
    EmbedRoute[API Route: /api/chat]
    GeminiEmbed[Gemini Text Embeddings API]
    VectorQuery[Neon Vector Database Query]
    KnowledgeTable[(knowledge Table)]
    PromptBuilder[Context & Prompt Builder]
    GeminiChat[Gemini Pro LLM API]
    Output[Terminal UI Response]

    Input --> EmbedRoute
    EmbedRoute --> GeminiEmbed
    GeminiEmbed -->|Vector embedding| VectorQuery
    VectorQuery -->|Cosine similarity search| KnowledgeTable
    KnowledgeTable -->|Relevant portfolio text segments| PromptBuilder
    PromptBuilder --> GeminiChat
    GeminiChat --> Output
```

### Database Schema

| Table | Purpose |
|-------|---------|
| `user` | Better Auth users with role-based access (`admin` / `user`) and ban management |
| `session` | Active user sessions |
| `account` | OAuth provider account links (Google, GitHub) |
| `verification` | Email verification tokens |
| `blogs` | Blog posts with slug, category, tags, icon, cover image, and publish state |
| `comments` | Nested blog comments with emoji reactions, DiceBear avatars, and like counts |
| `knowledge` | AI RAG knowledge base — text chunks with 3072-dimension Gemini vector embeddings |
| `analytics` | Named metric counters (page views, terminal executions, project clicks) |

---

## Technical Challenges

### AI Terminal Context Management
- **Problem**: Maintaining conversation context while keeping response latency low for portfolio-specific queries.
- **Solution**: Developed a RAG pipeline utilizing vector search against a pre-indexed knowledge base, avoiding full database scans. Only relevant text fragments are injected into the Gemini context window.
- **Result**: Sub-second contextual retrieval for portfolio-specific questions.

### External API Synchronization and Latency
- **Problem**: Synchronizing real-time developer statistics (GitHub contributions and LeetCode activity) introduced severe loading delays due to third-party rate limits and latency.
- **Solution**: Built server-side caching and data aggregation. The application polls APIs in the background and serves cached metrics, falling back to database logs if endpoints timeout.
- **Result**: Reduced average dashboard load times by 60 percent.

---

## Case Studies

### NodeWeave: SaaS Workflow Automation Platform
- **Problem**: Small teams need a Zapier-like workflow builder but require custom scripting, self-hosting flexibility, and high-frequency scheduling.
- **Solution**: Built a node-based workflow builder with scheduling, background jobs, conditional execution, and reusable templates.
- **Key Technologies**: Next.js, tRPC, PostgreSQL, Inngest, Prisma.
- **Key Challenges**: Ensuring execution reliability, sandboxing dynamic user workflows, and implementing event replay capabilities.
- **Outcome**: A production-ready SaaS automation architecture.

### Ray Tracer: C++ Path Tracing Engine
- **Problem**: Generating photorealistic scenes requires complex light transport simulations that are computationally expensive on CPU architectures.
- **Solution**: Developed a CPU-based Monte Carlo path tracing engine from scratch. Implemented ray-object intersection, light scattering, and materials (metal, dielectric, lambertian).
- **Key Technologies**: C++, OpenMP, CMake.
- **Key Challenges**: Optimizing CPU thread usage and memory layout to prevent caching issues during recursive ray tracing.
- **Outcome**: Fully optimized photorealistic engine rendering scenes in parallel.

### URL Shortener: Analytics Service
- **Problem**: URL redirection systems face heavy traffic spikes, requiring quick redirects, high-rate limits, and real-time click tracking.
- **Solution**: Built a URL shortening service with custom link aliases, click analytics, and JWT authentication.
- **Key Technologies**: Node.js, Express, Redis, PostgreSQL.
- **Key Challenges**: Implementing high-performance rate limiting to mitigate denial of service attacks without slowing down legitimate redirects.
- **Outcome**: Reduced redirection latency to under 15ms using Redis caching.

### Math Plotter: SDL2 Function Plotting Engine
- **Problem**: Parsing and graphing complex mathematical functions in real time with high accuracy.
- **Solution**: Built a native C++ graphing tool featuring a custom expression parser using the Shunting-Yard algorithm and numerical methods for roots and derivatives.
- **Key Technologies**: C++, SDL2, CMake.
- **Key Challenges**: Managing floating-point precision issues and implementing robust syntax validation in raw C++ strings.
- **Outcome**: High-framerate math visualization tool.

---

## Performance

- **Lighthouse Performance**: 98+
- **Accessibility**: 100
- **SEO**: 100
- **First Contentful Paint**: 0.7s
- **Largest Contentful Paint**: 1.0s
- **Speed Index**: 1.4s
- **Bundle Size**: 180KB initial JavaScript

---

## Getting Started

### Setup Prerequisites
- Node.js 20 or higher
- PostgreSQL Database (Neon recommended for pgvector support)
- npm or pnpm
- Docker (optional, for containerized deployment)

### Quick Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/Bharat940/Portfolio_and_Resume.git
   cd Portfolio_and_Resume
   npm install
   ```

2. **Environment Variables**

   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   ```env
   # Database (Neon/Postgres — must support pgvector extension)
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

   # Better Auth
   BETTER_AUTH_SECRET=your_long_random_secret_here
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

   # OAuth Providers
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=

   # AI (Google Gemini)
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

   # Email / SMTP (for OTP and password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM="Portfolio <auth@yourdomain.com>"

   # Test Utilities (optional)
   ENABLE_TEST_UTILS=false
   ```

3. **Database Migration**
   ```bash
   npx drizzle-kit push
   ```

4. **Ingest AI Knowledge Base**
   ```bash
   npm run ingest
   ```

5. **Development Server**
   ```bash
   npm run dev
   ```

The application will be live at `http://localhost:3000`.

### Docker Deployment

A multi-stage Dockerfile is included for production deployments:

```bash
# Build the image
docker build -t portfolio .

# Run the container
docker run -p 3000:3000 --env-file .env portfolio
```

---

## Scripts and Commands

| Script | Description |
|--------|-------------|
| `npm run dev` | Launch the Next.js development server |
| `npm run build` | Compile the production bundle |
| `npm run start` | Start the production server |
| `npm run test` | Run the Vitest testing suite |
| `npm run lint` | Enforce code formatting and quality rules |
| `npm run ingest` | Execute the AI knowledge base ingestion script to populate the Gemini RAG context |

---

## Terminal Commands Reference

Open the terminal with `Ctrl+K` / `Cmd+K` while in Developer Mode:

| Command | Description |
|---------|-------------|
| `neofetch` | Display a stylized system info panel with Gengar ASCII art |
| `stats` | Print live page views and execution metrics from the database |
| `recommend-project` | Get an AI-recommended project based on your interests |
| `explain-skill <name>` | Get a breakdown of a specific skill |
| `show-experience` | Print the full work experience timeline |
| `ask <question>` | Query the AI assistant using the RAG pipeline |
| `joke` | Print a developer joke |
| `easteregg` | Trigger a hidden easter egg |
| `help` | List all available commands |

---

## Auth System

Authentication is powered by [Better Auth](https://better-auth.com) with the following methods:

- **Email OTP** — passwordless login via one-time codes sent to email (default sign-in flow)
- **Email + Password** — traditional login with mandatory email verification
- **Google OAuth** — sign in with a Google account
- **GitHub OAuth** — sign in with a GitHub account
- **Admin Plugin** — role-based access control (`admin` / `user`) for the `/admin` portal
- **Test Utilities** — OTP capture mode for Vitest integration (enabled via `ENABLE_TEST_UTILS=true`)

---

## Future Roadmap

- [ ] Add voice-enabled input commands for the AI Terminal.
- [ ] Implement AI-driven project recommendation engine on the homepage.
- [ ] Add multi-language localization to the blogging platform.
- [ ] Build a private dashboard for admin analytics tracking.

---

<p align="center">
  Distributed under the MIT License. Built with care by
  <strong>Bharat Dangi</strong>
  (<a href="mailto:bdangi450@gmail.com">bdangi450@gmail.com</a>).
</p>
