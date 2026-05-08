"use client";

import { useState } from "react";
import { BlogCard } from "./BlogCard";
import { QuickNav, MobileBottomNav } from "../layout/QuickNav";
import { Home, BookOpen, Shield, LogOut } from "lucide-react";
import { LoginOverlay } from "./LoginOverlay";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

import { DiamondDivider } from "../layout/DiamondDivider";

import { BlogPost } from "@/types/blog";

interface BlogContentProps {
  posts: BlogPost[];
}

export function BlogContent({ posts }: BlogContentProps) {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navItems = [
    {
      name: session ? session.user.name || "Operator" : "Authorize",
      href: "#",
      testId: session ? "user-nav-item" : "authorize-btn",
      onClick: session ? undefined : () => setIsLoginOpen(true),
      icon: session ? (
        <Avatar className="w-5 h-5 border border-ctp-mauve/30">
          <AvatarImage
            src={`https://api.dicebear.com/9.x/identicon/svg?seed=${session.user.id}`}
          />
          <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <Shield className="w-4 h-4" />
      ),
      customElement: session ? (
        <div className="flex flex-col items-center gap-1 min-w-35">
          <span className="text-[8px] font-mono font-bold text-ctp-subtext1 uppercase tracking-widest truncate max-w-32.5 text-center">
            {session.user.name}
          </span>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-ctp-red/10 text-ctp-red text-[8px] font-bold uppercase tracking-widest hover:bg-ctp-red/20 transition-colors border border-ctp-red/20"
          >
            <LogOut className="w-2.5 h-2.5" /> Sign Out
          </button>
        </div>
      ) : null,
    },
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    {
      name: "Journal",
      href: "#journal",
      icon: <BookOpen className="w-4 h-4" />,
      isSection: true,
    },
  ];

  // Add Admin Link if role is admin
  if (session?.user?.role === "admin") {
    navItems.splice(1, 0, {
      name: "Terminal",
      href: "/admin",
      icon: <Shield className="w-4 h-4" />,
    });
  }

  return (
    <main
      className="flex flex-col min-h-screen bg-background"
      data-auth-state={session ? "authenticated" : "anonymous"}
    >
      <QuickNav items={navItems} />
      <MobileBottomNav items={navItems} />
      <LoginOverlay
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      {/* Header Section */}
      <section className="bg-(--section-1) min-h-dvh flex flex-col justify-center px-6 md:px-12 lg:px-20 relative">
        {/* Background Technical Grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#cba6f7 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full py-20">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-12 bg-ctp-mauve" />
              <span className="font-mono text-[10px] font-bold text-ctp-mauve uppercase tracking-[0.3em]">
                Technical Journal
              </span>
            </div>
            <h1
              data-cursor="focus"
              className="text-5xl md:text-8xl lg:text-9xl font-black text-foreground font-heading tracking-tighter uppercase leading-[0.85] italic"
            >
              Engineering <br />
              <span className="text-ctp-mauve">Insights</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed pt-4 italic">
              A repository of deep dives into system architecture, distributed
              computing, and low-level engineering puzzles.
            </p>
          </div>
        </div>
      </section>

      <DiamondDivider color="ctp-mauve" />

      {/* Posts Section */}
      <section id="journal" className="bg-(--section-2) py-24 px-6 relative">
        <div className="max-w-7xl mx-auto w-full">
          {posts.length === 0 ? (
            <div className="p-20 border border-dashed border-border/30 rounded-[4rem] text-center bg-card/10 space-y-8 flex flex-col items-center">
              <div className="space-y-2">
                <p className="text-muted-foreground font-mono uppercase tracking-widest text-sm">
                  No entries currently indexed.
                </p>
                <p className="text-muted-foreground/60 text-xs font-mono uppercase tracking-widest">
                  System awaiting first transmission signal.
                </p>
              </div>

              {!session && (
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-ctp-mauve/10 hover:bg-ctp-mauve/20 border border-ctp-mauve/30 text-ctp-mauve rounded-2xl h-14 px-10 font-bold uppercase tracking-widest gap-3"
                >
                  <Shield className="w-5 h-5" /> Initialize Identity
                </Button>
              )}

              {session && (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4 p-4 bg-background/50 rounded-3xl border border-border/30">
                    <Avatar className="w-12 h-12 border-2 border-ctp-mauve/30">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/identicon/svg?seed=${session.user.id}`}
                      />
                      <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        Active Operator
                      </p>
                      <p className="text-sm font-bold uppercase tracking-tight">
                        {session.user.name}
                      </p>
                    </div>
                  </div>

                  {session.user.role === "admin" && (
                    <Link href="/admin">
                      <Button className="bg-ctp-mauve hover:bg-ctp-mauve/90 text-background font-bold uppercase tracking-widest px-8 rounded-2xl h-14 gap-3 shadow-lg shadow-ctp-mauve/20">
                        <Shield className="w-5 h-5" /> Access System Console
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
