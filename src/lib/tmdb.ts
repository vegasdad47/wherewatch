import "server-only";

import { headers } from "next/headers";
import { CACHE_TTL, makeCacheKey, withCache } from "@/lib/cache";
import { getTmdbLanguage } from "@/lib/locale";
import type {
  MediaType,
  SearchResponse,
  MovieDetails,
  TvDetails,
  ProviderResponse,
  CreditsResponse,
  PersonDetails,
  PersonCreditsResponse,
  GenreResponse,
} from "@/lib/tmdb-shared";

// Re-export shared types for backward compatibility
export type {
  MediaType,
  Genre,
  Person,
  PersonDetails,
  PersonCreditsResponse,
  GenreResponse,
  SearchResult,
  SearchResponse,
  MovieDetails,
  TvDetails,
  Provider,
  CountryProviders,
  ProviderResponse,
  CreditsResponse,
} from "@/lib/tmdb-shared";

export { imageUrl } from "@/lib/tmdb-shared";

const API_URL = "https://api.themoviedb.org/3";

/**
 * Auto-detect the user's preferred language from the request's Accept-Language header.
 * Falls back to "en-US" if headers aren't available (e.g., during build or in non-request contexts).
 */
async function detectLanguage(): Promise<string> {
  try {
    const heads = await headers();
    return getTmdbLanguage(heads.get("accept-language"));
  } catch {
    return "en-US";
  }
}

export class TmdbError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "TmdbError";
  }
}

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  language = "en-US",
): Promise<T> {
  const key = process.env.TMDB_API_KEY;
  if (!key || key === "your_tmdb_api_key_here") {
    throw new TmdbError("TMDB_API_KEY is not configured.");
  }

  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", language);
  Object.entries(params).forEach(([name, value]) =>
    url.searchParams.set(name, String(value)),
  );

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { next: { revalidate: 60 } });
      if (response.status === 404) throw new TmdbError("Not found", 404);
      if (response.status === 429) {
        if (attempt < 2) {
          const retryAfter = Number(response.headers.get("retry-after"));
          const delay = Number.isFinite(retryAfter)
            ? Math.min(retryAfter * 1000, 10_000)
            : 500 * 2 ** attempt;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw new TmdbError("TMDB rate limit exceeded", 429);
      }
      if (!response.ok) {
        throw new TmdbError(`TMDB request failed (${response.status})`, response.status);
      }
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof TmdbError && error.status !== undefined) throw error;
      lastError = error;
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
      }
    }
  }
  throw new TmdbError(
    lastError instanceof Error ? lastError.message : "Unable to reach TMDB",
  );
}

export async function searchMulti(query: string, page = 1, language = "") {
  const lang = language || await detectLanguage();
  const cleanQuery = query.trim();
  return withCache(
    makeCacheKey("/search/multi", { query: cleanQuery, page, language: lang }),
    CACHE_TTL.search,
    () =>
      tmdbFetch<SearchResponse>("/search/multi", {
        query: cleanQuery,
        page,
        include_adult: "false",
      }, lang),
  );
}

export async function getMovie(id: number, language = "") {
  const lang = language || await detectLanguage();
  return withCache(makeCacheKey(`/movie/${id}`, { language: lang }), CACHE_TTL.details, () =>
    tmdbFetch<MovieDetails>(`/movie/${id}`, {}, lang),
  );
}

export async function getTv(id: number, language = "") {
  const lang = language || await detectLanguage();
  return withCache(makeCacheKey(`/tv/${id}`, { language: lang }), CACHE_TTL.details, () =>
    tmdbFetch<TvDetails>(`/tv/${id}`, {}, lang),
  );
}

export async function getWatchProviders(type: MediaType, id: number, language = "") {
  const lang = language || await detectLanguage();
  const endpoint = `/${type}/${id}/watch/providers`;
  return withCache(makeCacheKey(endpoint, { language: lang }), CACHE_TTL.providers, () =>
    tmdbFetch<ProviderResponse>(endpoint, {}, lang),
  );
}

export async function getCredits(type: MediaType, id: number, language = "") {
  const lang = language || await detectLanguage();
  const endpoint = `/${type}/${id}/credits`;
  return withCache(makeCacheKey(endpoint, { language: lang }), CACHE_TTL.details, () =>
    tmdbFetch<CreditsResponse>(endpoint, {}, lang),
  );
}

