"use client";

import Image, { type ImageProps } from "next/image";
import { sanityLoader } from "@/sanity/imageLoader";

/**
 * next/image for cdn.sanity.io sources. A client component because a loader
 * function can't be passed from a Server Component.
 */
export function SanityCdnImage({ alt, ...props }: Omit<ImageProps, "loader">) {
  return <Image alt={alt} {...props} loader={sanityLoader} />;
}
