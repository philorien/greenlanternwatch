import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Keeps Vercel preview deployments out of search results as duplicates of the live site.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    // /search renders on every request, so keep crawlers from burning CPU on it.
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/search"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
