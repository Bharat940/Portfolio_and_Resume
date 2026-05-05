import { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description: "Diving into the technical philosophy of Bharat Dangi - bridging the gap between low-level efficiency and distributed system architecture.",
  openGraph: {
    title: "About | Bharat Dangi",
    description: "Technical philosophy and engineering background of Bharat Dangi.",
  }
};

export default function AboutPage() {
  return <AboutContent />;
}
