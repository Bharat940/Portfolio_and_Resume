import React from "react";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { blogs, comments } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QuickNav, MobileBottomNav } from "@/components/layout/QuickNav";
import { CommentSection } from "@/components/blog/CommentSection";
import {
  Calendar,
  Clock,
  Tag,
  ChevronLeft,
  BookOpen,
  Zap,
  Shield,
  Cpu,
  Globe,
  Brain,
  Terminal,
  Code,
  Lock,
  Eye,
  Activity,
  Layers,
  Database,
} from "lucide-react";

import { IconMap } from "@/types/blog";

const iconMap: IconMap = {
  Zap,
  Shield,
  Cpu,
  Globe,
  Brain,
  Terminal,
  Code,
  Lock,
  Eye,
  Activity,
  Layers,
  Database,
};
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.query.blogs.findFirst({ where: eq(blogs.slug, slug) });

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Bharat Dangi`,
    description:
      post.excerpt || `Read ${post.title} on Bharat Dangi's technical journal.`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, allComments] = await Promise.all([
    db.query.blogs.findFirst({
      where: eq(blogs.slug, slug),
    }),
    db.query.comments.findMany({
      where: eq(comments.postSlug, slug),
      orderBy: [asc(comments.createdAt)],
    }),
  ]);

  if (!post || !post.published) {
    notFound();
  }

  // Generate QuickNav items from content (headers)
  // This is a simple regex-based extraction for the server component
  // Intelligent Header Extraction for Dynamic Navigation
  const headerRegex = /^##\s+(?:\[(\w+)\]\s+)?(.+)$/gm;
  const matches = Array.from(post.content.matchAll(headerRegex));

  const navItems = [
    { name: "Back", href: "/blog", icon: <ChevronLeft className="w-4 h-4" /> },
    {
      name: "Top",
      href: "#top",
      icon: <BookOpen className="w-4 h-4" />,
      isSection: true,
    },
    ...matches.map((match) => {
      const iconName = match[1];
      const rawTitle = match[2];
      // Strip markdown for the display name in menu
      const cleanTitle = rawTitle.replace(/`|\*|_/g, "");
      // Generate ID from text only (no markdown)
      const id = cleanTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const Icon = (iconName && iconMap[iconName]) || Tag;

      return {
        name: cleanTitle,
        href: `#${id}`,
        icon: <Icon className="w-4 h-4" />,
        isSection: true,
      };
    }),
    {
      name: "Comments",
      href: "#comments",
      icon: <BookOpen className="w-4 h-4" />,
      isSection: true,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <QuickNav items={navItems} />
      <MobileBottomNav items={navItems} />

      <div
        id="top"
        className="pt-32 px-6 md:px-12 lg:px-20 max-w-4xl mx-auto pb-32"
      >
        {/* Optional Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-video mb-16 rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl shadow-ctp-mauve/10 group">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )}

        {/* Post Header */}
        <div className="space-y-8 mb-16">
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-ctp-mauve" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                dateStyle: "long",
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-ctp-mauve" />
              {Math.ceil(post.content.split(" ").length / 200)} min read
            </div>
            <Badge
              variant="outline"
              className="bg-ctp-mauve/5 border-ctp-mauve/20 text-ctp-mauve"
            >
              {post.category}
            </Badge>
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-ctp-mauve" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-ctp-mauve/10 text-ctp-mauve border-ctp-mauve/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-7xl font-black font-heading tracking-tighter uppercase leading-[0.9]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground italic font-medium leading-relaxed border-l-4 border-ctp-mauve/30 pl-6 py-2">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Post Content */}
        <article className="readme-prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => {
                const flatten = (children: React.ReactNode): string => {
                  if (Array.isArray(children)) {
                    return children.map(flatten).join("");
                  }
                  if (
                    React.isValidElement<{ children?: React.ReactNode }>(
                      children,
                    )
                  ) {
                    return flatten(children.props.children);
                  }
                  return String(children ?? "");
                };

                const rawContent = flatten(children);
                const iconMatch = rawContent.match(/^\[(\w+)\]/);
                const iconName = iconMatch ? iconMatch[1] : null;
                const fullTitle = rawContent.replace(/^\[\w+\]\s+/, "");
                const id = fullTitle
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");

                const Icon = (iconName && iconMap[iconName]) || null;

                // Strip the [Icon] from the visible children
                const childrenArray = Array.isArray(children)
                  ? [...children]
                  : [children];
                const cleanChildren = childrenArray.map((child, i) => {
                  if (i === 0 && typeof child === "string") {
                    return child.replace(/^\[\w+\]\s*/, "");
                  }
                  return child;
                });

                return (
                  <h2
                    id={id}
                    className="group flex items-center gap-3 mt-12 mb-6 scroll-mt-32"
                  >
                    {Icon && (
                      <div className="p-2 rounded-xl bg-ctp-mauve/10 text-ctp-mauve group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                    <span className="text-2xl font-bold tracking-tight">
                      {cleanChildren}
                    </span>
                  </h2>
                );
              },
              img: ({ ...props }) => (
                <div className="my-12 relative rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    {...props}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={props.alt || "Blog image"}
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem]" />
                </div>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Comment Section */}
        <div id="comments" className="mt-32 pt-16 border-t border-border/50">
          <CommentSection postSlug={post.slug} comments={allComments} />
        </div>
      </div>
    </main>
  );
}
