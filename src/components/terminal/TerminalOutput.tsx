"use client";

import React from 'react';
import type { UIMessage } from 'ai';
import { GREETING_ART_DESKTOP, GREETING_ART_MOBILE } from '@/lib/terminal/commands';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export type LogType = 'input' | 'output' | 'error' | 'ai';

export interface LogEntry {
  type: LogType;
  content: string | React.ReactNode;
}

interface TerminalOutputProps {
  history: LogEntry[];
  status: string;
  messages: UIMessage[];
}

// Helper to parse ANSI colors for neofetch
const parseAnsi = (text: string) => {
  if (typeof text !== 'string') return text;

  const parts = text.split(/(\x1b\[[0-9;]*m)/);
  let currentColor = "";

  return parts.map((part, i) => {
    if (part.startsWith('\x1b[')) {
      if (part === '\x1b[0m') currentColor = "";
      else if (part === '\x1b[1;34m') currentColor = "text-ctp-blue font-bold";
      else if (part === '\x1b[1;33m') currentColor = "text-ctp-yellow font-bold";
      return null;
    }
    return <span key={i} className={currentColor}>{part}</span>;
  });
};

export function TerminalOutput({ history, status, messages }: TerminalOutputProps) {
  const isLoading = status === 'submitted' || status === 'streaming';
  const lastAiMessage = messages.filter(m => m.role === 'assistant').pop();

  return (
    <div className="space-y-1.5 md:space-y-2 text-[13px] md:text-[15px]">
      {history.map((entry, i) => {
        const isArt = entry.type === 'output' &&
          (typeof entry.content === 'string' && (
            entry.content === GREETING_ART_DESKTOP ||
            entry.content === GREETING_ART_MOBILE ||
            entry.content.includes('⠀⠀⠀⠀⠀') || // Gengar detection
            entry.content.includes('quu..__') // Pikachu detection (legacy)
          ));

        const isGreeting = entry.type === 'output' && (entry.content === GREETING_ART_DESKTOP || entry.content === GREETING_ART_MOBILE);

        return (
          <div
            key={i}
            className={`leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300 ${isArt ? 'whitespace-pre overflow-x-auto pb-1 scrollbar-none' :
              entry.type === 'ai' ? 'whitespace-normal' : 'whitespace-pre-wrap'
              } ${entry.type === 'input' ? 'text-ctp-text' :
                entry.type === 'error' ? 'text-ctp-red' :
                  entry.type === 'ai' ? 'text-ctp-green border-l-2 border-ctp-green/10 pl-3 md:pl-4 mb-2' :
                    isGreeting ? 'text-ctp-mauve leading-[1.1] font-bold' :
                      'text-ctp-blue'
              }`}
          >
            {entry.type === 'ai' && typeof entry.content === 'string' ? (
              <div className="terminal-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {entry.content}
                </ReactMarkdown>
              </div>
            ) : typeof entry.content === 'string' ? (
              parseAnsi(entry.content)
            ) : (
              entry.content
            )}
          </div>
        );
      })}

      {/* AI Streaming Message (Active) */}
      {isLoading && (
        <div className="text-ctp-green border-l-2 border-ctp-green/10 pl-3 md:pl-4 mb-2">
          {lastAiMessage && status === 'streaming' ? (
            <div className="terminal-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {lastAiMessage.parts
                  .filter(p => p.type === 'text')
                  .map(p => p.type === 'text' ? p.text : '')
                  .join('')}
              </ReactMarkdown>
              <span className="inline-block w-2 h-4 ml-1 bg-ctp-green animate-pulse align-middle" />
            </div>
          ) : (
            <span className="opacity-50 italic animate-pulse">Thinking...</span>
          )}
        </div>
      )}
    </div>
  );
}
