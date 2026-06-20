import { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Bharat Dangi | Full Stack Software Engineer & Architect",
  description:
    "Welcome to the technical arsenal of Bharat Dangi. Exploring distributed systems, C++ ray tracing, and high-performance web architectures.",
  openGraph: {
    title: "Bharat Dangi | Full Stack Software Engineer & Architect",
    description:
      "Exploring distributed systems, C++ ray tracing, and high-performance web architectures.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomeContent />;
}
