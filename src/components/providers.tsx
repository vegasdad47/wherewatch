import Image from "next/image";
import { CountryProviders, imageUrl, Provider } from "@/lib/tmdb";

// Map TMDB provider IDs to known streaming service URLs
// These are the best available deep links — most services don't have public APIs
const PROVIDER_URLS: Record<number, (title: string, year: string) => string> = {
  // Netflix — no public API, link to search
  8: (title) => `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
  // Amazon Prime Video — can add affiliate tag later
  9: (title) => `https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video`,
  // Apple TV+
  2: (title) => `https://tv.apple.com/search?term=${encodeURIComponent(title)}`,
  // Disney+
  337: (title) => `https://www.disneyplus.com/search?q=${encodeURIComponent(title)}`,
  // Hulu
  15: (title) => `https://www.hulu.com/search?q=${encodeURIComponent(title)}`,
  // Max (HBO)
  1899: (title) => `https://play.max.com/search?q=${encodeURIComponent(title)}`,
  // Paramount+
  531: (title) => `https://www.paramountplus.com/search/?search=${encodeURIComponent(title)}`,
  // Peacock
  386: (title) => `https://www.peacocktv.com/search?q=${encodeURIComponent(title)}`,
  // YouTube (rent/buy)
  192: (title) => `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " full movie")}`,
  // Google Play Movies
  3: (title) => `https://play.google.com/store/search?q=${encodeURIComponent(title)}&c=movies`,
  // Vudu / Fandango at Home
  7: (title) => `https://www.vudu.com/content/movies/search?searchString=${encodeURIComponent(title)}`,
  // Microsoft Store
  68: (title) => `https://www.microsoft.com/en-us/search?q=${encodeURIComponent(title + " movie")}`,
  // Tubi (free)
  373: (title) => `https://tubitv.com/search/${encodeURIComponent(title)}`,
  // Pluto TV (free)
  300: (title) => `https://pluto.tv/us/search?q=${encodeURIComponent(title)}`,
  // Freevee (Amazon free)
  613: (title) => `https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video&rh=p_n_ways_to_watch%3A12007865011`,
  // The Roku Channel
  207: (title) => `https://therokuchannel.roku.com/search/${encodeURIComponent(title)}`,
  // Crackle
  12: (title) => `https://www.crackle.com/search?q=${encodeURIComponent(title)}`,
  // Plex
  538: (title) => `https://app.plex.tv/desktop/#!/search?query=${encodeURIComponent(title)}`,
  // MGM+
  34: (title) => `https://www.mgmplus.com/search?q=${encodeURIComponent(title)}`,
  // Starz
  43: (title) => `https://www.starz.com/us/en/search?q=${encodeURIComponent(title)}`,
  // Showtime
  37: (title) => `https://www.sho.com/search?q=${encodeURIComponent(title)}`,
  // AMC+
  526: (title) => `https://www.amcplus.com/search?q=${encodeURIComponent(title)}`,
  // Discovery+
  510: (title) => `https://www.discoveryplus.com/search?q=${encodeURIComponent(title)}`,
  // Crunchyroll
  283: (title) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`,
  // Funimation
  269: (title) => `https://www.funimation.com/search/?q=${encodeURIComponent(title)}`,
  // BritBox
  151: (title) => `https://www.britbox.com/us/search?q=${encodeURIComponent(title)}`,
  // Shudder
  99: (title) => `https://www.shudder.com/search?q=${encodeURIComponent(title)}`,
  // Kanopy
  191: (title) => `https://www.kanopy.com/search?q=${encodeURIComponent(title)}`,
  // Hoopla
  212: (title) => `https://www.hoopladigital.com/search?q=${encodeURIComponent(title)}`,
};

function getProviderUrl(provider: Provider, title: string, year: string): string | null {
  const urlBuilder = PROVIDER_URLS[provider.provider_id];
  if (urlBuilder) return urlBuilder(title, year);
  return null;
}

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

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{groupTitle}</h3>
      <div className="mt-3 flex flex-wrap gap-3">
        {unique.map((provider) => {
          const logo = imageUrl(provider.logo_path, "w185");
          const url = getProviderUrl(provider, mediaTitle, mediaYear);

          const badge = (
            <div
              key={provider.provider_id}
              title={provider.provider_name}
              className="flex min-h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-2 pr-3"
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

export function Providers({
  providers,
  title,
  year,
}: {
  providers?: CountryProviders;
  title: string;
  year: string;
}) {
  const freeProviders = [...(providers?.free ?? []), ...(providers?.ads ?? [])];
  const hasProviders = Boolean(
    providers?.flatrate?.length ||
      providers?.rent?.length ||
      providers?.buy?.length ||
      freeProviders.length,
  );

  // Build JustWatch URL as fallback
  const justWatchQuery = encodeURIComponent(title);
  const justWatchUrl = `https://www.justwatch.com/us/search?q=${justWatchQuery}`;

  return (
    <section
      aria-labelledby="streaming-heading"
      className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="streaming-heading" className="text-xl font-bold text-white">
          Where to watch
        </h2>
        <span className="text-xs text-zinc-500">United States</span>
      </div>
      {hasProviders ? (
        <div className="mt-6 space-y-6">
          <ProviderGroup title="Subscription" items={providers?.flatrate} mediaTitle={title} mediaYear={year} />
          <ProviderGroup title="Free with ads" items={freeProviders} mediaTitle={title} mediaYear={year} />
          <ProviderGroup title="Rent" items={providers?.rent} mediaTitle={title} mediaYear={year} />
          <ProviderGroup title="Buy" items={providers?.buy} mediaTitle={title} mediaYear={year} />
        </div>
      ) : (
        <p className="mt-4 text-zinc-400">Not currently available to stream in the US.</p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <a
          href={justWatchUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-400 hover:text-blue-300"
        >
          View all options on JustWatch ↗
        </a>
      </div>
    </section>
  );
}
