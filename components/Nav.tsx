const links = [
  { href: "#work", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[#141310]/85 backdrop-blur">
      <nav aria-label="Primary" className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
        <a href="#top" className="hidden sm:block font-display font-medium text-cream shrink-0">
          {name}
        </a>
        <ul className="flex items-center gap-5 min-w-0 overflow-x-auto font-mono text-xs sm:ml-auto">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-cream/70 hover:text-safelight transition whitespace-nowrap">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
