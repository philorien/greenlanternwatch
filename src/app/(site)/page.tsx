import { ArticleCard, ComicCoverageCard } from "@/components/cards";
import { HeroCarousel, type HeroSlide } from "@/components/HeroCarousel";
import {
  CategoriesPanel,
  LatestNewsPanel,
  NewsletterPanel,
  SocialsPanel,
  StartHerePanel,
} from "@/components/Sidebar";
import { EmptyState, SectionTitle } from "@/components/ui";
import { getHome } from "@/sanity/data";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getHome();

  const slides: HeroSlide[] = data.hero.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category?.title,
    imageSrc: a.mainImage?.asset
      ? urlFor(a.mainImage).width(1600).auto("format").url()
      : undefined,
    imageAlt: a.mainImage?.alt,
  }));

  const heroIds = new Set(data.hero.map((a) => a._id));
  const featured = data.latest.filter((a) => !heroIds.has(a._id)).slice(0, 3);
  const sidebarNews = data.latest.slice(0, 4);
  const hasContent = data.latest.length > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="min-w-0 space-y-12">
        {slides.length > 0 ? (
          <HeroCarousel slides={slides} />
        ) : (
          <EmptyState>
            No stories yet. Publish an article in the Studio at /studio and it
            will lead the page.
          </EmptyState>
        )}

        {featured.length > 0 ? (
          <section>
            <SectionTitle href="/news">Featured articles</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <SectionTitle href="/comics">Latest comics</SectionTitle>
          {data.comics.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
              {data.comics.map((a) => (
                <ComicCoverageCard key={a._id} article={a} />
              ))}
            </div>
          ) : (
            <EmptyState>
              New-release coverage appears here. Fill in the Comic coverage
              fields on an article to add it.
            </EmptyState>
          )}
        </section>

        {data.features.length > 0 ? (
          <section>
            <SectionTitle href="/category/features">Recent features</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.features.map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <aside className="space-y-6" aria-label="Sidebar">
        <LatestNewsPanel articles={sidebarNews} />
        <StartHerePanel order={data.startHere} />
        <CategoriesPanel categories={data.categories} />
        <NewsletterPanel />
        {hasContent ? <SocialsPanel /> : null}
      </aside>
    </div>
  );
}