export async function getTrending(page = 1, language = "") {
  const lang = language || await detectLanguage();
  return withCache(
    makeCacheKey("/trending/all/week", { page, language: lang }),
    CACHE_TTL.trending,
    () => tmdbFetch<SearchResponse>("/trending/all/week", { page }, lang),
  );
}

export async function getNowPlaying(page = 1, language = "") {
  const lang = language || await detectLanguage();
  return withCache(
    makeCacheKey("/movie/now_playing", { page, language: lang }),
    CACHE_TTL.trending,
    () => tmdbFetch<SearchResponse>("/movie/now_playing", { page }, lang),
  );
}

export async function getPerson(id: number, language = "") {
  const lang = language || await detectLanguage();
  return withCache(makeCacheKey(`/person/${id}`, { language: lang }), CACHE_TTL.details, () =>
    tmdbFetch<PersonDetails>(`/person/${id}`, {}, lang),
  );
}

export async function getPersonCredits(id: number, language = "") {
  const lang = language || await detectLanguage();
  const endpoint = `/person/${id}/combined_credits`;
  return withCache(makeCacheKey(endpoint, { language: lang }), CACHE_TTL.details, () =>
    tmdbFetch<PersonCreditsResponse>(endpoint, {}, lang),
  );
}

export async function getGenres(type: MediaType, language = "") {
  const lang = language || await detectLanguage();
  const endpoint = `/genre/${type}/list`;
  return withCache(makeCacheKey(endpoint, { language: lang }), CACHE_TTL.details, () =>
    tmdbFetch<GenreResponse>(endpoint, {}, lang),
  );
}

export async function discoverByGenre(type: MediaType, genreId: number, page = 1, language = "") {
  const lang = language || await detectLanguage();
  const endpoint = `/discover/${type}`;
  return withCache(
    makeCacheKey(endpoint, { genreId, page, language: lang }),
    CACHE_TTL.trending,
    async () => {
      const response = await tmdbFetch<SearchResponse>(endpoint, {
        with_genres: genreId,
        page,
        sort_by: "popularity.desc",
        include_adult: "false",
      }, lang);
      return {
        ...response,
        results: response.results.map((result) => ({ ...result, media_type: type })),
      };
    },
  );
}

export async function discoverByProvider(
  type: MediaType,
  providerId: number,
  region: string,
  page = 1,
  language = "",
) {
  const lang = language || await detectLanguage();
  const endpoint = `/discover/${type}`;
  return withCache(
    makeCacheKey(endpoint, { providerId, region, page, language: lang }),
    CACHE_TTL.trending,
    async () => {
      const response = await tmdbFetch<SearchResponse>(endpoint, {
        with_watch_providers: providerId,
        watch_region: region,
        page,
        sort_by: "popularity.desc",
        include_adult: "false",
      }, lang);
      return {
        ...response,
        results: response.results.map((result) => ({ ...result, media_type: type })),
      };
    },
  );
}

export async function getTrendingByRegion(region: string, page = 1, language = "") {
  const lang = language || await detectLanguage();
  return withCache(
    makeCacheKey("/trending/all/week", { region, page, language: lang }),
    CACHE_TTL.trending,
    () =>
      tmdbFetch<SearchResponse>("/trending/all/week", {
        page,
      }, lang),
  );
}

export async function getSimilar(type: MediaType, id: number, language = "") {
  const lang = language || await detectLanguage();
  const endpoint = `/${type}/${id}/similar`;
  return withCache(makeCacheKey(endpoint, { language: lang }), CACHE_TTL.trending, () =>
    tmdbFetch<SearchResponse>(endpoint, { include_adult: "false" }, lang),
  );
}

export async function getRecommendations(type: MediaType, id: number, language = "") {
  const lang = language || await detectLanguage();
  const endpoint = `/${type}/${id}/recommendations`;
  return withCache(makeCacheKey(endpoint, { language: lang }), CACHE_TTL.trending, () =>
    tmdbFetch<SearchResponse>(endpoint, { include_adult: "false" }, lang),
  );
}
