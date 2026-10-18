import { site } from "@/config/site";
import { absoluteUrl, describe } from "@/lib/seo";
import { getCharacters, getComicsHub, getExplainers, getNews } from "@/sanity/data";
import { pathFor } from "@/sanity/paths";

export const revalidate = 86400;

const RECENT_ARTICLES = 25;

type Link = { title: string; path: string; description?: string | null };

const link = ({ title, path, description }: Link) => {
  const summary = describe(description);
  return `- [${title}](${absoluteUrl(path)})${summary ? `: ${summary}` : ""}`;
};

const section = (title: string, links: Link[]) =>
  links.length > 0 ? [`## ${title}`, "", ...links.map(link), ""] : [];

const guides: Link[] = [
  {
    title: "Where to start",
    path: "/comics",
    description: "The Book of Oa, our comics guide: reading orders, story arc hubs and key issues.",
  },
  { title: "News", path: "/news", description: "Announcements, release dates and casting across comics, TV and film." },
  {
    title: "Movies & TV",
    path: "/movies-tv",
    description: "Every film and show built around a Green Lantern, and the ones where a Lantern appears.",
  },
  { title: "Characters", path: "/characters", description: "Profiles of the Lanterns, their allies and their enemies." },
  {
    title: "Features",
    path: "/category/features",
    description: "Explainers, histories and longer reads on the corners of the mythos.",
  },
  { title: "The emotional spectrum", path: "/corps", description: "Every Corps, the emotion that powers it, and who carries its rings." },
  { title: "About", path: "/about", description: "Who runs the site, how we source facts, and how corrections work." },
];

export async function GET() {
  const [hub, { characters, corps }, news, explainers] = await Promise.all([
    getComicsHub(),
    getCharacters(),
    getNews(),
    getExplainers(),
  ]);

  const body = [
    `# ${site.name}`,
    "",
    "> An unofficial, fan-run guide to Green Lantern across comics, TV and film: news, reviews, comics reading orders, story arc guides and profiles of the characters and Corps.",
    "",
    "Green Lantern Watch is not affiliated with DC or Warner Bros. Discovery. Issue numbers, release dates and creator credits come from the books and from ComicVine; news stories link to the original announcement and label rumors as rumors. Newcomers should start with the reading orders below.",
    "",
    ...section("Guides", guides),
    ...section(
      "Features",
      [
        ...explainers.map((explainer) => ({
          title: explainer.title,
          path: `/explainers/${explainer.slug}`,
          description: explainer.dek,
          date: explainer.publishedAt,
        })),
        ...news
          .filter((article) => article.category?.slug === "features")
          .map((article) => ({
            title: article.title,
            path: pathFor("article", article.slug),
            description: article.excerpt,
            date: article.publishedAt,
          })),
      ]
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .map(({ title, path, description }) => ({ title, path, description })),
    ),
    ...section(
      "Reading orders",
      hub.orders.map((o) => ({ title: o.title, path: pathFor("readingOrder", o.slug), description: o.tagline })),
    ),
    ...section(
      "Story arcs",
      hub.arcs.map((a) => ({ title: a.title, path: pathFor("storyArc", a.slug), description: a.tagline })),
    ),
    ...section(
      "Corps",
      corps.map((k) => ({
        title: k.name,
        path: pathFor("corps", k.slug),
        description: [`Powered by ${k.emotion.toLowerCase()}.`, k.tagline].filter(Boolean).join(" "),
      })),
    ),
    ...section(
      "Characters",
      characters.map((c) => ({
        title: c.name,
        path: pathFor("character", c.slug),
        description: [c.alias && `Also known as ${c.alias}.`, c.corps && `Member of the ${c.corps.name}.`].filter(Boolean).join(" "),
      })),
    ),
    ...section(
      "Recent articles",
      news.slice(0, RECENT_ARTICLES).map((a) => ({ title: a.title, path: pathFor("article", a.slug), description: a.excerpt })),
    ),
    "## Optional",
    "",
    link({ title: "Sitemap", path: "/sitemap.xml", description: "Every page on the site." }),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
