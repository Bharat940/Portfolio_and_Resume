"use client";

import { useState, useEffect, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import mermaid from "mermaid";
import type { CSSProperties, ReactElement } from "react";

// --- Optimized Syntax Highlighting ---
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);

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

        text = text.replace(/!\[(.*?)\]\((?!http)(.*?)\)/g, (match, alt, path) => {
          const cleanPath = path.startsWith("./") ? path.slice(2) : path.startsWith("/") ? path.slice(1) : path;
          return `![${alt}](${baseUrl}${cleanPath})`;
        });

        text = text.replace(/<img\s+[^>]*src="([^"]+)"[^>]*>/g, (match, src) => {
          if (src.startsWith("http")) return match;
          const cleanSrc = src.startsWith("./") ? src.slice(2) : src.startsWith("/") ? src.slice(1) : src;
          return match.replace(src, `${baseUrl}${cleanSrc}`);
        });

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
          const { svg: renderedSvg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart);
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

  // Define components using the modern ReactMarkdown v10 approach
  const components: Components = useMemo(() => ({
    img: ({ node, ...props }) => (
      <img
        {...props}
        className="rounded-xl border border-border/30 my-8 shadow-lg max-w-full h-auto mx-auto"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    ),

    // Modern approach: 'pre' handles block-level code blocks
    pre: ({ node, children, ...props }) => {
      // Extract the code element from children to get language and content
      const codeEl = (children as ReactElement<CodeElementProps>)?.props;
      const className = codeEl?.className || "";
      const match = /language-(\w+)/.exec(className);
      const language = match ? match[1] : undefined;
      const codeContent = String(codeEl?.children ?? "").replace(/\n$/, "");

      if (language === "mermaid") {
        return <Mermaid chart={codeContent} />;
      }

      if (language) {
        return (
          <div className="my-6 rounded-xl overflow-hidden border border-border/30 shadow-xl group/code">
            <div className="bg-ctp-crust px-4 py-1 border-b border-border/30 flex justify-between items-center">
              <span className="font-mono text-[9px] text-muted-foreground uppercase">{language}</span>
            </div>
            <SyntaxHighlighter
              style={vscDarkPlus as { [key: string]: CSSProperties }}
              language={language}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: '1.25rem',
                fontSize: '0.8125rem',
                backgroundColor: '#11111b',
              }}
            >
              {codeContent}
            </SyntaxHighlighter>
          </div>
        );
      }

      // Fallback for plain <pre> without language
      return <pre className="bg-ctp-crust p-4 rounded-xl border border-border/30 overflow-x-auto" {...props}>{children}</pre>;
    },

    // 'code' now only handles inline code (wrapped in single backticks)
    code: ({ node, className, children, ...props }) => (
      <code
        className={cn(
          "bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-mauve border border-border/20 font-mono text-xs",
          className
        )}
        {...props}
      >
        {children}
      </code>
    ),
  }), []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
        <Loader2 className="w-5 h-5 animate-spin text-ctp-mauve" />
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Accessing Payload...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-ctp-red bg-ctp-red/5 rounded-xl border border-ctp-red/20">
        <AlertCircle className="w-6 h-6" />
        <p className="font-mono text-[10px] uppercase tracking-widest">Signal Lost: {error || "Empty"}</p>
      </div>
    );
  }

  return (
    <div className={cn("readme-prose", className)}>
      <div className="flex items-center gap-2 mb-6 text-muted-foreground/50 border-b border-border/30 pb-2">
        <FileText className="w-3.5 h-3.5" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest">Technical Documentation</span>
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
