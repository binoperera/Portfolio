import type { Skill } from "@/lib/types";
import Reveal from "@/components/Reveal";
import { getSkillIcon } from "@/lib/skillIcons";

const CATEGORY_ICONS: Record<string, JSX.Element> = {
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

function getIcon(category: string) {
  const key = category.trim().toLowerCase();
  return CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
}

export default function Skills({ skills }: { skills: Skill[] }) {
  if (!skills || skills.length === 0) return null;

  const sorted = [...skills].sort((a, b) => a.order - b.order);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 border-t border-line">
      <div className="flex items-baseline justify-between mb-10">
        <p className="eyebrow text-cream/50">Skills</p>
        <p className="font-mono text-xs text-cream/30">{sorted.length}< /p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {sorted.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}>
            <div className="group relative border border-line bg-surface p-5 overflow-hidden hover:border-safelight/40 transition">
              {/* top accent strip */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-safelight/70 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 text-aperture">
                  {getIcon(s.category)}
                  <h3 className="font-display font-medium text-lg text-cream">
                    {s.category}
                  </h3>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-xs text-cream/80 border border-line px-3 py-1.5 hover:border-safelight/60 hover:text-safelight hover:bg-safelight/5 transition cursor-default"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
