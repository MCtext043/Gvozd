import type { MetadataRoute } from "next";
import { SITE, ROOT_CATEGORIES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/catalog",
    "/companies",
    "/promotions",
    "/news",
    "/about",
    "/contacts",
    "/plan",
    "/arenda",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const categories = ROOT_CATEGORIES.map((c) => ({
    url: `${base}/catalog/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categories];
}
