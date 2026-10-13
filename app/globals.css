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

    // Very old browsers without IntersectionObserver: just show everything.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Reveal immediately if already on-screen at mount (e.g. mid-scroll load
    // or a back/forward navigation that restored scroll position).
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyInView) setVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        // threshold 0 + a positive bottom margin: content starts developing
        // just BEFORE it scrolls into view, and only hides once it's fully
        // off-screen. So visitors never see a blank gap where a section
        // should be — even on fast scrolls or tall sections.
        threshold: 0,
        rootMargin: "0px 0px 15% 0px",
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
