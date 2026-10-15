import type { QueryParams } from "next-sanity";
import { explainers as demoExplainers, explainersMatching } from "@/content/explainers";
import { sanityFetch } from "./client";
import {
  block,
  demoArcs,
  demoArticles,
  demoBody,
  demoCategories,
  demoCharacters,
  demoCorps,
  demoIssues,
  demoKeyIssues,
  demoOrders,
  isDemo,
} from "./demo";
import { mapExplainer, type SanityExplainerDoc } from "./mapExplainer";
import * as q from "./queries";
import type {
  Article,
  ArticleSummary,
  Author,
  CategoryItem,
  Character,
  CharacterSummary,
  ComicIssue,
  ComicsHubData,
  Corps,
  CorpsSummary,
  HomeData,
  ReadingOrder,
  SearchHit,
  SitemapEntry,
  StoryArc,
} from "./types";

/** Use `demo` only in development while Sanity is unconfigured. */
const pick = <T>(empty: T, demo: T): T => (isDemo ? demo : empty);

const withReadTime = <T extends ArticleSummary>(a: T): T => ({
  ...a,
  readMinutes:
    a.readMinutes ??
    (a.bodyLength ? Math.max(1, Math.round(a.bodyLength / 1150)) : undefined),
});

const fetchList = <T>(query: string, params: QueryParams, empty: T, demo: T, tags: string[]) =>
  sanityFetch<T>(query, params, pick(empty, demo), tags);

/* Home */

const HOME_COMICS = 5;

/** Newest issue of each series first, then the next newest overall to fill the row. */
function latestPerSeries(issues: ComicIssue[]) {
  const seen = new Set<string>();
  const leads: ComicIssue[] = [];
  const rest: ComicIssue[] = [];
  for (const issue of issues) {
    const series = issue.series ?? issue.title;
    (seen.has(series) ? rest : leads).push(issue);
    seen.add(series);
  }
  return [...leads, ...rest].slice(0, HOME_COMICS);
}

export async function getHome(): Promise<HomeData> {
  const demoHome: HomeData = {
    hero: demoArticles.slice(0, 4),
    latest: demoArticles.slice(0, 12),
    comics: demoIssues,
    features: demoArticles.filter((a) => a.category?.slug === "features").slice(0, 3),
    categories: demoCategories,
    startHere: { title: demoOrders[0].title, slug: demoOrders[0].slug, tagline: demoOrders[0].tagline },
  };
  const data = await fetchList<HomeData>(
    q.HOME_QUERY,
    {},
    { hero: [], latest: [], comics: [], features: [], categories: [], startHere: null },
    demoHome,
    ["article", "category", "readingOrder", "comicIssue"],
  );
  const hero = data.hero.length > 0 ? data.hero : data.latest.slice(0, 3);
  return {
    ...data,
    hero: hero.map(withReadTime),
    latest: data.latest.map(withReadTime),
    comics: latestPerSeries(data.comics),
    features: data.features.map(withReadTime),
  };
}

/* News and categories */

export async function getNews(): Promise<ArticleSummary[]> {
  const list = await fetchList<ArticleSummary[]>(q.NEWS_QUERY, {}, [], demoArticles, ["article"]);
  return list.map(withReadTime);
}

export async function getCategoryPage(slug: string) {
  const demoPage = {
    category: demoCategories.find((c) => c.slug === slug) ?? null,
    articles: demoArticles.filter((a) => a.category?.slug === slug),
  };
  const data = await fetchList<{ category: CategoryItem | null; articles: ArticleSummary[] }>(
    q.CATEGORY_PAGE_QUERY,
    { slug },
    { category: null, articles: [] },
    demoPage,
    ["article", "category"],
  );
  return { ...data, articles: data.articles.map(withReadTime) };
}

export const getCategorySlugs = () =>
  fetchList<{ slug: string }[]>(q.CATEGORY_SLUGS_QUERY, {}, [], demoCategories.map((c) => ({ slug: c.slug })), ["category"]);

