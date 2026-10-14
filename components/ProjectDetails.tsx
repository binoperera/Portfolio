"use client";

import { useId, useState } from "react";
import { getTechIconUrl } from "@/lib/techIcons";

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.08 0 4.41-2.7 5.38-5.26 5.67.42.36.78 1.07.78 2.15 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

export default function ProjectDetails({
  summary,
  description,
  techStack,
  liveUrl,
  githubUrl,
  architectureImage,
  impact,
  challenges,
  learnings,
}: {
  summary: string;
  description?: string;
  techStack?: string[];
  liveUrl?: string;
  githubUrl?: string;
  architectureImage?: string;
  impact?: string[];
  challenges?: string;
  learnings?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const hasExtras =
    (impact && impact.length > 0) || architectureImage || challenges || learnings;

  return (
    <>
      <p className="text-cream/80 mt-2 leading-relaxed">{summary}</p>

      {techStack && techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono
                         bg-cream/5 border border-cream/15 text-cream/70"
            >
              {/* Small external SVG icons — next/image adds nothing here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getTechIconUrl(tech)}
                alt=""
                className="w-3.5 h-3.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {tech}
            </span>
          ))}
        </div>
      )}

      {(liveUrl || githubUrl) && (
        <div className="flex flex-wrap gap-4 mt-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-safelight hover:underline"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-safelight hover:underline"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              GitHub
            </a>
          )}
        </div>
      )}

      {(description || hasExtras) && (
        <div className="mt-3">
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{
              gridTemplateRows: expanded ? "1fr" : "0fr",
            }}
          >
            {/* While collapsed this panel is 0px tall but still in the DOM, so hide it
                from screen readers and search crawlers too — otherwise the description
                is read twice (here and in the 2-line preview below). */}
            <div id={panelId} aria-hidden={!expanded} className="overflow-hidden min-h-0">
              {description && (
                <p className="text-cream/70 text-sm leading-relaxed">
                  {description}
                </p>
              )}

              {impact && impact.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {impact.map((line, i) => (
                    <li
                      key={i}
                      className="text-cream/70 text-sm flex items-start gap-2"
                    >
                      <span className="text-safelight mt-0.5" aria-hidden>▹</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}

              {architectureImage && (
                <div className="mt-4">
                  <p className="font-mono text-xs text-cream/65 mb-2 uppercase tracking-wide">
                    Architecture
                  </p>
                  <div className="overflow-hidden border border-cream/10">
                    {/* Plain <img>: next/image would crash on uploaded images
                        unless their host is added to next.config images.remotePatterns. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={architectureImage}
                      alt="Architecture diagram"
                      loading="lazy"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {challenges && (
                <div className="mt-4">
                  <p className="font-mono text-xs text-cream/65 mb-1.5 uppercase tracking-wide">
                    Challenges
                  </p>
                  <p className="text-cream/70 text-sm leading-relaxed">
                    {challenges}
                  </p>
                </div>
              )}

              {learnings && (
                <div className="mt-4">
                  <p className="font-mono text-xs text-cream/65 mb-1.5 uppercase tracking-wide">
                    What I Learned
                  </p>
                  <p className="text-cream/70 text-sm leading-relaxed">
                    {learnings}
                  </p>
                </div>
              )}
            </div>
          </div>

          {!expanded && description && (
            <p className="text-cream/70 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-controls={panelId}
            className="font-mono text-xs text-safelight hover:underline mt-2"
          >
            {expanded ? "See less" : "See more"}
          </button>
        </div>
      )}
    </>
  );
}
