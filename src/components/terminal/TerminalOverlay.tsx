"use client";

import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { useTerminal } from '@/context/TerminalContext';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import { MatrixRain } from './MatrixRain';
import { MascotGames } from '../easter-eggs/MascotGames';
import { TerminalHeader } from './TerminalHeader';
import { TerminalFooter } from './TerminalFooter';
import { TerminalOutput, LogEntry } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';

import {
  GREETING_ART_DESKTOP,
  GREETING_ART_MOBILE,
  MOCK_FILESYSTEM,
  RESUME_CONTENT,
  NEOFETCH_DATA_DESKTOP,
  NEOFETCH_DATA_MOBILE,
  generateAscii
} from '@/lib/terminal/commands';

export function TerminalOverlay() {
  const { isOpen, closeTerminal } = useTerminal();
  const [isMobile, setIsMobile] = useState(false);

  const [history, setHistory] = useState<LogEntry[]>([]);
  const [currentDir, setCurrentDir] = useState(''); // Empty string is root
  const hasInitialized = useRef(false);

  // Track mobile state and initialize history
  useEffect(() => {
    if (!hasInitialized.current) {
      const checkMobile = () => window.innerWidth < 768;
      const initialMobile = checkMobile();
      setIsMobile(initialMobile);

      setHistory([
        { type: 'output', content: initialMobile ? GREETING_ART_MOBILE : GREETING_ART_DESKTOP },
        { type: 'output', content: 'Welcome to Bharat\'s Linux Environment (WSL: Ubuntu 24.04 LTS)' },
        { type: 'output', content: 'Type "help" to see available commands.' },
      ]);

      const handleResize = () => setIsMobile(checkMobile());
      window.addEventListener('resize', handleResize);
      hasInitialized.current = true;

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const [input, setInput] = useState('');
  const [showMatrix, setShowMatrix] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: ({ message }) => {
      const content = message.parts
        .filter(p => p.type === 'text')
        .map(p => {
          if ('text' in p) return p.text;
          return '';
        })
        .join('')
        .trim();

      if (content) {
        setHistory(prev => [...prev, { type: 'ai', content }]);
      }
    }
  });

  const isLoading = status === "submitted" || status === "streaming";
  const lastAiMessage = messages.filter(m => m.role === 'assistant').pop();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, lastAiMessage, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: 'input', content: `bharat@wsl-ubuntu:~$ ${trimmedCmd}` }]);
    setInput('');

    const parts = trimmedCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    interface FileSystemNode {
      [key: string]: string | FileSystemNode;
    }

    // Helper to get relative path contents
    const getDirContents = (dirPath: string): FileSystemNode | null => {
      if (!dirPath) return MOCK_FILESYSTEM as FileSystemNode;
      const pathParts = dirPath.split('/');
      let current: string | FileSystemNode = MOCK_FILESYSTEM as FileSystemNode;
      for (const p of pathParts) {
        if (typeof current === 'object' && current !== null && p in current) {
          current = current[p];
        } else {
          return null;
        }
      }
      return typeof current === 'object' ? current : null;
    };

    const currentContents = getDirContents(currentDir);

    switch (command) {
      case 'help':
        setHistory(prev => [...prev, {
          type: 'output',
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2 text-ctp-subtext1">
              <div><span className="text-ctp-blue font-bold">ls [dir]</span>        - List files</div>
              <div><span className="text-ctp-blue font-bold">cd [dir]</span>        - Change directory</div>
              <div><span className="text-ctp-blue font-bold">pwd</span>             - Print working directory</div>
              <div><span className="text-ctp-blue font-bold">cat [file]</span>      - View file contents</div>
              <div><span className="text-ctp-blue font-bold">ask [q]</span>         - Query AI Knowledge Base</div>
              <div><span className="text-ctp-blue font-bold">./resume</span>        - View full resume</div>
              <div><span className="text-ctp-blue font-bold">neofetch</span>        - Show system stats</div>
              <div><span className="text-ctp-blue font-bold">figlet [text]</span>   - Generate ASCII art</div>
              <div><span className="text-ctp-blue font-bold">whoami</span>          - Display user info</div>
              <div><span className="text-ctp-blue font-bold">socials</span>         - List social links</div>
              <div><span className="text-ctp-blue font-bold">game</span>            - Launch arcade center</div>
              <div><span className="text-ctp-blue font-bold">matrix</span>          - Toggle digital rain</div>
              <div><span className="text-ctp-blue font-bold">clear</span>           - Clear screen</div>
              <div><span className="text-ctp-blue font-bold">exit</span>            - Close shell</div>
            </div>
          )
        }]);
        break;

      case 'ls':
        const dirArg = args[0]?.toLowerCase();
        let targetContents = currentContents;

        if (dirArg) {
          const targetPath = currentDir ? `${currentDir}/${dirArg}` : dirArg;
          targetContents = getDirContents(targetPath);
        }

        if (targetContents && typeof targetContents === 'object') {
          const contents = Object.keys(targetContents as object).map(k =>
            typeof (targetContents as FileSystemNode)[k] === 'object' ? `${k}/` : k
          ).join('  ');
          setHistory(prev => [...prev, { type: 'output', content: contents }]);
        } else {
          setHistory(prev => [...prev, { type: 'error', content: `ls: ${dirArg}: No such directory` }]);
        }
        break;

      case 'cd':
        const targetDir = args[0]?.toLowerCase();
        if (!targetDir || targetDir === '~' || targetDir === '/') {
          setCurrentDir('');
        } else if (targetDir === '..') {
          const parts = currentDir.split('/');
          setCurrentDir(parts.slice(0, -1).join('/'));
        } else {
          const newPath = currentDir ? `${currentDir}/${targetDir}` : targetDir;
          if (getDirContents(newPath) && typeof getDirContents(newPath) === 'object') {
            setCurrentDir(newPath);
          } else {
            setHistory(prev => [...prev, { type: 'error', content: `cd: ${targetDir}: No such directory` }]);
          }
        }
        break;

      case 'pwd':
        setHistory(prev => [...prev, { type: 'output', content: `/${currentDir}` }]);
        break;

      case 'cat':
        const fileName = args[0]?.toLowerCase();
        if (!fileName) {
          const available = Object.keys(currentContents as object).join(', ');
          setHistory(prev => [...prev, { type: 'error', content: `Usage: cat [file]\nAvailable: ${available}` }]);
        } else {
          const targetPath = fileName.includes('/') ? fileName : (currentDir ? `${currentDir}/${fileName}` : fileName);
          const pathParts = targetPath.split('/');
          const file = pathParts.pop() || '';
          const dirPath = pathParts.join('/');
          const dirObj = getDirContents(dirPath);

          if (dirObj && typeof dirObj === 'object' && dirObj[file]) {
            if (typeof dirObj[file] === 'object') {
              setHistory(prev => [...prev, { type: 'error', content: `cat: ${fileName}: Is a directory` }]);
            } else {
              // Use 'ai' type for markdown if it looks like markdown
              const isMd = fileName.endsWith('.md') || dirPath === 'projects';
              setHistory(prev => [...prev, {
                type: isMd ? 'ai' : 'output',
                content: dirObj[file] as string
              }]);
            }
          } else {
            setHistory(prev => [...prev, { type: 'error', content: `cat: ${fileName}: No such file` }]);
          }
        }
        break;

      case './resume':
      case '.\\resume':
        setHistory(prev => [...prev, { type: 'output', content: RESUME_CONTENT }]);
        break;

      case 'neofetch':
        setHistory(prev => [...prev, {
          type: 'output',
          content: isMobile ? NEOFETCH_DATA_MOBILE : NEOFETCH_DATA_DESKTOP
        }]);
        break;

      case 'whoami':
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'Bharat Dangi: A passionate Full Stack Developer & Systems Engineer. Currently pursuing B.Tech in IT @ UIT RGPV. I love building high-performance systems and exploring the intersection of graphics and AI.'
        }]);
        break;

      case 'socials':
        setHistory(prev => [...prev, {
          type: 'output',
          content: (
            <div className="flex flex-col gap-1 mt-1">
              <div><span className="text-ctp-mauve font-bold">GitHub:</span>   https://github.com/Bharat940</div>
              <div><span className="text-ctp-blue font-bold">LinkedIn:</span> https://linkedin.com/in/bharat-dangi-b186b3248</div>
              <div><span className="text-ctp-sky font-bold">Twitter:</span>  @Bharat940</div>
              <div><span className="text-ctp-red font-bold">Email:</span>    bdangi450@gmail.com</div>
            </div>
          )
        }]);
        break;

      case 'repo':
        setHistory(prev => [...prev, { type: 'output', content: 'Source Code: https://github.com/Bharat940/portfolio' }]);
        break;

      case 'figlet':
        const text = args.join(' ');
        if (!text) {
          setHistory(prev => [...prev, { type: 'error', content: 'Usage: figlet [text]' }]);
        } else {
          try {
            const art = await generateAscii(text);
            setHistory(prev => [...prev, { type: 'output', content: art }]);
          } catch {
            setHistory(prev => [...prev, { type: 'error', content: 'Error generating ASCII art' }]);
          }
        }
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        closeTerminal();
        break;

      case 'ask':
        const query = args.join(' ');
        if (!query) {
          setHistory(prev => [...prev, { type: 'error', content: 'Usage: ask [your question]' }]);
        } else {
          sendMessage({ text: query });
        }
        break;

      case 'matrix':
        setShowMatrix(prev => !prev);
        setHistory(prev => [...prev, {
          type: 'output',
          content: `Digital rain ${!showMatrix ? 'enabled' : 'disabled'}.`
        }]);
        break;

      case 'game':
        setHistory(prev => [...prev, {
          type: 'output',
          content: (
            <div className="mt-2 p-3 border border-ctp-surface2 rounded-lg bg-ctp-base/50">
              <div className="text-ctp-yellow font-bold mb-1">🎮 Arcade Center Initialized</div>
              <div className="text-ctp-subtext0 mb-2 italic">Select a module to launch:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ctp-green animate-pulse"></span> Mascot Runner</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ctp-blue"></span> Matrix Rain (v2.0)</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ctp-mauve"></span> Memory Match (Coming Soon)</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ctp-red"></span> Terminal Invaders (Legacy)</div>
              </div>
            </div>
          )
        }]);
        setShowGames(true);
        break;

      default:
        setHistory(prev => [...prev, { type: 'error', content: `sh: command not found: ${command}` }]);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, lastAiMessage, isLoading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="terminal-root"
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-8 lg:p-12 pointer-events-none"
        >
          <div key="terminal-backdrop" className="absolute inset-0 bg-background/90 backdrop-blur-md pointer-events-auto" onClick={closeTerminal} />

          <m.div
            key="terminal-window"
            className="relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[85vh] bg-ctp-mantle sm:border border-ctp-surface1 sm:rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col pointer-events-auto font-mono ring-1 ring-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            {showMatrix && <MatrixRain />}

            <TerminalHeader onClose={closeTerminal} />

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-ctp-surface2 relative z-10"
            >
              <TerminalOutput
                history={history}
                status={status}
                messages={messages}
              />

              <TerminalInput
                ref={inputRef}
                value={input}
                onChange={setInput}
                onSubmit={handleCommand}
                currentDir={currentDir}
              />
            </div>

            <TerminalFooter inputLength={input.length} />
          </m.div>
        </m.div>
      )}
      <MascotGames key="mascot-games" open={showGames} onOpenChange={setShowGames} />
    </AnimatePresence>
  );
}
