import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterCard } from "@/components/cards";
import { RichText } from "@/components/RichText";
import { EmptyState, Section } from "@/components/ui";
import { sanityFetch } from "@/sanity/client";
import { CORPS_QUERY, CORPS_SLUGS_QUERY } from "@/sanity/queries";
import type { Corps } from "@/sanity/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(
    CORPS_SLUGS_QUERY,
    {},
    [],
    ["corps"],
  );
  return slugs.map(({ slug }) => ({ slug }));
}

async function getCorps(slug: string) {
  return sanityFetch<Corps | null>(CORPS_QUERY, { slug }, null, [
    "corps",
    "character",
  ]);
}

export async function generateMetadata({
  params,
}: PageProps<"/corps/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const corps = await getCorps(slug);
  if (!corps) return {};
  return { title: corps.name, description: corps.tagline };
}

export default async function CorpsPage({
  params,
}: PageProps<"/corps/[slug]">) {
  const { slug } = await params;
  const corps = await getCorps(slug);
  if (!corps) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/characters"
        className="text-sm text-muted transition-colors hover:text-glow"
      >
        &larr; All characters
      </Link>
      <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
        {corps.name}
      </h1>
      {corps.tagline ? (
        <p className="mt-4 text-lg text-muted">{corps.tagline}</p>
      ) : null}
      <div className="mt-10 max-w-3xl">
        <RichText value={corps.description} />
      </div>
      <Section title="Members">
        {corps.members && corps.members.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {corps.members.map((m) => (
              <CharacterCard key={m._id} character={m} />
            ))}
          </div>
        ) : (
          <EmptyState>No members listed yet.</EmptyState>
        )}
      </Section>
    </div>
  );
}
