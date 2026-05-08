import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, embed, type UIMessage } from "ai";
import { db } from "@/lib/db";
import { knowledge } from "@/lib/db/schema";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success, limit, remaining, reset } = await rateLimit(ip);

  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // Extract text from the last message parts
  const lastMessageText = lastMessage.parts
    .filter((part) => part.type === "text")
    .map((part) => {
      if ("text" in part) return part.text;
      return "";
    })
    .join(" ");

  // 1. Generate embedding for the user's query
  const { embedding } = await embed({
    model: google.embedding("gemini-embedding-2"),
    value: lastMessageText || "",
  });

  // 2. Search for relevant context in the database
  const similarity = sql<number>`1 - (${cosineDistance(knowledge.embedding, embedding)})`;
  const relevantChunks = await db
    .select({ content: knowledge.content, similarity })
    .from(knowledge)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(3);

  const context = relevantChunks.map((c) => c.content).join("\n\n");

  // 3. System Prompt
  const systemPrompt = `
You are the AI Assistant for Bharat Dangi's developer portfolio. 
Your goal is to answer questions about Bharat's projects, skills, education, and experience using the provided context.

Context from Bharat's Knowledge Base:
${context}

Instructions:
- Be professional, concise, and helpful.
- If a user provides a Job Description (JD), analyze it and tell them how Bharat's skills align with the requirements (JD Matcher mode).
- Use a "Technical/Hacker" tone consistent with the portfolio (Catppuccin Mocha aesthetic).
- If the answer is not in the context, be honest but try to guide them to Bharat's contact information (bdangi450@gmail.com).
- Use markdown for formatting (bold, lists, etc.).
`;

  // 4. Stream the response from Gemini
  const result = streamText({
    model: google("gemini-3-flash-preview"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
