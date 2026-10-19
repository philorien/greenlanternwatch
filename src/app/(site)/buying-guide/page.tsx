import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LogoMark } from "@/components/Logo";
import { PageHeader, SectionTitle } from "@/components/ui";
import { buySections, buyingGuideEditions, featured, type Edition } from "@/content/buying-guide";
import { amazonUrl, externalRel } from "@/lib/affiliate";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "The collected Green Lantern editions worth buying, from Geoff Johns's omnibus to a single book you can read on its own.";

export const metadata: Metadata = pageMetadata({
  title: "Buying guide",
  description,
  path: "/buying-guide",
});

const jumpLinks = [
  { id: featured.id, title: "The one to buy" },
  ...buySections.map((section) => ({ id: section.id, title: section.title })),
];

function Cover({ edition, sizes, className }: { edition: Edition; sizes: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-sm border border-line bg-surface-2 ${className ?? ""}`}>
      {edition.cover ? (
        <Image
          src={edition.cover}
          alt=""
          width={400}
          height={600}
          sizes={sizes}
          className="h-auto w-full"
        />
      ) : (
        <div aria-hidden className="flex aspect-[2/3] items-center justify-center bg-surface">
          <LogoMark className="size-1/2 opacity-25" />
        </div>
      )}
    </div>
  );
}

function BuyLink({ edition, prominent = false }: { edition: Edition; prominent?: boolean }) {
  const href = amazonUrl(edition.asin);
  return (
    <a
      href={href}
      target="_blank"
      rel={externalRel(href)}
      className={
        prominent
          ? "inline-flex items-center rounded-full border border-glow px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-glow transition-colors hover:bg-glow hover:text-ink"
          : "inline-flex items-center py-2 font-display text-xs font-bold uppercase tracking-wider text-glow hover:underline"
      }
    >
      Buy on Amazon
      <span className="sr-only">
        : {edition.title} (opens in a new tab)
      </span>
    </a>
  );
}

function OrderLink({ edition }: { edition: Edition }) {
  if (!edition.orderHref || !edition.orderLabel) return null;
  return (
    <Link href={edition.orderHref} className="text-sm text-muted hover:text-glow">
      {edition.orderLabel}
    </Link>
  );
}

function itemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Green Lantern buying guide",
    description,
    url: absoluteUrl("/buying-guide"),
    numberOfItems: buyingGuideEditions.length,
    itemListElement: buyingGuideEditions.map((edition, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: edition.title,
      url: absoluteUrl(`/buying-guide#${edition.id}`),
    })),
  };
}

export default function BuyingGuidePage() {
  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd(),
          breadcrumbJsonLd([{ name: "Buying guide", path: "/buying-guide" }]),
        ]}
      />
      <PageHeader
        eyebrow="Buying guide"
        title="What to buy"
        intro="The collected editions worth paying for. One clear first buy, then the books that stand on their own, then the ones for a specific Lantern."
      />

      <p className="-mt-4 mb-8 max-w-3xl text-sm leading-relaxed text-muted">
        Amazon links on this page are affiliate links. As an Amazon Associate,
        Green Lantern Watch earns from qualifying purchases, at no extra cost
        to you. Printings sell through. If a link opens another edition of the
        same book, it is still the one we mean.
      </p>

      <nav aria-label="Guide sections" className="mb-14 flex max-w-3xl flex-wrap gap-x-6 gap-y-2">
        {jumpLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="font-display text-xs font-bold uppercase tracking-wider text-muted hover:text-glow"
          >
            {link.title}
          </a>
        ))}
      </nav>

      <section
        id={featured.id}
        className="panel mb-16 max-w-3xl scroll-mt-28 bg-[radial-gradient(circle_at_85%_0%,rgb(34_179_78/0.18),transparent_60%)] p-6 sm:p-8"
      >
        <div className="flex gap-5 sm:gap-8">
          <Cover edition={featured} sizes="160px" className="w-24 shrink-0 self-start sm:w-40" />
          <div className="min-w-0">
            <p className="eyebrow">The one to buy</p>
            <h2 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {featured.by} · {featured.format}
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed">{featured.why}</p>
            {featured.collects ? (
              <p className="mt-3 max-w-2xl text-sm text-muted">{featured.collects}</p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <BuyLink edition={featured} prominent />
              <OrderLink edition={featured} />
            </div>
          </div>
        </div>
      </section>

      {buySections.map((section) => (
        <section key={section.id} id={section.id} className="mb-16 max-w-3xl scroll-mt-28">
          <SectionTitle>{section.title}</SectionTitle>
          <p className="mb-2 max-w-2xl text-muted">{section.lede}</p>
          <ol className="divide-y divide-line border-b border-line">
            {section.editions.map((edition) => (
              <li
                key={edition.id}
                id={edition.id}
                className="grid scroll-mt-28 grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5"
              >
                <Cover edition={edition} sizes="104px" className="w-full self-start" />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-extrabold leading-snug sm:text-2xl">
                    {edition.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {edition.by} · {edition.format}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed">{edition.why}</p>
                  {edition.collects ? (
                    <p className="mt-2 max-w-2xl text-sm text-muted">{edition.collects}</p>
                  ) : null}
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    <BuyLink edition={edition} />
                    <OrderLink edition={edition} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className="max-w-3xl text-xs text-muted">
        Covers from{" "}
        <a
          href="https://comicvine.gamespot.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-glow"
        >
          ComicVine
        </a>
        .
      </p>
    </>
  );
}
