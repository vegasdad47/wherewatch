import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { auth } from "@/auth";

// GET /api/watchlist — get user's watchlist
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", session.user.id)
    .order("added_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }

  return NextResponse.json({ watchlist: data });
}

// POST /api/watchlist — add to watchlist
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { tmdb_id, media_type, title, poster_path } = body;

    if (!tmdb_id || !media_type || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("watchlist")
      .upsert(
        {
          user_id: session.user.id,
          tmdb_id,
          media_type,
          title,
          poster_path: poster_path || null,
        },
        { onConflict: "user_id,tmdb_id,media_type" },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
    }

    return NextResponse.json({ item: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/watchlist — remove from watchlist
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const tmdbId = searchParams.get("tmdb_id");
  const mediaType = searchParams.get("media_type");

  if (!tmdbId || !mediaType) {
    return NextResponse.json({ error: "Missing tmdb_id or media_type" }, { status: 400 });
  }

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", session.user.id)
    .eq("tmdb_id", parseInt(tmdbId))
    .eq("media_type", mediaType);

  if (error) {
    return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
