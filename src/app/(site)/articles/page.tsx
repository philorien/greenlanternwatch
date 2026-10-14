import type { Metadata } from "next";
import { ArticleCard } from "@/components/cards";
import { EmptyState, PageHeader } from "@/components/ui";
import { sanityFetch } from "@/sanity/client";
import { ARTICLES_QUERY } from "@/sanity/queries";
import type { ArticleSummary } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "News",
  description: "Green Lantern news and features across TV, film and comics.",
};

export default async function ArticlesPage() {
  const articles = await sanityFetch<ArticleSummary[]>(
    ARTICLES_QUERY,
    {},
    [],
    ["article"],
  );

  return (
    <>
      <PageHeader
        eyebrow="News"
        title="News and features"
        intro="What is happening with the show, the movies and the books."
      />
      {articles.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      ) : (
        <EmptyState>Nothing published yet.</EmptyState>
      )}
    </>
  );
}
