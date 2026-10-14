export type LinkableType = "article" | "character" | "storyArc" | "readingOrder" | "corps";

export function pathFor(type: LinkableType, slug: string) {
  switch (type) {
    case "article":
      return `/news/${slug}`;
    case "character":
      return `/characters/${slug}`;
    case "storyArc":
      return `/comics/arcs/${slug}`;
    case "readingOrder":
      return `/comics/reading-orders/${slug}`;
    case "corps":
      return `/corps/${slug}`;
  }
}
