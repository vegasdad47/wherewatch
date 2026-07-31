"use client";

import { useCallback, useEffect, useState } from "react";
import { useTrending } from "@/hooks/use-trending";

interface WatchlistButtonProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  className?: string;
}

export function WatchlistButton({
  tmdbId,
  mediaType,
  title,
  posterPath,
  className = "",
}: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { track } = useTrending();

  // Check if already in watchlist on mount
  useEffect(() => {
    fetch(`/api/watchlist?tmdb_id=${tmdbId}&media_type=${mediaType}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.watchlist?.length > 0) {
          setIsInWatchlist(true);
        }
      })
      .catch(() => {});
  }, [tmdbId, mediaType]);

  const handleToggle = useCallback(async () => {
    setLoading(true);
    try {
      if (isInWatchlist) {
        await fetch(
          `/api/watchlist?tmdb_id=${tmdbId}&media_type=${mediaType}`,
          { method: "DELETE" },
        );
        setIsInWatchlist(false);
        track(tmdbId, mediaType, "watchlist_remove");
      } else {
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tmdb_id: tmdbId,
            media_type: mediaType,
            title,
            poster_path: posterPath,
          }),
        });
        setIsInWatchlist(true);
        track(tmdbId, mediaType, "watchlist_add");
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [isInWatchlist, tmdbId, mediaType, title, posterPath, track]);

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
        isInWatchlist
          ? "bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30 hover:bg-blue-600/30"
          : "bg-white/[0.06] text-zinc-300 ring-1 ring-white/10 hover:bg-white/[0.10]"
      } ${className}`}
    >
      {isInWatchlist ? (
        <>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          Saved
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
            />
          </svg>
          Watch later
        </>
      )}
    </button>
  );
}
