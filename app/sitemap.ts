import type { MetadataRoute } from "next";

// Served at /sitemap.xml. One-page site, so one entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://nimsaraperera.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
