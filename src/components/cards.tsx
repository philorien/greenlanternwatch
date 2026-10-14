import Link from "next/link";
import type {
  ArticleSummary,
  CharacterSummary,
  CorpsSummary,
  ReadingOrderSummary,
  StoryArcSummary,
} from "@/sanity/types";
import { SpectrumDot } from "./ui";
import { Thumb } from "./Thumb";
import { TimeAgo } from "./TimeAgo";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function yearSpan(start?: number, end?: number) {
  if (!start) return null;
  return end && end !== start ? `${start} to ${end}` : `${start}`;
}

export function CategoryLabel({ children }: { children: string }) {
  return <p className="eyebrow">{children}</p>;
}

export function Byline({ article }: { article: ArticleSummary }) {
  const parts = [
    article.author ? `By ${article.author.name}` : null,
    article.readMinutes ? `${article.readMinutes} min read` : null,
  ].filter(Boolean);
  if (parts.length === 0) return null;
  return <p className="text-xs text-muted">{parts.join("  •  ")}</p>;
}

/** Standard article card: image on top, text below. */
export function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="panel group flex flex-col overflow-hidden transition-colors hover:border-glow-dim"
    >
      <Thumb
        image={article.mainImage}
        aspect="aspect-[16/9]"
        className="rounded-none"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        {article.category ? <CategoryLabel>{article.category.title}</CategoryLabel> : null}
        <h3 className="font-display text-lg font-bold leading-snug transition-colors group-hover:text-glow">
          {article.title}
        </h3>
        {article.excerpt ? (
          <p className="line-clamp-3 text-sm text-muted">{article.excerpt}</p>
        ) : null}
        <div className="mt-auto pt-2">
          <Byline article={article} />
        </div>
      </div>
    </Link>
  );
}

/** Compact row used in the Latest News sidebar. */
export function NewsRow({ article }: { article: ArticleSummary }) {
  return (
    <Link href={`/news/${article.slug}`} className="group flex gap-3">
      <Thumb
        image={article.mainImage}
        aspect="aspect-square"
        className="w-16 shrink-0 rounded-md"
        sizes="64px"
        width={160}
      />
      <div className="min-w-0">
        {article.category ? <CategoryLabel>{article.category.title}</CategoryLabel> : null}
        <p className="font-display text-sm font-bold leading-snug transition-colors group-hover:text-glow">
          {article.title}
        </p>
        <p className="mt-1 text-xs text-muted">
          <TimeAgo iso={article.publishedAt} fallback={formatDate(article.publishedAt)} />
        </p>
      </div>
    </Link>
  );
}

const coverageLabel = { review: "Review", preview: "Preview", recap: "Recap" } as const;

/** Portrait cover card for new-release coverage. */
export function ComicCoverageCard({ article }: { article: ArticleSummary }) {
  const rel = article.comicRelease;
  if (!rel) return null;
  return (
    <Link
      href={`/news/${article.slug}`}
      className="panel group flex flex-col gap-2 p-2.5 transition-colors hover:border-glow-dim"
    >
      <Thumb
        image={rel.cover ?? article.mainImage}
        aspect="aspect-[2/3]"
        className="rounded"
        sizes="(min-width: 1024px) 15vw, 40vw"
        width={400}
      />
      <p className="font-display text-sm font-bold leading-tight transition-colors group-hover:text-glow">
        {rel.title ?? article.title}
      </p>
      <p className="text-[0.7rem] text-muted">
        {[rel.publisher, rel.releaseDate ? formatDate(rel.releaseDate) : null]
          .filter(Boolean)
          .join("  •  ")}
      </p>
      {rel.coverageType ? (
        <span className="mt-auto w-fit rounded border border-glow-dim/60 bg-glow-dim/15 px-1.5 py-0.5 font-display text-[0.62rem] font-bold uppercase tracking-wider text-glow">
          {coverageLabel[rel.coverageType]}
        </span>
      ) : null}
    </Link>
  );
}

export function CharacterCard({ character }: { character: CharacterSummary }) {
  return (
    <Link
      href={`/characters/${character.slug}`}
      className="panel group flex items-center gap-4 p-3 transition-colors hover:border-glow-dim"
    >
      <Thumb
        image={character.portrait}
        aspect="aspect-square"
        className="w-16 shrink-0 rounded-full"
        sizes="64px"
        width={160}
      />
      <div className="min-w-0">
        <h3 className="font-display text-base font-bold transition-colors group-hover:text-glow">
          {character.name}
        </h3>
        <p className="flex items-center gap-2 text-sm text-muted">
          {character.corps ? <SpectrumDot spectrum={character.corps.spectrum} /> : null}
          {[character.alias, character.corps?.name].filter(Boolean).join("  •  ")}
        </p>
      </div>
    </Link>
  );
}

export function CorpsCard({ corps }: { corps: CorpsSummary }) {
  return (
    <Link
      href={`/corps/${corps.slug}`}
      data-spectrum={corps.spectrum}
      className="panel group flex flex-col gap-1 border-l-4 border-l-[var(--spec)] p-4 transition-colors hover:border-glow-dim"
    >
      <p className="font-display text-xs font-bold uppercase tracking-wider text-[var(--spec)]">
        {corps.emotion}
      </p>
      <h3 className="font-display text-lg font-bold transition-colors group-hover:text-glow">
        {corps.name}
      </h3>
      {corps.tagline ? <p className="text-sm text-muted">{corps.tagline}</p> : null}
    </Link>
  );
}

const audienceLabel = {
  "new-reader": "New readers",
  era: "Era guide",
  character: "Character guide",
} as const;

export function ReadingOrderCard({ order }: { order: ReadingOrderSummary }) {
  return (
    <Link
      href={`/comics/reading-orders/${order.slug}`}
      className="panel group flex flex-col gap-2 p-5 transition-colors hover:border-glow-dim"
    >
      <p className="eyebrow">{audienceLabel[order.audience]}</p>
      <h3 className="font-display text-lg font-bold leading-snug transition-colors group-hover:text-glow">
        {order.title}
      </h3>
      {order.tagline ? <p className="text-sm text-muted">{order.tagline}</p> : null}
      {order.entryCount ? (
        <p className="mt-auto pt-2 text-xs text-muted">{order.entryCount} entries</p>
      ) : null}
    </Link>
  );
}

const arcKind = { event: "Event", run: "Creative run", storyline: "Storyline" } as const;

export function StoryArcCard({ arc }: { arc: StoryArcSummary }) {
  const years = yearSpan(arc.startYear, arc.endYear);
  return (
    <Link
      href={`/comics/arcs/${arc.slug}`}
      className="panel group flex gap-4 p-3 transition-colors hover:border-glow-dim"
    >
      <Thumb
        image={arc.cover}
        aspect="aspect-[2/3]"
        className="w-20 shrink-0 rounded"
        sizes="80px"
        width={240}
      />
      <div className="flex min-w-0 flex-col gap-1">
        {arc.kind ? <p className="eyebrow">{arcKind[arc.kind]}</p> : null}
        <h3 className="font-display text-base font-bold leading-snug transition-colors group-hover:text-glow">
          {arc.title}
        </h3>
        {arc.tagline ? <p className="line-clamp-2 text-sm text-muted">{arc.tagline}</p> : null}
        <p className="mt-auto text-xs text-muted">
          {[arc.creators?.join(", "), years].filter(Boolean).join("  •  ")}
        </p>
      </div>
    </Link>
  );
}
