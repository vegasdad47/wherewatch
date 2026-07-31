"use client";

import { useEffect } from "react";
import { useTrending } from "@/hooks/use-trending";

interface SearchTrackerProps {
  results: { id: number; media_type: string }[];
}

/**
 * Tracks search impressions — fires once when search results load.
 * Each result gets a "search" event for trending scoring.
 */
export function SearchTracker({ results }: SearchTrackerProps) {
  const { track } = useTrending();

  useEffect(() => {
    results.forEach((item) => {
      if (item.media_type === "movie" || item.media_type === "tv") {
        track(item.id, item.media_type, "search");
      }
    });
    // Only fire once per search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
