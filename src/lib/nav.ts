/** Nav item for a reader-facing section label. Stories all live under /news. */
export function navHrefForLabel(label?: string) {
  switch (label) {
    case "News":
      return "/news";
    case "Reviews":
      return "/category/reviews";
    case "Features":
      return "/category/features";
    case "Movies & TV":
      return "/movies-tv";
    case "Comics":
      return "/comics";
    case "Characters":
      return "/characters";
    case "About":
      return "/about";
    default:
      return undefined;
  }
}

/** Whether a nav item is the section the reader is in. */
export function navIsCurrent(href: string, pathname: string, sectionHref?: string | null) {
  if (pathname.startsWith("/news/") && sectionHref) return href === sectionHref;
  if (pathname === href) return true;
  switch (href) {
    case "/news":
      return pathname === "/category/articles";
    case "/comics":
      return pathname.startsWith("/comics/") || pathname === "/buying-guide";
    case "/movies-tv":
      return pathname.startsWith("/movies-tv/");
    case "/characters":
      return pathname.startsWith("/characters/") || pathname.startsWith("/corps");
    case "/category/features":
      return pathname.startsWith("/explainers/");
    default:
      return false;
  }
}
