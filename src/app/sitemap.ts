import type { MetadataRoute } from "next";
import { getTrending, getNowPlaying, getGenres, discoverByGenre } from "@/lib/tmdb";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/browse`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/browse?type=tv`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/travel`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const ids = new Set<number>();
  const tvIds = new Set<number>();

  // Helper: add results from a page fetch
  function collect(results: Array<{ id: number; media_type?: string }>, type?: "movie" | "tv") {
    for (const item of results) {
      if (type === "movie" || item.media_type === "movie") ids.add(item.id);
      else if (type === "tv" || item.media_type === "tv") tvIds.add(item.id);
    }
  }

  // Trending — pages 1-5 (100 results)
  for (let page = 1; page <= 5; page++) {
    try {
      const trending = await getTrending(page);
      collect(trending.results);
    } catch { break; }
  }

  // Now playing movies — pages 1-3 (60 results)
  for (let page = 1; page <= 3; page++) {
    try {
      const nowPlaying = await getNowPlaying(page);
      collect(nowPlaying.results, "movie");
    } catch { break; }
  }

  // All genres for both types — page 1 of each
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      getGenres("movie"),
      getGenres("tv"),
    ]);

    for (const genre of movieGenres.genres) {
      try {
        const res = await discoverByGenre("movie", genre.id, 1);
        collect(res.results, "movie");
      } catch { /* skip */ }
    }

    for (const genre of tvGenres.genres) {
      try {
        const res = await discoverByGenre("tv", genre.id, 1);
        collect(res.results, "tv");
      } catch { /* skip */ }
    }
  } catch { /* skip on failure */ }

  // Add movie detail pages
  for (const id of ids) {
    entries.push({
      url: `${BASE}/movie/${id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Add TV detail pages
  for (const id of tvIds) {
    entries.push({
      url: `${BASE}/tv/${id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
