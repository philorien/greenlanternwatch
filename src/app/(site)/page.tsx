import Link from "next/link";
import { ArticleCard, ComicRunCard } from "@/components/cards";
import { SanityImage } from "@/components/SanityImage";
import { EmptyState, Section } from "@/components/ui";
import { sanityFetch } from "@/sanity/client";
import { HOME_QUERY } from "@/sanity/queries";
import type {
  ArticleSummary,
  ComicRunSummary,
  CorpsSummary,
} from "@/sanity/types";

export const revalidate = 60;

type HomeData = {
  featured: ArticleSummary[];
  latest: ArticleSummary[];
  essentialRuns: ComicRunSummary[];
  corps: CorpsSummary[];
};

export default async function HomePage() {
  const data = await sanityFetch<HomeData>(
    HOME_QUERY,
    {},
    { featured: [], latest: [], essentialRuns: [], corps: [] },
    ["article", "comicRun", "corps"],
  );

  const lead = data.featured[0] ?? data.latest[0];
  const latest = data.latest.filter((a) => a._id !== lead?._id).slice(0, 3);

  return (
    <>
      <section className="max-w-3xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-glow">
          TV, film and comics
        </p>
        <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
          In brightest day, in blackest night, there is a lot to talk about.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          News, a practical comics reading guide, and profiles of the Lanterns
          and the other Corps, written by fans.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/comics"
            className="rounded-md bg-glow px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-glow-dim"
          >
            Start reading the comics
          </Link>
          <Link
            href="/articles"
            className="rounded-md border border-line px-5 py-2.5 text-sm transition-colors hover:border-glow-dim"
          >
            Latest news
          </Link>
        </div>
      </section>

      {lead ? (
        <Section title="Lead story">
          <Link
            href={`/articles/${lead.slug}`}
            className="group grid overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-glow-dim md:grid-cols-2"
          >
            {lead.mainImage?.asset ? (
              <SanityImage
                image={lead.mainImage}
                width={800}
                height={450}
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
                className="aspect-video h-full w-full object-cover"
              />
            ) : (
              <div className="aspect-video bg-surface-2" aria-hidden />
            )}
            <div className="flex flex-col justify-center gap-3 p-8">
              <h3 className="font-display text-3xl leading-snug transition-colors group-hover:text-glow">
                {lead.title}
              </h3>
              {lead.excerpt ? (
                <p className="text-muted">{lead.excerpt}</p>
              ) : null}
            </div>
          </Link>
        </Section>
      ) : (
        <Section title="Latest">
          <EmptyState>
            No articles yet. Publish one in the{" "}
            <Link href="/studio" className="text-glow underline">
              Studio
            </Link>{" "}
            and it will show up here.
          </EmptyState>
        </Section>
      )}

      {latest.length > 0 ? (
        <Section title="More news" href="/articles">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Where to start in the comics" href="/comics">
        {data.essentialRuns.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {data.essentialRuns.map((run) => (
              <ComicRunCard key={run._id} run={run} />
            ))}
          </div>
        ) : (
          <EmptyState>
            The reading guide is empty. Add comic runs and mark the best entry
            points as essential.
          </EmptyState>
        )}
      </Section>

      {data.corps.length > 0 ? (
        <Section title="The Corps">
          <div className="flex flex-wrap gap-3">
            {data.corps.map((c) => (
              <Link
                key={c._id}
                href={`/corps/${c.slug}`}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm transition-colors hover:border-glow-dim hover:text-glow"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
