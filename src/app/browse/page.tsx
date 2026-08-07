import type { Metadata } from "next";
import Link from "next/link";
import { MediaCard } from "@/components/media-card";
import { Pagination } from "@/components/pagination";
import { discoverByGenre, getGenres, MediaType } from "@/lib/tmdb";
import { MyServicesSelector } from "@/components/my-services-selector";

export const revalidate = 300; // ISR: regenerate at most every 5 minutes

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; genre?: string; page?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const type: MediaType = params.type === "tv" ? "tv" : "movie";
  const typeLabel = type === "movie" ? "Movies" : "TV Shows";

  let genreName = "";
  if (params.genre) {
    try {
      const genres = await getGenres(type);
      const genre = genres.genres.find((g) => g.id === Number(params.genre));
      if (genre) genreName = genre.name;
    } catch { /* fall through */ }
  }

  const title = genreName
    ? `Best ${genreName} ${typeLabel} — Where to Watch`
    : `Browse ${typeLabel} by Genre — WhereWatch`;
  const description = genreName
    ? `Discover the most popular ${genreName.toLowerCase()} ${typeLabel.toLowerCase()}. Find where to stream, rent, or buy ${genreName.toLowerCase()} ${typeLabel.toLowerCase()}.`
    : `Browse popular movies and TV shows by genre. Find where to stream, rent, or buy your next watch.`;

  return {
    title,
    description,
    alternates: { canonical: "/browse" },
    openGraph: { title, description },
  };
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<{ type?: string; genre?: string; page?: string }> }) {
  const params = await searchParams;
  const type: MediaType = params.type === "tv" ? "tv" : "movie";
  let movieGenres, tvGenres;
  try {
    [movieGenres, tvGenres] = await Promise.all([getGenres("movie"), getGenres("tv")]);
  } catch {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center"><div className="text-4xl">📡</div><h1 className="mt-4 text-3xl font-bold">Browse is temporarily unavailable</h1><p className="mt-3 text-zinc-400">We couldn&apos;t reach the movie service. Check your connection and try again shortly.</p><Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-blue-500 px-5 font-semibold hover:bg-blue-400">Go home</Link></div>;
  }
  const genres = type === "movie" ? movieGenres.genres : tvGenres.genres;
  const requestedGenre = Number.parseInt(params.genre ?? "", 10);
  const genreId = genres.some((genre) => genre.id === requestedGenre) ? requestedGenre : genres[0]?.id;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const selectedGenre = genres.find((genre) => genre.id === genreId);
  const response = genreId ? await discoverByGenre(type, genreId, page) : null;

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <p className="text-sm font-bold uppercase tracking-widest text-blue-400">Explore the catalog</p>
    <h1 className="mt-2 text-3xl font-black sm:text-4xl">Browse by genre</h1>
    <div className="mt-6 flex gap-2" aria-label="Media type">
      {(["movie", "tv"] as const).map((value) => <Link key={value} href={`/browse?type=${value}`} className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${type === value ? "bg-blue-500 text-white" : "bg-white/[0.06] text-zinc-300 hover:bg-white/10"}`}>{value === "movie" ? "Movies" : "TV shows"}</Link>)}
    </div>
    <div className="mt-6 flex flex-wrap gap-2">{genres.map((genre) => <Link key={genre.id} href={`/browse?type=${type}&genre=${genre.id}`} className={`rounded-full border px-3 py-2 text-sm ${genre.id === genreId ? "border-blue-400 bg-blue-500/15 text-blue-300" : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"}`}>{genre.name}</Link>)}</div>
    <h2 className="mt-10 text-2xl font-bold">Popular {selectedGenre?.name} {type === "movie" ? "movies" : "TV shows"}</h2>
    <div className="mt-4 mb-6">
      <MyServicesSelector />
    </div>
    {response?.results.length ? <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{response.results.map((item) => <MediaCard key={`${type}-${item.id}`} item={item} />)}</div> : <div className="mt-6 rounded-2xl border border-white/10 p-12 text-center text-zinc-400">No titles are available in this genre right now.</div>}
    {response && <Pagination page={page} totalPages={response.total_pages} href={(nextPage) => `/browse?type=${type}&genre=${genreId}&page=${nextPage}`} />}
  </div>;
}
