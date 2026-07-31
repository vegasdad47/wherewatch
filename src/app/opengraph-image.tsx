import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Streaming Finder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          }}
        />
        {/* Icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 24,
            filter: "drop-shadow(0 0 20px rgba(59,130,246,0.3))",
          }}
        >
          🎬
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          Streaming Finder
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#3b82f6",
            marginTop: 16,
            fontWeight: 600,
          }}
        >
          Find where to watch
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            color: "#71717a",
            marginTop: 32,
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          Search movies and TV shows. Find streaming subscriptions, free options, rentals, and places to buy.
        </div>
      </div>
    ),
    { ...size },
  );
}
