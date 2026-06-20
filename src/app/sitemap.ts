import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bharat-dangi.vercel.app";

  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/projects",
    "/arcade",
    "/architecture",
  ];

  try {
    const posts = await db.query.blogs.findMany({
      where: eq(blogs.published, true),
    });

    const blogUrls = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const routes = staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1.0 : 0.8,
    }));

    return [...routes, ...blogUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return at least static routes if DB query fails
    return staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1.0 : 0.8,
    }));
  }
}
