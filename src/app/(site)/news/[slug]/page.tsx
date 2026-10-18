import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, formatDate } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { RichText } from "@/components/RichText";
import { Thumb } from "@/components/Thumb";
import { BackLink, SectionTitle, Tag } from "@/components/ui";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  describe,
  organizationId,
  pageMetadata,
  shareImage,
} from "@/lib/seo";
import { getArticle, getArticleSlugs } from "@/sanity/data";
import type { Article } from "@/sanity/types";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    type: "article",
    title: article.title,
    description: describe(article.excerpt, article.lead),
    path: `/news/${slug}`,
    image: article.mainImage,
    publishedTime: article.publishedAt,
    modifiedTime: article._updatedAt,
    authors: article.author ? [absoluteUrl(`/authors/${article.author.slug}`)] : undefined,
    section: article.category?.title,
    tags: article.tags,
  });
}

function articleJsonLd(article: Article) {
  const url = absoluteUrl(`/news/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: article.title,
    description: describe(article.excerpt, article.lead),
    image: article.mainImage?.asset ? [shareImage(article.mainImage).url] : undefined,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt ?? article.publishedAt,
    articleSection: article.category?.title,
    keywords: article.tags,
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.name,
          url: absoluteUrl(`/authors/${article.author.slug}`),
        }
      : { "@id": organizationId },
    publisher: { "@id": organizationId },
    isAccessibleForFree: true,
    inLanguage: "en",
  };
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <article>
      <JsonLd
        data={[
          articleJsonLd(article),
          breadcrumbJsonLd([
            { name: "News", path: "/news" },
            ...(article.category
              ? [{ name: article.category.title, path: `/category/${article.category.slug}` }]
              : []),
            { name: article.title, path: `/news/${article.slug}` },
          ]),
        ]}
      />
      <div className="mx-auto max-w-3xl">
        <BackLink href="/news">All news</BackLink>
        <header className="mt-6 mb-8">
          {article.category ? (
            <Link
              href={`/category/${article.category.slug}`}
              className="eyebrow hover:underline"
            >
              {article.category.title}
            </Link>
          ) : null}
          <h1 className="mt-3 font-display text-4xl font-black leading-tight sm:text-5xl">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="mt-4 text-lg text-muted">{article.excerpt}</p>
          ) : null}
          <p className="mt-4 text-sm text-muted">
            {article.author ? (
              <>
                By{" "}
                <Link
                  href={`/authors/${article.author.slug}`}
                  className="text-text transition-colors hover:text-glow"
                >
                  {article.author.name}
                </Link>
                {"  •  "}
              </>
            ) : null}
            {[
              formatDate(article.publishedAt),
              article.readMinutes ? `${article.readMinutes} min read` : null,
            ]
              .filter(Boolean)
              .join("  •  ")}
          </p>
        </header>

        {article.mainImage?.asset ? (
          <figure className="mb-10">
            <Thumb
              image={article.mainImage}
              aspect="aspect-video"
              className="rounded-lg border border-line"
              sizes="(min-width: 768px) 768px, 100vw"
              width={1400}
              priority
            />
            {article.mainImage.caption || article.mainImage.credit ? (
              <figcaption className="mt-2 text-sm text-muted">
                {[article.mainImage.caption, article.mainImage.credit]
                  .filter(Boolean)
                  .join("  •  ")}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <RichText value={article.body} />

        {article.tags && article.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ) : null}
      </div>

      {article.related && article.related.length > 0 ? (
        <section className="mt-16">
          <SectionTitle>Keep reading</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {article.related.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
