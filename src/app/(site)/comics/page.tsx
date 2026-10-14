import type { Metadata } from "next";
import Link from "next/link";
import {
  ComicCoverageCard,
  ReadingOrderCard,
  StoryArcCard,
} from "@/components/cards";
import { Thumb } from "@/components/Thumb";
import { EmptyState, PageHeader, SectionTitle } from "@/components/ui";
import { getComicsHub } from "@/sanity/data";
import type { KeyIssue } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Comics guide",
  description:
    "The Book of Oa: reading orders, story arc hubs, key issues and new-release coverage for Green Lantern comics.",
};

const keyIssueLabel: Record<KeyIssue["kind"], string> = {
  "first-appearance": "First appearance",
  origin: "Origin",
  "villain-debut": "Villain debut",
  "historic-ring": "Historic ring",
  milestone: "Milestone",
};

export default async function ComicsPage() {
  const { orders, arcs, keyIssues, coverage } = await getComicsHub();
  const starter = orders.find((o) => o.audience === "new-reader");
  const others = orders.filter((o) => o._id !== starter?._id);
  const empty = orders.length + arcs.length + keyIssues.length + coverage.length === 0;

  return (
    <>
      <PageHeader
        eyebrow="Comics guide"
        title="The Book of Oa"
        intro="Green Lantern continuity can be daunting. Start with a reading order, dive into an event hub, or browse the issues that matter most."
      />

      {empty ? (
        <EmptyState>
          The guide is empty. Add reading orders, story arcs and key issues in the Studio.
        </EmptyState>
      ) : null}

      {starter ? (
        <Link
          href={`/comics/reading-orders/${starter.slug}`}
          className="panel group mb-12 flex flex-col gap-2 bg-[radial-gradient(circle_at_85%_0%,rgb(53_232_160/0.18),transparent_60%)] p-6 transition-colors hover:border-glow-dim sm:p-8"
        >
          <p className="eyebrow">Start here</p>
          <h2 className="font-display text-3xl font-extrabold transition-colors group-hover:text-glow">
            {starter.title}
          </h2>
          {starter.tagline ? <p className="max-w-xl text-muted">{starter.tagline}</p> : null}
        </Link>
      ) : null}

      {others.length > 0 ? (
        <section className="mb-12">
          <SectionTitle>Reading orders</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <ReadingOrderCard key={o._id} order={o} />
            ))}
          </div>
        </section>
      ) : null}

      {arcs.length > 0 ? (
        <section className="mb-12">
          <SectionTitle>Story arcs and events</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {arcs.map((a) => (
              <StoryArcCard key={a._id} arc={a} />
            ))}
          </div>
        </section>
      ) : null}

      {keyIssues.length > 0 ? (
        <section className="mb-12">
          <SectionTitle>Key issues</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {keyIssues.map((k) => (
              <article key={k._id} className="panel flex gap-4 p-4">
                <Thumb
                  image={k.cover}
                  aspect="aspect-[2/3]"
                  className="w-20 shrink-0 rounded"
                  sizes="80px"
                  width={240}
                />
                <div className="min-w-0">
                  <p className="eyebrow">{keyIssueLabel[k.kind]}</p>
                  <h3 className="font-display text-base font-bold">
                    {k.title}
                    {k.publicationYear ? (
                      <span className="font-normal text-muted"> ({k.publicationYear})</span>
                    ) : null}
                  </h3>
                  <p className="mt-2 text-sm text-text/85">{k.whyItMatters}</p>
                  {k.characters && k.characters.length > 0 ? (
                    <p className="mt-2 text-xs text-muted">
                      {k.characters.map((c, i) => (
                        <span key={c.slug}>
                          {i > 0 ? ", " : ""}
                          <Link href={`/characters/${c.slug}`} className="text-glow hover:underline">
                            {c.name}
                          </Link>
                        </span>
                      ))}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {coverage.length > 0 ? (
        <section>
          <SectionTitle href="/category/reviews">New comic day coverage</SectionTitle>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {coverage.map((a) => (
              <ComicCoverageCard key={a._id} article={a} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
