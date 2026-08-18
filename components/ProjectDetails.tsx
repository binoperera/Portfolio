"use client";

import { useState } from "react";

export default function ProjectDetails({
  summary,
  description,
}: {
  summary: string;
  description?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <p className="text-cream/80 mt-2 leading-relaxed">{summary}</p>

      {description && (
        <div className="mt-3">
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{
              gridTemplateRows: expanded ? "1fr" : "0fr",
            }}
          >
            <div className="overflow-hidden">
              <p className="text-cream/60 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Collapsed preview (only shown when not expanded) */}
          {!expanded && (
            <p className="text-cream/60 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="font-mono text-xs text-safelight hover:underline mt-1"
          >
            {expanded ? "See less" : "See more"}
          </button>
        </div>
      )}
    </>
  );
}
