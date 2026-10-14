import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { Tag } from "@/components/ui";
import { sanityFetch } from "@/sanity/client";
import { CHARACTER_QUERY, CHARACTER_SLUGS_QUERY } from "@/sanity/queries";
import type { Character } from "@/sanity/types";

export const revalidate = 60;

const mediumLabel: Record<string, string> = {
  comics: "Comics",
  tv: "TV",
  film: "Film",
  animation: "Animation",
  games: "Games",
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(
    CHARACTER_SLUGS_QUERY,
    {},
    [],
    ["character"],
  );
  return slugs.map(({ slug }) => ({ slug }));
}

async function getCharacter(slug: string) {
  return sanityFetch<Character | null>(CHARACTER_QUERY, { slug }, null, [
    "character",
  ]);
}

export async function generateMetadata({
  params,
}: PageProps<"/characters/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const character = await getCharacter(slug);
  if (!character) return {};
  return {
    title: character.name,
    description: character.alias
      ? `${character.name}, also known as ${character.alias}.`
      : undefined,
  };
}

export default async function CharacterPage({
  params,
}: PageProps<"/characters/[slug]">) {
  const { slug } = await params;
  const character = await getCharacter(slug);
  if (!character) notFound();

  const facts = [
    character.alias ? ["Alias", character.alias] : null,
    character.species ? ["Species", character.species] : null,
    character.homeSector ? ["Home sector", character.homeSector] : null,
    character.firstAppearance
      ? ["First appearance", character.firstAppearance]
      : null,
  ].filter((f): f is string[] => f !== null);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/characters"
        className="text-sm text-muted transition-colors hover:text-glow"
      >
        &larr; All characters
      </Link>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        {character.portrait?.asset ? (
          <SanityImage
            image={character.portrait}
            width={320}
            height={400}
            priority
            className="h-auto w-56 shrink-0 self-start rounded-lg border border-line object-cover"
          />
        ) : null}
        <div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            {character.name}
          </h1>
          {character.corps ? (
            <Link
              href={`/corps/${character.corps.slug}`}
              className="mt-3 inline-block text-glow underline underline-offset-4"
            >
              {character.corps.name}
            </Link>
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
          {character.appearsIn && character.appearsIn.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {character.appearsIn.map((m) => (
                <Tag key={m}>{mediumLabel[m] ?? m}</Tag>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-12 max-w-3xl">
        <RichText value={character.bio} />
      </div>
    </div>
  );
}
