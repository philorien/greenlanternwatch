import Link from "next/link";
import type { ReadingEntry } from "@/sanity/types";

const formatLabel = {
  issues: "Single issues",
  collected: "Collected edition",
  event: "Event",
} as const;

export function ReadingList({
  entries,
  startAt = 1,
}: {
  entries: ReadingEntry[];
  startAt?: number;
}) {
  return (
    <ol className="space-y-3">
      {entries.map((entry, i) => (
        <li key={entry._key} className="panel flex gap-4 p-4">
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-full border border-glow-dim font-display text-sm font-extrabold text-glow"
          >
            {startAt + i}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold">{entry.title}</h3>
            <p className="mt-0.5 text-sm text-muted">
              {[entry.issues, entry.format ? formatLabel[entry.format] : null]
                .filter(Boolean)
                .join("  •  ")}
            </p>
            {entry.note ? <p className="mt-2 text-sm text-text/85">{entry.note}</p> : null}
            {entry.arc ? (
              <Link
                href={`/comics/arcs/${entry.arc.slug}`}
                className="mt-2 inline-block text-sm text-glow hover:underline"
              >
                Arc guide: {entry.arc.title} &rarr;
              </Link>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
