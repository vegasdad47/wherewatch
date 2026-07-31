"use client";

import { useState, useRef, useEffect } from "react";

function SearchIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function LandingHero() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  // Keyboard shortcut: press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const trustItems = [
    { emoji: "✨", label: "30+ Services" },
    { emoji: "🛡️", label: "No Account Required" },
    { emoji: "👥", label: "Always Free" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20 pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-[#0a0a0f] to-[#0a0a0f] pointer-events-none" />

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-8 animate-fade-in">
          <span>✨</span>
          <span>Now tracking 30+ streaming services</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Find Where to Stream
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Any Movie or TV Show
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
          Search across 30+ streaming services. Free, rental, subscription, or
          buy — we&apos;ll show you exactly where to watch.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className={`max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-400 transition-all duration-300 ${
            isFocused ? "scale-[1.02]" : ""
          }`}
        >
          <div
            className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
              isFocused
                ? "border-blue-500 bg-white/[0.06] shadow-lg shadow-blue-500/20"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <span
              className={`ml-5 transition-colors duration-300 ${
                isFocused ? "text-blue-400" : "text-zinc-500"
              }`}
            >
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search for a movie or TV show..."
              className="flex-1 bg-transparent px-4 py-5 text-white placeholder-zinc-500 outline-none text-lg"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 mr-4 px-2 py-1 rounded-md bg-white/[0.06] border border-white/10 text-xs text-zinc-500 font-mono">
              <span className="text-sm">/</span>
            </kbd>
            <button
              type="submit"
              className="mr-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              Search
            </button>
          </div>
        </form>

        {/* Travel teaser */}
        <div className="mb-12 animate-fade-in-up animation-delay-500">
          <a
            href="/travel"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 group"
          >
            <span>✈️</span>
            <span>Traveling? See what&apos;s streaming at your destination</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 animate-fade-in-up animation-delay-600">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-zinc-400"
            >
              <span className="text-base">{item.emoji}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-zinc-500 animate-scroll-dot" />
          </div>
        </div>
      </div>
    </section>
  );
}
