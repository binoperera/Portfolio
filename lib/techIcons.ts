const SLUG_OVERRIDES: Record<string, string> = {
  "next.js": "nextdotjs",
  "nextjs": "nextdotjs",
  "node.js": "nodedotjs",
  "nodejs": "nodedotjs",
  "vue.js": "vuedotjs",
  "vuejs": "vuedotjs",
  "c#": "csharp",
  "c++": "cplusplus",
  ".net": "dotnet",
  "tailwind css": "tailwindcss",
  "tailwind": "tailwindcss",
  "postgresql": "postgresql",
  "postgres": "postgresql",
  "mysql": "mysql",
  "mongodb": "mongodb",
  "express": "express",
  "express.js": "express",
  "html": "html5",
  "css": "css3",
  "js": "javascript",
  "ts": "typescript",
};

export function getTechIconUrl(techName: string): string {
  const key = techName.trim().toLowerCase();
  const slug =
    SLUG_OVERRIDES[key] ?? key.replace(/[.\s]/g, "").replace(/[^a-z0-9]/g, "");
  // Simple Icons CDN — returns the brand's own color automatically
  return `https://cdn.simpleicons.org/${slug}`;
}
