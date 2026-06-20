"use client";

import { useState, useEffect, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import mermaid from "mermaid";
import type { ReactElement } from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface ProjectReadmeProps {
  url: string;
  className?: string;
}

interface CodeElementProps {
  className?: string;
  children?: React.ReactNode;
}

export function ProjectReadme({ url, className }: ProjectReadmeProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Mermaid with a standard configuration
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "var(--font-source-code-pro)",
    });
  }, []);

  useEffect(() => {
    async function fetchReadme() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch README");
        let text = await response.text();

        // Transform Relative Image URLs to Absolute GitHub URLs
        const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);

        text = text.replace(
          /!\[(.*?)\]\((?!http)(.*?)\)/g,
          (match, alt, path) => {
            const cleanPath = path.startsWith("./")
              ? path.slice(2)
              : path.startsWith("/")
                ? path.slice(1)
                : path;
            return `![${alt}](${baseUrl}${cleanPath})`;
          },
        );

        text = text.replace(
          /<img\s+[^>]*src="([^"]+)"[^>]*>/g,
          (match, src) => {
            if (src.startsWith("http")) return match;
            const cleanSrc = src.startsWith("./")
              ? src.slice(2)
              : src.startsWith("/")
                ? src.slice(1)
                : src;
            return match.replace(src, `${baseUrl}${cleanSrc}`);
          },
        );

        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading README");
      } finally {
        setLoading(false);
      }
    }

    if (url) fetchReadme();
  }, [url]);

  // Mermaid Component
  const Mermaid = ({ chart }: { chart: string }) => {
    const [svg, setSvg] = useState<string>("");

    useEffect(() => {
      const renderMermaid = async () => {
        try {
          const { svg: renderedSvg } = await mermaid.render(
            `mermaid-${Math.random().toString(36).substr(2, 9)}`,
            chart,
          );
          setSvg(renderedSvg);
        } catch (e) {
          console.error("Mermaid error:", e);
        }
      };
      renderMermaid();
    }, [chart]);

    return (
      <div
        className="flex justify-center my-8 bg-ctp-crust/50 p-8 rounded-2xl border border-border/20 shadow-inner overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  };

  const components: Components = useMemo(
    () => ({
      img: ({ alt, src }) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={(src as string) || ""}
          alt={alt || ""}
          className="rounded-xl border border-border/30 my-8 shadow-lg max-w-full h-auto mx-auto object-contain"
        />
      ),

      pre: ({ children }) => {
        const codeEl = (children as ReactElement<CodeElementProps>)?.props;
        const className = codeEl?.className || "";
        const match = /language-(\w+)/.exec(className);
        const language = match ? match[1] : undefined;
        const codeContent = String(codeEl?.children ?? "").replace(/\n$/, "");

        if (language === "mermaid") {
          return <Mermaid chart={codeContent} />;
        }

        return (
          <CodeBlock
            language={language || "text"}
            value={codeContent}
          />
        );
      },

      // 'code' now only handles inline code (wrapped in single backticks)
      code: ({ className, children, ...props }) => (
        <code
          className={cn(
            "bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-mauve border border-border/20 font-mono text-xs",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      ),
    }),
    [],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
        <Loader2 className="w-5 h-5 animate-spin text-ctp-mauve" />
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          Accessing Payload...
        </p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-ctp-red bg-ctp-red/5 rounded-xl border border-ctp-red/20">
        <AlertCircle className="w-6 h-6" />
        <p className="font-mono text-[10px] uppercase tracking-widest">
          Signal Lost: {error || "Empty"}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("readme-prose", className)}>
      <div className="flex items-center gap-2 mb-6 text-muted-foreground/50 border-b border-border/30 pb-2">
        <FileText className="w-3.5 h-3.5" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest">
          Technical Documentation
        </span>
      </div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
