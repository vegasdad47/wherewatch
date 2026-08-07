import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About WhereWatch",
  description: "WhereWatch helps you find where to watch movies and TV shows across streaming services, rentals, and purchases.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-400">About</p>
      <h1 className="mt-2 text-4xl font-black sm:text-5xl">Why we built WhereWatch</h1>

      <div className="mt-10 space-y-6 text-lg leading-8 text-zinc-300">
        <p>
          It started with a three-year-old and a remote control. I wanted to show my daughter a
          specific show — something simple, something she&apos;d love. I opened one streaming
          service. Not there. Opened another. Nope. A third. Nothing. By the time I cycled through
          five different apps, she had lost interest and wandered off to play with her toys.
        </p>

        <p>
          This happened more times than I can count. And I&apos;m not alone — every household with
          multiple streaming subscriptions knows this frustration. You know <em>what</em> you want to
          watch. You just don&apos;t know <em>where</em>.
        </p>

        <p>
          WhereWatch solves that. Search any movie or TV show, and we&apos;ll tell you exactly where
          it&apos;s streaming, where you can rent it, and where you can buy it — across hundreds of
          services in dozens of countries. One search, instant answer.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-white">How it works</h2>
        <p>
          We pull data from TMDB (The Movie Database), the same source used by apps like Letterboxd
          and Trakt. Our watch provider data covers Netflix, Prime Video, Disney+, Hulu, Max, Apple
          TV+, and dozens more — including free ad-supported services and rental options. We update
          regularly so you&apos;re always seeing current availability.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-white">Travel Mode</h2>
        <p>
          Traveling abroad? Streaming catalogs change by country. WhereWatch&apos;s Travel Mode lets
          you pick your destination and see what&apos;s trending on Netflix and Prime Video when
          you land. No more surprises when your watchlist disappears mid-flight.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-white">Free to use</h2>
        <p>
          WhereWatch is free. We keep the lights on through advertising, but our core mission is
          simple: stop the app-hopping and get you to what you actually want — watching something
          great.
        </p>
      </div>

      <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-zinc-400">Questions, feedback, or just want to say hi?</p>
        <p className="mt-2">
          <a href="mailto:hello@wherewatch.app" className="text-blue-400 hover:text-blue-300 font-semibold">
            hello@wherewatch.app
          </a>
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-lg bg-blue-500 px-5 font-semibold hover:bg-blue-400">
          Start searching
        </Link>
      </div>
    </div>
  );
}
