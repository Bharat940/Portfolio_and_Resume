"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const blogSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z.url().optional().or(z.literal("")),
  category: z.string().default("Engineering"),
  icon: z.string().default("Code"),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

/**
 * Validates if the current user has the 'admin' role.
 */
async function validateAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }

  return session.user;
}

export type BlogInput = z.infer<typeof blogSchema>;

/**
 * Creates or updates a blog post.
 */
export async function upsertBlogPost(data: BlogInput) {
  const user = await validateAdmin();
  const validated = blogSchema.parse(data);

  const blogData = {
    ...validated,
    authorId: user.id,
    updatedAt: new Date(),
  };

  if (validated.id) {
    // Update existing
    await db.update(blogs).set(blogData).where(eq(blogs.id, validated.id));
  } else {
    // Insert new
    await db.insert(blogs).values({
      ...blogData,
      createdAt: new Date(),
    });
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${validated.slug}`);
  revalidatePath("/admin");
}

/**
 * Deletes a blog post by ID.
 */
export async function deleteBlogPost(id: string) {
  await validateAdmin();

  await db.delete(blogs).where(eq(blogs.id, id));

  revalidatePath("/blog");
  revalidatePath("/admin");
}

/**
 * Quickly toggles the published status of a blog.
 */
export async function togglePublishStatus(id: string, currentStatus: boolean) {
  await validateAdmin();

  await db
    .update(blogs)
    .set({ published: !currentStatus, updatedAt: new Date() })
    .where(eq(blogs.id, id));

  revalidatePath("/blog");
  revalidatePath("/admin");
}
