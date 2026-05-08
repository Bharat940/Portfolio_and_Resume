import { describe, it, expect, beforeAll, vi } from "vitest";
import { auth } from "@/lib/auth";
import { postComment, toggleReaction } from "@/lib/actions/comment-actions";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

describe("Comment Actions Integration", () => {
  interface BetterAuthTestUtils {
    createUser: (data?: { email?: string; name?: string; emailVerified?: boolean }) => { id: string; email: string; name: string };
    saveUser: (user: unknown) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    login: (data: { userId: string }) => Promise<{
      headers: Headers;
      session: unknown;
      user: unknown;
      cookies: unknown[];
      token: string
    }>;
  }
  let testUtils: BetterAuthTestUtils;

  beforeAll(async () => {
    const ctx = await auth.$context;
    testUtils = ctx.test as unknown as BetterAuthTestUtils;
  });

  it("should post a comment and then toggle a reaction", async () => {
    // 1. Create and save a test user
    const testEmail = `test-${Math.random()}@example.com`;
    const user = testUtils.createUser({
      email: testEmail,
      name: "Test Operator",
    });
    await testUtils.saveUser(user);

    // 2. Mock a session/headers
    const { headers: sessionHeaders } = await testUtils.login({ userId: user.id });
    vi.mocked(headers).mockResolvedValue(sessionHeaders);

    const postSlug = "test-post-slug";
    const content = "This is a test discourse node.";

    const result = await postComment({ postSlug, content });
    expect(result.success).toBe(true);

    // Verify in DB
    const dbComment = await db.query.comments.findFirst({
      where: eq(comments.postSlug, postSlug),
    });
    expect(dbComment).toBeDefined();
    expect(dbComment?.content).toBe(content);

    // 3. Toggle a reaction
    const reactionResult = await toggleReaction(dbComment!.id, "🚀", postSlug);
    expect(reactionResult.success).toBe(true);

    // Verify reaction in DB
    const updatedComment = await db.query.comments.findFirst({
      where: eq(comments.id, dbComment!.id),
    });
    expect(updatedComment?.reactions?.["🚀"]).toContain(user.id);

    // 4. Cleanup
    await db.delete(comments).where(eq(comments.postSlug, postSlug));
    await testUtils.deleteUser(user.id);
  }, 30000);
});
