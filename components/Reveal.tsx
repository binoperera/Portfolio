"use client";

import { useEffect, useRef, useState } from "react";

// Wraps content so it "develops" into view on scroll — starts blurred and
// slightly dark, like a print emerging in a chemical bath, then clears.
// Re-triggers both ways: scrolling past a section again replays the effect,
// so the page keeps a sense of movement instead of revealing once and going static.
// Respects prefers-reduced-motion via the global CSS override in globals.css.
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reveal immediately if already on-screen at mount (e.g. mid-scroll load
    // or a back/forward navigation that restored scroll position).
    const rect = el.getBoundingClientRect();
    const alreadyInView =
      rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    if (alreadyInView) setVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        // Slightly generous margins so it doesn't flicker right at the
        // viewport edge, but still clearly replays on scroll-up.
        rootMargin: "0px 0px -5% 0px",
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`develop-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}