import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "#work", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <nav aria-label="Primary" className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
        <a
          href="#top"
          className="hidden sm:flex items-center gap-2 font-display font-bold text-cream tracking-tight shrink-0 hover:text-safelight transition"
        >
          <span aria-hidden className="h-2 w-2 rounded-full bg-safelight" />
          {name}
        </a>
        <ul className="flex items-center gap-6 min-w-0 overflow-x-auto sm:ml-auto">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="eyebrow text-cream/60 hover:text-cream transition whitespace-nowrap">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
