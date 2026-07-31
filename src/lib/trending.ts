export interface TrendingItem {
  tmdb_id: number;
  media_type: "movie" | "tv";
  score: number;
  search_count: number;
  click_count: number;
  watchlist_add_count: number;
}

export async function getTrending(
  type: "movie" | "tv" = "movie",
  limit = 20,
): Promise<TrendingItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/trending?type=${type}&limit=${limit}`,
      { next: { revalidate: 300 } }, // revalidate every 5 minutes
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.trending || [];
  } catch {
    return [];
  }
}
