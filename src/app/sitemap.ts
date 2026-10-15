import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getSitemapEntries } from "@/sanity/data";
import { pathFor } from "@/sanity/paths";

export const revalidate = 3600;

const staticPaths = ["/", "/news", "/comics", "/characters", "/corps", "/movies-tv", "/about"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  const latest = entries.reduce<string | undefined>(
    (max, e) => (e.updatedAt && (!max || e.updatedAt > max) ? e.updatedAt : max),
    undefined,
  );

  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path), lastModified: latest })),
    ...entries.map((e) => ({
      url: absoluteUrl(pathFor(e._type, e.slug)),
      lastModified: e.updatedAt,
    })),
  ];
}
