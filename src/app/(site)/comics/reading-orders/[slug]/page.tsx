import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UpdatedOn } from "@/components/cards";
import { Wordmark, type WordmarkVariant } from "@/components/Logo";
import { ComicVineCredit, ReadingList } from "@/components/ReadingList";
import { RichText } from "@/components/RichText";
import { JsonLd } from "@/components/JsonLd";
import { BackLink, PageHeader } from "@/components/ui";
import { absoluteUrl, breadcrumbJsonLd, describe, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { getReadingOrder, getReadingOrderSlugs } from "@/sanity/data";
import type { ReadingOrder } from "@/sanity/types";

export const revalidate = 86400;

const orderWordmarks: Record<string, WordmarkVariant> = {
  "morrison-and-thorne-2018-2022": "the-green-lantern-2018",
};

export async function generateStaticParams() {
  const slugs = await getReadingOrderSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/comics/reading-orders/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const order = await getReadingOrder(slug);
  if (!order) return {};
  return pageMetadata({
    title: order.title,
    description: describe(order.tagline, order.lead),
    path: `/comics/reading-orders/${slug}`,
  });
}

function readingOrderJsonLd(order: ReadingOrder) {
  const entries = order.sections?.flatMap((s) => s.entries ?? []) ?? [];
  const list = {
    "@type": "ItemList",
    name: order.title,
    description: describe(order.tagline, order.lead),
    url: absoluteUrl(`/comics/reading-orders/${order.slug}`),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.issues ? `${entry.title}, ${entry.issues}` : entry.title,
      ...(entry.arc ? { url: absoluteUrl(`/comics/arcs/${entry.arc.slug}`) } : {}),
    })),
  };
  return webPageJsonLd({
    path: `/comics/reading-orders/${order.slug}`,
    name: order.title,
    dateModified: order._updatedAt,
    mainEntity: list,
  });
}

export default async function ReadingOrderPage({
  params,
}: PageProps<"/comics/reading-orders/[slug]">) {
  const { slug } = await params;
  const order = await getReadingOrder(slug);
  if (!order) notFound();

  let counter = 1;
  const wordmark = orderWordmarks[slug];

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd
        data={[
          readingOrderJsonLd(order),
          breadcrumbJsonLd([
            { name: "Comics guide", path: "/comics" },
            { name: order.title, path: `/comics/reading-orders/${order.slug}` },
          ]),
        ]}
      />
      <BackLink href="/comics">Comics guide</BackLink>
      {wordmark ? <Wordmark variant={wordmark} className="mt-8 w-full max-w-xs" /> : null}
      <div className="mt-6">
        <PageHeader eyebrow="Reading order" title={order.title} intro={order.tagline}>
          <UpdatedOn iso={order._updatedAt} className="mt-4" />
        </PageHeader>
      </div>
      <RichText value={order.intro} />
      <div className="mt-10 space-y-12">
        {order.sections?.map((section) => {
          const entries = section.entries ?? [];
          const start = counter;
          counter += entries.length;
          return (
            <section key={section._key}>
              <h2 className="font-display text-2xl font-black">{section.title}</h2>
              {section.note ? <p className="mt-1 mb-4 text-muted">{section.note}</p> : <div className="mb-4" />}
              <ReadingList entries={entries} startAt={start} />
            </section>
          );
        })}
      </div>
      <ComicVineCredit entries={order.sections?.flatMap((s) => s.entries ?? []) ?? []} />
    </div>
  );
}
