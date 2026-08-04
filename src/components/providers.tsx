"use client";

import Image from "next/image";
import { useState } from "react";
import { CountryProviders, imageUrl, Provider } from "@/lib/tmdb-shared";
import { CountrySelector } from "@/components/country-selector";
import { getCountryByCode, COUNTRIES } from "@/lib/countries";

// Map TMDB provider IDs to known streaming service URLs
const PROVIDER_URLS: Record<number, (title: string, year: string) => string> = {
  8: (title) => `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
  9: (title) => `https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video`,
  2: (title) => `https://tv.apple.com/search?term=${encodeURIComponent(title)}`,
  337: (title) => `https://www.disneyplus.com/search?q=${encodeURIComponent(title)}`,
  15: (title) => `https://www.hulu.com/search?q=${encodeURIComponent(title)}`,
  1899: (title) => `https://play.max.com/search?q=${encodeURIComponent(title)}`,
  531: (title) => `https://www.paramountplus.com/search/?search=${encodeURIComponent(title)}`,
  386: (title) => `https://www.peacocktv.com/search?q=${encodeURIComponent(title)}`,
  192: (title) => `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " full movie")}`,
  3: (title) => `https://play.google.com/store/search?q=${encodeURIComponent(title)}&c=movies`,
  7: (title) => `https://www.vudu.com/content/movies/search?searchString=${encodeURIComponent(title)}`,
  68: (title) => `https://www.microsoft.com/en-us/search?q=${encodeURIComponent(title + " movie")}`,
  373: (title) => `https://tubitv.com/search/${encodeURIComponent(title)}`,
  300: (title) => `https://pluto.tv/us/search?q=${encodeURIComponent(title)}`,
  613: (title) => `https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video&rh=p_n_ways_to_watch%3A12007865011`,
  207: (title) => `https://therokuchannel.roku.com/search/${encodeURIComponent(title)}`,
  12: (title) => `https://www.crackle.com/search?q=${encodeURIComponent(title)}`,
  538: (title) => `https://app.plex.tv/desktop/#!/search?query=${encodeURIComponent(title)}`,
  34: (title) => `https://www.mgmplus.com/search?q=${encodeURIComponent(title)}`,
  43: (title) => `https://www.starz.com/us/en/search?q=${encodeURIComponent(title)}`,
  37: (title) => `https://www.sho.com/search?q=${encodeURIComponent(title)}`,
  526: (title) => `https://www.amcplus.com/search?q=${encodeURIComponent(title)}`,
  510: (title) => `https://www.discoveryplus.com/search?q=${encodeURIComponent(title)}`,
  283: (title) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`,
  269: (title) => `https://www.funimation.com/search/?q=${encodeURIComponent(title)}`,
  151: (title) => `https://www.britbox.com/us/search?q=${encodeURIComponent(title)}`,
  99: (title) => `https://www.shudder.com/search?q=${encodeURIComponent(title)}`,
  191: (title) => `https://www.kanopy.com/search?q=${encodeURIComponent(title)}`,
  212: (title) => `https://www.hoopladigital.com/search?q=${encodeURIComponent(title)}`,
};

function getProviderUrl(provider: Provider, title: string, year: string): string | null {
  const urlBuilder = PROVIDER_URLS[provider.provider_id];
  if (urlBuilder) return urlBuilder(title, year);
  return null;
}

const GROUP_STYLES: Record<string, { icon: string; border: string; bg: string }> = {
  Subscription: { icon: "📺", border: "border-emerald-500/30", bg: "bg-emerald-500/[0.06]" },
  "Free with ads": { icon: "🆓", border: "border-amber-500/30", bg: "bg-amber-500/[0.06]" },
  Rent: { icon: "💲", border: "border-violet-500/30", bg: "bg-violet-500/[0.06]" },
  Buy: { icon: "💰", border: "border-rose-500/30", bg: "bg-rose-500/[0.06]" },
};

