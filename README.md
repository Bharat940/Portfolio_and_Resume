<div align="center">
  <img src="./public/logo.png" alt="Portfolio Logo" width="120" height="120" />
  <h1>Bharat Dangi's Technical Portfolio</h1>
  <p><strong>A high-performance, developer-centric portfolio with an integrated AI terminal.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM" />
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer" alt="Framer Motion" />
  </p>

  <p>
    <a href="https://bharat-dangi.vercel.app/">Live Demo</a> •
    <a href="#overview">Overview</a> •
    <a href="#core-features">Features</a> •
    <a href="#technology-stack">Tech Stack</a> •
    <a href="#project-structure">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#scripts-and-commands">Commands</a>
  </p>
</div>

<br />

---

## Overview

This project is a modern developer portfolio that follows a premium Catppuccin Mocha aesthetic. It allows users to explore technical projects, interact with an AI-powered terminal emulator, and engage with technical blog posts through an authenticated comment system.

The platform emphasizes professional dark mode consistency, high-performance animations using Framer Motion, and robust background operations powered by Next.js server actions and Drizzle ORM.

<p align="center">
  <img src="./public/screenshots/Portfolio.png" alt="Portfolio Screenshot" width="800" />
</p>

---

## Core Features

### Interactive AI Terminal
- **CLI Emulator**: A full-screen command-line interface built directly into the web application.
- **RAG Pipeline**: Integrated with Google Gemini 3.0 for intelligent context retrieval and responses based on the internal knowledge base.
- **Custom Commands**: Navigate the portfolio, fetch data, and interact using standard terminal commands.

### Dynamic Blogging System
- **Markdown Parsing**: Write and render technical content seamlessly using `react-markdown`.
- **Authentication**: Powered by Better Auth, supporting passwordless, OAuth, and anonymous sessions.
- **Interactive Comments**: Nested commenting system featuring Dicebear avatars and reaction tracking.

### UI Architecture and Animations
- **Staircase Transitions**: Seamless, app-like page navigation built with Framer Motion and the Next.js View Transitions API.
- **Matrix Protocol**: A global, high-performance theme toggle that transforms the entire UI into a CRT-style terminal aesthetic with scanlines and green glow effects.
- **DiamondDivider Optimization**: Custom divider components for precise diagonal transitions between sections using rotation-aware margins.
- **Immersive UI Elements**: Includes a custom magnetic cursor (`CustomCursor`), `GlobalMatrixEffects`, and smooth `ScrollProgress` indicators.
- **QuickNav Dock**: A MacOS-style mobile dock navigation component for quick access.

### Retro Arcade Suite
- **Standalone Game Center**: A dedicated `/arcade` route for immersive, full-screen gameplay outside the terminal environment.
- **Responsive Pixel Games**: A collection of high-performance games including `Terminal Invaders`, `Cyber Slither`, `Binary Bound`, and `Memory Match`.
- **Fluid Scaling**: Fully responsive layouts optimized for everything from mobile devices to laptops using custom aspect-ratio management.

### Portfolio and Integrations
- **Live Metrics**: `ContributionGraph` and `PixelCalendar` components fetch and visualize real-time GitHub and LeetCode statistics.
- **Project Showcase**: Features an interactive `ProjectGrid` with a detailed `ProjectPreviewModal` and live README parsing (`ProjectReadme`).
- **Interactive Timeline**: An animated `ExperienceTimeline` detailing professional and educational history.

### Admin Dashboard
- **Content Management**: Built-in protected routes for managing blog posts, portfolio projects, and comments securely.

---

## Technology Stack

```mermaid
graph TD
    A[Frontend: Next.js 16 + React 19] --> B[API: Server Actions + Routes]
    B --> C[Backend: Node.js + Drizzle]
    C --> D[Database: Neon Serverless PostgreSQL]
    A --> E[Visuals: Framer Motion]
    A --> F[Styling: Tailwind CSS v4]
    C --> G[Auth: Better Auth]
    C --> H[AI: Vercel AI SDK + Gemini 3.0]
```

---

## Project Structure

```text
Portfolio_and_Resume/
├── public/                 # Static assets, fonts, SVGs, and resume PDF
├── src/
│   ├── app/                # Next.js App Router and Layouts
│   │   ├── admin/          # Protected dashboard routes
│   │   ├── api/            # API endpoints (Auth, Chat, Contact, Github, Leetcode)
│   │   ├── arcade/         # Standalone Retro Arcade Hub
│   │   ├── blog/           # Dynamic blog post rendering
│   │   └── projects/       # Portfolio projects showcase
│   ├── components/         # React Components
│   │   ├── layout/         # Navbar, Footer, QuickNav, DiamondDivider
│   │   ├── home/           # Hero, ExperienceTimeline, ProjectCards, Stats
│   │   ├── ui/             # CustomCursor, MatrixEffects, Shadcn primitives
│   │   ├── easter-eggs/    # Hidden interactive elements
│   │   └── terminal/       # Logic and UI for the interactive terminal
│   ├── context/            # React Context providers (Terminal, Cursor, Transitions)
│   ├── lib/                # Core business logic and integrations
│   │   ├── actions/        # Next.js Server Actions (Blogs, Comments)
│   │   ├── auth/           # BetterAuth configuration and adapters
│   │   ├── db/             # Drizzle schema, DB connections, AI ingest scripts
│   │   └── terminal/       # Terminal parsing utilities
│   ├── data/               # Static portfolio data and knowledge-base.md
│   ├── types/              # TypeScript interfaces and global types
│   └── __tests__/          # Vitest unit and integration test suites
```

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL Database
- npm or pnpm

### Quick Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/Bharat940/Portfolio_and_Resume.git
   cd Portfolio_and_Resume
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgres://user:password@hostname/dbname
   BETTER_AUTH_SECRET=your_super_secret_key
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

3. **Database Migration**
   ```bash
   npx drizzle-kit push
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

The application will be live at `http://localhost:3000`.

---

## Security and API

### Authentication
User authentication is managed securely via Better Auth, supporting encrypted session management, CSRF protection, and standardized OAuth flows. The database securely tracks active sessions, verifications, and accounts.

### API Routes
Internal API endpoints for external integrations (such as Contact, GitHub stats, and LeetCode stats) implement strict rate-limiting logic to prevent abuse and ensure reliable platform stability. Contact form submissions are handled safely through a verified Nodemailer SMTP transport.

---

## Scripts and Commands

- `npm run dev` : Next.js development server.
- `npm run build` : Production bundle generation.
- `npm run test` : Run Vitest unit and integration suites.
- `npm run lint` : Code quality enforcement.
- `npm run ingest` : Execute the AI knowledge base vectorization script to update Gemini's RAG context.

---

<p align="center">
  Distributed under the MIT License. Built with care by 
  <strong>Bharat Dangi</strong> 
  (<a href="mailto:bdangi450@gmail.com">bdangi450@gmail.com</a>).
</p>
