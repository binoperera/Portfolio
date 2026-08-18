import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/BackToTop";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Nimsara Perera — Software Engineer & Visual Creator",
  description:
    "Technology meets creativity. I am a Software Developer, QA Engineer, and Business Analyst with a passion for photography, videography, graphic design, and customer experience. I enjoy building reliable software, creating compelling visual content, and solving real-world problems through a balance of technical expertise, creativity, and continuous learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-ink text-cream`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-safelight focus:text-cream focus:px-4 focus:py-2 focus:font-medium"
        >
          Skip to content
        </a>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
