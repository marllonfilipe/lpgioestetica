import type { MetadataRoute } from "next";
import { siteConfig } from "../src/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");
  if (!base) return [];

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/politica-de-privacidade`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/termos-de-uso`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
