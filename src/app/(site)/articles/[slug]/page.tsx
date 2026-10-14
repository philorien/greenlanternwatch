import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/cards";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { Tag } from "@/components/ui";
import { sanityFetch } from "@/sanity/client";
import { ARTICLE_QUERY, ARTICLE_SLUGS_QUERY } from "@/sanity/queries";
import type { Article } from "@/sanity/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(
    ARTICLE_SLUGS_QUERY,
    {},
    [],
    ["article"],
  );
  return slugs.map(({ slug }) => ({ slug }));
}

async function getArticle(slug: string) {
  return sanityFetch<Article | null>(ARTICLE_QUERY, { slug }, null, ["article"]);
}

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/articles"
        className="text-sm text-muted transition-colors hover:text-glow"
      >
        &larr; All news
      </Link>
      <header className="mt-6 mb-10">
        <div className="mb-4 flex flex-wrap gap-2">
          {article.categories?.map((c) => (
            <Tag key={c.slug}>{c.title}</Tag>
          ))}
        </div>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          {article.title}
        </h1>
        {article.excerpt ? (
          <p className="mt-4 text-lg text-muted">{article.excerpt}</p>
        ) : null}
        <p className="mt-4 text-sm text-muted">
          {formatDate(article.publishedAt)}
        </p>
      </header>
      {article.mainImage?.asset ? (
        <figure className="mb-10">
          <SanityImage
            image={article.mainImage}
            width={1200}
            height={675}
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            className="aspect-video w-full rounded-lg border border-line object-cover"
          />
          {article.mainImage.caption ? (
            <figcaption className="mt-2 text-sm text-muted">
              {article.mainImage.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      <RichText value={article.body} />
    </article>
  );
}
