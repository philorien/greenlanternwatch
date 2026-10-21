import type { ImageLoaderProps } from "next/image";

/**
 * Asks Sanity's CDN for each srcset width, so Sanity does the resizing instead
 * of Vercel Image Optimization, which bills every new width as a transformation.
 * A `w` already on the URL stays the largest size requested, as it was when
 * Vercel resized that version.
 */
export function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  const max = Number(url.searchParams.get("w"));
  url.searchParams.set("w", String(max ? Math.min(width, max) : width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.href;
}
