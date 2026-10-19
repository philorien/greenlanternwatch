import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

export const client = createClient({
  projectId: projectId || "unconfigured",
  dataset,
  apiVersion,
  // The API CDN can lag a few seconds behind the publish webhook, and the page
  // that re-renders in that gap caches old content as fresh. Next already
  // caches every fetch, so read from the live API.
  useCdn: false,
});

/**
 * Every fetch carries this tag. The Sanity webhook at /api/revalidate busts
 * it on publish, so queries that pull in referenced types (an article's
 * author or category) never go stale.
 */
export const SITE_CACHE_TAG = "sanity";

/**
 * Fetch published content. Returns `fallback` when Sanity is not configured
 * yet, so local builds and previews work without a project.
 *
 * Content refreshes when the publish webhook fires. The daily revalidate is
 * only a safety net if the webhook fails; short timers re-render pages on
 * nearly every visit and burn Vercel CPU.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  fallback: T,
  tags: string[] = [],
): Promise<T> {
  if (!isSanityConfigured) return fallback;
  return client.fetch<T>(query, params, {
    next: { revalidate: 86400, tags: [SITE_CACHE_TAG, ...tags] },
  });
}
