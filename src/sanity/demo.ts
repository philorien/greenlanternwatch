import type { PortableTextBlock } from "next-sanity";
import { isSanityConfigured } from "./env";
import type {
  ArticleSummary,
  CategoryItem,
  CharacterSummary,
  CorpsSummary,
  KeyIssue,
  ReadingOrderSummary,
  StoryArcSummary,
} from "./types";

/** Placeholder content. Only used in development while Sanity is unconfigured. */
export const isDemo =
  !isSanityConfigured && process.env.NODE_ENV !== "production";

const daysAgo = (n: number, hours = 0) =>
  new Date(Date.now() - (n * 24 + hours) * 3600 * 1000).toISOString();

export const block = (text: string, style = "normal"): PortableTextBlock =>
  ({
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style,
    markDefs: [],
    children: [
      { _type: "span", _key: Math.random().toString(36).slice(2, 10), text, marks: [] },
    ],
  }) as PortableTextBlock;

export const demoBody = [
  block("This is placeholder copy shown only in development. Publish real articles in the Studio and it disappears."),
  block("A section heading", "h2"),
  block("The layout, typography and spacing here are what published articles will look like."),
];

export const demoCategories: CategoryItem[] = [
  { _id: "c1", title: "Comics", slug: "comics", description: "Reviews, previews, reading orders" },
  { _id: "c2", title: "Movies & TV", slug: "movies-tv", description: "News, trailers, analysis" },
  { _id: "c3", title: "Characters", slug: "characters", description: "Profiles, deep dives, origins" },
  { _id: "c4", title: "Features", slug: "features", description: "Opinion, retrospectives, lore" },
  { _id: "c5", title: "Reviews", slug: "reviews", description: "Comics, movies, TV, more" },
];

const cat = (slug: string) => {
  const c = demoCategories.find((x) => x.slug === slug)!;
  return { title: c.title, slug: c.slug };
};
const author = { name: "Demo Author", slug: "demo-author" };

const mk = (
  i: number,
  title: string,
  category: string,
  days: number,
  extra: Partial<ArticleSummary> = {},
): ArticleSummary => ({
  _id: `a${i}`,
  title,
  slug: `demo-article-${i}`,
  excerpt: "Placeholder summary text. It is replaced when real content is published.",
  publishedAt: daysAgo(days, i),
  category: cat(category),
  author,
  readMinutes: 4 + (i % 5),
  ...extra,
});

export const demoArticles: ArticleSummary[] = [
  mk(1, "Demo headline: the lead story goes here", "movies-tv", 0),
  mk(2, "Demo headline: a second featured story", "comics", 0, {}),
  mk(3, "Demo headline: a third featured story", "movies-tv", 1),
  mk(4, "Demo headline: a fourth featured story", "features", 1),
  mk(5, "Demo headline: another news item", "movies-tv", 2),
  mk(6, "Demo headline: weekly review column", "reviews", 2, {
    comicRelease: { title: "Demo Series #25", publisher: "Publisher", releaseDate: "2026-10-08", coverageType: "review" },
  }),
  mk(7, "Demo headline: a preview of next week", "reviews", 3, {
    comicRelease: { title: "Demo Series #7", publisher: "Publisher", releaseDate: "2026-10-01", coverageType: "preview" },
  }),
  mk(8, "Demo headline: recap of the latest issue", "reviews", 4, {
    comicRelease: { title: "Demo Annual #4", publisher: "Publisher", releaseDate: "2026-09-24", coverageType: "recap" },
  }),
  mk(9, "Demo headline: another review", "reviews", 5, {
    comicRelease: { title: "Demo Series #26", publisher: "Publisher", releaseDate: "2026-09-17", coverageType: "review" },
  }),
  mk(10, "Demo headline: another preview", "reviews", 6, {
    comicRelease: { title: "Demo Series #8", publisher: "Publisher", releaseDate: "2026-09-10", coverageType: "preview" },
  }),
  mk(11, "Demo feature: on symbols and what they mean", "features", 7),
  mk(12, "Demo feature: why the Corps still matters", "features", 8),
  mk(13, "Demo feature: a history piece", "features", 9),
];

