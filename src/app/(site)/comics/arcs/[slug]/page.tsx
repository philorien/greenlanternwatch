import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CharacterCard, CorpsCard, yearSpan } from "@/components/cards";
import { Wordmark, type WordmarkVariant } from "@/components/Logo";
import { ComicVineCredit, ReadingList } from "@/components/ReadingList";
import { RichText } from "@/components/RichText";
import { Thumb } from "@/components/Thumb";
import { BackLink, SectionTitle } from "@/components/ui";
import { getStoryArc, getStoryArcSlugs } from "@/sanity/data";

export const revalidate = 60;

const arcWordmarks: Record<string, WordmarkVariant> = {
  "absolute-green-lantern": "absolute-green-lantern",
};

export async function generateStaticParams() {
  const slugs = await getStoryArcSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/comics/arcs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const arc = await getStoryArc(slug);
  if (!arc) return {};
  return { title: arc.title, description: arc.tagline };
}

export default async function StoryArcPage({
  params,
}: PageProps<"/comics/arcs/[slug]">) {
  const { slug } = await params;
  const arc = await getStoryArc(slug);
  if (!arc) notFound();

  const wordmark = arcWordmarks[slug];
  const years = yearSpan(arc.startYear, arc.endYear);
  const facts = [
    arc.creators?.length ? ["Creators", arc.creators.join(", ")] : null,
    arc.publisher ? ["Publisher", arc.publisher] : null,
    years ? ["Years", years] : null,
  ].filter((f): f is string[] => f !== null);

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink href="/comics">Comics guide</BackLink>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        <Thumb
          image={arc.cover}
          aspect="aspect-[2/3]"
          className="w-48 shrink-0 self-start rounded-lg border border-line"
          sizes="192px"
          width={480}
          priority
        />
        <div>
          {wordmark ? <Wordmark variant={wordmark} className="mb-6 w-full max-w-xs" /> : null}
          <p className="eyebrow">Story arc</p>
          <h1 className="mt-2 font-display text-4xl font-black leading-tight sm:text-5xl">
            {arc.title}
          </h1>
          {arc.tagline ? <p className="mt-4 text-lg text-muted">{arc.tagline}</p> : null}
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
        <RichText value={arc.summary} />
      </div>

      {arc.readingList && arc.readingList.length > 0 ? (
        <section className="mt-14 max-w-3xl">
          <SectionTitle>Reading list</SectionTitle>
          <ReadingList entries={arc.readingList} />
          <ComicVineCredit entries={arc.readingList} />
        </section>
      ) : null}

      {arc.corps && arc.corps.length > 0 ? (
        <section className="mt-14">
          <SectionTitle>Corps involved</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {arc.corps.map((k) => (
              <CorpsCard key={k._id} corps={k} />
            ))}
          </div>
        </section>
      ) : null}

      {arc.characters && arc.characters.length > 0 ? (
        <section className="mt-14">
          <SectionTitle>Key characters</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {arc.characters.map((c) => (
              <CharacterCard key={c._id} character={c} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
