import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { CharacterCard, StoryArcCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { CorpsSymbol } from "@/components/Logo";
import { RichText } from "@/components/RichText";
import { BackLink, EmptyState, SectionTitle } from "@/components/ui";
import { breadcrumbJsonLd, describe, pageMetadata } from "@/lib/seo";
import { getCorps, getCorpsSlugs } from "@/sanity/data";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getCorpsSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/corps/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const corps = await getCorps(slug);
  if (!corps) return {};
  return pageMetadata({
    title: corps.name,
    description: describe(
      corps.seoDescription,
      corps.tagline ? `${corps.emotion}. ${corps.tagline}` : undefined,
      corps.lead,
    ),
    path: `/corps/${slug}`,
  });
}

export default async function CorpsPage({ params }: PageProps<"/corps/[slug]">) {
  const { slug } = await params;
  const corps = await getCorps(slug);
  if (!corps) notFound();

  return (
    <div data-spectrum={corps.spectrum} className="mx-auto max-w-4xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "The emotional spectrum", path: "/corps" },
          { name: corps.name, path: `/corps/${corps.slug}` },
        ])}
      />
      <BackLink href="/corps">The emotional spectrum</BackLink>
      <div className="mt-6 flex items-center gap-6">
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--spec)]">
            {corps.emotion}
          </p>
          <h1 className="mt-2 font-display text-4xl font-black leading-tight sm:text-5xl">
            {corps.name}
          </h1>
        </div>
        <CorpsSymbol spectrum={corps.spectrum} className="size-20 shrink-0 sm:size-28" />
      </div>
      {corps.tagline ? <p className="mt-4 text-lg text-muted">{corps.tagline}</p> : null}
      {corps.keyFigures && corps.keyFigures.length > 0 ? (
        <p className="mt-4 text-sm text-muted">
          Key figures:{" "}
          <span className="text-text">
            {corps.keyFigures.map((figure, i) => {
              const character = corps.keyFigureCharacters?.find(
                (c) => c.name === figure || c.alias === figure,
              );
              return (
                <Fragment key={figure}>
                  {i > 0 ? ", " : null}
                  {character ? (
                    <Link
                      href={`/characters/${character.slug}`}
                      className="underline decoration-[var(--spec)] underline-offset-2 transition-colors hover:text-[var(--spec)]"
                    >
                      {figure}
                    </Link>
                  ) : (
                    figure
                  )}
                </Fragment>
              );
            })}
          </span>
        </p>
      ) : null}
      <div className="mt-10 max-w-3xl">
        <RichText value={corps.description} />
      </div>
      {corps.storylines && corps.storylines.length > 0 ? (
        <section className="mt-14">
          <SectionTitle>Key storylines</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {corps.storylines.map((a) => (
              <StoryArcCard key={a._id} arc={a} />
            ))}
          </div>
        </section>
      ) : null}
      <section className="mt-14">
        <SectionTitle>Members</SectionTitle>
        {corps.members && corps.members.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {corps.members.map((m) => (
              <CharacterCard key={m._id} character={m} />
            ))}
          </div>
        ) : (
          <EmptyState>No members listed yet.</EmptyState>
        )}
      </section>
    </div>
  );
}
