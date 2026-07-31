"use client";

export default function DetailError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="text-4xl">⚠️</div>
      <h1 className="mt-4 text-2xl font-bold text-white">Something went wrong</h1>
      <p className="mt-3 text-zinc-400">We couldn’t load this title. Check the TMDB API key or try again.</p>
      <button onClick={reset} className="mt-6 min-h-11 rounded-lg bg-blue-500 px-5 font-semibold text-white hover:bg-blue-400">Try again</button>
    </div>
  );
}
