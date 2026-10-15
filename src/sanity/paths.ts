export type LinkableType =
  | "article"
  | "explainer"
  | "character"
  | "storyArc"
  | "readingOrder"
  | "corps"
  | "category"
  | "author";

export function pathFor(type: LinkableType, slug: string) {
  switch (type) {
    case "article":
      return `/news/${slug}`;
    case "explainer":
      return `/explainers/${slug}`;
    case "character":
      return `/characters/${slug}`;
    case "storyArc":
      return `/comics/arcs/${slug}`;
    case "readingOrder":
      return `/comics/reading-orders/${slug}`;
    case "corps":
      return `/corps/${slug}`;
    case "category":
      return `/category/${slug}`;
    case "author":
      return `/authors/${slug}`;
  }
}
