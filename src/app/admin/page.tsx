import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { Plus, Edit, Trash2, Globe, Lock, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  deleteBlogPost,
  togglePublishStatus,
} from "@/lib/actions/blog-actions";
import { QuickNav, MobileBottomNav } from "@/components/layout/QuickNav";
import { Home, LayoutDashboard, PlusCircle, BookOpen } from "lucide-react";

import { BlogPost } from "@/types/blog";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Security Guard: Admin only
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const allBlogs = await db.query.blogs.findMany({
    orderBy: [desc(blogs.createdAt)],
  });

  const navItems = [
    {
      name: "Public Site",
      href: "/blog",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      name: "Terminal",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: "New Entry",
      href: "/admin/editor/new",
      icon: <PlusCircle className="w-4 h-4" />,
    },
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  ];

  return (
    <main className="min-h-screen bg-background">
      <QuickNav items={navItems} />
      <MobileBottomNav items={navItems} />

      <div className="pt-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1
              data-cursor="focus"
              className="text-4xl md:text-6xl font-black text-foreground font-heading tracking-tight"
            >
              Admin <span className="text-ctp-mauve italic">Terminal</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Logged in as{" "}
              <span className="text-foreground font-bold">
                {session.user.email}
              </span>
            </p>
          </div>
          <Link href="/admin/editor/new">
            <Button
              size="lg"
              className="bg-ctp-mauve hover:bg-ctp-mauve/80 text-background font-bold gap-2"
            >
              <Plus className="w-5 h-5" />
              New System Entry
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {allBlogs.length === 0 ? (
            <div className="p-20 border border-dashed border-border/50 rounded-3xl text-center">
              <p className="text-muted-foreground">
                No records found in the database.
              </p>
            </div>
          ) : (
            allBlogs.map((blog: BlogPost) => (
              <div
                key={blog.id}
                className="p-6 bg-card/30 border border-border/50 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 hover:border-ctp-mauve/30 transition-all group"
              >
                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={blog.published ? "default" : "secondary"}
                      className={
                        blog.published
                          ? "bg-ctp-green/20 text-ctp-green border-ctp-green/30"
                          : ""
                      }
                    >
                      {blog.published ? (
                        <Globe className="w-3 h-3 mr-1" />
                      ) : (
                        <Lock className="w-3 h-3 mr-1" />
                      )}
                      {blog.published ? "Public" : "Draft"}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      {new Date(blog.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-ctp-mauve transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 italic">
                    {blog.excerpt || "No excerpt provided."}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <form
                    action={togglePublishStatus.bind(
                      null,
                      blog.id,
                      blog.published,
                    )}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-[10px] uppercase tracking-widest"
                    >
                      {blog.published ? "Unpublish" : "Publish"}
                    </Button>
                  </form>

                  <Link href={`/blog/${blog.slug}`} target="_blank">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-ctp-sky"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </Link>

                  <Link href={`/admin/editor/${blog.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-ctp-mauve"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </Link>

                  <form action={deleteBlogPost.bind(null, blog.id)}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-ctp-red"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
