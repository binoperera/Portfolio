import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getData } from "@/lib/store";
import type { Qualification } from "@/lib/types";
import FilmFrame from "@/components/FilmFrame";
import SmartImage from "@/components/SmartImage";
import { byRecency, formatYearMonth } from "@/lib/dates";
import Reveal from "@/components/Reveal";
import ProjectDetails from "@/components/ProjectDetails";
import Skills from "@/components/Skills";
import Nav from "@/components/Nav";
import { isVisualCategory } from "@/lib/activityCategories";

// Always read fresh data — without this, Next.js may statically cache this
// page at build time and your admin edits wouldn't show up once deployed.
export const revalidate = 3600;
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Page width. Wider than before (was max-w-5xl / 1024px) so large screens
// don't leave big empty gutters. Nav.tsx and Skills.tsx must use the same value.
const CONTAINER = "max-w-7xl mx-auto px-6 lg:px-12";

// Shared section spacing; scroll-mt keeps headings clear of the sticky nav.
const SECTION = `${CONTAINER} py-16 border-t border-line scroll-mt-20`;

function Sprocket({ holeColor }: { holeColor: string }) {
  return <div className="sprocket-strip" style={{ ["--hole-color" as any]: holeColor }} />;
}

// Real <h2> for accessibility/SEO, styled exactly like the old eyebrow label.
function SectionHeading({ children, className = "text-cream/65 mb-10" }: { children: ReactNode; className?: string }) {
  return <h2 className={`eyebrow ${className}`}>{children}</h2>;
}

