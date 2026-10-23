"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Section set by a story page, so a review highlights Reviews rather than News. */
export function useNavSection() {
  const pathname = usePathname();
  const [section, setSection] = useState<{ pathname: string; href: string | null } | null>(null);

  useLayoutEffect(() => {
    if (!pathname.startsWith("/news/")) return;
    const href = document.querySelector("[data-nav-section]")?.getAttribute("data-nav-section") || null;
    // The story page renders data-nav-section into the DOM, which only exists after commit.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSection({ pathname, href });
  }, [pathname]);

  return section?.pathname === pathname ? section.href : null;
}
