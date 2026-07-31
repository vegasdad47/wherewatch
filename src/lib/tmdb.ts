import "server-only";

import { CACHE_TTL, makeCacheKey, withCache } from "@/lib/cache";
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
): Promise<T> {
  const key = process.env.TMDB_API_KEY;
  if (!key || key === "your_tmdb_api_key_here") {
    throw new TmdbError("TMDB_API_KEY is not configured.");
  }

  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([name, value]) =>
    url.searchParams.set(name, String(value)),
  );

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { cache: "no-store" });
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

export function searchMulti(query: string, page = 1) {
  const cleanQuery = query.trim();
  return withCache(
    makeCacheKey("/search/multi", { query: cleanQuery, page }),
    CACHE_TTL.search,
    () =>
      tmdbFetch<SearchResponse>("/search/multi", {
        query: cleanQuery,
        page,
        include_adult: "false",
      }),
  );
}

export function getMovie(id: number) {
  return withCache(makeCacheKey(`/movie/${id}`), CACHE_TTL.details, () =>
    tmdbFetch<MovieDetails>(`/movie/${id}`),
  );
}

export function getTv(id: number) {
  return withCache(makeCacheKey(`/tv/${id}`), CACHE_TTL.details, () =>
    tmdbFetch<TvDetails>(`/tv/${id}`),
  );
}

export function getWatchProviders(type: MediaType, id: number) {
  const endpoint = `/${type}/${id}/watch/providers`;
  return withCache(makeCacheKey(endpoint), CACHE_TTL.providers, () =>
    tmdbFetch<ProviderResponse>(endpoint),
  );
}

export function getCredits(type: MediaType, id: number) {
  const endpoint = `/${type}/${id}/credits`;
  return withCache(makeCacheKey(endpoint), CACHE_TTL.details, () =>
    tmdbFetch<CreditsResponse>(endpoint),
  );
}

export function getTrending(page = 1) {
  return withCache(
    makeCacheKey("/trending/all/week", { page }),
    CACHE_TTL.trending,
    () => tmdbFetch<SearchResponse>("/trending/all/week", { page }),
  );
}

export function getNowPlaying(page = 1) {
  return withCache(
    makeCacheKey("/movie/now_playing", { page }),
    CACHE_TTL.trending,
    () => tmdbFetch<SearchResponse>("/movie/now_playing", { page }),
  );
}

export function getPerson(id: number) {
  return withCache(makeCacheKey(`/person/${id}`), CACHE_TTL.details, () =>
    tmdbFetch<PersonDetails>(`/person/${id}`),
  );
}

export function getPersonCredits(id: number) {
  const endpoint = `/person/${id}/combined_credits`;
  return withCache(makeCacheKey(endpoint), CACHE_TTL.details, () =>
    tmdbFetch<PersonCreditsResponse>(endpoint),
  );
}

export function getGenres(type: MediaType) {
  const endpoint = `/genre/${type}/list`;
  return withCache(makeCacheKey(endpoint), CACHE_TTL.details, () =>
    tmdbFetch<GenreResponse>(endpoint),
  );
}

export function discoverByGenre(type: MediaType, genreId: number, page = 1) {
  const endpoint = `/discover/${type}`;
  return withCache(
    makeCacheKey(endpoint, { genreId, page }),
    CACHE_TTL.trending,
    async () => {
      const response = await tmdbFetch<SearchResponse>(endpoint, {
        with_genres: genreId,
        page,
        sort_by: "popularity.desc",
        include_adult: "false",
      });
      return {
        ...response,
        results: response.results.map((result) => ({ ...result, media_type: type })),
      };
    },
  );
}

export function discoverByProvider(
  type: MediaType,
  providerId: number,
  region: string,
  page = 1,
) {
  const endpoint = `/discover/${type}`;
  return withCache(
    makeCacheKey(endpoint, { providerId, region, page }),
    CACHE_TTL.trending,
    async () => {
      const response = await tmdbFetch<SearchResponse>(endpoint, {
        with_watch_providers: providerId,
        watch_region: region,
        page,
        sort_by: "popularity.desc",
        include_adult: "false",
      });
      return {
        ...response,
        results: response.results.map((result) => ({ ...result, media_type: type })),
      };
    },
  );
}

export function getTrendingByRegion(region: string, page = 1) {
  return withCache(
    makeCacheKey("/trending/all/week", { region, page }),
    CACHE_TTL.trending,
    () =>
      tmdbFetch<SearchResponse>("/trending/all/week", {
        page,
      }),
  );
}
