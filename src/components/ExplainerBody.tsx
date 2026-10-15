import Image from "next/image";
import type { ExplainerBlock, ExplainerSection } from "@/content/explainers";
import { urlFor } from "@/sanity/image";
import type { SanityImage } from "@/sanity/types";

function Thesis({ kicker, text }: { kicker: string; text: string }) {
  return (
    <p className="border-l-[3px] border-glow-dim pl-5">
      <span className="eyebrow mb-2 block">{kicker}</span>
      <span className="block font-display text-xl font-extrabold leading-snug text-text sm:text-2xl">
        {text}
      </span>
    </p>
  );
}

function Timeline({
  caption,
  rows,
}: {
  caption: string;
  rows: { when: string; what: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <caption className="mb-3 text-left text-sm text-muted">{caption}</caption>
        <thead>
          <tr className="border-b border-line">
            <th
              scope="col"
              className="w-28 pb-2 pr-6 font-display text-xs font-bold uppercase tracking-wider text-muted"
            >
              When
            </th>
            <th
              scope="col"
              className="pb-2 font-display text-xs font-bold uppercase tracking-wider text-muted"
            >
              What happened
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.when} className="border-b border-line">
              <th
                scope="row"
                className="py-4 pr-6 align-top font-display text-sm font-bold tabular-nums text-text"
              >
                {row.when}
              </th>
              <td className="py-4 align-top text-[0.975rem] leading-relaxed">{row.what}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Compare({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: [string, string];
  rows: { label: string; left: string; right: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="w-[22%] py-3 pr-3 sm:w-36 sm:pr-4">
              <span className="sr-only">Compared</span>
            </th>
            <th scope="col" className="w-[39%] py-3 pr-3 font-display text-base font-extrabold text-text sm:pr-6">
              {columns[0]}
            </th>
            <th scope="col" className="py-3 font-display text-base font-extrabold text-text">
              {columns[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line">
              <th
                scope="row"
                className="py-3 pr-3 align-top font-display text-sm font-bold text-text sm:pr-4"
              >
                {row.label}
              </th>
              <td className="py-3 pr-3 align-top leading-relaxed sm:pr-6">{row.left}</td>
              <td className="py-3 align-top leading-relaxed">{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Shown at its own shape. Sanity asset IDs carry the size, for example image-…-842x230-webp. */
function Figure({ image }: { image: SanityImage }) {
  const size = image.asset?._ref.match(/-(\d+)x(\d+)-\w+$/);
  if (!size) return null;
  return (
    <figure>
      <Image
        src={urlFor(image).auto("format").url()}
        alt={image.alt ?? ""}
        width={Number(size[1])}
        height={Number(size[2])}
        sizes="(min-width: 768px) 768px, 100vw"
        className="h-auto w-full rounded-lg border border-line"
      />
      {image.caption || image.credit ? (
        <figcaption className="mt-2 text-sm text-muted">
          {[image.caption, image.credit].filter(Boolean).join("  •  ")}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ReadingList({ items }: { items: { title: string; note: string }[] }) {
  return (
    <ol className="list-none border-b border-line pl-0">
      {items.map((item, index) => (
        <li
          key={item.title}
          className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-t border-line py-4 sm:grid-cols-[2.75rem_minmax(0,1fr)]"
        >
          <span aria-hidden className="pt-0.5 font-display text-sm font-black tabular-nums text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="font-display text-lg font-extrabold leading-snug text-text">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Block({ block }: { block: ExplainerBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "points":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item.lead}>
              <strong className="font-semibold text-text">{item.lead}</strong> {item.text}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "thesis":
      return <Thesis kicker={block.kicker} text={block.text} />;
    case "timeline":
      return <Timeline caption={block.caption} rows={block.rows} />;
    case "terms":
      return (
        <dl className="border-b border-line">
          {block.items.map((item) => (
            <div
              key={item.term}
              className="grid gap-1 border-t border-line py-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-6"
            >
              <dt>
                <span className="font-display text-lg font-extrabold text-text">{item.term}</span>
                {item.qualifier ? (
                  <span className="mt-0.5 block text-sm text-muted">{item.qualifier}</span>
                ) : null}
              </dt>
              <dd>{item.definition}</dd>
            </div>
          ))}
        </dl>
      );
    case "compare":
      return <Compare caption={block.caption} columns={block.columns} rows={block.rows} />;
    case "reading":
      return <ReadingList items={block.items} />;
    case "image":
      return <Figure image={block.image} />;
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}

const proseTypes = new Set<ExplainerBlock["type"]>(["paragraph", "points", "steps"]);

type BlockRun =
  | { kind: "prose"; blocks: ExplainerBlock[] }
  | { kind: "block"; block: ExplainerBlock };

function blockRuns(blocks: ExplainerBlock[]): BlockRun[] {
  const runs: BlockRun[] = [];
  for (const block of blocks) {
    const last = runs.at(-1);
    if (proseTypes.has(block.type) && last?.kind === "prose") {
      last.blocks.push(block);
    } else if (proseTypes.has(block.type)) {
      runs.push({ kind: "prose", blocks: [block] });
    } else {
      runs.push({ kind: "block", block });
    }
  }
  return runs;
}

export function ExplainerBody({ sections }: { sections: ExplainerSection[] }) {
  return (
    <div className="space-y-14">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-28"
          aria-labelledby={`${section.id}-title`}
        >
          <h2
            id={`${section.id}-title`}
            className="font-display text-[1.6rem] font-black leading-tight text-text"
          >
            {section.title}
          </h2>
          <div className="mt-4 space-y-6">
            {blockRuns(section.blocks).map((run, index) =>
              run.kind === "prose" ? (
                <div key={index} className="rich-text">
                  {run.blocks.map((block, blockIndex) => (
                    <Block key={blockIndex} block={block} />
                  ))}
                </div>
              ) : (
                <Block key={index} block={run.block} />
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
