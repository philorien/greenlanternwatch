import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  asset?: { _ref: string };
  hotspot?: { x: number; y: number };
  alt?: string;
  caption?: string;
  credit?: string;
};

export type SpectrumColor =
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "violet"
  | "orange"
  | "indigo"
  | "black"
  | "white";

export type CategoryRef = { title: string; slug: string };
export type AuthorRef = { name: string; slug: string };

export type ComicRelease = {
  title?: string;
  publisher?: string;
  releaseDate?: string;
  coverageType?: "review" | "preview" | "recap";
  cover?: SanityImage;
  buyLink?: string;
};

export type ArticleSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  mainImage?: SanityImage;
  category?: CategoryRef;
  author?: AuthorRef;
  bodyLength?: number | null;
  readMinutes?: number;
  comicRelease?: ComicRelease;
};

export type Author = {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  bio?: PortableTextBlock[];
  bioText?: string;
  avatar?: SanityImage;
  socials?: Partial<Record<"x" | "bluesky" | "instagram" | "youtube" | "website", string | null>>;
};

export type ComicIssue = {
  _id: string;
  title: string;
  series?: string;
  storyTitle?: string;
  releaseDate: string;
  cover?: SanityImage;
  writers?: string[];
  artists?: string[];
  comicVineUrl?: string;
  coverage?: { slug: string; coverageType?: ComicRelease["coverageType"] };
};

export type Article = ArticleSummary & {
  _updatedAt?: string;
  body?: PortableTextBlock[];
  lead?: string;
  tags?: string[];
  related?: ArticleSummary[];
};

export type CategoryItem = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
};

export type CorpsSummary = {
  _id: string;
  name: string;
  slug: string;
  spectrum: SpectrumColor;
  emotion: string;
  tagline?: string;
};

export type CharacterSummary = {
  _id: string;
  name: string;
  slug: string;
  alias?: string;
  section: "earth" | "alien" | "other";
  portrait?: SanityImage;
  corps?: { name: string; slug: string; spectrum: SpectrumColor };
};

export type StoryArcSummary = {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  kind?: "event" | "run" | "storyline";
  creators?: string[];
  publisher?: string;
  startYear?: number;
  endYear?: number;
  cover?: SanityImage;
};

export type ReadingEntry = {
  _key: string;
  title: string;
  issues?: string;
  format?: "issues" | "collected" | "event";
  note?: string;
  arc?: { title: string; slug: string };
  buyLink?: string;
  cover?: SanityImage;
  releaseStart?: string;
  releaseEnd?: string;
  writers?: string[];
  artists?: string[];
  comicVineUrl?: string;
};

export type ReadingSection = {
  _key: string;
  title: string;
  note?: string;
  entries?: ReadingEntry[];
};

export type ReadingOrderSummary = {
  _id: string;
  title: string;
  slug: string;
  audience: "new-reader" | "era" | "character";
  tagline?: string;
  entryCount?: number;
};

export type ReadingOrder = ReadingOrderSummary & {
  _updatedAt?: string;
  intro?: PortableTextBlock[];
  lead?: string;
  sections?: ReadingSection[];
};

export type StoryArc = StoryArcSummary & {
  _updatedAt?: string;
  seoDescription?: string;
  buyLink?: string;
  summary?: PortableTextBlock[];
  lead?: string;
  readingList?: ReadingEntry[];
  characters?: CharacterSummary[];
  corps?: CorpsSummary[];
};

export type KeyIssue = {
  _id: string;
  title: string;
  slug: string;
  kind:
    | "first-appearance"
    | "origin"
    | "villain-debut"
    | "historic-ring"
    | "milestone";
  publicationYear?: number;
  whyItMatters: string;
  cover?: SanityImage;
  characters?: { name: string; slug: string }[];
};

export type Character = CharacterSummary & {
  bio?: PortableTextBlock[];
  lead?: string;
  species?: string;
  homeSector?: string;
  firstAppearance?: string;
  abilities?: PortableTextBlock[];
  constructStyle?: string;
  appearsIn?: string[];
  portrayals?: { _key: string; actor: string; production: string }[];
  keyStorylines?: StoryArcSummary[];
  keyIssues?: KeyIssue[];
  readingRecommendations?: {
    _id: string;
    _type: "readingOrder" | "storyArc";
    title: string;
    slug: string;
  }[];
};

export type Corps = CorpsSummary & {
  seoDescription?: string;
  keyFigures?: string[];
  keyFigureCharacters?: { name: string; alias?: string; slug: string }[];
  description?: PortableTextBlock[];
  lead?: string;
  storylines?: StoryArcSummary[];
  members?: CharacterSummary[];
};

export type HomeData = {
  hero: ArticleSummary[];
  latest: ArticleSummary[];
  comics: ComicIssue[];
  features: ArticleSummary[];
  categories: CategoryItem[];
  startHere: { title: string; slug: string; tagline?: string } | null;
};

export type ComicsHubData = {
  orders: ReadingOrderSummary[];
  arcs: StoryArcSummary[];
  keyIssues: KeyIssue[];
  coverage: ArticleSummary[];
};

export type SitemapEntry = {
  _type: "article" | "explainer" | "character" | "storyArc" | "readingOrder" | "corps" | "category" | "author";
  slug: string;
  updatedAt?: string;
};

export type SearchHit = {
  _id: string;
  _type: "article" | "explainer" | "character" | "storyArc" | "readingOrder" | "corps";
  title: string;
  slug: string;
  excerpt?: string;
};
