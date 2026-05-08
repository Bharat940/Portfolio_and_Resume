import { Metadata } from "next";
import { BlogContent } from "@/components/blog/BlogContent";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical Journal of Bharat Dangi - Deep dives into system architecture, distributed systems, and low-level engineering.",
  openGraph: {
    title: "Blog | Bharat Dangi",
    description:
      "Read the latest engineering analyses and technical deep dives by Bharat Dangi.",
  },
};

export default async function BlogPage() {
  const allPosts = await db.query.blogs.findMany({
    where: eq(blogs.published, true),
    orderBy: [desc(blogs.createdAt)],
  });

  return <BlogContent posts={allPosts} />;
}
