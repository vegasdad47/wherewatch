import Image from "next/image";
import { CastList } from "@/components/cast-list";
import { Providers } from "@/components/providers";
import {
  CountryProviders,
  imageUrl,
  MediaType,
  MovieDetails,
  Person,
  TvDetails,
} from "@/lib/tmdb";
import { auth } from "@/auth";
import { AdUnit } from "@/components/ad-unit";
import { WatchlistButton } from "@/components/watchlist-button";

interface DetailViewProps {
  type: MediaType;
  details: MovieDetails | TvDetails;
  cast: Person[];
  providers?: CountryProviders;
}

export async function DetailView({ type, details, cast, providers }: DetailViewProps) {
  const session = await auth();
  const movie = type === "movie" ? (details as MovieDetails) : null;
  const tv = type === "tv" ? (details as TvDetails) : null;
  const title = movie?.title ?? tv?.name ?? "Untitled";
  const date = movie?.release_date ?? tv?.first_air_date;
  const poster = imageUrl(details.poster_path);
  const backdrop = imageUrl(details.backdrop_path, "original");
  const runtime = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : tv?.number_of_seasons
      ? `${tv.number_of_seasons} season${tv.number_of_seasons === 1 ? "" : "s"} · ${tv.number_of_episodes} episodes`
      : null;

  return (
    <article className="relative isolate pb-10">
      {backdrop && (
        <div className="absolute inset-x-0 top-0 -z-10 h-[430px] overflow-hidden">
          <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/35 via-[#0a0a0f]/80 to-[#0a0a0f]" />
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-7 md:grid-cols-[260px_1fr] md:gap-10">
          <div className="mx-auto w-48 md:mx-0 md:w-full">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl shadow-black/50 ring-1 ring-white/10">
              {poster ? (
                <Image
                  src={poster}
                  alt={`${title} poster`}
                  fill
                  priority
                  sizes="(max-width: 767px) 192px, 260px"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-zinc-600">No poster</div>
              )}
            </div>
          </div>
          <div className="min-w-0 md:pt-10">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-400">
              <span>{type === "movie" ? "Movie" : "TV series"}</span>
              {date && <><span>·</span><span>{date.slice(0, 4)}</span></>}
              {runtime && <><span>·</span><span>{runtime}</span></>}
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {details.vote_average > 0 && (
                <span className="rounded-lg bg-amber-400/10 px-3 py-2 font-bold text-amber-300">
                  ★ {details.vote_average.toFixed(1)}
                </span>
              )}
              {details.genres.map((genre) => (
                <span key={genre.id} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-zinc-300">
                  {genre.name}
                </span>
              ))}
            </div>
            <section aria-labelledby="synopsis-heading" className="mt-8">
              <h2 id="synopsis-heading" className="text-xl font-bold text-white">Synopsis</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
                {details.overview || "No synopsis is available for this title."}
              </p>
            </section>
            <div className="mt-6">
              <WatchlistButton
                tmdbId={details.id}
                mediaType={type}
                title={title}
                posterPath={details.poster_path}
              />
            </div>
            {session?.user?.tier !== "premium" && <AdUnit placement="native" />}
            <Providers providers={providers} title={title} year={date?.slice(0, 4) ?? ""} />
            <CastList cast={cast} />
          </div>
        </div>
      </div>
    </article>
  );
}
