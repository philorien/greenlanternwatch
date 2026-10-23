import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard, ExplainerCard } from "@/components/cards";
import { EmptyState, PageHeader } from "@/components/ui";
import { listFeatures } from "@/lib/features";
import { categoryLabel } from "@/lib/labels";
import { describe, pageMetadata } from "@/lib/seo";
import { getCategoryPage, getCategorySlugs, getExplainers } from "@/sanity/data";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getCategorySlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getCategoryPage(slug);
  if (!category) return {};
  const title = categoryLabel(category) ?? category.title;
  return pageMetadata({
    title,
    description: describe(category.description, `Green Lantern ${title.toLowerCase()} from Green Lantern Watch.`),
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const [{ category, articles }, explainers] = await Promise.all([
    getCategoryPage(slug),
    slug === "features" ? getExplainers() : Promise.resolve([]),
  ]);
  if (!category) notFound();
  const title = categoryLabel(category) ?? category.title;

  const features = slug === "features" ? listFeatures(articles, explainers) : null;
  const isEmpty = features ? features.length === 0 : articles.length === 0;

  return (
    <>
      <PageHeader
        eyebrow={title === "News" ? undefined : "Category"}
        title={title}
        intro={category.description}
      />
      {isEmpty ? (
        <EmptyState>Nothing in this category yet.</EmptyState>
      ) : features ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((item) =>
            item.kind === "article" ? (
              <ArticleCard key={item.article._id} article={item.article} />
            ) : (
              <ExplainerCard
                key={item.explainer.slug}
                explainer={item.explainer}
                readMinutes={item.readMinutes}
              />
            ),
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      )}
    </>
  );
}
