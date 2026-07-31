"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface SearchFormProps {
  defaultValue?: string;
  large?: boolean;
  autoFocus?: boolean;
}

export function SearchForm({
  defaultValue = "",
  large = false,
  autoFocus = false,
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (cleanQuery) router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
  }

  return (
    <form onSubmit={submit} role="search" className="w-full">
      <div
        className={`flex items-center rounded-xl border border-white/15 bg-white/[0.07] p-1 shadow-2xl shadow-black/20 focus-within:border-blue-500 ${large ? "min-h-16" : "min-h-12"}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="ml-3 size-5 shrink-0 fill-none stroke-zinc-400 stroke-2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <label htmlFor={large ? "hero-search" : "header-search"} className="sr-only">
          Search for a movie or TV show
        </label>
        <input
          id={large ? "hero-search" : "header-search"}
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What do you want to watch?"
          autoFocus={autoFocus}
          autoComplete="off"
          className={`min-w-0 flex-1 bg-transparent px-3 text-white outline-none placeholder:text-zinc-500 ${large ? "text-lg sm:text-xl" : "text-sm sm:text-base"}`}
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="min-h-11 shrink-0 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
        >
          Search
        </button>
      </div>
    </form>
  );
}
