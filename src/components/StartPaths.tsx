import Link from "next/link";
import type { CSSProperties } from "react";
import { readingSectionId } from "@/lib/reading-section";
import type { StartHere, StartPath } from "@/sanity/types";
import { Thumb } from "./Thumb";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const ease = "duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

// Covers behind the first one stand a little shorter and further right, like
// books on a shelf, and fan out a step more when the path is hovered.
const stack = [
  { left: "0rem", height: "100%", hover: "group-hover:-translate-y-2 group-focus-visible:-translate-y-2" },
  { left: "4.25rem", height: "90%", hover: "group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5" },
  { left: "7.75rem", height: "80%", hover: "group-hover:translate-x-3 group-focus-visible:translate-x-3" },
];

function CoverStack({ entries }: { entries: NonNullable<StartPath["entries"]> }) {
  const covers = entries.slice(0, stack.length);
  return (
    <div aria-hidden="true" className="relative h-44 border-b border-line sm:h-48">
      {covers.map((entry, index) => (
        <div
          key={`${entry.title}-${index}`}
          style={{ left: stack[index].left, height: stack[index].height, zIndex: stack.length - index }}
          className={cx(
            "absolute bottom-0 aspect-[2/3] transition-[transform,filter] motion-reduce:transform-none",
            ease,
            stack[index].hover,
            index === 0
              ? "shadow-[14px_0_22px_-12px_rgb(3_12_9/0.95)]"
              : "shadow-[10px_0_18px_-10px_rgb(3_12_9/0.9)] brightness-[0.62] group-hover:brightness-[0.85] group-focus-visible:brightness-[0.85]",
          )}
        >
          <Thumb
            image={entry.cover ? { ...entry.cover, alt: "" } : undefined}
            aspect="h-full w-full"
            className="rounded-[3px] ring-1 ring-line/80"
            sizes="8rem"
            width={320}
          />
        </div>
      ))}
    </div>
  );
}

/** The new-reader order's sections, as the first choice under the homepage hero. */
export function StartPaths({ order }: { order: StartHere | null }) {
  if (!order) return null;
  const href = `/comics/reading-orders/${order.slug}`;
  const sections = (order.sections ?? []).filter((section) => section.title);

  return (
    <section aria-labelledby="start-paths">
      <p className="eyebrow">New to Green Lantern?</p>
      <h2
        id="start-paths"
        className="mt-2 max-w-[26em] text-pretty font-display text-[clamp(1.45rem,2.3vw,1.9rem)] font-black leading-tight tracking-[-0.02em]"
      >
        {order.tagline ?? order.title}
      </h2>
      <Link
        href={href}
        className="mt-3 inline-block font-display text-xs font-bold uppercase tracking-[0.16em] text-glow underline-offset-4 hover:underline"
      >
        Full reading order <span aria-hidden="true">→</span>
      </Link>

      {sections.length > 0 ? (
        <ol
          style={{ "--paths": sections.length } as CSSProperties}
          className="-mx-4 mt-7 flex snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-[repeat(var(--paths),minmax(0,1fr))] sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((section) => {
            const entries = section.entries ?? [];
            const books = entries
              .map((entry) => entry.arcTitle ?? entry.title)
              .filter((name): name is string => Boolean(name));
            return (
              <li key={section._key} className="w-[78%] shrink-0 snap-start sm:w-auto">
                <Link
                  href={`${href}#${readingSectionId(section.title, section._key)}`}
                  className="group flex h-full flex-col"
                >
                  <CoverStack entries={entries} />
                  <div className="pr-6 pt-4">
                    <h3 className="font-display text-lg font-bold leading-snug tracking-[-0.01em] transition-colors group-hover:text-glow group-focus-visible:text-glow">
                      {section.title}
                    </h3>
                    {section.note ? (
                      <p className="mt-1 text-pretty text-sm leading-relaxed text-muted">{section.note}</p>
                    ) : null}
                    {books.length > 0 ? (
                      <p className="mt-2 text-sm leading-relaxed text-text/85">{books.join(" · ")}</p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}
