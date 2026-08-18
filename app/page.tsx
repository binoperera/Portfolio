import { getData } from "@/lib/store";
import type { Qualification } from "@/lib/types";
import FilmFrame from "@/components/FilmFrame";
import Reveal from "@/components/Reveal";

// Always read fresh data — without this, Next.js may statically cache this
// page at build time and your admin edits wouldn't show up once deployed.
export const dynamic = "force-dynamic";

function Sprocket({ holeColor }: { holeColor: string }) {
  return <div className="sprocket-strip" style={{ ["--hole-color" as any]: holeColor }} />;
}

function formatDate(d?: string) {
  if (!d) return "Present";
  const [year, month] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[Number(month) - 1] ?? ""} ${year}`;
}

const typeLabel: Record<Qualification["type"], string> = {
  education: "Education",
  experience: "Experience",
  certification: "Certification",
};

export default async function HomePage() {
  const data = await getData();
  const { profile, qualifications, activities, projects, resume } = data;

 const typeOrder: Record<Qualification["type"], number> = {
  education: 0,
  experience: 1,
  certification: 2,
};

const sortedQualifications = [...qualifications].sort((a, b) => {
  // Education -> Experience -> Certification
  if (typeOrder[a.type] !== typeOrder[b.type]) {
    return typeOrder[a.type] - typeOrder[b.type];
  }

  // Present (no endDate) counts as the latest possible date
  const endA = a.endDate || "9999-12";
  const endB = b.endDate || "9999-12";

  if (endA !== endB) {
    return endB.localeCompare(endA); // latest end date first
  }

  // Tiebreaker when end dates match: latest start date first
  return b.startDate.localeCompare(a.startDate);
});
  const sortedActivities = [...activities].sort((a, b) => a.order - b.order);
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  return (
    <main>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <Sprocket holeColor="#141310" />
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-[1fr_240px] gap-10 md:gap-14 items-start">
          <div>
            <p className="eyebrow text-safelight mb-6">
  Building software.Shooting film. <br></br>{profile.location && `${profile.location}`}
</p>
            <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight text-cream">
              {profile.name}
            </h1>
            <p className="font-display text-xl md:text-2xl text-aperture mt-3 break-words">{profile.role}</p>
            <p className="max-w-2xl text-cream/80 text-lg mt-6 leading-relaxed break-words">{profile.tagline}</p>

            <div className="flex flex-wrap gap-4 mt-9">
              {resume && (
                <a
                  href={resume.url}
                  download={resume.fileName}
                  className="inline-flex items-center gap-2 bg-safelight text-cream px-5 py-3 font-medium hover:brightness-110 transition"
                >
                  Resume
                  <span aria-hidden>↓</span>
                </a>
              )}
              <a
                href="#work"
                className="inline-flex items-center gap-2 border border-line text-cream px-5 py-3 font-medium hover:border-cream/50 transition"
              >
                See My Projects
              </a>
              <a
                href="#exposures"
                className="inline-flex items-center gap-2 border border-line text-cream px-5 py-3 font-medium hover:border-cream/50 transition"
              >
                Want to Check my Exposures?
              </a>
            </div>
          </div>

          <Reveal delay={150}>
            <FilmFrame photoUrl={profile.photoUrl} name={profile.name} />
          </Reveal>
        </div>
        <Sprocket holeColor="#141310" />
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-line">
        <div className="grid md:grid-cols-[120px_1fr] gap-6">
          <p className="eyebrow text-cream/50">About</p>
<p className="text-cream/90 text-lg leading-relaxed max-w-2xl break-words">{profile.bio}</p>
        </div>
      </section>

      {/* ---------------- QUALIFICATIONS (developed like a timeline of exposures) ---------------- */}
      <section id = "exposures" className="max-w-5xl mx-auto px-6 py-16 border-t border-line">
        <p className="eyebrow text-cream/50 mb-10">Education &amp; Experience</p>
        <ol className="space-y-10">
          {sortedQualifications.map((q, i) => (
            <li key={q.id}>
              <Reveal delay={i * 80}>
                <div>
  <div className="border-l border-line pl-6 pb-2">
                  </div>
                  <div className="border-l border-line pl-6 pb-2">
                    <p className="eyebrow text-aperture mb-1">{typeLabel[q.type]}</p>
                    <h3 className="font-display font-medium text-2xl text-cream">{q.title}</h3>
                    <p className="text-cream/70 mt-1">
                      {q.organization}
                      {q.location ? ` · ${q.location}` : ""}
                    </p>
                    <p className="font-mono text-xs text-cream/40 mt-2">
                      {formatDate(q.startDate)} — {formatDate(q.endDate)}
                    </p>
                    {q.description && (() => {
  const parts = q.description.split("•").map((s) => s.trim()).filter(Boolean);
  const [intro, ...points] = parts;

  return (
    <div className="mt-3 max-w-2xl">
      {intro && (
        <p className="text-cream/80 leading-relaxed">{intro}</p>
      )}
      {points.length > 0 && (
        <ul className="mt-2 space-y-1.5 list-disc list-inside marker:text-safelight">
          {points.map((point, idx) => (
            <li key={idx} className="text-cream/80 leading-relaxed pl-1">
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
})()}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- EXTRA-CURRICULAR / CONTACT SHEET ---------------- */}
      <section className="border-t border-line bg-paper text-paper-ink">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="eyebrow text-paper-ink/50 mb-10">Contact sheet — beyond the day job</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedActivities.map((a, i) => (
              <Reveal key={a.id} delay={i * 80}>
                <a
                  href={a.link || undefined}
                  target={a.link ? "_blank" : undefined}
                  rel={a.link ? "noopener noreferrer" : undefined}
                  className={`group border border-line-paper bg-[#EAE3D3] p-5 flex flex-col h-full ${
                    a.link ? "hover:border-paper-ink/40 transition cursor-pointer" : ""
                  }`}
                >
                  <p className="eyebrow text-safelight mb-3">{a.category}</p>
                  <h3 className="font-display font-medium text-xl">{a.title}</h3>
                  {a.description && (
                    <p className="text-paper-ink/70 text-sm mt-2 leading-relaxed flex-1">
                      {a.description}
                    </p>
                  )}
                  {a.link && (
                    <span className="font-mono text-xs mt-4 text-paper-ink/50 group-hover:text-safelight transition">
                      view →
                    </span>
                  )}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROJECTS ---------------- */}
      <section id="work" className="max-w-5xl mx-auto px-6 py-16 border-t border-line scroll-mt-8">
        <p className="eyebrow text-cream/50 mb-10">Developed — selected projects</p>
        <div className="grid md:grid-cols-2 gap-6">
          {sortedProjects.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <div className="border border-line p-6 flex flex-col bg-surface h-full">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-medium text-2xl text-cream">{p.title}</h3>
                  {p.featured && (
                    <span className="eyebrow text-safelight shrink-0 pt-1">Featured</span>
                  )}
                </div>
                <p className="text-cream/80 mt-2 leading-relaxed">{p.summary}</p>
                {p.description && (
                  <p className="text-cream/60 text-sm mt-3 leading-relaxed">{p.description}</p>
                )}
                {p.techStack?.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mt-4">
                    {p.techStack.map((t) => (
                      <li key={t} className="font-mono text-xs text-aperture border border-aperture/30 px-2 py-1">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-5 mt-5 pt-4 border-t border-line">
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-cream/80 hover:text-safelight transition"
                  >
                    GitHub ↗
                  </a>
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-cream/80 hover:text-safelight transition"
                    >
                      Live ↗
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- CONTACT / FOOTER ---------------- */}
      <footer className="border-t border-line">
        <Sprocket holeColor="#141310" />
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="eyebrow text-cream/50 mb-4">Develop &amp; print</p>
          <Reveal>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-cream mb-6">
              Let's Talk About the Next Roll or Something
            </h2>
          </Reveal>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
            <a href={`mailto:${profile.email}`} className="text-cream/80 hover:text-safelight transition">
              {profile.email}
            </a>
            {profile.socials.github && (
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-safelight transition">
                GitHub
              </a>
            )}
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-safelight transition">
                LinkedIn
              </a>
            )}
            {profile.socials.instagram && (
              <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-safelight transition">
                Instagram
              </a>
            )}
            {profile.socials.behance && (
              <a href={profile.socials.behance} target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-safelight transition">
                Facebook
              </a>
            )}
          </div>
          <p className="font-mono text-xs text-cream/30 mt-12">
            © {new Date().getFullYear()} {profile.name}. Built with Next.js, developed by NBP.
          </p>
        </div>
      </footer>
    </main>
  );
}
