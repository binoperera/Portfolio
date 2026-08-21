import type { JSX } from "react";

export const SKILL_CATEGORY_KEYS = [
  "languages",
  "frameworks",
  "databases",
  "tools",
  "testing",
] as const;

export const CATEGORY_ICONS: Record<string, JSX.Element> = {
  languages: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M4 6h16M4 6l4 12M4 6l4-2M20 6l-4 12M20 6l-4-2M9 18h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  frameworks: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 10h16M10 4v16" />
    </svg>
  ),
  databases: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4l-5 5v2h2l5-5a5 5 0 0 0 6.4-6.4l-2.8 2.8-2-2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  testing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M9 3v5.5L4 18a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9.5V3M9 3h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

export function getSkillIcon(category: string) {
  const key = category.trim().toLowerCase();
  return CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
}
