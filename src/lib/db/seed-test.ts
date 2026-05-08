import "dotenv/config";
import { db } from "./index";
import { blogs, user } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding test blog post...");

  // 1. Ensure an admin user exists
  let admin = await db.query.user.findFirst({
    where: eq(user.role, "admin"),
  });

  if (!admin) {
    console.log("Creating admin user...");
    const [newAdmin] = await db
      .insert(user)
      .values({
        id: "test-admin-id",
        name: "Test Admin",
        email: "admin@test.com",
        emailVerified: true,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    admin = newAdmin;
  }

  // 2. Create a test blog post
  const testSlug = "test-e2e-post";
  const existingPost = await db.query.blogs.findFirst({
    where: eq(blogs.slug, testSlug),
  });

  if (!existingPost) {
    console.log("Creating test blog post...");
    await db.insert(blogs).values({
      slug: testSlug,
      title: "E2E Test Post",
      content: "# This is a test post\n\nWith some content for Playwright.",
      excerpt: "Seeded post for end-to-end testing protocols.",
      authorId: admin.id,
      published: true,
      category: "Engineering",
      icon: "Code",
      tags: ["test", "e2e"],
    });
  }

  console.log("✅ Seeding completed.");
}

seed().catch(console.error);
