import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterCard, yearSpan } from "@/components/cards";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { Section } from "@/components/ui";
import { sanityFetch } from "@/sanity/client";
import { COMIC_RUN_QUERY, COMIC_RUN_SLUGS_QUERY } from "@/sanity/queries";
import type { ComicRun } from "@/sanity/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(
    COMIC_RUN_SLUGS_QUERY,
    {},
    [],
    ["comicRun"],
  );
  return slugs.map(({ slug }) => ({ slug }));
}

async function getRun(slug: string) {
  return sanityFetch<ComicRun | null>(COMIC_RUN_QUERY, { slug }, null, [
    "comicRun",
  ]);
}

export async function generateMetadata({
  params,
}: PageProps<"/comics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const run = await getRun(slug);
  if (!run) return {};
  return { title: run.title, description: run.tagline };
}

export default async function ComicRunPage({
  params,
}: PageProps<"/comics/[slug]">) {
  const { slug } = await params;
  const run = await getRun(slug);
  if (!run) notFound();

  const years = yearSpan(run.startYear, run.endYear);
  const facts = [
    run.creators?.length ? ["Creators", run.creators.join(", ")] : null,
    run.publisher ? ["Publisher", run.publisher] : null,
    years ? ["Years", years] : null,
    run.issueRange ? ["Issues", run.issueRange] : null,
  ].filter((f): f is string[] => f !== null);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/comics"
        className="text-sm text-muted transition-colors hover:text-glow"
      >
        &larr; Reading guide
      </Link>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        {run.cover?.asset ? (
          <SanityImage
            image={run.cover}
            width={240}
            height={360}
            priority
            className="h-auto w-48 shrink-0 self-start rounded-lg border border-line"
          />
        ) : null}
        <div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            {run.title}
          </h1>
          {run.tagline ? (
            <p className="mt-4 text-lg text-muted">{run.tagline}</p>
          ) : null}
          {facts.length > 0 ? (
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {facts.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
      <div className="mt-12 max-w-3xl">
        <RichText value={run.summary} />
      </div>
      {run.characters && run.characters.length > 0 ? (
        <Section title="Featured characters">
          <div className="grid gap-4 sm:grid-cols-2">
            {run.characters.map((c) => (
              <CharacterCard key={c._id} character={c} />
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
