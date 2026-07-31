import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailView } from "@/components/detail-view";
import { getCredits, getMovie, getSimilar, getWatchProviders, imageUrl, TmdbError } from "@/lib/tmdb";

type Props = { params: Promise<{ id: string }> };

async function loadMovie(id: number) {
  try {
    const details = await getMovie(id);
    const [credits, providers, similar] = await Promise.allSettled([
      getCredits("movie", id), getWatchProviders("movie", id), getSimilar("movie", id),
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
  if (!Number.isInteger(id) || id <= 0) return { title: "Movie not found" };
  try {
    const movie = await getMovie(id);
    const image = imageUrl(movie.backdrop_path ?? movie.poster_path, "w780");
    return {
      title: movie.title,
      description: movie.overview || `Find where to watch ${movie.title}.`,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        type: "video.movie",
        images: image ? [{ url: image, alt: movie.title }] : [],
      },
      twitter: { card: "summary_large_image", images: image ? [image] : [] },
      alternates: { canonical: `/movie/${id}` },
    };
  } catch {
    return { title: "Movie" };
  }
}

export default async function MoviePage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const { details, credits, providers, similar } = await loadMovie(id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: details.title,
    description: details.overview,
    dateCreated: details.release_date || undefined,
    image: imageUrl(details.poster_path, "w780") || undefined,
    aggregateRating: details.vote_average > 0 ? { "@type": "AggregateRating", ratingValue: details.vote_average, bestRating: 10 } : undefined,
    genre: details.genres.map((genre) => genre.name),
    actor: credits.cast.slice(0, 10).map((person) => ({ "@type": "Person", name: person.name })),
    url: `${siteUrl}/movie/${id}`,
  };

  return (
    <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><DetailView
      type="movie"
      details={details}
      cast={credits.cast}
      allCountries={providers.results}
      similar={similar}
    /></>
  );
}
