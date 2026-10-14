import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";

const links = [
  { href: "#work", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#certifications", label: "Certifications" },
   { href: "#exposures", label: "Beyond Code" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      {/* Same width as the page sections (CONTAINER in app/page.tsx). */}
      <nav aria-label="Primary" className="max-w-7xl mx-auto px-6 lg:px-12 h-14 flex items-center gap-6">
        <a
          href="#top"
          className="flex items-center gap-2 font-display font-bold text-cream tracking-tight shrink-0 hover:text-safelight transition"
        >
          <span aria-hidden className="h-2 w-2 rounded-full bg-safelight" />
          {name}
        </a>
        <ul className="hidden lg:flex items-center gap-6 ml-auto">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="eyebrow text-cream/65 hover:text-cream transition whitespace-nowrap">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto lg:ml-0 flex items-center gap-3">
          <ThemeToggle />
          <MobileMenu links={links} />
        </div>
      </nav>
    </header>
  );
}
