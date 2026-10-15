import type { Metadata } from "next";
import { site } from "@/config/site";
import { urlFor } from "@/sanity/image";
import type { SanityImage } from "@/sanity/types";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? site.url : "http://localhost:3000");

export const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString();

const SHARE_SIZE = { width: 1200, height: 630 };

type ImageFit = "crop" | "fill";

export const defaultShareImage = {
  url: "/og-default.jpg",
  ...SHARE_SIZE,
  alt: site.name,
};

/**
 * A 1200x630 JPEG of a Sanity image, or the site's default card. JPEG because
 * some link unfurlers still reject WebP. "fill" letterboxes portrait art such
 * as covers on the site background instead of cropping it to a strip.
 */
export function shareImage(image?: SanityImage, fallbackAlt?: string, fit: ImageFit = "crop") {
  if (!image?.asset) return defaultShareImage;
  const builder = urlFor(image).width(SHARE_SIZE.width).height(SHARE_SIZE.height).format("jpg");
  return {
    url: (fit === "fill"
      ? // Without ignoreImageParams the builder pre-crops to 1200x630, defeating "fill".
        builder.ignoreImageParams().fit("fill").bg("030c09")
      : builder.fit("crop")
    ).url(),
    ...SHARE_SIZE,
    alt: image.alt ?? fallbackAlt ?? site.name,
  };
}

const DESCRIPTION_LIMIT = 160;
// Below this, a whole first sentence says too little, so cut mid-sentence instead.
const MIN_SENTENCE_DESCRIPTION = 70;

/** Shortest-safe description: whole sentences when they fit, else cut at a word. */
export function describe(...candidates: (string | null | undefined)[]) {
  const text = candidates.find((c) => c?.trim())?.replace(/\s+/g, " ").trim();
  if (!text || text.length <= DESCRIPTION_LIMIT) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [];
  let whole = "";
  for (const sentence of sentences) {
    if ((whole + sentence).trim().length > DESCRIPTION_LIMIT) break;
    whole += sentence;
  }
  if (whole.trim().length >= MIN_SENTENCE_DESCRIPTION) return whole.trim();
  const cut = text.slice(0, DESCRIPTION_LIMIT - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

type PageMetadataInput = {
  title: string | { absolute: string };
  description?: string;
  path: string;
  image?: SanityImage;
  imageAlt?: string;
  imageFit?: ImageFit;
} & (
  | { type?: "website" | "profile" }
  | {
      type: "article";
      publishedTime?: string;
      modifiedTime?: string;
      authors?: string[];
      section?: string;
      tags?: string[];
    }
);

/**
 * Next shallow-merges metadata, so a page that sets `openGraph` loses the
 * root layout's. Build every page's sharing tags here so none drop out.
 */
export function pageMetadata(input: PageMetadataInput): Metadata {
  const { title, description, path, image, imageAlt, imageFit } = input;
  const plainTitle = typeof title === "string" ? title : title.absolute;
  const images = [shareImage(image, imageAlt ?? plainTitle, imageFit)];
  const shared = { siteName: site.name, locale: "en_US", url: path, images };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph:
      input.type === "article"
        ? {
            ...shared,
            type: "article",
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
            authors: input.authors,
            section: input.section,
            tags: input.tags,
          }
        : { ...shared, type: input.type ?? "website" },
    twitter: { card: "summary_large_image", images },
  };
}

/* Structured data (schema.org JSON-LD) */

const siteSocials = () => Object.values(site.socials).filter(Boolean);

export const organizationId = absoluteUrl("/#organization");

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon.png"),
        sameAs: siteSocials(),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: site.name,
        description: site.tagline,
        url: absoluteUrl("/"),
        publisher: { "@id": organizationId },
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: `${absoluteUrl("/search")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
