import Link from "next/link";
import { AtSign } from "lucide-react";
import { PixelGitHub } from "@/components/icons/PixelGitHub";
import { PixelLinkedIn } from "@/components/icons/PixelLinkedIn";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      id="main-footer"
      className="border-t border-border mt-auto relative overflow-hidden bg-muted/20"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start group">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border/50 group-hover:scale-110 transition-transform shadow-lg">
              <Image
                src="/logo.png"
                alt="Bharat Dangi"
                fill
                sizes="40px"
                className="object-cover"
                priority
                loading="eager"
              />
            </div>
            <p className="text-sm font-bold font-heading">BHARAT_DANGI</p>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            © {new Date().getFullYear()} Bharat Dangi.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built with Next.js, Tailwind v4, and lots of coffee.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            className="text-muted-foreground hover:text-ctp-lavender transition-colors p-2"
            title="GitHub"
          >
            <PixelGitHub className="w-6 h-6 grayscale hover:grayscale-0 transition-all" />
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            className="text-muted-foreground hover:text-ctp-sky transition-colors p-2"
            title="Twitter"
          >
            <AtSign className="w-5 h-5" />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            className="text-muted-foreground hover:text-ctp-blue transition-colors p-2"
            title="LinkedIn"
          >
            <PixelLinkedIn className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
