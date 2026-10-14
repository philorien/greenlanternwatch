import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/cards";
import { RichText } from "@/components/RichText";
import { Socials } from "@/components/Socials";
import { Thumb } from "@/components/Thumb";
import { EmptyState, SectionTitle } from "@/components/ui";
import { getAuthorPage, getAuthorSlugs } from "@/sanity/data";

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
  return { title: author.name, description: author.bioText?.split("\n")[0] };
}

export default async function AuthorPage({ params }: PageProps<"/authors/[slug]">) {
  const { slug } = await params;
  const { author, articles } = await getAuthorPage(slug);
  if (!author) notFound();

  return (
    <>
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
