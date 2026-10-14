import type { MetadataRoute } from "next";

// Served at /robots.txt. The admin pages are kept out of search with a
// noindex tag (app/admin/layout.tsx) rather than blocked here, because
// Google has to be able to crawl a page to see its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://nimsaraperera.vercel.app/sitemap.xml",
  };
}
