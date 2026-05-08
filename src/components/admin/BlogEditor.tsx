"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactTextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuickNav, MobileBottomNav } from "../layout/QuickNav";
import {
  Save,
  ArrowLeft,
  Eye,
  Code,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Zap,
  Shield,
  Cpu,
  Globe,
  Brain,
  Terminal,
  BookOpen,
  Tag,
  ChevronLeft,
  Activity,
  Layers,
  Database,
  Lock,
} from "lucide-react";

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
import Link from "next/link";
import { upsertBlogPost, BlogInput } from "@/lib/actions/blog-actions";
import { BlogPost, IconMap } from "@/types/blog";

interface BlogEditorProps {
  initialData?: Partial<BlogPost> | null;
}

export function BlogEditor({ initialData }: BlogEditorProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: initialData?.id || undefined,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    category: initialData?.category || "Engineering",
    icon: initialData?.icon || "Code",
    tags: initialData?.tags || [],
    published: initialData?.published || false,
  });

  const [tagInput, setTagInput] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await upsertBlogPost(formData as BlogInput);
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t: string) => t !== tag),
    });
  };

  // Intelligent Header Extraction for Preview Nav
  const headerRegex = /^##\s+(?:\[(\w+)\]\s+)?(.+)$/gm;
  const previewMatches = Array.from(formData.content.matchAll(headerRegex));

  const previewNavItems = [
    { name: "Back", href: "/admin", icon: <ChevronLeft className="w-4 h-4" /> },
    {
      name: "Top",
      href: "#top",
      icon: <BookOpen className="w-4 h-4" />,
      isSection: true,
    },
    ...previewMatches.map((match: RegExpMatchArray) => {
      const iconName = match[1];
      const title = match[2];
      const id = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const Icon = (iconName && iconMap[iconName]) || Tag;

      return {
        name: title,
        href: `#${id}`,
        icon: <Icon className="w-4 h-4" />,
        isSection: true,
      };
    }),
  ];

  return (
    <div className="space-y-8">
      {isPreview && (
        <>
          <QuickNav items={previewNavItems} />
          <MobileBottomNav items={previewNavItems} />
        </>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </Link>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="flex-1 md:flex-none gap-2 font-mono text-xs uppercase tracking-widest"
          >
            {isPreview ? (
              <Code className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {isPreview ? "Edit Source" : "Live Preview"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 md:flex-none bg-ctp-mauve hover:bg-ctp-mauve/80 text-background font-bold gap-2"
          >
            {isSaving ? (
              "Syncing..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Entry
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-ctp-red/10 border border-ctp-red/20 rounded-xl text-ctp-red flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {!isPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Entry Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Post Title..."
                className="text-2xl font-bold h-14 bg-card/20 border-border/50 focus:border-ctp-mauve/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Short Excerpt (SEO & Cards)
              </label>
              <ReactTextareaAutosize
                value={formData.excerpt || ""}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief summary of the transmission..."
                className="w-full min-h-20 p-4 bg-card/10 border border-border/50 rounded-xl focus:outline-none focus:border-ctp-mauve/30 text-sm leading-relaxed resize-none italic text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Content (Markdown)
              </label>
              <ReactTextareaAutosize
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Begin transmission..."
                className="w-full min-h-100 p-6 bg-card/20 border border-border/50 rounded-2xl focus:outline-none focus:border-ctp-mauve/50 font-mono text-sm leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="space-y-6">
            <div className="p-6 bg-card/30 border border-border/50 rounded-3xl space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Code className="w-3 h-3" /> System Slug
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  placeholder="post-slug-id"
                  className="bg-background/50 border-border/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Cover Image URL
                </label>
                <Input
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-background/50 border-border/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Category
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Engineering"
                  className="bg-background/50 border-border/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  Tags
                </label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="Add tech..."
                    className="bg-background/50 border-border/30"
                  />
                  <Button onClick={addTag} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-ctp-mauve/5 border-ctp-mauve/20 text-ctp-mauve py-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-ctp-red"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/20 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  Visibility
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ctp-green"></div>
                </label>
              </div>
            </div>

            <div className="p-6 bg-ctp-mauve/5 border border-ctp-mauve/20 rounded-3xl">
              <h4 className="text-xs font-mono text-ctp-mauve uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Deployment Info
              </h4>
              <ul className="text-[10px] space-y-2 text-muted-foreground font-mono leading-relaxed">
                <li>• Slugs must be unique system-wide.</li>
                <li>• Markdown supports GFM (Tables, Tasks).</li>
                <li>• Public entries appear on the main feed.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="readme-prose max-w-none p-12 bg-card/20 border border-border/50 rounded-3xl min-h-150">
          {formData.coverImage && (
            <div className="relative w-full h-75 mb-8 rounded-[2rem] overflow-hidden border border-border/50">
              <Image
                src={formData.coverImage}
                alt={formData.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                className="object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl font-black mb-4">{formData.title}</h1>
          {formData.excerpt && (
            <p className="text-xl text-muted-foreground italic font-medium leading-relaxed border-l-4 border-ctp-mauve/30 pl-6 py-2 mb-8">
              {formData.excerpt}
            </p>
          )}
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
            {formData.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
