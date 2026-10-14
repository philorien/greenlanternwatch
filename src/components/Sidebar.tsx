import Link from "next/link";
import { site } from "@/config/site";
import type { ArticleSummary, CategoryItem } from "@/sanity/types";
import { NewsRow } from "./cards";
import { LogoMark } from "./Logo";
import { Socials } from "./Socials";
import { Panel } from "./ui";

export function LatestNewsPanel({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null;
  return (
    <Panel title="Latest news" href="/news">
      <ul className="flex flex-col gap-4">
        {articles.map((a) => (
          <li key={a._id}>
            <NewsRow article={a} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function StartHerePanel({
  order,
}: {
  order: { title: string; slug: string; tagline?: string } | null;
}) {
  if (!order) return null;
  return (
    <Link
      href={`/comics/reading-orders/${order.slug}`}
      className="panel group flex flex-col items-center gap-3 bg-[radial-gradient(circle_at_50%_0%,rgb(53_232_160/0.16),transparent_65%)] p-6 text-center transition-colors hover:border-glow-dim"
    >
      <LogoMark className="size-12" />
      <p className="eyebrow">New to Green Lantern?</p>
      <p className="font-display text-xl font-extrabold leading-snug transition-colors group-hover:text-glow">
        {order.title}
      </p>
      {order.tagline ? <p className="text-sm text-muted">{order.tagline}</p> : null}
    </Link>
  );
}

const categoryOrder = ["comics", "movies-tv", "characters", "features", "reviews"];

export function CategoriesPanel({ categories }: { categories: CategoryItem[] }) {
  if (categories.length === 0) return null;
  const hrefFor = (slug: string) =>
    slug === "comics" ? "/comics" : slug === "characters" ? "/characters" : `/category/${slug}`;
  const sorted = [...categories].sort(
    (a, b) =>
      (categoryOrder.indexOf(a.slug) + 1 || 99) - (categoryOrder.indexOf(b.slug) + 1 || 99),
  );
  return (
    <Panel title="Site categories">
      <ul className="divide-y divide-line">
        {sorted.map((c) => (
          <li key={c._id}>
            <Link
              href={hrefFor(c.slug)}
              className="group flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span>
                <span className="block font-display text-sm font-bold transition-colors group-hover:text-glow">
                  {c.title}
                </span>
                {c.description ? (
                  <span className="block text-xs text-muted">{c.description}</span>
                ) : null}
              </span>
              <span aria-hidden className="text-muted group-hover:text-glow">&rsaquo;</span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function NewsletterPanel() {
  if (!site.newsletterAction) return null;
  return (
    <Panel title="Get the latest">
      <p className="mb-4 text-sm text-muted">
        News, reviews and more, straight to your inbox.
      </p>
      <form action={site.newsletterAction} method="post" className="flex">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Your email address"
          className="min-w-0 flex-1 rounded-l-md border border-line bg-ink px-3 py-2 text-sm placeholder:text-muted focus:border-glow focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-r-md bg-glow px-4 py-2 font-display text-xs font-extrabold uppercase tracking-wider text-ink hover:bg-glow-dim"
        >
          Subscribe
        </button>
      </form>
    </Panel>
  );
}

export function SocialsPanel() {
  const hasAny = Object.values(site.socials).some(Boolean);
  if (!hasAny) return null;
  return (
    <Panel>
      <Socials className="justify-center" />
    </Panel>
  );
}
