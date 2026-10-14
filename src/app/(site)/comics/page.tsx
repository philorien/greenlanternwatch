import type { Metadata } from "next";
import { ComicRunCard } from "@/components/cards";
import { EmptyState, PageHeader } from "@/components/ui";
import { sanityFetch } from "@/sanity/client";
import { COMIC_RUNS_QUERY } from "@/sanity/queries";
import type { ComicRunSummary } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Comics reading guide",
  description:
    "Where to start with Green Lantern comics, and which runs are worth your time.",
};

const tiers: { value: ComicRunSummary["tier"]; title: string; blurb: string }[] =
  [
    {
      value: "essential",
      title: "Essential",
      blurb: "The best places to begin, and the runs everyone talks about.",
    },
    {
      value: "recommended",
      title: "Recommended",
      blurb: "Strong follow-ups once you know what you like.",
    },
    {
      value: "deep-cut",
      title: "Deep cuts",
      blurb: "For readers who want the long tail.",
    },
  ];

export default async function ComicsPage() {
  const runs = await sanityFetch<ComicRunSummary[]>(
    COMIC_RUNS_QUERY,
    {},
    [],
    ["comicRun"],
  );

  return (
    <>
      <PageHeader
        eyebrow="Comics guide"
        title="Where to start reading"
        intro="A curated path through decades of Green Lantern comics, sorted by how strongly we recommend each run."
      />
      {runs.length === 0 ? (
        <EmptyState>No comic runs added yet.</EmptyState>
      ) : (
        <div className="space-y-14">
          {tiers.map((tier) => {
            const inTier = runs.filter((r) => r.tier === tier.value);
            if (inTier.length === 0) return null;
            return (
              <section key={tier.value}>
                <h2 className="font-display text-2xl">{tier.title}</h2>
                <p className="mt-1 mb-6 text-muted">{tier.blurb}</p>
                <div className="grid gap-5 md:grid-cols-2">
                  {inTier.map((run) => (
                    <ComicRunCard key={run._id} run={run} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
