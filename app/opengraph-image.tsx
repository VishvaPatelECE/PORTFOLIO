import { ImageResponse } from "next/og";

export const alt = "Vishva Patel — Embedded & Intelligent Systems Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#08070b",
          backgroundImage:
            "radial-gradient(circle at 84% 18%, rgba(0, 174, 189, 0.24), transparent 45%), radial-gradient(circle at 14% 85%, rgba(185, 157, 115, 0.18), transparent 48%)",
          color: "#f4f2ee",
          fontFamily: "sans-serif",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: 18,
              letterSpacing: "0.22em",
              color: "#00aebd",
              textTransform: "uppercase",
            }}
          >
            VISHVAPROJECTS · ENGINEERING PORTFOLIO
          </span>
          <span
            style={{
              fontSize: 16,
              letterSpacing: "0.14em",
              color: "#b99d73",
            }}
          >
            VISHVAPROJECTS.IN
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#f4f2ee",
            }}
          >
            Vishva Patel
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "#d4d0c8",
              maxWidth: 920,
            }}
          >
            Wireless Telemetry Compilers, Vehicular MARL, Computer Vision Liveness &amp; Digital Hardware Control
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 18,
            color: "#9a958d",
            letterSpacing: "0.08em",
          }}
        >
          <span>RANGRAPH</span>
          <span>·</span>
          <span>GRAPHMARL</span>
          <span>·</span>
          <span>DARVS</span>
          <span>·</span>
          <span>USMHACS</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

