import { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Home | Bharat Dangi",
  description:
    "Welcome to the technical arsenal of Bharat Dangi. Exploring distributed systems, C++ ray tracing, and high-performance web architectures.",
  openGraph: {
    title: "Home | Bharat Dangi",
    description:
      "Exploring distributed systems, C++ ray tracing, and high-performance web architectures.",
  },
};

export default function Home() {
  return <HomeContent />;
}
