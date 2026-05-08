"use client";

import { m } from "motion/react";
import {
  Code,
  Terminal,
  Cpu,
  Globe,
  Shield,
  Zap,
  Brain,
  ArrowRight,
  Calendar,
  Lock,
  Eye,
  Activity,
  Layers,
  Database,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { BlogPost, IconMap } from "@/types/blog";

const iconMap: IconMap = {
  Code,
  Terminal,
  Cpu,
  Globe,
  Shield,
  Zap,
  Brain,
  Lock,
  Eye,
  Activity,
  Layers,
  Database,
};

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const IconComponent = iconMap[post.icon || "Code"] || Code;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-full"
      data-testid="blog-card"
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="relative h-full flex flex-col p-8 bg-card/30 border border-border/50 rounded-3xl overflow-hidden hover:border-ctp-mauve/50 transition-all duration-500 hover:shadow-2xl hover:shadow-ctp-mauve/10">
          {/* Background Technical Accent */}
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity group-hover:rotate-12 duration-700">
            <IconComponent className="w-32 h-32" />
          </div>

          <div className="relative z-10 flex-1 flex flex-col space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-ctp-mauve/10 rounded-xl text-ctp-mauve group-hover:scale-110 transition-transform duration-500">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-ctp-mauve uppercase tracking-[0.2em] font-bold">
                    {post.category || "General"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <h3 className="text-2xl md:text-3xl font-black font-heading tracking-tight group-hover:text-ctp-mauve transition-colors leading-[1.1]">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 italic font-medium">
                {post.excerpt || "Decrypting technical details..."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags?.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-background/50 border-border/30 text-[9px] font-mono uppercase py-0.5 tracking-tighter"
                >
                  #{tag}
                </Badge>
              ))}
              {post.tags && post.tags.length > 3 && (
                <span className="text-[10px] font-mono text-muted-foreground">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>

            <div className="pt-4 mt-auto flex items-center gap-2 text-ctp-mauve font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all duration-500">
              Read Analysis
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </m.div>
  );
}