function ProviderGroup({
  title: groupTitle,
  items,
  mediaTitle,
  mediaYear,
}: {
  title: string;
  items?: Provider[];
  mediaTitle: string;
  mediaYear: string;
}) {
  if (!items?.length) return null;
  const unique = Array.from(new Map(items.map((item) => [item.provider_id, item])).values());
  const style = GROUP_STYLES[groupTitle] ?? { icon: "", border: "border-white/10", bg: "bg-white/[0.04]" };

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-4`}>
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
        {style.icon && <span className="text-sm">{style.icon}</span>}
        {groupTitle}
      </h3>
      <div className="mt-3 flex flex-wrap gap-3">
        {unique.map((provider) => {
          const logo = imageUrl(provider.logo_path, "w185");
          const url = getProviderUrl(provider, mediaTitle, mediaYear);

          const badge = (
            <div
              key={provider.provider_id}
              title={provider.provider_name}
              className="flex min-h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] py-2 pl-2 pr-3"
            >
              {logo && (
                <Image
                  src={logo}
                  alt=""
                  width={34}
                  height={34}
                  className="rounded-md"
                />
              )}
              <span className="text-sm font-medium text-zinc-200">{provider.provider_name}</span>
            </div>
          );

          if (url) {
            return (
              <a
                key={provider.provider_id}
                href={url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                title={`Watch on ${provider.provider_name}`}
                className="transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg outline-none"
              >
                {badge}
              </a>
            );
          }

          return badge;
        })}
      </div>
    </div>
  );
}

function AlsoAvailableIn({
  allCountries,
  selectedCountry,
}: {
  allCountries: Record<string, CountryProviders>;
  selectedCountry: string;
}) {
  const [expanded, setExpanded] = useState(false);

  // Find other countries that have flatrate providers
  const otherCountries = COUNTRIES.filter((c) => {
    if (c.code === selectedCountry) return false;
    const data = allCountries[c.code];
    return data?.flatrate && data.flatrate.length > 0;
  });

  if (otherCountries.length === 0) return null;

  const maxShown = expanded ? otherCountries.length : 8;
  const visible = otherCountries.slice(0, maxShown);
  const remaining = otherCountries.length - maxShown;

  return (
    <div className="mt-5 border-t border-white/10 pt-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        Also available in
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {visible.map((country) => {
          const data = allCountries[country.code];
          const topProviders = (data?.flatrate ?? [])
            .sort((a, b) => a.display_priority - b.display_priority)
            .slice(0, 2);

          return (
            <div
              key={country.code}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs"
              title={`${country.name}: ${topProviders.map((p) => p.provider_name).join(", ")}`}
            >
              <span className="text-sm leading-none">{country.flag}</span>
              <span className="text-zinc-300">
                {topProviders.map((p) => p.provider_name).join(", ")}
              </span>
            </div>
          );
        })}
        {remaining > 0 && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
          >
            +{remaining} more
          </button>
        )}
        {expanded && remaining <= 0 && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
}

export function Providers({
  allCountries,
  title,
  year,
}: {
  allCountries: Record<string, CountryProviders>;
  title: string;
  year: string;
}) {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const providers = allCountries[selectedCountry];
  const country = getCountryByCode(selectedCountry);

  const freeProviders = [...(providers?.free ?? []), ...(providers?.ads ?? [])];
  const hasProviders = Boolean(
    providers?.flatrate?.length ||
      providers?.rent?.length ||
      providers?.buy?.length ||
      freeProviders.length,
  );

  return (
    <section
      aria-labelledby="streaming-heading"
      className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="streaming-heading" className="text-xl font-bold text-white">
          Where to watch
        </h2>
        <CountrySelector
          selected={selectedCountry}
          onChange={setSelectedCountry}
        />
      </div>
      {hasProviders ? (
        <div className="mt-6 space-y-6">
          <ProviderGroup title="Subscription" items={providers?.flatrate} mediaTitle={title} mediaYear={year} />
          <ProviderGroup title="Free with ads" items={freeProviders} mediaTitle={title} mediaYear={year} />
          <ProviderGroup title="Rent" items={providers?.rent} mediaTitle={title} mediaYear={year} />
          <ProviderGroup title="Buy" items={providers?.buy} mediaTitle={title} mediaYear={year} />
        </div>
      ) : (
        <p className="mt-4 text-zinc-400">
          Not currently available to stream in {country.name}.
        </p>
      )}
      <AlsoAvailableIn allCountries={allCountries} selectedCountry={selectedCountry} />
    </section>
  );
}
