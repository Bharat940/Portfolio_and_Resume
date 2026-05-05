"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AtSign } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { PixelMenu } from '@/components/icons/PixelMenu';
import { PixelClose } from '@/components/icons/PixelClose';
import { PixelGitHub } from '@/components/icons/PixelGitHub';
import { PixelLinkedIn } from '@/components/icons/PixelLinkedIn';
import { PixelTerminal } from '@/components/icons/PixelTerminal';
import { PixelArrowRight } from '@/components/icons/PixelArrowRight';
import { useTerminal } from '@/context/TerminalContext';

export function Navbar() {
  const { toggleTerminal } = useTerminal();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling on mobile when menu is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/', hoverColor: 'group-hover:text-ctp-blue', hoverBorder: 'hover:border-ctp-blue', iconColor: 'text-ctp-blue' },
    { name: 'About', href: '/about', hoverColor: 'group-hover:text-ctp-green', hoverBorder: 'hover:border-ctp-green', iconColor: 'text-ctp-green' },
    { name: 'Projects', href: '/projects', hoverColor: 'group-hover:text-ctp-peach', hoverBorder: 'hover:border-ctp-peach', iconColor: 'text-ctp-peach' },
    { name: 'Blog', href: '/blog', hoverColor: 'group-hover:text-ctp-pink', hoverBorder: 'hover:border-ctp-pink', iconColor: 'text-ctp-pink' },
  ];

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { opacity: 0, x: -10, filter: "blur(5px)" }
  };

  return (
    <>
      {/* Floating Header Elements - z-[60] so it sits ABOVE the Modal overlay */}
      <header className="fixed top-0 left-0 w-full z-[60] pointer-events-none">
        <div className="flex justify-between items-start p-6 md:p-8 max-w-screen-2xl mx-auto relative">

          {/* Logo Box - Expands on hover */}
          <div className="pointer-events-auto">
            <Link
              href="/"
              className="flex items-center h-16 bg-card rounded-[20px] shadow-lg border border-border/50 transition-all duration-500 group cursor-pointer overflow-hidden max-w-[64px] hover:max-w-[280px] px-4"
              aria-label="Home"
            >
              <Image
                src="/logos/gengar_pfp.png"
                alt="Logo"
                width={40}
                height={40}
                className="shrink-0 group-hover:scale-110 transition-transform rounded-xl object-cover shadow-sm border border-border/20"
              />
              <span className="ml-4 font-bold text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 font-heading text-lg">
                Bharat Dangi
              </span>
            </Link>
          </div>

          {/* Hamburger / Menu Box */}
          <div className="pointer-events-auto relative flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-16 h-16 bg-card rounded-[20px] shadow-lg border border-border/50 transition-transform hover:scale-105 focus:outline-none group cursor-pointer relative md:z-[70]"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
            >
              {isOpen ? (
                <>
                  <PixelClose className="w-8 h-8 text-primary group-hover:scale-110 transition-transform hidden md:block" />
                  <PixelMenu className="w-8 h-8 text-primary group-hover:scale-110 transition-transform md:hidden" />
                </>
              ) : (
                <PixelMenu className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <>
                  {/* Mobile Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-background/95 md:bg-transparent z-[50]"
                    onClick={() => setIsOpen(false)}
                  />

                  {/* Dropdown Card (Desktop) / Centered Modal (Mobile) */}
                  <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-h-[85vh] md:absolute md:top-0 md:right-[72px] md:left-auto md:translate-x-0 md:translate-y-0 md:w-[350px] bg-card border border-border/50 rounded-[32px] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden z-[60]"
                  >

                    {/* Custom X Button inside the Card - MOBILE ONLY */}
                    <div className="absolute top-6 right-6 z-10 md:hidden">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center w-10 h-10 bg-background hover:bg-primary/20 rounded-[16px] transition-colors cursor-pointer border border-border/50 group"
                      >
                        <PixelClose className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      </button>
                    </div>

                    {/* Inner Panel Content - Scrollable container for links and socials */}
                    <div className="flex flex-col p-8 py-12 md:p-10 overflow-y-auto overflow-x-hidden scrollbar-none">

                      {/* Links List */}
                      <motion.nav
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mt-4 flex flex-col justify-center gap-1"
                      >
                        {navLinks.map((link) => (
                          <motion.div key={link.name} variants={itemVariants}>
                            <Link
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`group flex items-center justify-between py-4 border-b border-border/40 transition-colors cursor-pointer ${link.hoverBorder}`}
                            >
                              <div className="flex items-start">
                                <span className={`text-2xl md:text-3xl font-bold tracking-tight text-foreground transition-colors font-heading ${link.hoverColor}`}>
                                  {link.name}
                                </span>
                              </div>

                              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 border border-border/50 shadow-sm hidden md:flex">
                                <PixelArrowRight className={`w-4 h-4 transition-colors ${link.iconColor}`} />
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.nav>

                      {/* Footer / Socials inside the menu */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-10 flex flex-col gap-5"
                      >
                        <p className="text-xs text-primary font-heading font-semibold uppercase tracking-wider">
                          Let's Connect
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={() => {
                              toggleTerminal();
                              setIsOpen(false);
                            }} 
                            className="w-10 h-10 rounded-[12px] bg-background flex items-center justify-center hover:bg-ctp-blue hover:text-background hover:border-ctp-blue transition-all duration-300 border border-border/50 shadow-sm hover:scale-105 cursor-pointer relative group/term" 
                            title="Terminal (⌘K)"
                          >
                            <PixelTerminal className="w-6 h-6 text-ctp-blue group-hover/term:text-background transition-colors" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ctp-crust text-ctp-subtext0 text-[10px] px-1.5 py-0.5 rounded border border-border/50 opacity-0 group-hover/term:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              ⌘K
                            </span>
                          </button>
                          <Link href="https://github.com" target="_blank" className="w-10 h-10 rounded-[12px] bg-background flex items-center justify-center hover:bg-ctp-lavender hover:text-background hover:border-ctp-lavender transition-all duration-300 border border-border/50 shadow-sm hover:scale-105 cursor-pointer" title="GitHub">
                            <PixelGitHub className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
                          </Link>
                          <Link href="https://twitter.com" target="_blank" className="w-10 h-10 rounded-[12px] bg-background flex items-center justify-center hover:bg-ctp-sky hover:text-background hover:border-ctp-sky transition-all duration-300 border border-border/50 shadow-sm hover:scale-105 cursor-pointer" title="Twitter">
                            <AtSign className="w-4 h-4" />
                          </Link>
                          <Link href="https://linkedin.com" target="_blank" className="w-10 h-10 rounded-[12px] bg-background flex items-center justify-center hover:bg-ctp-blue hover:text-background hover:border-ctp-blue transition-all duration-300 border border-border/50 shadow-sm hover:scale-105 cursor-pointer" title="LinkedIn">
                            <PixelLinkedIn className="w-6 h-6" />
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
}