export async function getArticle(slug: string): Promise<Article | null> {
  const demoItem = demoArticles.find((a) => a.slug === slug);
  const demoArticle: Article | null = demoItem
    ? {
        ...demoItem,
        body: demoBody,
        related: demoArticles
          .filter((a) => a._id !== demoItem._id && a.category?.slug === demoItem.category?.slug)
          .slice(0, 3),
      }
    : null;
  const article = await sanityFetch<Article | null>(
    q.ARTICLE_QUERY,
    { slug },
    pick(null, demoArticle),
    ["article"],
  );
  if (!article) return null;
  return { ...withReadTime(article), related: article.related?.map(withReadTime) };
}

export const getArticleSlugs = () =>
  fetchList<{ slug: string }[]>(q.ARTICLE_SLUGS_QUERY, {}, [], demoArticles.map((a) => ({ slug: a.slug })), ["article"]);

/* Authors */

export async function getAuthorPage(slug: string) {
  const demoAuthor = demoArticles.find((a) => a.author?.slug === slug)?.author;
  const demoPage = {
    author: demoAuthor
      ? { _id: "au1", ...demoAuthor, role: "Contributor", bio: [block("Placeholder bio for this author.")] }
      : null,
    articles: demoArticles.filter((a) => a.author?.slug === slug),
  };
  const data = await fetchList<{ author: Author | null; articles: ArticleSummary[] }>(
    q.AUTHOR_PAGE_QUERY,
    { slug },
    { author: null, articles: [] },
    demoPage,
    ["author", "article"],
  );
  return { ...data, articles: data.articles.map(withReadTime) };
}

export const getAuthorSlugs = () =>
  fetchList<{ slug: string }[]>(
    q.AUTHOR_SLUGS_QUERY,
    {},
    [],
    [...new Set(demoArticles.flatMap((a) => (a.author ? [a.author.slug] : [])))].map((slug) => ({ slug })),
    ["author"],
  );

/* Comics guide */

export async function getComicsHub(): Promise<ComicsHubData> {
  const data = await fetchList<ComicsHubData>(
    q.COMICS_HUB_QUERY,
    {},
    { orders: [], arcs: [], keyIssues: [], coverage: [] },
    {
      orders: demoOrders,
      arcs: demoArcs,
      keyIssues: demoKeyIssues,
      coverage: demoArticles.filter((a) => a.comicRelease).slice(0, 6),
    },
    ["readingOrder", "storyArc", "keyIssue", "article"],
  );
  return { ...data, coverage: data.coverage.map(withReadTime) };
}

export async function getReadingOrder(slug: string): Promise<ReadingOrder | null> {
  const summary = demoOrders.find((o) => o.slug === slug);
  const demoOrder: ReadingOrder | null = summary
    ? {
        ...summary,
        intro: [block("Placeholder introduction for this reading order.")],
        sections: [
          {
            _key: "sec1",
            title: "Part one",
            note: "Placeholder note for this section.",
            entries: [
              { _key: "e1", title: "Demo Collected Edition", issues: "Issues 1 to 6", format: "collected", note: "Placeholder note on why this belongs here." },
              { _key: "e2", title: "Demo Event", issues: "Event miniseries", format: "event", arc: { title: demoArcs[0].title, slug: demoArcs[0].slug } },
              { _key: "e3", title: "Demo Single Issues", issues: "Issues 7 to 12", format: "issues" },
            ],
          },
        ],
      }
    : null;
  return sanityFetch<ReadingOrder | null>(q.READING_ORDER_QUERY, { slug }, pick(null, demoOrder), ["readingOrder"]);
}

export const getReadingOrderSlugs = () =>
  fetchList<{ slug: string }[]>(q.READING_ORDER_SLUGS_QUERY, {}, [], demoOrders.map((o) => ({ slug: o.slug })), ["readingOrder"]);

