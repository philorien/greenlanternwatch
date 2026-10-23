/** Reader-facing name for a category. The CMS calls the news bucket "Articles". */
export function categoryLabel(category?: { title: string; slug: string } | null) {
  if (!category) return undefined;
  if (category.slug === "articles" || category.title.trim().toLowerCase() === "articles") {
    return "News";
  }
  return category.title;
}
