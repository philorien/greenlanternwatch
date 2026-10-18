import { ArticleCard } from "@/components/cards";
import { PageHeader, SectionTitle } from "@/components/ui";
import { screenGuide } from "@/content/movies-tv";
import { pageMetadata } from "@/lib/seo";
import { getCategoryPage } from "@/sanity/data";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Movies & TV",
  description:
    "A guide to Green Lantern films and shows: the ones built around a Lantern, and the ones where a Lantern appears in a larger story.",
  path: "/movies-tv",
});

export default async function MoviesTvPage() {
  const { articles } = await getCategoryPage("movies-tv");

  return (
    <>
      <PageHeader
        eyebrow="Movies & TV guide"
        title="On screen"
        intro="Films and shows built around a Green Lantern, then the ones where a Lantern appears in someone else's story."
      />

      <nav aria-label="Guide sections" className="mb-14 flex max-w-3xl flex-wrap gap-x-6 gap-y-2">
        {screenGuide.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="font-display text-xs font-bold uppercase tracking-wider text-muted hover:text-glow"
          >
            {section.title}
          </a>
        ))}
      </nav>

      {screenGuide.map((section) => (
        <section key={section.id} id={section.id} className="mb-16 max-w-3xl scroll-mt-28">
          <SectionTitle>{section.title}</SectionTitle>
          <ol className="divide-y divide-line border-b border-line">
            {section.titles.map((item, index) => (
              <li
                key={item.title}
                className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 py-5 sm:grid-cols-[2.75rem_minmax(0,1fr)]"
              >
                <span
                  aria-hidden
                  className="pt-1 font-display text-sm font-black tabular-nums text-glow"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4">
                    <h3 className="font-display text-xl font-extrabold leading-snug sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="font-display text-sm font-bold tabular-nums text-muted">
                      {item.year}
                    </p>
                  </div>
                  <p className="mt-1.5 max-w-2xl text-sm text-muted">
                    <span className="text-text/80">{item.format}.</span> {item.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      {articles.length > 0 ? (
        <section>
          <SectionTitle href="/category/movies-tv">News and coverage</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
