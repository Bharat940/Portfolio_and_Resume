import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Source_Code_Pro,
  Pixelify_Sans,
} from "next/font/google";
import "./globals.css";
import { GlobalClientShell } from "@/components/layout/GlobalClientShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  display: "swap",
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bharat-dangi.vercel.app"),
  title: {
    default: "Bharat Dangi | Full Stack Developer",
    template: "%s | Bharat Dangi",
  },
  description:
    "Portfolio of Bharat Dangi: building high-performance distributed systems, AI-powered applications, and beautiful web experiences.",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bharat-dangi.vercel.app",
    title: "Bharat Dangi | Full Stack Developer",
    description:
      "Building high-performance distributed systems and beautiful web experiences.",
    siteName: "Bharat Dangi Portfolio",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Bharat Dangi Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bharat Dangi | Full Stack Developer",
    description:
      "Building high-performance distributed systems and beautiful web experiences.",
    images: ["/logo.png"],
    creator: "@BharatDangi",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Bharat Dangi",
    "Full Stack Developer",
    "Software Engineer",
    "Portfolio",
    "Distributed Systems",
    "Next.js",
    "React",
    "TypeScript",
    "Rust",
    "C++",
    "Web Development",
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bharat Dangi",
  url: "https://bharat-dangi.vercel.app",
  image: "https://bharat-dangi.vercel.app/logo.png",
  sameAs: [
    "https://github.com/Bharat940",
    "https://linkedin.com/in/bharat-dangi-b186b3248",
  ],
  jobTitle: "Full Stack Developer",
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
  description:
    "Portfolio of Bharat Dangi: building high-performance distributed systems, AI-powered applications, and beautiful web experiences.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bharat Dangi Portfolio",
  url: "https://bharat-dangi.vercel.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceCodePro.variable} ${pixelifySans.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="matrix-theme-lock"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('matrix-mode-active') === 'true') {
                  document.documentElement.classList.add('matrix-mode');
                }
                if (localStorage.getItem('recruiter-mode-active') === 'true') {
                  document.documentElement.classList.add('recruiter-mode');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <GlobalClientShell>{children}</GlobalClientShell>
      </body>
    </html>
  );
}
