import { ImageResponse } from "next/og";
import { getTv, imageUrl } from "@/lib/tmdb";

export const runtime = "edge";
export const alt = "TV show poster";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return new ImageResponse(
      <div style={{ background: "#0a0a0f", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 48 }}>TV show not found</div>,
      { ...size },
    );
  }

  try {
    const show = await getTv(id);
    const poster = imageUrl(show.poster_path, "w780");
    const backdrop = imageUrl(show.backdrop_path, "w780");

    if (backdrop) {
      return new ImageResponse(
        (
          <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Inter, system-ui, sans-serif" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={backdrop} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)" }} />
            <div style={{ position: "absolute", bottom: 60, left: 60, right: 60, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 20, color: "#3b82f6", fontWeight: 600, marginBottom: 8 }}>WhereWatch</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{show.name}</div>
              {show.first_air_date && <div style={{ fontSize: 24, color: "#a1a1aa", marginTop: 8 }}>{new Date(show.first_air_date).getFullYear()}{show.number_of_seasons ? ` · ${show.number_of_seasons} season${show.number_of_seasons > 1 ? "s" : ""}` : ""}</div>}
            </div>
          </div>
        ),
        { ...size },
      );
    }

    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)", fontFamily: "Inter, system-ui, sans-serif" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 60 }}>
            <div style={{ fontSize: 20, color: "#3b82f6", fontWeight: 600, marginBottom: 8 }}>WhereWatch</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{show.name}</div>
            {show.first_air_date && <div style={{ fontSize: 24, color: "#a1a1aa", marginTop: 8 }}>{new Date(show.first_air_date).getFullYear()}{show.number_of_seasons ? ` · ${show.number_of_seasons} season${show.number_of_seasons > 1 ? "s" : ""}` : ""}</div>}
            <div style={{ fontSize: 18, color: "#71717a", marginTop: 16, maxWidth: 500, lineHeight: 1.4 }}>{show.overview?.slice(0, 200)}{(show.overview?.length ?? 0) > 200 ? "…" : ""}</div>
          </div>
          {poster && (
            <div style={{ width: 300, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster} alt="" style={{ height: "80%", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
            </div>
          )}
        </div>
      ),
      { ...size },
    );
  } catch {
    return new ImageResponse(
      <div style={{ background: "#0a0a0f", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 48 }}>TV show not found</div>,
      { ...size },
    );
  }
}
