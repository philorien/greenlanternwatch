import Link from "next/link";
import { site } from "@/config/site";
import { SiteLogo } from "./Logo";
import { Socials } from "./Socials";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex flex-col items-start gap-3">
          <SiteLogo variant="lockup" sizes="324px" className="h-16 sm:h-20" />
          <span className="text-xs text-muted">{site.tagline}.</span>
        </Link>
        <nav aria-label="Footer" className="flex gap-6 text-sm text-muted">
          <Link href="/buying-guide" className="hover:text-glow">Buying guide</Link>
          <Link href="/about" className="hover:text-glow">About</Link>
          <Link href="/search" prefetch={false} className="hover:text-glow">Search</Link>
        </nav>
        <Socials />
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-muted sm:px-6 md:flex-row md:items-start md:justify-between md:gap-8">
          <p>
            Green Lantern Watch is an unofficial fan site. Green Lantern and
            related characters and names are trademarks of DC. This site is not
            affiliated with or endorsed by DC or Warner Bros. Discovery. As an
            Amazon Associate, Green Lantern Watch earns from qualifying
            purchases.
          </p>
          <p className="shrink-0">
            Built by{" "}
            <a href="https://lorienweb.com" className="text-text underline underline-offset-2 hover:text-glow">
              Lorien Web
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
