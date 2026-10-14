import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

export const client = createClient({
  projectId: projectId || "unconfigured",
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Fetch published content. Returns `fallback` when Sanity is not configured
 * yet, so local builds and previews work without a project.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  fallback: T,
  tags: string[] = [],
): Promise<T> {
  if (!isSanityConfigured) return fallback;
  return client.fetch<T>(query, params, {
    next: { revalidate: 60, tags },
  });
}
