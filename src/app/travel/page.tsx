import type { Metadata } from "next";
import { getTrending, discoverByProvider } from "@/lib/tmdb";
import type { SearchResult } from "@/lib/tmdb-shared";
import { COUNTRIES, getCountryByCode } from "@/lib/countries";
import { TravelPageClient } from "./client";

export const metadata: Metadata = {
  title: "Travel Mode",
  description: "See what's streaming when you land. Browse trending movies and TV shows by country.",
  alternates: { canonical: "/travel" },
};

export const revalidate = 300; // ISR: regenerate at most every 5 minutes

// Netflix provider ID: 8, Prime Video: 9
const NETFLIX_ID = 8;
const PRIME_ID = 9;

interface TravelData {
  trending: SearchResult[];
  netflix: SearchResult[];
  prime: SearchResult[];
}

async function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const result = await promise;
    clearTimeout(timer);
    return result;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function loadCountryData(countryCode: string): Promise<TravelData> {
  const TIMEOUT = 8000; // 8s per call, Vercel hobby has 10s total

  const [trendingRes, netflixMovies, netflixTv, primeMovies, primeTv] = await Promise.allSettled([
    fetchWithTimeout(getTrending(), TIMEOUT),
    fetchWithTimeout(discoverByProvider("movie", NETFLIX_ID, countryCode), TIMEOUT),
    fetchWithTimeout(discoverByProvider("tv", NETFLIX_ID, countryCode), TIMEOUT),
    fetchWithTimeout(discoverByProvider("movie", PRIME_ID, countryCode), TIMEOUT),
    fetchWithTimeout(discoverByProvider("tv", PRIME_ID, countryCode), TIMEOUT),
  ]);

    const trending = trendingRes.status === "fulfilled" ? trendingRes.value.results.slice(0, 12) : [];

    const netflixMovieResults = netflixMovies.status === "fulfilled" ? netflixMovies.value.results : [];
    const netflixTvResults = netflixTv.status === "fulfilled" ? netflixTv.value.results : [];
    const netflix = [...netflixMovieResults, ...netflixTvResults]
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 12);

    const primeMovieResults = primeMovies.status === "fulfilled" ? primeMovies.value.results : [];
    const primeTvResults = primeTv.status === "fulfilled" ? primeTv.value.results : [];
    const prime = [...primeMovieResults, ...primeTvResults]
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 12);

    return { trending, netflix, prime };
}

export default async function TravelPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const params = await searchParams;
  const countryCode = params.country ?? "US";
  const country = getCountryByCode(countryCode);
  const data = await loadCountryData(countryCode);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 px-6 py-16 sm:px-10 sm:py-20">
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-300">
            ✈️ Travel Mode
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Traveling soon?
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-400">
            See what&apos;s streaming when you land. Pick your destination and discover what&apos;s
            trending, what&apos;s new on Netflix, and what&apos;s hot on Prime Video.
          </p>
        </div>
      </section>

      {/* Country Picker */}
      <TravelPageClient country={country} data={data} />
    </div>
  );
}
