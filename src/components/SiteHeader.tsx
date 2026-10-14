import Link from "next/link";
import { site } from "@/config/site";
import { LogoMark } from "./Logo";

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
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <LogoMark />
          <span className="leading-tight">
            <span className="block font-display text-xl font-extrabold uppercase tracking-wide sm:text-2xl">
              Green Lantern <span className="text-glow">Watch</span>
            </span>
            <span className="hidden text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted sm:block">
              {site.tagline}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-6 font-display text-[0.8rem] font-semibold uppercase tracking-wider lg:flex"
        >
          {site.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-glow"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/search"
            aria-label="Search"
            className="rounded-md p-2 text-muted transition-colors hover:text-glow"
          >
            <SearchIcon />
          </Link>
          <details className="group relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-md border border-line px-3 py-1.5 text-sm text-muted marker:content-none">
              Menu
            </summary>
            <nav
              aria-label="Mobile"
              className="panel absolute right-0 mt-2 flex w-56 flex-col p-2"
            >
              {site.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded px-3 py-2 font-display text-sm font-semibold uppercase tracking-wider text-muted hover:bg-surface-2 hover:text-glow"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
