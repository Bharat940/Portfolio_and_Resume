import { Metadata } from "next";
import { ProjectsContent } from "@/components/projects/ProjectsContent";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the technical arsenal of Bharat Dangi, ranging from distributed web systems to low-level native core projects in C++.",
  openGraph: {
    title: "Projects | Bharat Dangi",
    description:
      "Detailed archive of technical projects and engineering challenges solved by Bharat Dangi.",
  },
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
