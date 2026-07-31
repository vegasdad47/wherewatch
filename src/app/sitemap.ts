import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/browse`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/browse?type=tv`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];
}
