import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MediaCard } from "@/components/media-card";
import { getPerson, getPersonCredits, imageUrl, TmdbError } from "@/lib/tmdb";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return { title: "Person not found" };
  try { const person = await getPerson(id); const image = imageUrl(person.profile_path, "w500"); return { title: person.name, description: person.biography || `Movies and TV shows featuring ${person.name}.`, alternates: { canonical: `/person/${id}` }, openGraph: { title: person.name, description: person.biography, images: image ? [image] : [] } }; }
  catch { return { title: "Person" }; }
}

export default async function PersonPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  let person; let credits;
  try { [person, credits] = await Promise.all([getPerson(id), getPersonCredits(id)]); }
  catch (error) { if (error instanceof TmdbError && error.status === 404) notFound(); throw error; }
  const profile = imageUrl(person.profile_path, "w500");
  const knownFor = credits.cast.filter((item) => item.poster_path).sort((a, b) => b.vote_average - a.vote_average).filter((item, index, list) => list.findIndex((other) => other.id === item.id && other.media_type === item.media_type) === index).slice(0, 15);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const schema = {
    "@context": "https://schema.org", "@type": "Person", name: person.name,
    description: person.biography || undefined,
    image: profile || undefined,
    birthDate: person.birthday || undefined,
    deathDate: person.deathday || undefined,
    birthPlace: person.place_of_birth || undefined,
    jobTitle: person.known_for_department,
    url: `${siteUrl}/person/${id}`,
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="grid gap-8 sm:grid-cols-[220px_1fr] lg:gap-12">
      <div className="mx-auto w-48 sm:w-full"><div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10">{profile ? <Image src={profile} alt={person.name} fill priority sizes="220px" className="object-cover" /> : <div className="grid h-full place-items-center text-6xl">👤</div>}</div></div>
      <div><p className="text-sm font-bold uppercase tracking-widest text-blue-400">{person.known_for_department}</p><h1 className="mt-2 text-4xl font-black sm:text-5xl">{person.name}</h1>
      <div className="mt-4 text-sm text-zinc-400">{person.birthday && <span>{person.birthday}{person.deathday ? ` – ${person.deathday}` : ""}</span>}{person.place_of_birth && <span> · {person.place_of_birth}</span>}</div>
      <h2 className="mt-8 text-xl font-bold">Biography</h2><p className="mt-3 max-w-3xl whitespace-pre-line leading-7 text-zinc-300">{person.biography || "No biography is available for this person."}</p></div>
    </div>
    <section className="mt-14"><h2 className="text-2xl font-bold">Known for</h2>{knownFor.length ? <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5">{knownFor.map((item) => <MediaCard key={`${item.media_type}-${item.id}`} item={item} />)}</div> : <p className="mt-4 text-zinc-400">No movie or TV credits are available.</p>}</section>
  </div></>;
}
