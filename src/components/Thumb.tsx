import Image from "next/image";
import { focalPoint, urlFor } from "@/sanity/image";
import type { SanityImage } from "@/sanity/types";
import { LogoMark } from "./Logo";

type Props = {
  image?: SanityImage;
  aspect?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
};

/** An image from Sanity, or an on-brand placeholder when there is none. */
export function Thumb({
  image,
  aspect = "aspect-video",
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
  width = 800,
}: Props) {
  const src = image?.asset ? urlFor(image).width(width).auto("format").url() : null;
  return (
    <div
      className={`relative overflow-hidden bg-surface-2 ${aspect} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={image?.alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: focalPoint(image) }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgb(34_179_78/0.22),transparent_55%),linear-gradient(135deg,#0b1f17,#071611)]"
        >
          <LogoMark className="size-1/3 max-h-24 max-w-24 opacity-25" />
        </div>
      )}
    </div>
  );
}
