"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const commentSchema = z.object({
  postSlug: z.string(),
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long"),
  parentId: z.uuid().optional(),
  authorName: z.string().max(50, "Name too long").optional(),
});

export async function postComment(data: z.infer<typeof commentSchema>) {
  const validated = commentSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id || null;
  const authorName =
    validated.authorName ||
    session?.user.name ||
    `Guest Hacker ${Math.floor(Math.random() * 1000)}`;
  // Seed the avatar with the user ID if logged in, otherwise use the post slug + random for guests
  const avatarSeed =
    userId || authorName || `${validated.postSlug}-${Math.random()}`;

  await db.insert(comments).values({
    postSlug: validated.postSlug,
    content: validated.content,
    userId,
    authorName,
    // Always use a random avatar based on identity for privacy
    authorAvatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${avatarSeed}`,
    parentId: validated.parentId,
    createdAt: new Date(),
  });

  revalidatePath(`/blog/${validated.postSlug}`);
  return { success: true };
}

export async function toggleReaction(
  commentId: string,
  emoji: string,
  postSlug: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user.id;
  if (!userId) return { error: "Login required" };

  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });

  if (!comment) return { error: "Comment not found" };

  const currentReactions =
    (comment.reactions as Record<string, string[]>) || {};
  const users = currentReactions[emoji] || [];

  let newUsers;
  if (users.includes(userId)) {
    newUsers = users.filter((id) => id !== userId);
  } else {
    newUsers = [...users, userId];
  }

  const newReactions = {
    ...currentReactions,
    [emoji]: newUsers,
  };

  await db
    .update(comments)
    .set({ reactions: newReactions })
    .where(eq(comments.id, commentId));

  revalidatePath(`/blog/${postSlug}`);
  return { success: true };
}
