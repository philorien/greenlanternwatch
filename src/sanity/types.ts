import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
};

export type CategoryRef = { title: string; slug: string };

export type ArticleSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  mainImage?: SanityImage;
  categories?: CategoryRef[];
  featured?: boolean;
};

export type Article = ArticleSummary & {
  body?: PortableTextBlock[];
};

export type CorpsSummary = {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
};

export type Corps = CorpsSummary & {
  description?: PortableTextBlock[];
  members?: CharacterSummary[];
};

export type CharacterSummary = {
  _id: string;
  name: string;
  slug: string;
  alias?: string;
  portrait?: SanityImage;
  corps?: { name: string; slug: string };
};

export type Character = CharacterSummary & {
  species?: string;
  homeSector?: string;
  firstAppearance?: string;
  appearsIn?: string[];
  bio?: PortableTextBlock[];
};

export type ComicRunSummary = {
  _id: string;
  title: string;
  slug: string;
  tier: "essential" | "recommended" | "deep-cut";
  readingOrder: number;
  creators?: string[];
  startYear?: number;
  endYear?: number;
  tagline?: string;
  cover?: SanityImage;
};

export type ComicRun = ComicRunSummary & {
  issueRange?: string;
  publisher?: string;
  summary?: PortableTextBlock[];
  characters?: CharacterSummary[];
};
