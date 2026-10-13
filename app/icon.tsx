import { ImageResponse } from "next/og";

// Browser-tab favicon. Next.js picks this file up automatically.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#22201C",
          color: "#EDE8DC",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: -0.5,
          borderRadius: 6,
        }}
      >
        NP
        <div style={{ width: 4, height: 4, borderRadius: 2, background: "#EC5244", marginLeft: 1, marginTop: 9 }} />
      </div>
    ),
    size
  );
}
