import Image from "next/image";
import type { SpectrumColor } from "@/sanity/types";

/** The Green Lantern emblem on its own. */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <Image
      src="/green-lantern-emblem.svg"
      alt=""
      aria-hidden="true"
      width={400}
      height={400}
      className={`object-contain ${className}`}
    />
  );
}

const siteLogos = {
  long: { src: "/glw-logo-long.webp", width: 1002, height: 65 },
  short: { src: "/glw-logo-short.webp", width: 927, height: 408 },
  full: { src: "/glw-logo-full.webp", width: 952, height: 431 },
  lockup: { src: "/glw-logo-lockup.png", width: 1024, height: 253 },
} as const;

/** The Green Lantern Watch logo: one line, compact "GL Watch", or the full stacked version. */
export function SiteLogo({
  variant,
  sizes,
  className = "",
  eager = false,
}: {
  variant: keyof typeof siteLogos;
  sizes: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <Image
      {...siteLogos[variant]}
      alt="Green Lantern Watch"
      sizes={sizes}
      loading={eager ? "eager" : undefined}
      className={`w-auto max-w-none ${className}`}
    />
  );
}

const wordmarks = {
  classic: { src: "/gl-wordmark.png", width: 1024, height: 338, alt: "Green Lantern" },
  modern: { src: "/gl-wordmark-modern.webp", width: 572, height: 207, alt: "Green Lantern" },
  "the-green-lantern-2018": {
    src: "/the-green-lantern-2018.webp",
    width: 679,
    height: 232,
    alt: "The Green Lantern",
  },
  "absolute-green-lantern": {
    src: "/absolute-green-lantern.webp",
    width: 794,
    height: 231,
    alt: "Absolute Green Lantern",
  },
} as const;

export type WordmarkVariant = keyof typeof wordmarks;

/** A series title wordmark. */
export function Wordmark({
  variant = "classic",
  alt,
  className = "w-full max-w-md",
}: {
  variant?: WordmarkVariant;
  alt?: string;
  className?: string;
}) {
  const { alt: defaultAlt, ...image } = wordmarks[variant];
  return (
    <Image
      {...image}
      alt={alt ?? defaultAlt}
      className={`h-auto ${className}`}
    />
  );
}

const corpsSymbols: Record<SpectrumColor, string> = {
  green: "/gl-logo.webp",
  yellow: "/corps/yellow.png",
  red: "/corps/red.png",
  blue: "/corps/blue.png",
  orange: "/corps/orange.png",
  violet: "/corps/violet.png",
  indigo: "/corps/indigo.png",
  black: "/corps/black.png",
  white: "/corps/white.png",
};

/** The symbol for a Corps, by spectrum color. */
export function CorpsSymbol({
  spectrum,
  className = "size-12",
}: {
  spectrum: SpectrumColor;
  className?: string;
}) {
  return (
    <Image
      src={corpsSymbols[spectrum]}
      alt=""
      aria-hidden="true"
      width={256}
      height={256}
      className={`object-contain ${className}`}
    />
  );
}
