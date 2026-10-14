import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  asset?: { _ref: string };
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

export type Article = ArticleSummary & {
  body?: PortableTextBlock[];
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
  intro?: PortableTextBlock[];
  sections?: ReadingSection[];
};

export type StoryArc = StoryArcSummary & {
  summary?: PortableTextBlock[];
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
  species?: string;
  homeSector?: string;
  firstAppearance?: string;
  abilities?: PortableTextBlock[];
  constructStyle?: string;
  appearsIn?: string[];
  portrayals?: { _key: string; actor: string; production: string }[];
  keyStorylines?: StoryArcSummary[];
  readingRecommendations?: {
    _id: string;
    _type: "readingOrder" | "storyArc";
    title: string;
    slug: string;
  }[];
};

export type Corps = CorpsSummary & {
  keyFigures?: string[];
  description?: PortableTextBlock[];
  members?: CharacterSummary[];
};

export type HomeData = {
  hero: ArticleSummary[];
  latest: ArticleSummary[];
  comics: ArticleSummary[];
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

export type SearchHit = {
  _id: string;
  _type: "article" | "character" | "storyArc" | "readingOrder" | "corps";
  title: string;
  slug: string;
  excerpt?: string;
};
