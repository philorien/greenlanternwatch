import type { Metadata } from "next";
import { ArticleCard, ComicIssueCard, ExplainerCard } from "@/components/cards";
import { HeroCarousel, type HeroSlide } from "@/components/HeroCarousel";
import { NewsletterPanel, SocialsPanel } from "@/components/Sidebar";
import { StartPaths } from "@/components/StartPaths";
import { categoryLabel } from "@/lib/labels";
import { JsonLd } from "@/components/JsonLd";
import { EmptyState, SectionTitle } from "@/components/ui";
import { site } from "@/config/site";
import { listFeatures } from "@/lib/features";
import { pageMetadata, siteJsonLd } from "@/lib/seo";
import { getExplainers, getHome } from "@/sanity/data";
import { focalPoint, urlFor } from "@/sanity/image";

export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: { absolute: `${site.name}: ${site.tagline}` },
  description:
    "Green Lantern news, reading orders and character profiles across the comics, the Lanterns TV show and the films, written by fans for new and longtime readers.",
  path: "/",
});

export default async function HomePage() {
  const [data, explainers] = await Promise.all([getHome(), getExplainers()]);

  const slides: HeroSlide[] = data.hero.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: categoryLabel(a.category),
    imageSrc: a.mainImage?.asset
      ? urlFor(a.mainImage).width(1600).auto("format").url()
      : undefined,
    imageAlt: a.mainImage?.alt,
    imagePosition: focalPoint(a.mainImage),
  }));

  const heroIds = new Set(data.hero.map((a) => a._id));
  const featured = data.latest.filter((a) => !heroIds.has(a._id)).slice(0, 3);
  const recentFeatures = listFeatures(data.features, explainers, 3);
  const hasContent = data.latest.length > 0;
  const showSocials = hasContent && Object.values(site.socials).some(Boolean);
  const showAside = recentFeatures.length > 0 || Boolean(site.newsletterAction) || showSocials;

  return (
    <>
      <JsonLd data={siteJsonLd()} />
      <h1 className="sr-only">
        {site.name}: Green Lantern news, comics reading orders and character guides
      </h1>
      <div className={showAside ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]" : undefined}>
        <div className="min-w-0 space-y-12">
          {slides.length > 0 ? (
            <HeroCarousel slides={slides} />
          ) : (
            <EmptyState>
              No stories yet. Publish an article in the Studio at /studio and it
              will lead the page.
            </EmptyState>
          )}

          <StartPaths order={data.startHere} />

          {featured.length > 0 ? (
            <section>
              <SectionTitle href="/news">Latest news</SectionTitle>
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
                {data.comics.map((issue) => (
                  <ComicIssueCard key={issue._id} issue={issue} />
                ))}
              </div>
            ) : (
              <EmptyState>
                The newest Lantern issues appear here. Run
                scripts/comicvine/latest.mjs to pull them from ComicVine.
              </EmptyState>
            )}
          </section>

        </div>

        {showAside ? (
          <aside className="space-y-6" aria-label="Sidebar">
            {recentFeatures.length > 0 ? (
              <section>
                <SectionTitle href="/category/features">Recent features</SectionTitle>
                <div className="flex flex-col gap-4">
                  {recentFeatures.map((item) =>
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
              </section>
            ) : null}
            <NewsletterPanel />
            {showSocials ? <SocialsPanel /> : null}
          </aside>
        ) : null}
      </div>
    </>
  );
}
