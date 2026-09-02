import type { MetadataRoute } from "next";
import { rackets } from "@/data/rackets";

const BASE = "https://gutmatch.vercel.app";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/compare/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...Object.keys(rackets).map((slug) => ({
      url: `${BASE}/racket/${slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
