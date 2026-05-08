import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { BlogEditor } from "@/components/admin/BlogEditor";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Guard
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  let initialData = null;

  if (id !== "new") {
    const blog = await db.query.blogs.findFirst({
      where: eq(blogs.id, id),
    });

    if (!blog) {
      notFound();
    }

    initialData = blog;
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto pb-32">
      <BlogEditor initialData={initialData} />
    </div>
  );
}
