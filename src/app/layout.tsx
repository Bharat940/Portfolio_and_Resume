import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Code_Pro, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bharat-dangi.is-a.dev'),
  title: {
    default: "Bharat Dangi | Full Stack Developer",
    template: "%s | Bharat Dangi"
  },
  description: "Portfolio of Bharat Dangi - Building high-performance distributed systems, AI-powered applications, and beautiful web experiences.",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://bharat-dangi.is-a.dev',
    title: 'Bharat Dangi | Full Stack Developer',
    description: 'Building high-performance distributed systems and beautiful web experiences.',
    siteName: 'Bharat Dangi Portfolio',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'Bharat Dangi Portfolio'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bharat Dangi | Full Stack Developer',
    description: 'Building high-performance distributed systems and beautiful web experiences.',
    images: ['/logo.png'],
    creator: '@BharatDangi',
  },
};

import { CursorProvider } from "@/context/CursorContext";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { TerminalProvider } from "@/context/TerminalContext";
import { TerminalOverlay } from "@/components/terminal/TerminalOverlay";
import { LazyMotion, domAnimation } from "motion/react";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceCodePro.variable} ${pixelifySans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <LazyMotion features={domAnimation} strict>
          <TerminalProvider>
            <CursorProvider>
              <CustomCursor />
              <TooltipProvider>
                <Navbar />
                <main className="flex-1 flex flex-col">
                  {children}
                </main>
                <Footer />
                <TerminalOverlay />
                <ScrollProgress />
              </TooltipProvider>
            </CursorProvider>
          </TerminalProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
