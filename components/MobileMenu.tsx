"use client";

import { useEffect, useId, useState } from "react";

type NavLink = { href: string; label: string };

// Below the lg breakpoint the seven section links don't fit in one row, so
// they collapse behind a menu button instead of a sideways-scrolling strip.
export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // Close if the window is widened past the breakpoint while open.
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="h-9 w-9 flex items-center justify-center border border-line text-cream/70 hover:text-cream transition"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {/* Positioned against the sticky <header> in Nav.tsx. */}
      <ul
        id={panelId}
        hidden={!open}
        className="absolute left-0 right-0 top-full border-b border-line bg-ink px-6 py-2"
      >
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              onClick={() => setOpen(false)}
              className="eyebrow block py-3 text-cream/70 hover:text-cream transition"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
