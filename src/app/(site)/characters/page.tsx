import type { Metadata } from "next";
import Link from "next/link";
import { CharacterCard } from "@/components/cards";
import { EmptyState, PageHeader, SectionTitle, SpectrumDot } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { getCharacters } from "@/sanity/data";
import type { CharacterSummary } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Characters and Corps",
  description:
    "The Great Spectrum Database: profiles of Earth's Lanterns, alien Lanterns and every Corps on the emotional spectrum.",
  path: "/characters",
});

const sections: { value: CharacterSummary["section"]; title: string }[] = [
  { value: "earth", title: "Earth's Green Lanterns (Sector 2814)" },
  { value: "alien", title: "Alien Lanterns and fan favorites" },
  { value: "other", title: "Others" },
];

export default async function CharactersPage() {
  const { characters, corps } = await getCharacters();

  return (
    <>
      <PageHeader
        eyebrow="Characters and Corps"
        title="The Great Spectrum Database"
        intro="Every major ring-bearer and faction, from Sector 2814 to the far reaches of the emotional spectrum."
      />

      {corps.length > 0 ? (
        <section className="mb-12">
          <SectionTitle href="/corps" hrefLabel="All Corps">
            The emotional spectrum
          </SectionTitle>
          <ul className="flex flex-wrap gap-3">
            {corps.map((k) => (
              <li key={k._id}>
                <Link
                  href={`/corps/${k.slug}`}
                  className="panel flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:border-glow-dim hover:text-glow"
                >
                  <SpectrumDot spectrum={k.spectrum} />
                  <span className="font-display font-bold">{k.emotion}</span>
                  <span className="text-muted">{k.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {characters.length === 0 ? <EmptyState>No characters added yet.</EmptyState> : null}

      {sections.map((s) => {
        const list = characters.filter((c) => c.section === s.value);
        if (list.length === 0) return null;
        return (
          <section key={s.value} className="mb-12">
            <SectionTitle>{s.title}</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <CharacterCard key={c._id} character={c} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
