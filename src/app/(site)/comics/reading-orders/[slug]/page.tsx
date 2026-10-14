import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingList } from "@/components/ReadingList";
import { RichText } from "@/components/RichText";
import { BackLink, PageHeader } from "@/components/ui";
import { getReadingOrder, getReadingOrderSlugs } from "@/sanity/data";

export const revalidate = 60;

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
  return { title: order.title, description: order.tagline };
}

export default async function ReadingOrderPage({
  params,
}: PageProps<"/comics/reading-orders/[slug]">) {
  const { slug } = await params;
  const order = await getReadingOrder(slug);
  if (!order) notFound();

  let counter = 1;

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/comics">Comics guide</BackLink>
      <div className="mt-6">
        <PageHeader eyebrow="Reading order" title={order.title} intro={order.tagline} />
      </div>
      <RichText value={order.intro} />
      <div className="mt-10 space-y-12">
        {order.sections?.map((section) => {
          const entries = section.entries ?? [];
          const start = counter;
          counter += entries.length;
          return (
            <section key={section._key}>
              <h2 className="font-display text-2xl font-extrabold">{section.title}</h2>
              {section.note ? <p className="mt-1 mb-4 text-muted">{section.note}</p> : <div className="mb-4" />}
              <ReadingList entries={entries} startAt={start} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
