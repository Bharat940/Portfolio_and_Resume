import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postSlug = searchParams.get("postSlug");

  if (!postSlug) {
    return new Response("Missing postSlug", { status: 400 });
  }

  const results = await db
    .select()
    .from(comments)
    .where(eq(comments.postSlug, postSlug))
    .orderBy(desc(comments.createdAt));

  return Response.json(results);
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await rateLimit(ip);

  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }

  const body = await req.json();
  const { postSlug, content, authorName, authorAvatar, userId } = body;

  if (!postSlug || !content) {
    return new Response("Missing required fields", { status: 400 });
  }

  const newComment = await db
    .insert(comments)
    .values({
      postSlug,
      content,
      authorName: authorName || "Anonymous Hacker",
      authorAvatar,
      userId,
    })
    .returning();

  return Response.json(newComment[0]);
}
