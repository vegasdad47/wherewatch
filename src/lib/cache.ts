type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  staleUntil: number;
};

const store = new Map<string, CacheEntry<unknown>>();

export const CACHE_TTL = {
  search: 60 * 60 * 1000,
  details: 24 * 60 * 60 * 1000,
  providers: 24 * 60 * 60 * 1000,
  trending: 60 * 60 * 1000,
} as const;

export function makeCacheKey(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");

  return query ? `${endpoint}:${query}` : endpoint;
}

export async function withCache<T>(
  key: string,
  ttl: number,
  loader: () => Promise<T>,
): Promise<T> {
  const cached = store.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  try {
    const value = await loader();
    store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      // A failed upstream request may use the last successful response for a
      // week. TMDB images remain remote; only JSON responses are retained.
      staleUntil: Date.now() + ttl + 7 * 24 * 60 * 60 * 1000,
    });
    return value;
  } catch (error) {
    if (cached && cached.staleUntil > Date.now()) return cached.value;
    if (cached) store.delete(key);
    throw error;
  }
}
