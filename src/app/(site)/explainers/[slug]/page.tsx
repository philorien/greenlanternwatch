import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/cards";
import { ExplainerBody } from "@/components/ExplainerBody";
import { JsonLd } from "@/components/JsonLd";
import { BackLink } from "@/components/ui";
import { explainerReadMinutes } from "@/content/explainers";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  describe,
  organizationId,
  pageMetadata,
} from "@/lib/seo";
import { getExplainer, getExplainerSlugs } from "@/sanity/data";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getExplainerSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/explainers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const explainer = await getExplainer(slug);
  if (!explainer) return {};
  return pageMetadata({
    type: "article",
    title: explainer.title,
    description: describe(explainer.dek),
    path: `/explainers/${slug}`,
    publishedTime: explainer.publishedAt,
    section: "Features",
  });
}

export default async function ExplainerPage({ params }: PageProps<"/explainers/[slug]">) {
  const { slug } = await params;
  const explainer = await getExplainer(slug);
  if (!explainer) notFound();

  const url = absoluteUrl(`/explainers/${explainer.slug}`);

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `${url}#article`,
            mainEntityOfPage: url,
            headline: explainer.title,
            description: describe(explainer.dek),
            datePublished: explainer.publishedAt,
            articleSection: "Features",
            author: explainer.author
              ? {
                  "@type": "Person",
                  name: explainer.author.name,
                  url: explainer.author.slug
                    ? absoluteUrl(`/authors/${explainer.author.slug}`)
                    : undefined,
                }
              : { "@id": organizationId },
            publisher: { "@id": organizationId },
            isAccessibleForFree: true,
            inLanguage: "en",
          },
          breadcrumbJsonLd([
            { name: "Features", path: "/category/features" },
            { name: explainer.title, path: `/explainers/${explainer.slug}` },
          ]),
        ]}
      />
      <BackLink href="/category/features">Features</BackLink>
      <header className="mt-6 mb-8">
        <Link href="/category/features" className="eyebrow hover:underline">
          Features
        </Link>
        <h1 className="mt-3 font-display text-4xl font-black leading-tight sm:text-5xl">
          {explainer.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{explainer.dek}</p>
        <p className="mt-4 text-sm text-muted">
          {formatDate(explainer.publishedAt)}
          {explainer.author ? (
            <>
              {"  ·  "}
              {explainer.author.slug ? (
                <Link
                  href={`/authors/${explainer.author.slug}`}
                  className="text-text transition-colors hover:text-glow"
                >
                  {explainer.author.name}
                </Link>
              ) : (
                explainer.author.name
              )}
            </>
          ) : null}
          {"  ·  "}
          {explainerReadMinutes(explainer)} min read
        </p>
      </header>

      <nav aria-label="On this page" className="mb-14 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
        {explainer.sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="font-display text-xs font-bold uppercase tracking-wider text-muted hover:text-glow"
          >
            {section.title}
          </a>
        ))}
      </nav>

      <ExplainerBody sections={explainer.sections} />
    </article>
  );
}
