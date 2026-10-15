import { explainerReadMinutes, type Explainer } from "@/content/explainers";
import type { ArticleSummary } from "@/sanity/types";

export type ListedFeature =
  | { kind: "article"; publishedAt: string; article: ArticleSummary }
  | { kind: "explainer"; publishedAt: string; explainer: Explainer; readMinutes: number };

/** Feature articles and explainers, newest first. Explainers are a kind of feature. */
export function listFeatures(
  articles: ArticleSummary[],
  explainers: Explainer[],
  limit?: number,
): ListedFeature[] {
  const items: ListedFeature[] = [
    ...articles.map((article) => ({
      kind: "article" as const,
      publishedAt: article.publishedAt,
      article,
    })),
    ...explainers.map((explainer) => ({
      kind: "explainer" as const,
      publishedAt: explainer.publishedAt,
      explainer,
      readMinutes: explainerReadMinutes(explainer),
    })),
  ];
  items.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0));
  return limit ? items.slice(0, limit) : items;
}
