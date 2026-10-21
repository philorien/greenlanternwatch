import type { Explainer, ExplainerBlock } from "@/content/explainers";
import type { SanityImage } from "./types";

export type SanityExplainerDoc = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  dek?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  mainImage?: SanityImage | null;
  author?: { name?: string | null; slug?: string | null } | null;
  sections?:
    | {
        _key?: string;
        title?: string | null;
        anchor?: string | null;
        blocks?: Record<string, unknown>[] | null;
      }[]
    | null;
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const records = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => !!item && typeof item === "object") : [];

const strings = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];

function anchorFor(title: string, key: string) {
  const slug = title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || key;
}

function mapBlock(block: Record<string, unknown>): ExplainerBlock | null {
  switch (block._type) {
    case "explainerParagraph": {
      const body = text(block.text);
      return body ? { type: "paragraph", text: body } : null;
    }
    case "explainerPoints": {
      const items = records(block.items)
        .map((item) => ({ lead: text(item.lead), text: text(item.text) }))
        .filter((item) => item.lead && item.text);
      return items.length > 0 ? { type: "points", items } : null;
    }
    case "explainerSteps": {
      const items = strings(block.items);
      return items.length > 0 ? { type: "steps", items } : null;
    }
    case "explainerThesis": {
      const kicker = text(block.kicker);
      const body = text(block.text);
      return kicker && body ? { type: "thesis", kicker, text: body } : null;
    }
    case "explainerTimeline": {
      const rows = records(block.rows)
        .map((row) => ({ when: text(row.when), what: text(row.what) }))
        .filter((row) => row.when && row.what);
      return rows.length > 0 ? { type: "timeline", caption: text(block.caption), rows } : null;
    }
    case "explainerTerms": {
      const items = records(block.items)
        .map((item) => ({
          term: text(item.term),
          qualifier: text(item.qualifier) || undefined,
          definition: text(item.definition),
        }))
        .filter((item) => item.term && item.definition);
      return items.length > 0 ? { type: "terms", items } : null;
    }
    case "explainerCompare": {
      const left = text(block.leftHeading);
      const right = text(block.rightHeading);
      const rows = records(block.rows)
        .map((row) => ({ label: text(row.label), left: text(row.left), right: text(row.right) }))
        .filter((row) => row.label && row.left && row.right);
      return left && right && rows.length > 0
        ? { type: "compare", caption: text(block.caption), columns: [left, right], rows }
        : null;
    }
    case "explainerReading": {
      const items = records(block.items)
        .map((item) => ({ title: text(item.title), note: text(item.note) }))
        .filter((item) => item.title && item.note);
      return items.length > 0 ? { type: "reading", items } : null;
    }
    case "explainerImage": {
      const { asset, hotspot, alt, caption, credit } = block as SanityImage;
      return asset?._ref ? { type: "image", image: { asset, hotspot, alt, caption, credit } } : null;
    }
    default:
      return null;
  }
}

export function mapExplainer(doc: SanityExplainerDoc): Explainer | null {
  if (!doc.title || !doc.slug || !doc.publishedAt) return null;
  const sections = (doc.sections ?? [])
    .map((section, index) => {
      const title = text(section.title);
      if (!title) return null;
      const blocks = (section.blocks ?? [])
        .map(mapBlock)
        .filter((block): block is ExplainerBlock => block !== null);
      if (blocks.length === 0) return null;
      return {
        id: text(section.anchor) || anchorFor(title, section._key ?? `section-${index}`),
        title,
        blocks,
      };
    })
    .filter((section): section is Explainer["sections"][number] => section !== null);

  return {
    slug: doc.slug,
    title: doc.title,
    dek: text(doc.dek),
    seoDescription: text(doc.seoDescription) || undefined,
    publishedAt: doc.publishedAt,
    updatedAt: doc.updatedAt ?? undefined,
    mainImage: doc.mainImage?.asset ? doc.mainImage : undefined,
    author: doc.author?.name
      ? { name: doc.author.name, slug: doc.author.slug ?? undefined }
      : undefined,
    sections,
  };
}
