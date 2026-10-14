import Link from "next/link";
import { site } from "@/config/site";
import { SiteLogo } from "./Logo";
import { Socials } from "./Socials";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex flex-col items-start gap-3">
          <SiteLogo variant="full" sizes="177px" className="h-20" />
          <span className="text-xs text-muted">{site.tagline}.</span>
        </Link>
        <nav aria-label="Footer" className="flex gap-6 text-sm text-muted">
          <Link href="/about" className="hover:text-glow">About</Link>
          <Link href="/search" className="hover:text-glow">Search</Link>
        </nav>
        <Socials />
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted sm:px-6">
          Green Lantern Watch is an unofficial fan site. Green Lantern and
          related characters and names are trademarks of DC. This site is not
          affiliated with or endorsed by DC or Warner Bros. Discovery.
        </p>
      </div>
    </footer>
  );
}