export async function getStoryArc(slug: string): Promise<StoryArc | null> {
  const summary = demoArcs.find((a) => a.slug === slug);
  const demoArc: StoryArc | null = summary
    ? {
        ...summary,
        summary: [block("Placeholder summary of this story arc.")],
        readingList: [
          { _key: "r1", title: "Demo Prelude", issues: "Issues 1 to 3", format: "issues" },
          { _key: "r2", title: "Demo Main Series", issues: "Issues 4 to 10", format: "collected" },
        ],
        characters: demoCharacters.slice(0, 3),
        corps: demoCorps.slice(0, 2),
      }
    : null;
  return sanityFetch<StoryArc | null>(q.STORY_ARC_QUERY, { slug }, pick(null, demoArc), ["storyArc"]);
}

export const getStoryArcSlugs = () =>
  fetchList<{ slug: string }[]>(q.STORY_ARC_SLUGS_QUERY, {}, [], demoArcs.map((a) => ({ slug: a.slug })), ["storyArc"]);

/* Characters and corps */

export const getCharacters = () =>
  fetchList<{ characters: CharacterSummary[]; corps: CorpsSummary[] }>(
    q.CHARACTERS_QUERY,
    {},
    { characters: [], corps: [] },
    { characters: demoCharacters, corps: demoCorps },
    ["character", "corps"],
  );

export async function getCharacter(slug: string): Promise<Character | null> {
  const summary = demoCharacters.find((c) => c.slug === slug);
  const demoCharacter: Character | null = summary
    ? {
        ...summary,
        bio: [block("Placeholder biography for this character.")],
        species: "Placeholder species",
        homeSector: "Sector 2814",
        firstAppearance: "Placeholder title, year",
        abilities: [block("Placeholder powers and abilities.")],
        constructStyle: "Placeholder description of how their constructs look.",
        appearsIn: ["comics", "tv"],
        portrayals: [{ _key: "p1", actor: "Placeholder Actor", production: "Placeholder Production" }],
        keyStorylines: demoArcs.slice(0, 2),
        keyIssues: demoKeyIssues.slice(0, 2),
        readingRecommendations: [
          { _id: demoOrders[0]._id, _type: "readingOrder", title: demoOrders[0].title, slug: demoOrders[0].slug },
        ],
      }
    : null;
  return sanityFetch<Character | null>(q.CHARACTER_QUERY, { slug }, pick(null, demoCharacter), [
    "character",
    "storyArc",
    "keyIssue",
  ]);
}

export const getCharacterSlugs = () =>
  fetchList<{ slug: string }[]>(q.CHARACTER_SLUGS_QUERY, {}, [], demoCharacters.map((c) => ({ slug: c.slug })), ["character"]);

export const getCorpsList = () =>
  fetchList<CorpsSummary[]>(q.CORPS_LIST_QUERY, {}, [], demoCorps, ["corps"]);

export async function getCorps(slug: string): Promise<Corps | null> {
  const summary = demoCorps.find((k) => k.slug === slug);
  const demoItem: Corps | null = summary
    ? {
        ...summary,
        keyFigures: ["Placeholder leader"],
        description: [block("Placeholder description of this Corps and what it stands for.")],
        storylines: demoArcs.slice(0, 2),
        members: demoCharacters.filter((c) => c.corps?.slug === slug),
      }
    : null;
  return sanityFetch<Corps | null>(q.CORPS_QUERY, { slug }, pick(null, demoItem), ["corps", "character", "storyArc"]);
}

export const getCorpsSlugs = () =>
  fetchList<{ slug: string }[]>(q.CORPS_SLUGS_QUERY, {}, [], demoCorps.map((k) => ({ slug: k.slug })), ["corps"]);

/* Sitemap */

export const getSitemapEntries = () =>
  fetchList<SitemapEntry[]>(
    q.SITEMAP_QUERY,
    {},
    [],
    [
      ...demoArticles.map((a) => ({ _type: "article" as const, slug: a.slug, updatedAt: a.publishedAt })),
      ...demoCharacters.map((c) => ({ _type: "character" as const, slug: c.slug })),
      ...demoArcs.map((a) => ({ _type: "storyArc" as const, slug: a.slug })),
      ...demoOrders.map((o) => ({ _type: "readingOrder" as const, slug: o.slug })),
      ...demoCorps.map((k) => ({ _type: "corps" as const, slug: k.slug })),
      ...demoCategories.map((c) => ({ _type: "category" as const, slug: c.slug })),
      ...demoExplainers.map((explainer) => ({
        _type: "explainer" as const,
        slug: explainer.slug,
        updatedAt: explainer.publishedAt,
      })),
    ],
    ["article", "explainer", "character", "storyArc", "readingOrder", "corps", "category", "author"],
  );

