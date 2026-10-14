import type { Metadata } from "next";
import Link from "next/link";
import { CharacterCard } from "@/components/cards";
import { EmptyState, PageHeader } from "@/components/ui";
import { sanityFetch } from "@/sanity/client";
import { CHARACTERS_QUERY, CORPS_LIST_QUERY } from "@/sanity/queries";
import type { CharacterSummary, CorpsSummary } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Characters and Corps",
  description: "Profiles of the Lanterns, the other Corps and their members.",
};

export default async function CharactersPage() {
  const [characters, corps] = await Promise.all([
    sanityFetch<CharacterSummary[]>(CHARACTERS_QUERY, {}, [], ["character"]),
    sanityFetch<CorpsSummary[]>(CORPS_LIST_QUERY, {}, [], ["corps"]),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Characters"
        title="Lanterns and the Corps"
        intro="Who is who across the emotional spectrum."
      />
      {corps.length > 0 ? (
        <div className="mb-12 flex flex-wrap gap-3">
          {corps.map((c) => (
            <Link
              key={c._id}
              href={`/corps/${c.slug}`}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm transition-colors hover:border-glow-dim hover:text-glow"
            >
              {c.name}
            </Link>
          ))}
        </div>
      ) : null}
      {characters.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((c) => (
            <CharacterCard key={c._id} character={c} />
          ))}
        </div>
      ) : (
        <EmptyState>No characters added yet.</EmptyState>
      )}
    </>
  );
}
