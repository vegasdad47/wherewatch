"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Country, CountrySelector, getCountryByCode } from "@/components/country-selector";
import { imageUrl, SearchResult } from "@/lib/tmdb-shared";

interface TravelData {
  trending: SearchResult[];
  netflix: SearchResult[];
  prime: SearchResult[];
}

function MediaGrid({
  items,
  emptyMessage,
}: {
  items: SearchResult[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <p className="mt-4 text-sm text-zinc-500">{emptyMessage}</p>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => {
        const title = item.media_type === "movie" ? item.title : item.name;
        const date = item.media_type === "movie" ? item.release_date : item.first_air_date;
        const poster = imageUrl(item.poster_path, "w500");
        const href = `/${item.media_type}/${item.id}`;

        return (
          <Link
            key={`${item.media_type}-${item.id}`}
            href={href}
            className="group relative overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-blue-500/70"
          >
            <div className="aspect-[2/3]">
              {poster ? (
                <Image
                  src={poster}
                  alt={title || ""}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-zinc-700">No poster</div>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8">
              <p className="text-sm font-medium text-white line-clamp-2">{title}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                <span>{date?.slice(0, 4) || "—"}</span>
                {item.vote_average > 0 && (
                  <span className="text-amber-300">★ {item.vote_average.toFixed(1)}</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function TravelPageClient({
  country,
  data,
}: {
  country: Country;
  data: TravelData | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCountryChange = useCallback(
    (code: string) => {
      setLoading(true);
      router.push(`/travel?country=${code}`);
    },
    [router],
  );

  return (
    <>
      {/* Country Picker Section */}
      <section className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Choose your destination</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Select a country to see what&apos;s available there
          </p>
        </div>
        <CountrySelector selected={country.code} onChange={handleCountryChange} />
      </section>

      {loading && (
        <div className="mt-10 flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-zinc-400">
            <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading {country.name} catalog...</span>
          </div>
        </div>
      )}

      {!loading && data && (
        <div className="mt-10 space-y-14">
          {/* Trending */}
          <section>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">
                🔥 Trending in {country.name}
              </h2>
            </div>
            <MediaGrid
              items={data.trending}
              emptyMessage="No trending data available for this country."
            />
          </section>

          {/* Netflix */}
          <section>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">
                🎬 New on Netflix in {country.name}
              </h2>
              <span className="rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs font-semibold text-red-400">
                Netflix
              </span>
            </div>
            <MediaGrid
              items={data.netflix}
              emptyMessage="No Netflix titles found for this country. Try another destination."
            />
          </section>

          {/* Prime Video */}
          <section>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">
                📺 New on Prime Video in {country.name}
              </h2>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                Prime
              </span>
            </div>
            <MediaGrid
              items={data.prime}
              emptyMessage="No Prime Video titles found for this country. Try another destination."
            />
          </section>
        </div>
      )}

      {!loading && !data && (
        <div className="mt-10 text-center py-16">
          <p className="text-zinc-400">
            Select a country above to see what&apos;s streaming there.
          </p>
        </div>
      )}
    </>
  );
}
