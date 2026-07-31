// Shared TMDB types and utilities — safe for both server and client components

const IMAGE_URL = "https://image.tmdb.org/t/p";

export type MediaType = "movie" | "tv";

export interface Genre {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
}

export interface PersonCreditsResponse {
  id: number;
  cast: Array<SearchResult & { media_type: "movie" | "tv"; character?: string }>;
}

export interface GenreResponse {
  genres: Genre[];
}

export interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
}

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genres: Genre[];
  title: string;
  release_date: string;
  runtime: number | null;
}

export interface TvDetails {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genres: Genre[];
  name: string;
  first_air_date: string;
  episode_run_time: number[];
  number_of_episodes: number;
  number_of_seasons: number;
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface CountryProviders {
  link?: string;
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
  free?: Provider[];
  ads?: Provider[];
}

export interface ProviderResponse {
  id: number;
  results: Record<string, CountryProviders>;
}

export interface CreditsResponse {
  id: number;
  cast: Person[];
}

export function imageUrl(
  path: string | null | undefined,
  size: "w185" | "w300" | "w500" | "w780" | "original" = "w500",
) {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}