const mapExplainers = (docs: SanityExplainerDoc[]) =>
  docs.flatMap((doc) => {
    const explainer = mapExplainer(doc);
    return explainer ? [explainer] : [];
  });

export async function getExplainers() {
  const docs = await fetchList<SanityExplainerDoc[]>(
    q.EXPLAINERS_QUERY,
    {},
    [],
    demoExplainers.map((explainer) => ({
      _id: explainer.slug,
      title: explainer.title,
      slug: explainer.slug,
      dek: explainer.dek,
      publishedAt: explainer.publishedAt,
      author: explainer.author ?? null,
      sections: explainer.sections.map((section) => ({
        title: section.title,
        anchor: section.id,
        blocks: section.blocks.map(demoBlock),
      })),
    })),
    ["explainer"],
  );
  return mapExplainers(docs);
}

export async function getExplainer(slug: string) {
  const demo = demoExplainers.find((explainer) => explainer.slug === slug);
  const doc = await sanityFetch<SanityExplainerDoc | null>(
    q.EXPLAINER_QUERY,
    { slug },
    pick(
      null,
      demo
        ? {
            _id: demo.slug,
            title: demo.title,
            slug: demo.slug,
            dek: demo.dek,
            publishedAt: demo.publishedAt,
            author: demo.author ?? null,
            sections: demo.sections.map((section) => ({
              title: section.title,
              anchor: section.id,
              blocks: section.blocks.map(demoBlock),
            })),
          }
        : null,
    ),
    ["explainer"],
  );
  return doc ? mapExplainer(doc) : null;
}

export const getExplainerSlugs = () =>
  fetchList<{ slug: string }[]>(
    q.EXPLAINER_SLUGS_QUERY,
    {},
    [],
    demoExplainers.map((explainer) => ({ slug: explainer.slug })),
    ["explainer"],
  );

const demoBlock = (block: (typeof demoExplainers)[number]["sections"][number]["blocks"][number]) => {
  switch (block.type) {
    case "paragraph":
      return { _type: "explainerParagraph", text: block.text };
    case "points":
      return { _type: "explainerPoints", items: block.items };
    case "steps":
      return { _type: "explainerSteps", items: block.items };
    case "thesis":
      return { _type: "explainerThesis", kicker: block.kicker, text: block.text };
    case "timeline":
      return { _type: "explainerTimeline", caption: block.caption, rows: block.rows };
    case "terms":
      return { _type: "explainerTerms", items: block.items };
    case "compare":
      return {
        _type: "explainerCompare",
        caption: block.caption,
        leftHeading: block.columns[0],
        rightHeading: block.columns[1],
        rows: block.rows,
      };
    case "reading":
      return { _type: "explainerReading", items: block.items };
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
};

/* Search */

export async function search(term: string): Promise<SearchHit[]> {
  const clean = term.trim().replace(/[^\p{L}\p{N}\s'-]/gu, "");
  if (clean.length < 2) return [];
  const needle = clean.toLowerCase();
  const demoHits: SearchHit[] = [
    ...demoArticles
      .filter((a) => a.title.toLowerCase().includes(needle))
      .map((a) => ({ _id: a._id, _type: "article" as const, title: a.title, slug: a.slug, excerpt: a.excerpt })),
    ...explainersMatching(needle).map((explainer) => ({
      _id: explainer.slug,
      _type: "explainer" as const,
      title: explainer.title,
      slug: explainer.slug,
      excerpt: explainer.dek,
    })),
  ];
  return sanityFetch<SearchHit[]>(q.SEARCH_QUERY, { q: `${clean}*` }, pick([], demoHits), []);
}
