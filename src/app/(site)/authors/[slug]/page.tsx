import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { RichText } from "@/components/RichText";
import { Socials } from "@/components/Socials";
import { Thumb } from "@/components/Thumb";
import { EmptyState, SectionTitle } from "@/components/ui";
import { absoluteUrl, describe, organizationId, pageMetadata, shareImage } from "@/lib/seo";
import { getAuthorPage, getAuthorSlugs } from "@/sanity/data";
import type { Author } from "@/sanity/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAuthorSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/authors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { author } = await getAuthorPage(slug);
  if (!author) return {};
  return pageMetadata({
    type: "profile",
    title: author.name,
    description: describe(author.bioText, author.role ? `${author.role} at Green Lantern Watch.` : undefined),
    path: `/authors/${slug}`,
    image: author.avatar,
    imageFit: "fill",
  });
}

function authorJsonLd(author: Author) {
  const url = absoluteUrl(`/authors/${author.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    mainEntity: {
      "@type": "Person",
      "@id": `${url}#person`,
      name: author.name,
      url,
      jobTitle: author.role,
      description: describe(author.bioText),
      image: author.avatar?.asset ? shareImage(author.avatar, author.name, "fill").url : undefined,
      sameAs: Object.values(author.socials ?? {}).filter(Boolean),
      worksFor: { "@id": organizationId },
    },
  };
}

export default async function AuthorPage({ params }: PageProps<"/authors/[slug]">) {
  const { slug } = await params;
  const { author, articles } = await getAuthorPage(slug);
  if (!author) notFound();

  return (
    <>
      <JsonLd data={authorJsonLd(author)} />
      <header className="mb-12 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-start">
        {author.avatar?.asset ? (
          <Thumb
            image={{ ...author.avatar, alt: author.avatar.alt ?? author.name }}
            aspect="aspect-square"
            className="w-32 shrink-0 rounded-full border border-line"
            sizes="128px"
            width={320}
            priority
          />
        ) : null}
        <div className="min-w-0">
          {author.role ? <p className="eyebrow mb-3">{author.role}</p> : null}
          <h1 className="font-display text-4xl font-black leading-tight sm:text-5xl">
            {author.name}
          </h1>
          {author.socials ? <Socials links={author.socials} showHandles className="mt-3" /> : null}
          <div className="mt-4">
            <RichText value={author.bio} />
          </div>
        </div>
      </header>

      <section>
        <SectionTitle>Articles by {author.name}</SectionTitle>
        {articles.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        ) : (
          <EmptyState>No articles yet.</EmptyState>
        )}
      </section>
    </>
  );
}
