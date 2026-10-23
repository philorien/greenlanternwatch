"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { navIsCurrent } from "@/lib/nav";
import { useNavSection } from "./useNavSection";

export function MobileMenu({
  links,
}: {
  links: readonly { href: string; label: string; group?: string }[];
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const sectionHref = useNavSection();

  useEffect(() => {
    const menu = ref.current;
    if (!menu) return;

    const onPointerDown = (event: PointerEvent) => {
      if (menu.open && !menu.contains(event.target as Node)) menu.open = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary className="flex cursor-pointer list-none items-center rounded-md border border-line px-3 py-1.5 text-sm text-muted marker:content-none">
        Menu
      </summary>
      <nav aria-label="Mobile" className="panel absolute right-0 mt-2 flex w-56 flex-col p-2">
        {links.map((link, index) => {
          const current = navIsCurrent(link.href, pathname, sectionHref);
          const previous = links[index - 1];
          const newGroup = previous && previous.group !== link.group;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                if (ref.current) ref.current.open = false;
              }}
              aria-current={pathname === link.href ? "page" : current ? "true" : undefined}
              className={`rounded px-3 py-2 font-display text-sm font-semibold uppercase tracking-wider hover:bg-surface-2 hover:text-glow ${
                newGroup ? "mt-1 border-t border-line pt-3" : ""
              } ${current ? "text-text" : "text-muted"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </details>
  );
}
