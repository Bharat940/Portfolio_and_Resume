import { Metadata } from "next";
import { BlogContent } from "@/components/blog/BlogContent";

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

export default function BlogPage() {
  return <BlogContent />;
}
