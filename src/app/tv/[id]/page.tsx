import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailView } from "@/components/detail-view";
import { getCredits, getSimilar, getTv, getWatchProviders, imageUrl, TmdbError } from "@/lib/tmdb";

type Props = { params: Promise<{ id: string }> };

async function loadTv(id: number) {
  try {
    const details = await getTv(id);
    const [credits, providers, similar] = await Promise.allSettled([
      getCredits("tv", id), getWatchProviders("tv", id), getSimilar("tv", id),
    ]);
    return {
      details,
      credits: credits.status === "fulfilled" ? credits.value : { id, cast: [] },
      providers: providers.status === "fulfilled" ? providers.value : { id, results: {} },
      similar: similar.status === "fulfilled" ? similar.value.results : [],
    };
  } catch (error) {
    if (error instanceof TmdbError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return { title: "TV show not found" };
  try {
    const show = await getTv(id);
    const image = imageUrl(show.backdrop_path ?? show.poster_path, "w780");
    return {
      title: show.name,
      description: show.overview || `Find where to watch ${show.name}.`,
      openGraph: {
        title: show.name,
        description: show.overview,
        type: "video.tv_show",
        images: image ? [{ url: image, alt: show.name }] : [],
      },
      twitter: { card: "summary_large_image", images: image ? [image] : [] },
      alternates: { canonical: `/tv/${id}` },
    };
  } catch {
    return { title: "TV show" };
  }
}

export default async function TvPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const { details, credits, providers, similar } = await loadTv(id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const schema = {
    "@context": "https://schema.org", "@type": "TVSeries", name: details.name,
    description: details.overview, dateCreated: details.first_air_date || undefined,
    image: imageUrl(details.poster_path, "w780") || undefined,
    numberOfSeasons: details.number_of_seasons, numberOfEpisodes: details.number_of_episodes,
    aggregateRating: details.vote_average > 0 ? { "@type": "AggregateRating", ratingValue: details.vote_average, bestRating: 10 } : undefined,
    genre: details.genres.map((genre) => genre.name),
    actor: credits.cast.slice(0, 10).map((person) => ({ "@type": "Person", name: person.name })),
    url: `${siteUrl}/tv/${id}`,
  };

  return (
    <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><DetailView
      type="tv"
      details={details}
      cast={credits.cast}
      allCountries={providers.results}
      similar={similar}
    /></>
  );
}
