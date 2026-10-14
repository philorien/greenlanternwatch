import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { SanityImage as SanityImageType } from "@/sanity/types";

type Props = {
  image?: SanityImageType;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function SanityImage({
  image,
  width,
  height,
  className,
  sizes,
  priority,
}: Props) {
  if (!image?.asset) return null;
  const src = urlFor(image)
    .width(width * 2)
    .height(height * 2)
    .fit("crop")
    .auto("format")
    .url();
  return (
    <Image
      src={src}
      alt={image.alt ?? ""}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
