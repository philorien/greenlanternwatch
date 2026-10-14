import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/ui";
import { search } from "@/sanity/data";
import type { SearchHit } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

const typeLabel: Record<SearchHit["_type"], string> = {
  article: "Article",
  character: "Character",
  storyArc: "Story arc",
  readingOrder: "Reading order",
  corps: "Corps",
};

const hrefFor = (hit: SearchHit) => {
  switch (hit._type) {
    case "article":
      return `/news/${hit.slug}`;
    case "character":
      return `/characters/${hit.slug}`;
    case "storyArc":
      return `/comics/arcs/${hit.slug}`;
    case "readingOrder":
      return `/comics/reading-orders/${hit.slug}`;
    case "corps":
      return `/corps/${hit.slug}`;
  }
};

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = (await searchParams).q;
  const term = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  const hits = term ? await search(term) : [];

  return (
    <>
      <PageHeader eyebrow="Search" title="Search the site" />
      <form action="/search" className="mb-10 flex max-w-xl">
        <label htmlFor="q" className="sr-only">
          Search
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={term}
          placeholder="Articles, characters, arcs"
          className="min-w-0 flex-1 rounded-l-md border border-line bg-surface px-4 py-2.5 placeholder:text-muted focus:border-glow focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-r-md bg-glow px-5 py-2.5 font-display text-xs font-extrabold uppercase tracking-wider text-ink hover:bg-glow-dim"
        >
          Search
        </button>
      </form>

      {term && hits.length === 0 ? (
        <EmptyState>No results for that search.</EmptyState>
      ) : null}

      <ul className="max-w-3xl space-y-3">
        {hits.map((hit) => (
          <li key={hit._id}>
            <Link
              href={hrefFor(hit)}
              className="panel group block p-4 transition-colors hover:border-glow-dim"
            >
              <p className="eyebrow">{typeLabel[hit._type]}</p>
              <p className="font-display text-lg font-bold transition-colors group-hover:text-glow">
                {hit.title}
              </p>
              {hit.excerpt ? <p className="text-sm text-muted">{hit.excerpt}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
