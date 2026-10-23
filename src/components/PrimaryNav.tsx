"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { navIsCurrent } from "@/lib/nav";
import { useNavSection } from "./useNavSection";

export function PrimaryNav() {
  const pathname = usePathname();
  const sectionHref = useNavSection();

  return (
    <nav
      aria-label="Primary"
      className="ml-auto hidden items-center font-display text-[0.8rem] font-semibold uppercase tracking-wider lg:flex"
    >
      {site.nav.map((link, index) => {
        const current = navIsCurrent(link.href, pathname, sectionHref);
        const previous = site.nav[index - 1];
        const newGroup = previous && previous.group !== link.group;
        return (
          <span key={link.href} className={`flex items-center ${index > 0 ? "ml-4 xl:ml-6" : ""}`}>
            {newGroup ? <span aria-hidden className="mr-4 h-3.5 w-px bg-line xl:mr-6" /> : null}
            <Link
              href={link.href}
              aria-current={pathname === link.href ? "page" : current ? "true" : undefined}
              className={`whitespace-nowrap transition-colors hover:text-glow ${
                current ? "text-text" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
