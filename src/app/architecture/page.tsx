import { Metadata } from "next";
import { QuickNav, MobileBottomNav } from "@/components/layout/QuickNav";
import {
  Home,
  BookOpen,
  Terminal,
  Shield,
  Cpu,
  RefreshCw,
  Lock,
  Database,
  Layout,
} from "lucide-react";
import MermaidDiagram from "@/components/architecture/MermaidDiagram";

export const metadata: Metadata = {
  title: "System Architecture",
  description:
    "System architecture, technology choices, and data flows of the portfolio platform.",
  openGraph: {
    title: "System Architecture | Bharat Dangi",
    description:
      "A deep dive into the engineering, RAG pipelines, caching strategies, and data schema behind this portfolio.",
  },
  alternates: {
    canonical: "/architecture",
  },
};

export default function ArchitecturePage() {
  const navItems = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Journal", href: "/blog?tag=build-log", icon: <BookOpen className="w-4 h-4" /> },
    {
      name: "Matrix",
      href: "#tech-decisions",
      icon: <Layout className="w-4 h-4" />,
      isSection: true,
    },
    {
      name: "Request Flow",
      href: "#request-pipeline",
      icon: <Terminal className="w-4 h-4" />,
      isSection: true,
    },
    {
      name: "RAG Pipeline",
      href: "#rag-architecture",
      icon: <Cpu className="w-4 h-4" />,
      isSection: true,
    },
    {
      name: "Caching Strategy",
      href: "#cache-domains",
      icon: <RefreshCw className="w-4 h-4" />,
      isSection: true,
    },
    {
      name: "Auth Protocols",
      href: "#auth-protocols",
      icon: <Lock className="w-4 h-4" />,
      isSection: true,
    },
    {
      name: "Database Schema",
      href: "#schema-architecture",
      icon: <Database className="w-4 h-4" />,
      isSection: true,
    },
    {
      name: "Deployment Topology",
      href: "#deployment-pipelines",
      icon: <Shield className="w-4 h-4" />,
      isSection: true,
    },
  ];

  // Request Flow Diagram
  const requestFlowChart = `
graph TD
    User[User Client Browser] -->|HTTP Request| CF[Cloudflare CDN]
    CF -->|Edge Routing| Vercel[Vercel Serverless Edge]
    Vercel -->|Dynamic SSR / Fetch| RSC[React Server Components]
    Vercel -->|REST API Request| API[Next.js Route Handlers]
    RSC -->|Queries| Drizzle[Drizzle ORM]
    API -->|Queries| Drizzle
    Drizzle -->|HTTP Serverless Driver| Neon[(Neon Serverless Postgres)]
    API -->|Prompt & Context| AISDK[Vercel AI SDK]
    AISDK -->|API Request| Gemini[Google Gemini API]
  `;

  // RAG Pipeline Diagram
  const ragPipelineChart = `
graph TD
    Input[Terminal /ask Command] --> EmbedRoute[API Route: /api/chat]
    EmbedRoute --> GeminiEmbed[Gemini Text Embeddings API]
    GeminiEmbed -->|Vector embedding| VectorQuery[Neon Vector Database Query]
    VectorQuery -->|Cosine similarity search| KnowledgeTable[(knowledge Table)]
    KnowledgeTable -->|Relevant portfolio text segments| PromptBuilder[Context & Prompt Builder]
    PromptBuilder --> GeminiChat[Gemini Pro LLM API]
    GeminiChat --> Output[Terminal UI Response]
  `;

  // Auth Flow Diagram
  const authFlowChart = `
graph TD
    Start[User Authentication] --> Choice{Provider Selection}
    Choice -->|Email & Password| OTPVerify[Request verification code]
    OTPVerify --> SendEmail[Nodemailer Dispatch]
    SendEmail --> CodeInput[Enter verification code]
    CodeInput --> VerifySession[Better Auth Validation]
    Choice -->|OAuth Google / GitHub| OAuthRedirect[Redirect to Provider]
    OAuthRedirect --> Callback[OAuth Callback Route]
    Callback --> VerifySession
    VerifySession --> Active[Session Established]
  `;

  // Deployment Topology Diagram
  const deploymentChart = `
graph TD
    Local[Local Machine] -->|Git Commit & Push| GitHub[GitHub Repository]
    GitHub -->|Workflow Trigger| GHA[GitHub Actions CI/CD]
    GHA -->|Trigger Runs| Test[Lint & Test Execution]
    Test -->|Build & Deploy| Vercel[Vercel Serverless Hosting]
    Vercel -->|Read/Write Operations| Neon[(Neon Serverless Database)]
    GHA -->|Container Package| Docker[Docker Hub / Registry]
  `;

  return (
    <main className="flex flex-col min-h-screen bg-ctp-crust text-ctp-text font-mono relative">
      <QuickNav items={navItems} />
      <MobileBottomNav items={navItems} />

      {/* Header Section */}
      <section className="pt-28 md:pt-36 pb-12 flex flex-col justify-center px-6 md:px-12 lg:px-20 border-b border-ctp-surface0 bg-ctp-base/50 relative overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#cba6f7 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto w-full py-12">
          <div className="flex items-center gap-3 text-ctp-mauve mb-4">
            <Cpu className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              SYSTEM ENGINE SPECS / CORE DESIGN
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-ctp-text mb-6">
            SYSTEM ARCHITECTURE
          </h1>

          <p className="text-sm md:text-base text-ctp-subtext0 max-w-2xl leading-relaxed">
            Detailed hardware abstractions, pipeline diagrams, and software
            selections defining the high-performance execution layers of this
            portfolio.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-5xl mx-auto w-full px-6 py-12 md:py-16 space-y-16">
        {/* Section 1: Tech Decision Table */}
        <section id="tech-decisions" className="space-y-6 scroll-mt-20">
          <div className="flex items-center gap-3 border-b border-ctp-surface0 pb-3">
            <Layout className="w-5 h-5 text-ctp-mauve" />
            <h2 className="text-lg md:text-xl font-bold text-ctp-text">
              1. Technology Decision Matrix
            </h2>
          </div>
          <div className="overflow-x-auto border border-ctp-surface0 rounded-2xl bg-ctp-base/60">
            <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
              <thead>
                <tr className="bg-ctp-mantle/70 text-ctp-mauve border-b border-ctp-surface0">
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Decision Layer
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Chosen stack
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Alternatives
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Reasoning
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ctp-surface0/60 text-ctp-subtext0">
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">Database</td>
                  <td className="p-4 text-ctp-green">Neon PostgreSQL</td>
                  <td className="p-4">Supabase, PlanetScale</td>
                  <td className="p-4">
                    Supports pgvector natively for semantic search; serverless
                    HTTP connection driver fits Edge runtime.
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">ORM</td>
                  <td className="p-4 text-ctp-green">Drizzle ORM</td>
                  <td className="p-4">Prisma ORM</td>
                  <td className="p-4">
                    Lighter bundle footprint, type-safe SQL construction, no
                    query engine overhead inside Edge functions.
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">Auth</td>
                  <td className="p-4 text-ctp-green">Better Auth</td>
                  <td className="p-4">Auth.js, Clerk</td>
                  <td className="p-4">
                    Full database adapter autonomy, built-in email validation
                    flows, no third-party vendor lock-in.
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">Animation</td>
                  <td className="p-4 text-ctp-green">`motion/react`</td>
                  <td className="p-4">Framer Motion</td>
                  <td className="p-4">
                    Modern tree-shakeable alternative offering identical syntax
                    but resulting in smaller bundle targets.
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">AI Layer</td>
                  <td className="p-4 text-ctp-green">Gemini + Vercel AI SDK</td>
                  <td className="p-4">OpenAI SDK</td>
                  <td className="p-4">
                    High performance API response times, native 3072-dimensional
                    vector embedding models matching Postgres indexing.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Request Flow */}
        <section id="request-pipeline" className="space-y-6 scroll-mt-20">
          <div className="flex items-center gap-3 border-b border-ctp-surface0 pb-3">
            <Terminal className="w-5 h-5 text-ctp-mauve" />
            <h2 className="text-lg md:text-xl font-bold text-ctp-text">
              2. Request Execution Pipeline
            </h2>
          </div>
          <p className="text-xs md:text-sm text-ctp-subtext0 leading-relaxed">
            Data resolution paths showing client request routing through Content
            Delivery Networks (CDN) and edge caches, terminating in database
            query execution loops.
          </p>
          <MermaidDiagram chart={requestFlowChart} id="req-flow" />
        </section>

        {/* Section 3: RAG Pipeline */}
        <section id="rag-architecture" className="space-y-6 scroll-mt-20">
          <div className="flex items-center gap-3 border-b border-ctp-surface0 pb-3">
            <Cpu className="w-5 h-5 text-ctp-mauve" />
            <h2 className="text-lg md:text-xl font-bold text-ctp-text">
              3. Retrieval-Augmented Generation (RAG) Architecture
            </h2>
          </div>
          <p className="text-xs md:text-sm text-ctp-subtext0 leading-relaxed">
            Vector embeddings processing pipeline mapping natural language
            prompts to similarity calculations over indexed tables inside Neon.
          </p>
          <MermaidDiagram chart={ragPipelineChart} id="rag-pipe" />
        </section>

        {/* Section 4: Caching Strategy */}
        <section id="cache-domains" className="space-y-6 scroll-mt-20">
          <div className="flex items-center gap-3 border-b border-ctp-surface0 pb-3">
            <RefreshCw className="w-5 h-5 text-ctp-mauve" />
            <h2 className="text-lg md:text-xl font-bold text-ctp-text">
              4. Application Cache Domains
            </h2>
          </div>
          <div className="overflow-x-auto border border-ctp-surface0 rounded-2xl bg-ctp-base/60">
            <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
              <thead>
                <tr className="bg-ctp-mantle/70 text-ctp-mauve border-b border-ctp-surface0">
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Caching Layer
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Cached Context
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Time-to-Live (TTL)
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Invalidation Strategy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ctp-surface0/60 text-ctp-subtext0">
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">
                    Next.js Static Paths
                  </td>
                  <td className="p-4">
                    Rendered layout and route structures (/, /projects, /about)
                  </td>
                  <td className="p-4 text-ctp-green">Permanent</td>
                  <td className="p-4">
                    On-demand build execution; revalidate parameters on dynamic
                    endpoints.
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">
                    GitHub REST API
                  </td>
                  <td className="p-4">
                    Contribution histories and statistics values
                  </td>
                  <td className="p-4 text-ctp-green">3600 seconds (1 hour)</td>
                  <td className="p-4">
                    Stale-while-revalidate fetching on server routes.
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">LeetCode API</td>
                  <td className="p-4">
                    Problem submission frequencies and tracking metrics
                  </td>
                  <td className="p-4 text-ctp-green">3600 seconds (1 hour)</td>
                  <td className="p-4">
                    Incremental background fetch during diagnostic dashboard
                    request cycles.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Authentication Flow */}
        <section id="auth-protocols" className="space-y-6 scroll-mt-20">
          <div className="flex items-center gap-3 border-b border-ctp-surface0 pb-3">
            <Lock className="w-5 h-5 text-ctp-mauve" />
            <h2 className="text-lg md:text-xl font-bold text-ctp-text">
              5. Authentication Protocols
            </h2>
          </div>
          <p className="text-xs md:text-sm text-ctp-subtext0 leading-relaxed">
            Sequence routing for login procedures via standard provider callback
            handlers or validation loops.
          </p>
          <MermaidDiagram chart={authFlowChart} id="auth-flow" />
        </section>

        {/* Section 6: Database Schema */}
        <section id="schema-architecture" className="space-y-6 scroll-mt-20">
          <div className="flex items-center gap-3 border-b border-ctp-surface0 pb-3">
            <Database className="w-5 h-5 text-ctp-mauve" />
            <h2 className="text-lg md:text-xl font-bold text-ctp-text">
              6. Schema Architecture
            </h2>
          </div>
          <div className="overflow-x-auto border border-ctp-surface0 rounded-2xl bg-ctp-base/60">
            <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
              <thead>
                <tr className="bg-ctp-mantle/70 text-ctp-mauve border-b border-ctp-surface0">
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Relation Table
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Field Keys
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ctp-surface0/60 text-ctp-subtext0">
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">users</td>
                  <td className="p-4 text-ctp-yellow">
                    id, name, email, role, isBanned, createdAt
                  </td>
                  <td className="p-4">
                    Session identities and permissions control (admin access for
                    stats and content controls).
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">blogs</td>
                  <td className="p-4 text-ctp-yellow">
                    id, title, slug, content, published, authorId, createdAt
                  </td>
                  <td className="p-4">
                    Relational storage holding editorial content write-ups,
                    tracking creation timestamps.
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">comments</td>
                  <td className="p-4 text-ctp-yellow">
                    id, blogId, userId, parentId, text, isPinned, createdAt
                  </td>
                  <td className="p-4">
                    Hierarchy of comment records linking user identities to blog
                    post items.
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">analytics</td>
                  <td className="p-4 text-ctp-yellow">
                    id, metricName, value, updatedAt
                  </td>
                  <td className="p-4">
                    Aggregated tracking records for total page hits, blog reads,
                    and terminal commands.
                  </td>
                </tr>
                <tr className="hover:bg-ctp-surface0/20 transition-colors">
                  <td className="p-4 font-bold text-ctp-text">knowledge</td>
                  <td className="p-4 text-ctp-yellow">
                    id, content, embedding (vector)
                  </td>
                  <td className="p-4">
                    Segmented text database holding high-dimensional vector
                    representations for RAG queries.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 7: Deployment Topology */}
        <section id="deployment-pipelines" className="space-y-6 scroll-mt-20">
          <div className="flex items-center gap-3 border-b border-ctp-surface0 pb-3">
            <Shield className="w-5 h-5 text-ctp-mauve" />
            <h2 className="text-lg md:text-xl font-bold text-ctp-text">
              7. Deployment Pipelines & Topology
            </h2>
          </div>
          <p className="text-xs md:text-sm text-ctp-subtext0 leading-relaxed">
            Deployment paths tracing code submission from git repositories
            through automation checks to Vercel compute containers.
          </p>
          <MermaidDiagram chart={deploymentChart} id="deploy-flow" />
        </section>
      </div>
    </main>
  );
}
