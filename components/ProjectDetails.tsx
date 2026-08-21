"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { getTechIconUrl } from "@/lib/techIcons";

export default function ProjectDetails({
  summary,
  description,
  techStack,
  liveUrl,
  githubUrl,
  architectureImage,
  impact,
  challenges,
}: {
  summary: string;
  description?: string;
  techStack?: string[];
  liveUrl?: string;
  githubUrl?: string;
  architectureImage?: string;
  impact?: string[];
  challenges?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const hasExtras =
    (impact && impact.length > 0) || architectureImage || challenges;

  return (
    <>
      <p className="text-cream/80 mt-2 leading-relaxed">{summary}</p>

      {/* Tech stack badges — always visible, not gated behind expand */}
      {techStack && techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono
                         bg-cream/5 border border-cream/15 text-cream/70"
            >
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

      {/* Live demo / GitHub links */}
      {(liveUrl || githubUrl) && (
        <div className="flex flex-wrap gap-4 mt-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-safelight hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
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
              <Github className="w-3.5 h-3.5" />
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
            <div className="overflow-hidden">
              {description && (
                <p className="text-cream/60 text-sm leading-relaxed">
                  {description}
                </p>
              )}

              {/* Impact / metrics */}
              {impact && impact.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {impact.map((line, i) => (
                    <li
                      key={i}
                      className="text-cream/70 text-sm flex items-start gap-2"
                    >
                      <span className="text-safelight mt-0.5">▹</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Architecture diagram */}
              {architectureImage && (
                <div className="mt-4">
                  <p className="font-mono text-xs text-cream/50 mb-2 uppercase tracking-wide">
                    Architecture
                  </p>
                  <div className="rounded-lg overflow-hidden border border-cream/10">
                    <Image
                      src={architectureImage}
                      alt="Architecture diagram"
                      width={800}
                      height={450}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {/* Challenges & learnings */}
              {challenges && (
                <div className="mt-4">
                  <p className="font-mono text-xs text-cream/50 mb-1.5 uppercase tracking-wide">
                    Challenges &amp; What I Learned
                  </p>
                  <p className="text-cream/70 text-sm leading-relaxed italic">
                    {challenges}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Collapsed preview (only shown when not expanded) */}
          {!expanded && description && (
            <p className="text-cream/60 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          {(description || hasExtras) && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="font-mono text-xs text-safelight hover:underline mt-2"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      )}
    </>
  );
}
