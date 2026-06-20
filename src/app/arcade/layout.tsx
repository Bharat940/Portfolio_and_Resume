import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arcade",
  description:
    "Play mini retro terminal and arcade games created by Bharat Dangi.",
  alternates: {
    canonical: "/arcade",
  },
};

export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
