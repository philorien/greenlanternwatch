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

/** CSS object-position that keeps an image's hotspot in view when it is cropped to fit. */
export function focalPoint(image?: { hotspot?: { x: number; y: number } }) {
  return image?.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : undefined;
}
