import type { Metadata } from "next";
import { CorpsCard } from "@/components/cards";
import { EmptyState, PageHeader } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { getCorpsList } from "@/sanity/data";

export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: "The emotional spectrum",
  description: "Every Corps on the emotional spectrum, and what powers each one.",
  path: "/corps",
});

export default async function CorpsIndexPage() {
  const corps = await getCorpsList();
  return (
    <>
      <PageHeader
        eyebrow="Corps"
        title="The emotional spectrum"
        intro="Each Corps draws its power from a different emotion. Start anywhere."
      />
      {corps.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {corps.map((k) => (
            <CorpsCard key={k._id} corps={k} />
          ))}
        </div>
      ) : (
        <EmptyState>No Corps added yet.</EmptyState>
      )}
    </>
  );
}