// Two-column section: on large screens the label sits in a sticky left rail
// and the content fills the rest of the width. On mobile it stacks as before.
function Section({ id, title, children }: { id?: string; title: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className={SECTION}>
      <div className="grid lg:grid-cols-[160px_minmax(0,1fr)] gap-x-12 gap-y-8">
        <div>
          <SectionHeading className="text-cream/65 lg:sticky lg:top-24">{title}</SectionHeading>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function QualificationDescription({ text }: { text: string }) {
  const parts = text.split("•").map((s) => s.trim()).filter(Boolean);
  const [intro, ...points] = parts;

  return (
    <>
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
    </>
  );
}

// variant "split": title/org/date on the left, description on the right (Experience).
// variant "grid":  two entries per row on md+ screens (Education, Certifications).
function QualificationList({ items, variant = "grid" }: { items: Qualification[]; variant?: "split" | "grid" }) {
  const split = variant === "split";

  return (
    <ol className={split ? "space-y-12" : "grid md:grid-cols-2 gap-x-10 gap-y-10"}>
      {items.map((q, i) => (
        <li key={q.id}>
          <Reveal delay={i * 80}>
            <div
              className={`border-l border-line pl-6 pb-2 ${
                split ? "md:grid md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-10" : ""
              }`}
            >
              <div>
                <h3 className="font-display font-medium text-2xl text-cream">{q.title}</h3>
                <p className="text-cream/70 mt-1">
                  {q.organization}
                  {q.location ? ` · ${q.location}` : ""}
                </p>
                <p className="font-mono text-xs text-cream/65 mt-2">
                  {formatYearMonth(q.startDate)} – {formatYearMonth(q.endDate)}
                </p>
              </div>
              {q.description && (
                <div className={split ? "mt-3 md:mt-0 max-w-3xl" : "mt-3 max-w-2xl"}>
                  <QualificationDescription text={q.description} />
                </div>
              )}
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
  const certifications = qualifications
  .filter((q) => q.type === "certification")
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || byRecency(a, b));
  const sortedActivities = [...activities].sort((a, b) => a.order - b.order);
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  // Photos from Photography / Graphic Design galleries, in activity order, for the contact sheet.
  const GALLERY_LIMIT = 12;
  const galleryImages = sortedActivities
    .filter((a) => isVisualCategory(a.category))
    .flatMap((a) =>
      (a.images ?? []).map((src, idx) => ({ src, alt: `${a.title} — photo ${idx + 1}`, key: `${a.id}-${idx}` }))
    )
    .slice(0, GALLERY_LIMIT);
    // Structured data so search engines know this page is about a person.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: "https://nimsaraperera.vercel.app",
    ...(profile.photoUrl && { image: profile.photoUrl }),
    ...(profile.location && {
      address: { "@type": "PostalAddress", addressLocality: profile.location },
    }),
    sameAs: [profile.socials.linkedin, profile.socials.github].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav name={profile.name} />

      <main id="main-content">
        {/* ---------------- HERO ---------------- */}
        <section id="top" className="relative overflow-hidden">
          <Sprocket holeColor="rgb(var(--c-ink))" />
          <div className={`${CONTAINER} pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_360px] gap-10 md:gap-14 items-center`}>
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
                    className="inline-flex items-center gap-2 bg-safelight text-on-safelight px-5 py-3 font-medium hover:brightness-110 transition btn-glow"
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
        <Section id="about" title="About">
          <p className="text-cream/90 text-lg leading-relaxed max-w-3xl break-words">{profile.bio}</p>
        </Section>

        {/* ---------------- PROJECTS (moved up: the main thing recruiters look for) ---------------- */}
        <Section id="work" title="Projects">
          {/* Featured projects span the full row, so 3 projects read as 1 + 2 with no orphan card. */}
          <div className="grid md:grid-cols-2 gap-6">
            {sortedProjects.map((p, i) => (
              // Wrapper carries the column span; [&>*]:h-full keeps cards in a row equal height.
              <div key={p.id} className={`[&>*]:h-full ${p.featured ? "md:col-span-2" : ""}`}>
                <Reveal delay={i * 100}>
                  <div className="border border-line p-6 flex flex-col bg-surface h-full">
                    {p.imageUrl && (
                      <div className="relative -mx-6 -mt-6 mb-5 aspect-video overflow-hidden border-b border-line bg-ink">
                        <SmartImage
                          src={p.imageUrl}
                          alt={`${p.title} screenshot`}
                          sizes={p.featured ? "(min-width: 768px) 1100px, 100vw" : "(min-width: 768px) 550px, 100vw"}
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
                      learnings={p.learnings}
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
                    {/* Links get a 44px-tall tap area (py-3) without moving the text (-my-3). */}
                    <div className="flex gap-5 mt-5 pt-4 border-t border-line">
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center py-3 -my-3 font-mono text-sm text-cream/80 hover:text-safelight transition"
                      >
                        GitHub ↗
                      </a>
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center py-3 -my-3 font-mono text-sm text-cream/80 hover:text-safelight transition"
                        >
                          Live demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------------- EXPERIENCE ---------------- */}
        {experience.length > 0 && (
          <Section id="experience" title="Experience">
            <QualificationList items={experience} variant="split" />
          </Section>
        )}

        {/* ---------------- EDUCATION ---------------- */}
        {education.length > 0 && (
          <Section id="education" title="Education">
            <QualificationList items={education} />
          </Section>
        )}

        {/* ---------------- SKILLS ---------------- */}
        <div id="skills" className="scroll-mt-20">
          <Skills skills={skills} />
        </div>

        {/* ---------------- CERTIFICATIONS ---------------- */}
        {certifications.length > 0 && (
          <Section id="certifications" title="Certifications">
            <QualificationList items={certifications} />
          </Section>
        )}

        {/* ---------------- BEYOND CODE (was the cream "contact sheet") ---------------- */}
        <Section id="exposures" title={<>Beyond code </>}>
          {/* Contact sheet: gallery photos from all activities. Muted grade like the
              hero photo; hovering "develops" each frame to full colour. */}
          {galleryImages.length > 0 && (
            <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-10">
              {galleryImages.map((img, i) => (
                <li key={img.key}>
                  <Reveal delay={(i % 4) * 80}>
                    <a
                      href={img.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-[4/5] overflow-hidden border border-line bg-surface"
                    >
                      <SmartImage
                        src={img.src}
                        alt={img.alt}
                        sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
                        className="w-full h-full object-cover grayscale-[40%] sepia-[.2] brightness-[.85] transition duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-100 group-hover:scale-[1.03]"
                      />
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedActivities.map((a, i) => {
              // Cards without a link are plain cards, not <a> tags that go nowhere.
              const Card = a.link ? "a" : "div";
              return (
                <Reveal key={a.id} delay={i * 80}>
                  <Card
                    href={a.link || undefined}
                    target={a.link ? "_blank" : undefined}
                    rel={a.link ? "noopener noreferrer" : undefined}
                    className={`group border border-line bg-surface p-5 flex flex-col h-full ${
                      a.link ? "hover:border-cream/40 transition cursor-pointer" : ""
                    }`}
                  >
                    {a.imageUrl && (
                      <div className="relative -mx-5 -mt-5 mb-4 aspect-video overflow-hidden border-b border-line bg-ink">
                        <SmartImage
                          src={a.imageUrl}
                          alt={`${a.title} cover`}
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="eyebrow text-safelight mb-3">{a.category}</p>
                    <h3 className="font-display font-medium text-xl text-cream">{a.title}</h3>
                    {a.description && (
                      <p className="text-cream/70 text-sm mt-2 leading-relaxed flex-1">{a.description}</p>
                    )}
                    {a.link && (
                      <span className="font-mono text-xs mt-4 text-cream/65 group-hover:text-safelight transition">
                        view →
                      </span>
                    )}
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Section>
      </main>

      {/* ---------------- CONTACT / FOOTER ---------------- */}
      <footer id="contact" className="border-t border-line scroll-mt-20">
        <Sprocket holeColor="rgb(var(--c-ink))" />
        <div className={`${CONTAINER} py-16`}>
          <p className="eyebrow text-cream/65 mb-4">Contact</p>
          <Reveal>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-cream mb-6">
              Open to Software Engineering &amp; QA roles — let&apos;s talk.
            </h2>
          </Reveal>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
            <a href={`mailto:${profile.email}`} className="text-cream/80 hover:text-safelight transition link-underline">
              {profile.email}
            </a>
            {profile.socials.github && (
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-safelight transition link-underline">
                GitHub
              </a>
            )}
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-safelight transition link-underline">
                LinkedIn
              </a>
            )}      
          </div>
          <p className="font-mono text-xs text-cream/65 mt-12">
            © {new Date().getFullYear()} {profile.name}. Built with Next.js.
          </p>
        </div>
      </footer>
    </>
  );
}
