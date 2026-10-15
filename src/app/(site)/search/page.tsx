import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/ui";
import { search } from "@/sanity/data";
import { pathFor } from "@/sanity/paths";
import type { SearchHit } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

const typeLabel: Record<SearchHit["_type"], string> = {
  article: "Article",
  explainer: "Feature",
  character: "Character",
  storyArc: "Story arc",
  readingOrder: "Reading order",
  corps: "Corps",
};

const hrefFor = (hit: SearchHit) => pathFor(hit._type, hit.slug);

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = (await searchParams).q;
  const term = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  const hits = term ? await search(term) : [];
  const results = hits.map((hit) => ({
    key: hit._id,
    href: hrefFor(hit),
    type: typeLabel[hit._type],
    title: hit.title,
    excerpt: hit.excerpt,
  }));

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

      {term && results.length === 0 ? (
        <EmptyState>No results for that search.</EmptyState>
      ) : null}

      <ul className="max-w-3xl space-y-3">
        {results.map((result) => (
          <li key={result.key}>
            <Link
              href={result.href}
              className="panel group block p-4 transition-colors hover:border-glow-dim"
            >
              <p className="eyebrow">{result.type}</p>
              <p className="font-display text-lg font-bold transition-colors group-hover:text-glow">
                {result.title}
              </p>
              {result.excerpt ? <p className="text-sm text-muted">{result.excerpt}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
