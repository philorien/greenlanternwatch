import type { PortableTextBlock } from "next-sanity";

function words(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function blockText(block: PortableTextBlock) {
  if (block._type !== "block") return "";
  const children = block.children as { text?: string }[] | undefined;
  return (children ?? []).map((child) => child.text ?? "").join("");
}

function repeatsDek(block: PortableTextBlock, dek: string[]) {
  if (block._type !== "block" || (block.style && block.style !== "normal")) return false;
  const opening = words(blockText(block));
  if (opening.length === 0 || dek.length === 0) return false;
  let shared = 0;
  while (shared < opening.length && shared < dek.length && opening[shared] === dek[shared]) {
    shared += 1;
  }
  const identical = shared > 0 && shared === opening.length && shared === dek.length;
  return shared >= 8 || identical;
}

/**
 * The dek is the sentence the story continues from. When an opening paragraph
 * reprints it (a review sometimes puts a verdict line first), drop that paragraph.
 */
export function bodyAfterDek(body: PortableTextBlock[] | undefined, excerpt?: string) {
  if (!body?.length || !excerpt) return body;
  const dek = words(excerpt);
  if (dek.length === 0) return body;

  const drop = new Set<number>();
  let checked = 0;
  for (let i = 0; i < body.length && checked < 2; i += 1) {
    const block = body[i];
    if (!block || block._type !== "block" || (block.style && block.style !== "normal")) break;
    checked += 1;
    if (repeatsDek(block, dek)) drop.add(i);
  }
  if (drop.size === 0) return body;
  return body.filter((_, index) => !drop.has(index));
}
