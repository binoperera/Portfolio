import type { ReactNode } from "react";
import { getData } from "@/lib/store";
import type { Qualification } from "@/lib/types";
import FilmFrame from "@/components/FilmFrame";
import Reveal from "@/components/Reveal";
import ProjectDetails from "@/components/ProjectDetails";
import Skills from "@/components/Skills";
import Nav from "@/components/Nav";

// Always read fresh data — without this, Next.js may statically cache this
// page at build time and your admin edits wouldn't show up once deployed.
export const dynamic = "force-dynamic";

// Shared section spacing; scroll-mt keeps headings clear of the sticky nav.
const SECTION = "max-w-5xl mx-auto px-6 py-16 border-t border-line scroll-mt-20";

function Sprocket({ holeColor }: { holeColor: string }) {
  return <div className="sprocket-strip" style={{ ["--hole-color" as any]: holeColor }} />;
}

function formatDate(d?: string) {
  if (!d) return "Present";
  const [year, month] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[Number(month) - 1] ?? ""} ${year}`;
}

// Newest first. "Present" (no endDate) counts as the latest possible date;
// ties fall back to the latest start date.
function byRecency(a: Qualification, b: Qualification) {
  const endA = a.endDate || "9999-12";
  const endB = b.endDate || "9999-12";
  if (endA !== endB) return endB.localeCompare(endA);
  return b.startDate.localeCompare(a.startDate);
}

// Real <h2> for accessibility/SEO, styled exactly like the old eyebrow label.
function SectionHeading({ children, className = "text-cream/50 mb-10" }: { children: ReactNode; className?: string }) {
  return <h2 className={`eyebrow ${className}`}>{children}</h2>;
}

function QualificationList({ items }: { items: Qualification[] }) {
  return (
    <ol className="space-y-10">
      {items.map((q, i) => (
        <li key={q.id}>
          <Reveal delay={i * 80}>
            <div className="border-l border-line pl-6 pb-2">
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
                    {intro && <p className="text-cream/80 leading-relaxed">{intro}</p>}
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
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export default async function HomePage() {
  const data = await getData();
  const { profile, qualifications, activities, projects, resume, skills } = data;

  const experience = qualifications.filter((q) => q.type === "experience").sort(byRecency);
  const education = qualifications.filter((q) => q.type === "education").sort(byRecency);
  const certifications = qualifications.filter((q) => q.type === "certification").sort(byRecency);
  const sortedActivities = [...activities].sort((a, b) => a.order - b.order);
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  return (
    <>
      <Nav name={profile.name} />

      <main id="main-content">
        {/* ---------------- HERO ---------------- */}
        <section id="top" className="relative overflow-hidden">
          <Sprocket holeColor="rgb(var(--c-ink))" />
          <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-[1fr_240px] gap-10 md:gap-14 items-start">
            <div>
              <p className="eyebrow text-safelight mb-6">
                Software Engineering Graduate · QA Engineer
                {profile.location && (
                  <>
                    <br />
                    {profile.location}
                  </>
                )}
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
                    className="inline-flex items-center gap-2 bg-safelight text-white px-5 py-3 font-medium hover:brightness-110 transition"
                  >
                    Resume
                    <span aria-hidden>↓</span>
                  </a>
                )}
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 border border-line text-cream px-5 py-3 font-medium hover:border-cream/50 transition"
                >
                  View Projects
                </a>
                <a
                  href="#exposures"
                  className="inline-flex items-center gap-2 border border-line text-cream px-5 py-3 font-medium hover:border-cream/50 transition"
                >
                  Photography &amp; Design
                </a>
              </div>
            </div>

            <Reveal delay={150}>
              <FilmFrame photoUrl={profile.photoUrl} name={profile.name} />
            </Reveal>
          </div>
          <Sprocket holeColor="rgb(var(--c-ink))" />
        </section>

        {/* ---------------- ABOUT ---------------- */}
        <section id="about" className={SECTION}>
          <div className="grid md:grid-cols-[120px_1fr] gap-6">
            <SectionHeading className="text-cream/50">About</SectionHeading>
            <p className="text-cream/90 text-lg leading-relaxed max-w-2xl break-words">{profile.bio}</p>
          </div>
        </section>

        {/* ---------------- PROJECTS (moved up: the main thing recruiters look for) ---------------- */}
        <section id="work" className={SECTION}>
          <SectionHeading>Projects</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            {sortedProjects.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <div className="border border-line p-6 flex flex-col bg-surface h-full">
                  {p.imageUrl && (
                    <div className="-mx-6 -mt-6 mb-5 aspect-video overflow-hidden border-b border-line bg-ink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.imageUrl}
                        alt={`${p.title} screenshot`}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display font-medium text-2xl text-cream">{p.title}</h3>
                    {p.featured && (
                      <span className="eyebrow text-safelight shrink-0 pt-1">Featured</span>
                    )}
                  </div>
                  <ProjectDetails
                    summary={p.summary}
                    description={p.description}
                    impact={p.impact}
                    challenges={p.challenges}
                    architectureImage={p.architectureImage}
                  />
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
                        Live demo ↗
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------- EXPERIENCE ---------------- */}
        {experience.length > 0 && (
          <section id="experience" className={SECTION}>
            <SectionHeading>Experience</SectionHeading>
            <QualificationList items={experience} />
          </section>
        )}

        {/* ---------------- EDUCATION ---------------- */}
        {education.length > 0 && (
          <section id="education" className={SECTION}>
            <SectionHeading>Education</SectionHeading>
            <QualificationList items={education} />
          </section>
        )}

        {/* ---------------- SKILLS ---------------- */}
        <div id="skills" className="scroll-mt-20">
          <Skills skills={skills} />
        </div>

        {/* ---------------- CERTIFICATIONS ---------------- */}
        {certifications.length > 0 && (
          <section id="certifications" className={SECTION}>
            <SectionHeading>Certifications</SectionHeading>
            <QualificationList items={certifications} />
          </section>
        )}

        {/* ---------------- BEYOND CODE (was the cream "contact sheet") ---------------- */}
        <section id="exposures" className={SECTION}>
          <SectionHeading>Beyond code — photography, design &amp; community</SectionHeading>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedActivities.map((a, i) => (
              <Reveal key={a.id} delay={i * 80}>
                <a
                  href={a.link || undefined}
                  target={a.link ? "_blank" : undefined}
                  rel={a.link ? "noopener noreferrer" : undefined}
                  className={`group border border-line bg-surface p-5 flex flex-col h-full ${
                    a.link ? "hover:border-cream/40 transition cursor-pointer" : ""
                  }`}
                >
                  <p className="eyebrow text-safelight mb-3">{a.category}</p>
                  <h3 className="font-display font-medium text-xl text-cream">{a.title}</h3>
                  {a.description && (
                    <p className="text-cream/70 text-sm mt-2 leading-relaxed flex-1">{a.description}</p>
                  )}
                  {a.link && (
                    <span className="font-mono text-xs mt-4 text-cream/50 group-hover:text-safelight transition">
                      view →
                    </span>
                  )}
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      {/* ---------------- CONTACT / FOOTER ---------------- */}
      <footer id="contact" className="border-t border-line scroll-mt-20">
        <Sprocket holeColor="rgb(var(--c-ink))" />
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="eyebrow text-cream/50 mb-4">Contact</p>
          <Reveal>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-cream mb-6">
              Open to Software Engineering &amp; QA roles — let&apos;s talk.
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
            {profile.socials.facebook && (
              <a href={profile.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-safelight transition">
                Facebook
              </a>
            )}
          </div>
          <p className="font-mono text-xs text-cream/30 mt-12">
            © {new Date().getFullYear()} {profile.name}. Built with Next.js.
          </p>
        </div>
      </footer>
    </>
  );
}
