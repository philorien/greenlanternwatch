import Link from "next/link";
import type {
  ArticleSummary,
  CharacterSummary,
  ComicRunSummary,
} from "@/sanity/types";
import { SanityImage } from "./SanityImage";
import { Tag } from "./ui";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-glow-dim"
    >
      {article.mainImage?.asset ? (
        <SanityImage
          image={article.mainImage}
          width={640}
          height={360}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="aspect-video w-full bg-surface-2" aria-hidden />
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          {article.categories?.map((c) => (
            <Tag key={c.slug}>{c.title}</Tag>
          ))}
        </div>
        <h3 className="font-display text-xl leading-snug transition-colors group-hover:text-glow">
          {article.title}
        </h3>
        {article.excerpt ? (
          <p className="text-sm text-muted">{article.excerpt}</p>
        ) : null}
        <p className="mt-auto pt-2 text-xs text-muted">
          {formatDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  );
}

const tierLabel: Record<ComicRunSummary["tier"], string> = {
  essential: "Essential",
  recommended: "Recommended",
  "deep-cut": "Deep cut",
};

export function yearSpan(start?: number, end?: number) {
  if (!start) return null;
  return end && end !== start ? `${start} to ${end}` : `${start}`;
}

export function ComicRunCard({ run }: { run: ComicRunSummary }) {
  const years = yearSpan(run.startYear, run.endYear);
  return (
    <Link
      href={`/comics/${run.slug}`}
      className="group flex gap-4 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-glow-dim"
    >
      {run.cover?.asset ? (
        <SanityImage
          image={run.cover}
          width={96}
          height={144}
          className="h-36 w-24 shrink-0 rounded object-cover"
        />
      ) : (
        <div
          className="h-36 w-24 shrink-0 rounded bg-surface-2"
          aria-hidden
        />
      )}
      <div className="flex flex-col gap-2">
        <Tag>{tierLabel[run.tier]}</Tag>
        <h3 className="font-display text-lg leading-snug transition-colors group-hover:text-glow">
          {run.title}
        </h3>
        {run.tagline ? (
          <p className="text-sm text-muted">{run.tagline}</p>
        ) : null}
        <p className="mt-auto text-xs text-muted">
          {[run.creators?.join(", "), years].filter(Boolean).join(" / ")}
        </p>
      </div>
    </Link>
  );
}

export function CharacterCard({ character }: { character: CharacterSummary }) {
  return (
    <Link
      href={`/characters/${character.slug}`}
      className="group flex items-center gap-4 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-glow-dim"
    >
      {character.portrait?.asset ? (
        <SanityImage
          image={character.portrait}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="size-16 shrink-0 rounded-full bg-surface-2" aria-hidden />
      )}
      <div>
        <h3 className="font-display text-lg transition-colors group-hover:text-glow">
          {character.name}
        </h3>
        <p className="text-sm text-muted">
          {[character.alias, character.corps?.name].filter(Boolean).join(" / ")}
        </p>
      </div>
    </Link>
  );
}
