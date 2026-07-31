import Image from "next/image";
import Link from "next/link";
import { imageUrl, Person } from "@/lib/tmdb";

export function CastList({ cast }: { cast: Person[] }) {
  const people = cast.slice(0, 10);
  if (!people.length) return null;

  return (
    <section aria-labelledby="cast-heading" className="mt-10">
      <h2 id="cast-heading" className="text-xl font-bold text-white">
        Top cast
      </h2>
      <div className="-mx-4 mt-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {people.map((person) => {
          const profile = imageUrl(person.profile_path, "w185");
          return (
            <Link key={person.id} href={`/person/${person.id}`} prefetch className="group w-28 shrink-0 snap-start rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            <article>
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10">
                {profile ? (
                  <Image
                    src={profile}
                    alt={person.name}
                    fill
                    sizes="112px"
                    className="object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-3xl text-zinc-700">👤</div>
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold leading-tight text-zinc-200">
                {person.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-tight text-zinc-500">
                {person.character}
              </p>
            </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
