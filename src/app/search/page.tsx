import { Metadata } from "next";
import { MediaCard } from "@/components/media-card";
import { Pagination } from "@/components/pagination";
import { searchMulti } from "@/lib/tmdb";
import { auth } from "@/auth";
import { AdUnit } from "@/components/ad-unit";
import { MyServicesSelector } from "@/components/my-services-selector";
import { SearchTracker } from "@/components/search-tracker";

export const metadata: Metadata = {
  title: "Search",
  description: "Search movies and TV shows and find where to watch them.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam = "1" } = await searchParams;
  const query = q.trim();
  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1);
  const session = await auth();

  if (!query) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">Search for something to watch</h1>
        <p className="mt-3 text-zinc-400">Enter a movie or TV show in the search bar above.</p>
      </div>
    );
  }

  let response;
  try { response = await searchMulti(query, page); }
  catch { return <div className="mx-auto max-w-3xl px-4 py-20 text-center"><div className="text-4xl">📡</div><h1 className="mt-4 text-3xl font-bold">Search is temporarily unavailable</h1><p className="mt-3 text-zinc-400">We couldn’t reach the movie service. Check your connection and try again shortly.</p></div>; }
  const results = response.results.filter(
    (result) => result.media_type === "movie" || result.media_type === "tv",
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">Search results</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {results.length ? `Results for "${query}"` : `No results found for "${query}"`}
        </h1>
        {results.length > 0 && (
          <p className="mt-2 text-sm text-zinc-500">{response.total_results.toLocaleString()} matches from TMDB</p>
        )}
      </div>
      <div className="mb-8">
        <MyServicesSelector />
      </div>
      {results.length ? (
        <>
          <SearchTracker results={results} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((result) => <MediaCard key={`${result.media_type}-${result.id}`} item={result} />)}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <div className="text-4xl">🎞️</div>
          <h2 className="mt-4 text-xl font-semibold text-white">We couldn’t find that title</h2>
          <p className="mx-auto mt-2 max-w-md text-zinc-400">Check the spelling, try fewer words, or browse popular genres instead.</p>
          <a href="/browse" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-blue-500 px-5 font-semibold hover:bg-blue-400">Browse genres</a>
        </div>
      )}
      {session?.user?.tier !== "premium" && <AdUnit placement="banner" />}
      <Pagination page={page} totalPages={response.total_pages} href={(nextPage) => `/search?q=${encodeURIComponent(query)}&page=${nextPage}`} />
    </div>
  );
}