export const demoCorps: CorpsSummary[] = [
  { _id: "k1", name: "Green Lantern Corps", slug: "green-lantern-corps", spectrum: "green", emotion: "Willpower", tagline: "Placeholder tagline for this Corps." },
  { _id: "k2", name: "Sinestro Corps", slug: "sinestro-corps", spectrum: "yellow", emotion: "Fear", tagline: "Placeholder tagline for this Corps." },
  { _id: "k3", name: "Red Lantern Corps", slug: "red-lantern-corps", spectrum: "red", emotion: "Rage", tagline: "Placeholder tagline for this Corps." },
  { _id: "k4", name: "Blue Lantern Corps", slug: "blue-lantern-corps", spectrum: "blue", emotion: "Hope", tagline: "Placeholder tagline for this Corps." },
  { _id: "k5", name: "Star Sapphires", slug: "star-sapphires", spectrum: "violet", emotion: "Love", tagline: "Placeholder tagline for this Corps." },
  { _id: "k6", name: "Orange Lantern Corps", slug: "orange-lantern-corps", spectrum: "orange", emotion: "Avarice", tagline: "Placeholder tagline for this Corps." },
  { _id: "k7", name: "Indigo Tribe", slug: "indigo-tribe", spectrum: "indigo", emotion: "Compassion", tagline: "Placeholder tagline for this Corps." },
  { _id: "k8", name: "Black Lantern Corps", slug: "black-lantern-corps", spectrum: "black", emotion: "Death", tagline: "Placeholder tagline for this Corps." },
  { _id: "k9", name: "White Lantern Corps", slug: "white-lantern-corps", spectrum: "white", emotion: "Life", tagline: "Placeholder tagline for this Corps." },
];

const corpsRef = (slug: string) => {
  const k = demoCorps.find((x) => x.slug === slug)!;
  return { name: k.name, slug: k.slug, spectrum: k.spectrum };
};

export const demoCharacters: CharacterSummary[] = [
  { _id: "h1", name: "Demo Earth Lantern One", slug: "demo-earth-lantern-one", alias: "Civilian Name", section: "earth", corps: corpsRef("green-lantern-corps") },
  { _id: "h2", name: "Demo Earth Lantern Two", slug: "demo-earth-lantern-two", alias: "Civilian Name", section: "earth", corps: corpsRef("green-lantern-corps") },
  { _id: "h3", name: "Demo Earth Lantern Three", slug: "demo-earth-lantern-three", section: "earth", corps: corpsRef("green-lantern-corps") },
  { _id: "h4", name: "Demo Alien Lantern One", slug: "demo-alien-lantern-one", section: "alien", corps: corpsRef("green-lantern-corps") },
  { _id: "h5", name: "Demo Alien Lantern Two", slug: "demo-alien-lantern-two", section: "alien", corps: corpsRef("blue-lantern-corps") },
  { _id: "h6", name: "Demo Rival", slug: "demo-rival", section: "other", corps: corpsRef("sinestro-corps") },
];

export const demoOrders: ReadingOrderSummary[] = [
  { _id: "r1", title: "New Reader Starter Pack", slug: "new-reader-starter-pack", audience: "new-reader", tagline: "Where to begin without decades of background.", entryCount: 6 },
  { _id: "r2", title: "Demo Era Master Reading Order", slug: "demo-era-master-reading-order", audience: "era", tagline: "A step-by-step order through one era.", entryCount: 24 },
  { _id: "r3", title: "Demo Modern Era Guide", slug: "demo-modern-era-guide", audience: "era", tagline: "Reading lists for the current era.", entryCount: 12 },
];

export const demoArcs: StoryArcSummary[] = [
  { _id: "s1", title: "Demo Event One", slug: "demo-event-one", kind: "event", tagline: "Placeholder arc description.", creators: ["Writer", "Artist"], startYear: 2007, endYear: 2008 },
  { _id: "s2", title: "Demo Event Two", slug: "demo-event-two", kind: "event", tagline: "Placeholder arc description.", creators: ["Writer", "Artist"], startYear: 2009, endYear: 2010 },
  { _id: "s3", title: "Demo Storyline", slug: "demo-storyline", kind: "storyline", tagline: "Placeholder arc description.", creators: ["Writer", "Artist"], startYear: 1994 },
];

export const demoKeyIssues: KeyIssue[] = [
  { _id: "i1", title: "Demo Series #1", slug: "demo-series-1", kind: "first-appearance", publicationYear: 1960, whyItMatters: "Placeholder explanation of why this issue matters to collectors and readers.", characters: [{ name: "Demo Earth Lantern One", slug: "demo-earth-lantern-one" }] },
  { _id: "i2", title: "Demo Series #52", slug: "demo-series-52", kind: "villain-debut", publicationYear: 1971, whyItMatters: "Placeholder explanation of why this issue matters to collectors and readers.", characters: [{ name: "Demo Rival", slug: "demo-rival" }] },
  { _id: "i3", title: "Demo Special #1", slug: "demo-special-1", kind: "historic-ring", publicationYear: 1985, whyItMatters: "Placeholder explanation of why this issue matters to collectors and readers." },
];
