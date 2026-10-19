import Image from "next/image";
import Link from "next/link";
import { externalRel, isAmazonLink } from "@/lib/affiliate";
import { urlFor } from "@/sanity/image";
import type { ReadingEntry } from "@/sanity/types";

const formatLabel = {
  issues: "Single issues",
  collected: "Collected edition",
  event: "Event",
} as const;

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function releaseSpan(start?: string, end?: string) {
  if (!start) return null;
  const from = monthYear.format(new Date(start));
  const to = end ? monthYear.format(new Date(end)) : from;
  return from === to ? from : `${from} to ${to}`;
}

function credits(entry: ReadingEntry) {
  return [
    entry.writers?.length ? `Writer${entry.writers.length > 1 ? "s" : ""}: ${entry.writers.join(", ")}` : null,
    entry.artists?.length ? `Art: ${entry.artists.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("  •  ");
}

export function ComicVineCredit({ entries }: { entries: ReadingEntry[] }) {
  if (!entries.some((e) => e.comicVineUrl)) return null;
  return (
    <p className="mt-10 text-xs text-muted">
      Covers and issue details from{" "}
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
  );
}

export function ReadingList({
  entries,
  startAt = 1,
}: {
  entries: ReadingEntry[];
  startAt?: number;
}) {
  return (
    <ol className="space-y-3">
      {entries.map((entry, i) => {
        const coverSrc = entry.cover?.asset
          ? urlFor(entry.cover).width(160).auto("format").url()
          : null;
        const creditLine = credits(entry);
        return (
          <li key={entry._key} className="panel flex gap-4 p-4">
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full border border-glow-dim font-display text-sm font-extrabold text-glow"
            >
              {startAt + i}
            </span>
            {coverSrc ? (
              <div className="relative aspect-[2/3] w-16 shrink-0 self-start overflow-hidden rounded border border-line bg-surface-2 sm:w-20">
                <Image
                  src={coverSrc}
                  alt={entry.cover?.alt ?? ""}
                  fill
                  sizes="(min-width: 640px) 80px, 64px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold">{entry.title}</h3>
              <p className="mt-0.5 text-sm text-muted">
                {[
                  entry.issues,
                  releaseSpan(entry.releaseStart, entry.releaseEnd),
                  entry.format ? formatLabel[entry.format] : null,
                ]
                  .filter(Boolean)
                  .join("  •  ")}
              </p>
              {creditLine ? <p className="mt-1 text-sm text-text/75">{creditLine}</p> : null}
              {entry.note ? <p className="mt-2 text-sm text-text/85">{entry.note}</p> : null}
              {entry.arc || entry.buyLink || entry.comicVineUrl ? (
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {entry.arc ? (
                    <Link
                      href={`/comics/arcs/${entry.arc.slug}`}
                      className="text-glow hover:underline"
                    >
                      Arc guide: {entry.arc.title} &rarr;
                    </Link>
                  ) : null}
                  {entry.buyLink ? (
                    <a
                      href={entry.buyLink}
                      target="_blank"
                      rel={externalRel(entry.buyLink)}
                      className="text-glow hover:underline"
                    >
                      {isAmazonLink(entry.buyLink) ? "Buy on Amazon" : "Buy the collected edition"} &#8599;
                    </a>
                  ) : null}
                  {entry.comicVineUrl ? (
                    <a
                      href={entry.comicVineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition-colors hover:text-glow"
                    >
                      ComicVine &#8599;
                    </a>
                  ) : null}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
