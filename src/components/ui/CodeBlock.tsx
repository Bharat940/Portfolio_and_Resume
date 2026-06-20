"use client";

import React, { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

// --- Optimized Syntax Highlighting ---
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import docker from "react-syntax-highlighter/dist/esm/languages/prism/docker";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("c++", cpp);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("docker", docker);
SyntaxHighlighter.registerLanguage("dockerfile", docker);
SyntaxHighlighter.registerLanguage("rust", rust);

interface CodeBlockProps {
  language?: string;
  value: string;
}

export function CodeBlock({ language = "text", value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="code-block my-6 rounded-2xl overflow-hidden border border-border/35 shadow-2xl bg-ctp-mantle group/code-block relative">
      <div className="bg-ctp-crust/85 backdrop-blur-md px-4 py-2 border-b border-border/30 flex justify-between items-center z-10 relative">
        <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {language}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ctp-surface0 hover:bg-ctp-surface1 border border-border/20 text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase transition-all duration-200 cursor-pointer active:scale-95 select-none"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-ctp-green animate-bounce" />
              <span className="text-ctp-green font-mono">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 transition-transform group-hover/code-block:scale-105" />
              <span className="font-mono">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          style={vscDarkPlus as { [key: string]: React.CSSProperties }}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            fontSize: "0.8125rem",
            backgroundColor: "#11111b",
            fontFamily: "var(--font-source-code-pro), monospace",
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
