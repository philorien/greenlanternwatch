import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KeyIssueCard, StoryArcCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { RichText } from "@/components/RichText";
import { Thumb } from "@/components/Thumb";
import { BackLink, SectionTitle, SpectrumDot, Tag } from "@/components/ui";
import { breadcrumbJsonLd, describe, pageMetadata } from "@/lib/seo";
import { getCharacter, getCharacterSlugs } from "@/sanity/data";
import type { Character } from "@/sanity/types";

export const revalidate = 86400;

const mediumLabel: Record<string, string> = {
  comics: "Comics",
  tv: "TV",
  film: "Film",
  animation: "Animation",
  games: "Games",
};

export async function generateStaticParams() {
  const slugs = await getCharacterSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/characters/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const character = await getCharacter(slug);
  if (!character) return {};
  return pageMetadata({
    type: "profile",
    title: character.name,
    description: characterDescription(character),
    path: `/characters/${slug}`,
    image: character.portrait,
    imageFit: "fill",
  });
}

function characterDescription(c: Character) {
  const name = c.alias ? `${c.name} (${c.alias})` : c.name;
  const identity = [c.species, c.corps ? `member of the ${c.corps.name}` : null]
    .filter(Boolean)
    .join(", ");
  const facts = [
    identity ? `${name}: ${identity}.` : null,
    c.firstAppearance ? `First appearance: ${c.firstAppearance.trim()}.` : null,
  ]
    .filter(Boolean)
    .join(" ");
  return describe(c.lead, facts);
}

export default async function CharacterPage({
  params,
}: PageProps<"/characters/[slug]">) {
  const { slug } = await params;
  const c = await getCharacter(slug);
  if (!c) notFound();

  const facts = [
    c.alias ? ["Alias", c.alias] : null,
    c.species ? ["Species", c.species] : null,
    c.homeSector ? ["Home sector", c.homeSector] : null,
    c.firstAppearance ? ["First appearance", c.firstAppearance] : null,
  ].filter((f): f is string[] => f !== null);

  return (
    <div className="mx-auto max-w-4xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Characters", path: "/characters" },
          { name: c.name, path: `/characters/${c.slug}` },
        ])}
      />
      <BackLink href="/characters">All characters</BackLink>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        <Thumb
          image={c.portrait}
          aspect="aspect-[4/5]"
          className="w-56 shrink-0 self-start rounded-lg border border-line"
          sizes="224px"
          width={560}
          priority
        />
        <div>
          <h1 className="font-display text-4xl font-black leading-tight sm:text-5xl">
            {c.name}
          </h1>
          {c.corps ? (
            <Link
              href={`/corps/${c.corps.slug}`}
              className="mt-3 inline-flex items-center gap-2 text-glow hover:underline"
            >
              <SpectrumDot spectrum={c.corps.spectrum} />
              {c.corps.name}
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
          {c.appearsIn && c.appearsIn.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {c.appearsIn.map((m) => (
                <Tag key={m}>{mediumLabel[m] ?? m}</Tag>
              ))}
            </div>
          ) : null}
          {c.portrayals && c.portrayals.length > 0 ? (
            <ul className="mt-6 space-y-1 text-sm">
              {c.portrayals.map((p) => (
                <li key={p._key}>
                  <span className="font-semibold">{p.actor}</span>{" "}
                  <span className="text-muted">in {p.production}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="mt-12 max-w-3xl space-y-12">
        <RichText value={c.bio} />

        {c.abilities && c.abilities.length > 0 ? (
          <section>
            <h2 className="mb-3 font-display text-2xl font-black">Powers and abilities</h2>
            <RichText value={c.abilities} />
          </section>
        ) : null}

        {c.constructStyle ? (
          <section>
            <h2 className="mb-3 font-display text-2xl font-black">Construct style</h2>
            <p className="text-text/85">{c.constructStyle}</p>
          </section>
        ) : null}
      </div>

      {c.keyStorylines && c.keyStorylines.length > 0 ? (
        <section className="mt-14">
          <SectionTitle>Key storylines</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {c.keyStorylines.map((a) => (
              <StoryArcCard key={a._id} arc={a} />
            ))}
          </div>
        </section>
      ) : null}

      {c.keyIssues && c.keyIssues.length > 0 ? (
        <section className="mt-14">
          <SectionTitle>Key issues</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {c.keyIssues.map((k) => (
              <KeyIssueCard key={k._id} issue={k} except={c.slug} />
            ))}
          </div>
        </section>
      ) : null}

      {c.readingRecommendations && c.readingRecommendations.length > 0 ? (
        <section className="mt-14">
          <SectionTitle>Where to read</SectionTitle>
          <ul className="space-y-2">
            {c.readingRecommendations.map((r) => (
              <li key={r._id}>
                <Link
                  href={
                    r._type === "readingOrder"
                      ? `/comics/reading-orders/${r.slug}`
                      : `/comics/arcs/${r.slug}`
                  }
                  className="text-glow hover:underline"
                >
                  {r.title} &rarr;
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
