import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({
  projectId: projectId || "unconfigured",
  dataset,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

/** Pixel size read from the asset ID, for example image-…-842x230-webp. */
export function imageSize(image?: { asset?: { _ref?: string } }) {
  const match = image?.asset?._ref?.match(/-(\d+)x(\d+)-\w+$/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

/**
 * CSS width that keeps an image at most 80% of the screen tall, so a full comic page fits in view,
 * and never wider than its own pixels, so small scans are not blown up.
 */
export function screenFitWidth({ width, height }: { width: number; height: number }) {
  return `min(100%, ${Math.round((8000 * width) / height) / 100}vh, ${width}px)`;
}

/** CSS object-position that keeps an image's hotspot in view when it is cropped to fit. */
export function focalPoint(image?: { hotspot?: { x: number; y: number } }) {
  return image?.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : undefined;
}
