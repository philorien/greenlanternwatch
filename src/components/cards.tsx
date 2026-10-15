import Link from "next/link";
import type { Explainer } from "@/content/explainers";
import type {
  ArticleSummary,
  CharacterSummary,
  ComicIssue,
  CorpsSummary,
  KeyIssue,
  ReadingOrderSummary,
  StoryArcSummary,
} from "@/sanity/types";
import { CorpsSymbol } from "./Logo";
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

/** Same card as an article, for an explainer filed under Features. */
export function ExplainerCard({
  explainer,
  readMinutes,
}: {
  explainer: Explainer;
  readMinutes?: number;
}) {
  return (
    <Link
      href={`/explainers/${explainer.slug}`}
      className="panel group flex flex-col overflow-hidden transition-colors hover:border-glow-dim"
    >
      <Thumb
        image={explainer.mainImage}
        aspect="aspect-[16/9]"
        className="rounded-none"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <CategoryLabel>Features</CategoryLabel>
        <h3 className="font-display text-lg font-bold leading-snug transition-colors group-hover:text-glow">
          {explainer.title}
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{explainer.dek}</p>
        <div className="mt-auto pt-2">
          <p className="text-xs text-muted">
            {[explainer.author ? `By ${explainer.author.name}` : null, readMinutes ? `${readMinutes} min read` : null]
              .filter(Boolean)
              .join("  •  ")}
          </p>
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

/** Portrait cover card for a new issue. Links to our coverage if there is any, else ComicVine. */
export function ComicIssueCard({ issue }: { issue: ComicIssue }) {
  const review = issue.coverage?.slug;
  const className = "panel group flex flex-col gap-2 p-2.5 transition-colors hover:border-glow-dim";
  const body = (
    <>
      <Thumb
        image={issue.cover}
        aspect="aspect-[2/3]"
        className="rounded"
        sizes="(min-width: 1024px) 15vw, 40vw"
        width={400}
      />
      <p className="font-display text-sm font-bold leading-tight transition-colors group-hover:text-glow">
        {issue.title}
      </p>
      {issue.storyTitle ? <p className="line-clamp-2 text-xs text-muted">{issue.storyTitle}</p> : null}
      <p className="text-[0.7rem] text-muted">
        {[issue.writers?.[0], formatDate(issue.releaseDate)].filter(Boolean).join("  •  ")}
      </p>
      {issue.coverage?.coverageType ? (
        <span className="mt-auto w-fit rounded border border-glow-dim/60 bg-glow-dim/15 px-1.5 py-0.5 font-display text-[0.62rem] font-bold uppercase tracking-wider text-glow">
          {coverageLabel[issue.coverage.coverageType]}
        </span>
      ) : null}
    </>
  );
  if (review) {
    return (
      <Link href={`/news/${review}`} className={className}>
        {body}
      </Link>
    );
  }
  if (issue.comicVineUrl) {
    return (
      <a href={issue.comicVineUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }
  return <div className={className}>{body}</div>;
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
      className="panel group flex items-start gap-4 border-l-4 border-l-[var(--spec)] p-4 transition-colors hover:border-glow-dim"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-display text-xs font-bold uppercase tracking-wider text-[var(--spec)]">
          {corps.emotion}
        </p>
        <h3 className="font-display text-lg font-bold transition-colors group-hover:text-glow">
          {corps.name}
        </h3>
        {corps.tagline ? <p className="text-sm text-muted">{corps.tagline}</p> : null}
      </div>
      <CorpsSymbol spectrum={corps.spectrum} className="size-12 shrink-0" />
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

const keyIssueKind = {
  "first-appearance": "First appearance",
  origin: "Origin",
  "villain-debut": "Villain debut",
  "historic-ring": "Historic ring",
  milestone: "Milestone",
} as const;

/** Key issue card. `except` drops a character from the list, on that character's own page. */
export function KeyIssueCard({ issue, except }: { issue: KeyIssue; except?: string }) {
  const characters = issue.characters?.filter((c) => c.slug !== except) ?? [];
  return (
    <article className="panel flex gap-4 p-4">
      <Thumb
        image={issue.cover}
        aspect="aspect-[2/3]"
        className="w-20 shrink-0 rounded"
        sizes="80px"
        width={240}
      />
      <div className="min-w-0">
        <p className="eyebrow">{keyIssueKind[issue.kind]}</p>
        <h3 className="font-display text-base font-bold">
          {issue.title}
          {issue.publicationYear ? (
            <span className="font-normal text-muted"> ({issue.publicationYear})</span>
          ) : null}
        </h3>
        <p className="mt-2 text-sm text-text/85">{issue.whyItMatters}</p>
        {characters.length > 0 ? (
          <p className="mt-2 text-xs text-muted">
            {characters.map((c, i) => (
              <span key={c.slug}>
                {i > 0 ? ", " : ""}
                <Link href={`/characters/${c.slug}`} className="text-glow hover:underline">
                  {c.name}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </article>
  );
}
