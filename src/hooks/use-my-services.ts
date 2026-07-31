"use client";

import { useCallback, useEffect, useState } from "react";
import { Provider } from "@/lib/tmdb";

// Top US streaming providers — these are the ones users care about
const TOP_PROVIDERS: { id: number; name: string; color: string }[] = [
  { id: 8, name: "Netflix", color: "#E50914" },
  { id: 9, name: "Prime Video", color: "#00A8E1" },
  { id: 15, name: "Hulu", color: "#1CE783" },
  { id: 1899, name: "Max", color: "#002BE7" },
  { id: 337, name: "Disney+", color: "#113CCF" },
  { id: 2, name: "Apple TV+", color: "#000000" },
  { id: 531, name: "Paramount+", color: "#0064FF" },
  { id: 386, name: "Peacock", color: "#000000" },
  { id: 373, name: "Tubi", color: "#FF00FF" },
  { id: 300, name: "Pluto TV", color: "#FF0000" },
  { id: 613, name: "Freevee", color: "#FF9900" },
  { id: 207, name: "Roku Channel", color: "#662D91" },
  { id: 43, name: "Starz", color: "#000000" },
  { id: 37, name: "Showtime", color: "#B80000" },
  { id: 34, name: "MGM+", color: "#000000" },
  { id: 283, name: "Crunchyroll", color: "#F47521" },
];

const STORAGE_KEY = "streaming-finder-services";

function loadFromStorage(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function useMyServices() {
  const [selected, setSelected] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSelected(loadFromStorage());
    setLoaded(true);
  }, []);

  const toggle = useCallback((providerId: number) => {
    setSelected((prev) => {
      const next = prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId];
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelected([]);
    saveToStorage([]);
  }, []);

  const selectAll = useCallback(() => {
    const all = TOP_PROVIDERS.map((p) => p.id);
    setSelected(all);
    saveToStorage(all);
  }, []);

  return { selected, toggle, clearAll, selectAll, loaded, providers: TOP_PROVIDERS };
}

/**
 * Filter a list of TMDB providers to only include the user's selected services.
 * Returns the filtered list, or null if no services are selected (show all).
 */
export function filterByMyServices(
  providers: Provider[] | undefined,
  myServiceIds: number[],
): Provider[] | undefined {
  if (!providers) return undefined;
  if (myServiceIds.length === 0) return providers; // no filter = show all
  return providers.filter((p) => myServiceIds.includes(p.provider_id));
}
