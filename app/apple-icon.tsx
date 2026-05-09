import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0f172a 0%, #020617 45%, #0e7490 100%)",
          borderRadius: 40,
          border: "3px solid rgba(34, 211, 238, 0.5)",
          color: "#e2e8f0",
          fontSize: 88,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          boxShadow: "0 0 60px rgba(34, 211, 238, 0.35)",
        }}
      >
        M
      </div>
    ),
    { ...size },
  );
}
