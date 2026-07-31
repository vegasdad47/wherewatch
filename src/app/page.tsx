import { SearchForm } from "@/components/search-form";
import { TrendingSection } from "@/components/trending-section";

export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  return (
    <div>
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute left-1/2 top-8 -z-10 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">Your next watch starts here</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
          Where can I watch this?
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
          Search any movie or TV show. Find streaming subscriptions, free options, rentals, and places to buy.
        </p>
        <div className="mx-auto mt-10 max-w-2xl text-left">
          <SearchForm large autoFocus />
        </div>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <TrendingSection />
    </div>
    </div>
  );
}
