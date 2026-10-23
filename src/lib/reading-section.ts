/** Stable hash for a reading-order section, shared by the page and the homepage links. */
export function readingSectionId(title: string, key: string) {
  const slug = title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || key;
}
