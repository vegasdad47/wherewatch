"use client";

import { useCallback } from "react";

type TrendingEvent = "search" | "click" | "watchlist_add" | "watchlist_remove";

/**
 * Fire-and-forget trending event tracking.
 * Events are sent to /api/trending/track and processed async.
 */
export function useTrending() {
  const track = useCallback(
    (tmdb_id: number, media_type: "movie" | "tv", event_type: TrendingEvent) => {
      fetch("/api/trending/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdb_id, media_type, event_type }),
      }).catch(() => {
        // Silently fail — trending is best-effort
      });
    },
    [],
  );

  return { track };
}
