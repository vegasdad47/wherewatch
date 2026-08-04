import Link from "next/link";
import { imageUrl, SearchResult } from "@/lib/tmdb";

export function MediaCard({ item, compact = false }: { item: SearchResult; compact?: boolean }) {
  if (item.media_type !== "movie" && item.media_type !== "tv") return null;
  const title = item.media_type === "movie" ? item.title : item.name;
  const date = item.media_type === "movie" ? item.release_date : item.first_air_date;
  const poster = imageUrl(item.poster_path);

  return (
    <Link
      href={`/${item.media_type}/${item.id}`}
      prefetch
      className={`group min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${compact ? "w-36 shrink-0 snap-start sm:w-44" : ""}`}
    >
      <article>
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 transition duration-200 group-hover:-translate-y-1 group-hover:ring-blue-500/70">
          {poster ? (
            <img
              src={poster}
              alt={`${title ?? "Title"} poster`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-sm text-zinc-600">
              No poster available
            </div>
          )}
          <span className="absolute left-2 top-2 rounded-md bg-black/80 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300 backdrop-blur">
            {item.media_type === "movie" ? "Movie" : "TV"}
          </span>
        </div>
        <h2 className="mt-3 truncate font-semibold text-zinc-100 group-hover:text-blue-400">
          {title}
        </h2>
        <div className="mt-1 flex items-center justify-between gap-2 text-sm text-zinc-500">
          <span>{date?.slice(0, 4) || "Date unknown"}</span>
          {item.vote_average > 0 && <span className="text-amber-300">★ {item.vote_average.toFixed(1)}</span>}
        </div>
      </article>
    </Link>
  );
}
