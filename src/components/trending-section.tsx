import { getTrending as getTmdbTrending, getMovie, getTv, imageUrl } from "@/lib/tmdb";
import { getTrending as getOurTrending, TrendingItem } from "@/lib/trending";
import Image from "next/image";
import Link from "next/link";

interface TrendingRowProps {
  type: "movie" | "tv";
  label: string;
}

async function TrendingRow({ type, label }: TrendingRowProps) {
  // Try our own trending data first
  let items: TrendingItem[] = [];
  try {
    items = await getOurTrending(type, 12);
  } catch {
    // Supabase not available yet
  }

  // If we have our own trending data, enrich with TMDB details
  if (items.length > 0) {
    const enriched = await Promise.all(
      items.slice(0, 12).map(async (item) => {
        try {
          const details =
            type === "movie"
              ? await getMovie(item.tmdb_id)
              : await getTv(item.tmdb_id);
          return { ...item, details };
        } catch {
          return null;
        }
      }),
    );

    const valid = enriched.filter(Boolean) as (TrendingItem & {
      details: { title?: string; name?: string; poster_path?: string | null };
    })[];

    if (valid.length > 0) {
      return (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">{label}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {valid.map((item) => {
              const title =
                "title" in item.details ? item.details.title : item.details.name;
              const href = `/${type}/${item.tmdb_id}`;
              const posterUrl = imageUrl(item.details.poster_path, "w500");

              return (
                <Link
                  key={item.tmdb_id}
                  href={href}
                  className="group relative overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-white/30"
                >
                  <div className="aspect-[2/3]">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={title || ""}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-zinc-700">
                        No poster
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8">
                    <p className="text-sm font-medium text-white line-clamp-2">
                      {title}
                    </p>
                    {item.watchlist_add_count > 0 && (
                      <p className="mt-1 text-xs text-zinc-400">
                        🔥 {item.watchlist_add_count} saved
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      );
    }
  }

  // Fallback: use TMDB trending
  return <TrendingFallback type={type} label={label} />;
}

// Fallback: use TMDB trending when we don't have our own data yet
async function TrendingFallback({ type, label }: { type: "movie" | "tv"; label: string }) {
  let results: { id: number; title?: string; name?: string; poster_path?: string | null }[] = [];
  try {
    const data = await getTmdbTrending();
    results = (data.results || [])
      .filter((item: { media_type: string }) => item.media_type === type)
      .slice(0, 12);
  } catch {
    // TMDB also unavailable
  }

  if (results.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-white">{label}</h2>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-500">
          TMDB
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {results.map((item) => {
          const title = item.title || item.name;
          const href = `/${type}/${item.id}`;
          const posterUrl = imageUrl(item.poster_path, "w500");

          return (
            <Link
              key={item.id}
              href={href}
              className="group relative overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-white/30"
            >
              <div className="aspect-[2/3]">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={title || ""}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-zinc-700">
                    No poster
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8">
                <p className="text-sm font-medium text-white line-clamp-2">
                  {title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function TrendingSection() {
  return (
    <>
      <TrendingRow type="movie" label="Trending movies" />
      <TrendingRow type="tv" label="Trending TV" />
    </>
  );
}
