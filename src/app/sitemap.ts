import type { MetadataRoute } from "next";

import { primaryPages, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return primaryPages.map((page) => ({
    url: page.url,
    lastModified: now,
    changeFrequency: page.url === siteConfig.url ? "weekly" : "monthly",
    priority: page.url === siteConfig.url ? 1 : 0.7,
  }));
}
