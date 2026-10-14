import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CharacterCard } from "@/components/cards";
import { RichText } from "@/components/RichText";
import { BackLink, EmptyState, SectionTitle } from "@/components/ui";
import { getCorps, getCorpsSlugs } from "@/sanity/data";

export const revalidate = 60;

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
  return { title: corps.name, description: corps.tagline };
}

export default async function CorpsPage({ params }: PageProps<"/corps/[slug]">) {
  const { slug } = await params;
  const corps = await getCorps(slug);
  if (!corps) notFound();

  return (
    <div data-spectrum={corps.spectrum} className="mx-auto max-w-4xl">
      <BackLink href="/corps">The emotional spectrum</BackLink>
      <p className="mt-6 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--spec)]">
        {corps.emotion}
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        {corps.name}
      </h1>
      {corps.tagline ? <p className="mt-4 text-lg text-muted">{corps.tagline}</p> : null}
      {corps.keyFigures && corps.keyFigures.length > 0 ? (
        <p className="mt-4 text-sm text-muted">
          Key figures: <span className="text-text">{corps.keyFigures.join(", ")}</span>
        </p>
      ) : null}
      <div className="mt-10 max-w-3xl">
        <RichText value={corps.description} />
      </div>
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
