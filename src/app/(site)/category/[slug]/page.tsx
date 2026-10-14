import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/cards";
import { EmptyState, PageHeader } from "@/components/ui";
import { getCategoryPage, getCategorySlugs } from "@/sanity/data";

export const revalidate = 60;

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
  return { title: category.title, description: category.description };
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const { category, articles } = await getCategoryPage(slug);
  if (!category) notFound();

  return (
    <>
      <PageHeader eyebrow="Category" title={category.title} intro={category.description} />
      {articles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      ) : (
        <EmptyState>Nothing in this category yet.</EmptyState>
      )}
    </>
  );
}
