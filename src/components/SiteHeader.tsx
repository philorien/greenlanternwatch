import Link from "next/link";
import { site } from "@/config/site";
import { SiteLogo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 flex-col items-start gap-1.5">
          <SiteLogo
            variant="lockup"
            sizes="(min-width: 1280px) 291px, (min-width: 1024px) 194px, 227px"
            eager
            className="h-14 sm:h-16 lg:h-12 xl:h-[4.5rem]"
          />
          <span className="hidden text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted sm:block">
            {site.tagline}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-4 font-display text-[0.8rem] font-semibold uppercase tracking-wider lg:flex xl:gap-6"
        >
          {site.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-muted transition-colors hover:text-glow"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/search"
            prefetch={false}
            aria-label="Search"
            className="rounded-md p-2 text-muted transition-colors hover:text-glow"
          >
            <SearchIcon />
          </Link>
          <MobileMenu links={site.nav} />
        </div>
      </div>
    </header>
  );
}
