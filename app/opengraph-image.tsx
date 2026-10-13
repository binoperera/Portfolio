import { ImageResponse } from "next/og";

// Preview card shown when the site link is shared on LinkedIn, WhatsApp, Slack, etc.
// Next.js picks this file up automatically — no extra wiring needed.
export const alt = "Nimsara Perera — Software Engineer & QA Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#22201C",
          color: "#EDE8DC",
        }}
      >
        {/* sprocket strip */}
        <div style={{ display: "flex", gap: 22 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "#0F0E0C" }} />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, letterSpacing: 3, color: "#EC5244", textTransform: "uppercase" }}>
            Software Engineering Graduate · QA Engineer
          </div>
          <div style={{ fontSize: 96, fontWeight: 700, marginTop: 18, letterSpacing: -2 }}>Nimsara Perera</div>
          <div style={{ fontSize: 34, color: "#60B07E", marginTop: 12 }}>
            Projects · Experience · Skills
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#EDE8DCAA" }}>
          <span>Colombo, Sri Lanka</span>
          <span>nimsaraperera.vercel.app</span>
        </div>
      </div>
    ),
    size
  );
}
