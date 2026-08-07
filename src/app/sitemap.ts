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

  // Collect movie and TV IDs from multiple sources
  const ids = new Set<number>();
  const tvIds = new Set<number>();

  try {
    // Trending (all types)
    const trending = await getTrending(1);
    for (const item of trending.results) {
      if (item.media_type === "movie") ids.add(item.id);
      else if (item.media_type === "tv") tvIds.add(item.id);
    }
  } catch { /* skip on failure */ }

  try {
    // Now playing movies
    const nowPlaying = await getNowPlaying(1);
    for (const item of nowPlaying.results) ids.add(item.id);
  } catch { /* skip on failure */ }

  // Popular by genre (top 3 genres for each type)
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      getGenres("movie"),
      getGenres("tv"),
    ]);

    const topMovieGenres = movieGenres.genres.slice(0, 3);
    const topTvGenres = tvGenres.genres.slice(0, 3);

    for (const genre of topMovieGenres) {
      try {
        const res = await discoverByGenre("movie", genre.id, 1);
        for (const item of res.results) ids.add(item.id);
      } catch { /* skip */ }
    }

    for (const genre of topTvGenres) {
      try {
        const res = await discoverByGenre("tv", genre.id, 1);
        for (const item of res.results) tvIds.add(item.id);
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
