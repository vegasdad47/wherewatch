import Link from "next/link";
import { imageUrl, SearchResult } from "@/lib/tmdb-shared";

export function SimilarTitles({
  items,
  mediaType,
}: {
  items: SearchResult[];
  mediaType: "movie" | "tv";
}) {
  const filtered = items
    .filter((item) => item.poster_path && (item.title || item.name))
    .slice(0, 12);

  if (filtered.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-white">You Might Also Like</h2>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((item) => {
          const title = item.title ?? item.name ?? "Untitled";
          const date = item.release_date ?? item.first_air_date;
          const poster = imageUrl(item.poster_path, "w300");
          const itemType = item.media_type === "tv" ? "tv" : mediaType;

          return (
            <Link
              key={item.id}
              href={`/${itemType}/${item.id}`}
              prefetch
              className="group min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 transition duration-200 group-hover:-translate-y-1 group-hover:ring-blue-500/70">
                {poster ? (
                  <img
                    src={poster}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center px-2 text-center text-xs text-zinc-600">
                    No poster
                  </div>
                )}
              </div>
              <h3 className="mt-2 truncate text-sm font-medium text-zinc-300 group-hover:text-blue-400">
                {title}
              </h3>
              <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                <span>{date?.slice(0, 4) || "—"}</span>
                {item.vote_average > 0 && (
                  <span className="text-amber-300">★ {item.vote_average.toFixed(1)}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
