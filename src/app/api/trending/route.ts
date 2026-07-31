import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// POST /api/trending/track — record a trending event
export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { tmdb_id, media_type, event_type } = body;

    if (!tmdb_id || !media_type || !event_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["movie", "tv"].includes(media_type)) {
      return NextResponse.json({ error: "Invalid media_type" }, { status: 400 });
    }

    if (!["search", "click", "watchlist_add", "watchlist_remove"].includes(event_type)) {
      return NextResponse.json({ error: "Invalid event_type" }, { status: 400 });
    }

    const { error } = await supabase.from("trending_events").insert({
      tmdb_id,
      media_type,
      event_type,
      // user_id is optional — null for anonymous users
    });

    if (error) {
      console.error("Trending track error:", error);
      return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Trending track error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET /api/trending?type=movie&limit=20
export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const mediaType = searchParams.get("type") || "movie";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  if (!["movie", "tv"].includes(mediaType)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("trending_scores")
    .select("tmdb_id, media_type, score, search_count, click_count, watchlist_add_count")
    .eq("media_type", mediaType)
    .order("score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Trending fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }

  return NextResponse.json({ trending: data });
}
