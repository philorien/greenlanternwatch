import type { Metadata } from "next";
import { ArticleCard } from "@/components/cards";
import { EmptyState, PageHeader } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { getNews } from "@/sanity/data";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "News",
  description: "Green Lantern news and coverage across TV, film and comics.",
  path: "/news",
});

export default async function NewsPage() {
  const articles = await getNews();
  return (
    <>
      <PageHeader
        eyebrow="News"
        title="The Central Battery Feed"
        intro="Breaking updates and coverage across the show, the films and the books."
      />
      {articles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
