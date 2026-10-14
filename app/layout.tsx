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

const SITE_URL = "https://nimsaraperera.vercel.app";
const TITLE = "Nimsara Perera — Software Engineer & QA Engineer";
const DESCRIPTION =
  "Software Engineering graduate (BEng Hons, IIT) and QA Engineer based in Colombo, Sri Lanka. Projects, experience and skills in web development, software testing and business analysis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Nimsara Perera",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Runs before the page paints: applies the visitor's saved Light/Dark choice
// so there's no flash of the wrong theme. No saved choice = follow the OS.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the script above may add data-theme to <html>
    // before React loads, which would otherwise log a hydration warning.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-ink text-cream`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-safelight focus:text-on-safelight focus:px-4 focus:py-2 focus:font-medium"
        >
          Skip to content
        </a>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
