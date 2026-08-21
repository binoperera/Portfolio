import type { Skill } from "@/lib/types";
import Reveal from "@/components/Reveal";

export default function Skills({ skills }: { skills: Skill[] }) {
  if (!skills || skills.length === 0) return null;

  const sorted = [...skills].sort((a, b) => a.order - b.order);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 border-t border-line">
      <p className="eyebrow text-cream/50 mb-10">Skills</p>
      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {sorted.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}>
            <div>
              <p className="eyebrow text-aperture mb-3">{s.category}</p>
              <ul className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-xs text-cream/80 border border-line px-3 py-1.5 hover:border-safelight/50 transition"
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
