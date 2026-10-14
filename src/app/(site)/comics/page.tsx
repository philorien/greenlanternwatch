import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ComicCoverageCard,
  KeyIssueCard,
  ReadingOrderCard,
  StoryArcCard,
} from "@/components/cards";
import { Wordmark } from "@/components/Logo";
import { EmptyState, PageHeader, SectionTitle } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { getComicsHub } from "@/sanity/data";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Comics guide",
  description:
    "The Book of Oa: reading orders, story arc hubs, key issues and new-release coverage for Green Lantern comics.",
  path: "/comics",
});

export default async function ComicsPage() {
  const { orders, arcs, keyIssues, coverage } = await getComicsHub();
  const starter = orders.find((o) => o.audience === "new-reader");
  const others = orders.filter((o) => o._id !== starter?._id);
  const empty = orders.length + arcs.length + keyIssues.length + coverage.length === 0;

  return (
    <>
      <div className="flex items-start justify-between gap-8">
        <PageHeader
          eyebrow="Comics guide"
          title="The Book of Oa"
          intro="Green Lantern continuity can be daunting. Start with a reading order, dive into an event hub, or browse the issues that matter most."
        />
        <Image
          src="/dc-universe-corner-box.webp"
          alt=""
          width={132}
          height={378}
          sizes="56px"
          className="hidden h-40 w-auto shrink-0 rounded-sm sm:block"
        />
      </div>

      {empty ? (
        <EmptyState>
          The guide is empty. Add reading orders, story arcs and key issues in the Studio.
        </EmptyState>
      ) : null}

      {starter ? (
        <Link
          href={`/comics/reading-orders/${starter.slug}`}
          className="panel group mb-12 flex items-center gap-6 bg-[radial-gradient(circle_at_85%_0%,rgb(34_179_78/0.18),transparent_60%)] p-6 transition-colors hover:border-glow-dim sm:p-8"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="eyebrow">Start here</p>
            <h2 className="font-display text-3xl font-black transition-colors group-hover:text-glow">
              {starter.title}
            </h2>
            {starter.tagline ? <p className="max-w-xl text-muted">{starter.tagline}</p> : null}
          </div>
          <Wordmark variant="modern" alt="" className="hidden w-56 shrink-0 md:block lg:w-64" />
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
              <KeyIssueCard key={k._id} issue={k} />
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
