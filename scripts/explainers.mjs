// Seeds explainer documents for `sanity dataset import`.
//
//   node scripts/explainers.mjs > /tmp/explainers.ndjson
//   npx sanity dataset import /tmp/explainers.ndjson production --replace
//
// Document IDs are fixed, so re-running replaces these explainers in place.
// The Phil author reference is the author document already in production.

import { createHash } from "node:crypto";
import { explainers } from "../src/content/explainers.ts";

const PHIL_AUTHOR_ID = "cf1803ce-3bfc-44ba-8730-b854f72ba444";

const key = (...parts) => createHash("sha1").update(parts.join("/")).digest("hex").slice(0, 12);

const publishedAt = (value) => (value.includes("T") ? value : `${value}T12:00:00.000Z`);

function block(docId, sectionKey, block, index) {
  const blockKey = key(docId, sectionKey, "block", index);
  switch (block.type) {
    case "paragraph":
      return { _key: blockKey, _type: "explainerParagraph", text: block.text };
    case "points":
      return {
        _key: blockKey,
        _type: "explainerPoints",
        items: block.items.map((item, i) => ({
          _key: key(blockKey, "point", i),
          _type: "explainerPoint",
          lead: item.lead,
          text: item.text,
        })),
      };
    case "steps":
      return { _key: blockKey, _type: "explainerSteps", items: block.items };
    case "thesis":
      return { _key: blockKey, _type: "explainerThesis", kicker: block.kicker, text: block.text };
    case "timeline":
      return {
        _key: blockKey,
        _type: "explainerTimeline",
        caption: block.caption,
        rows: block.rows.map((row, i) => ({
          _key: key(blockKey, "when", i),
          _type: "explainerTimelineRow",
          when: row.when,
          what: row.what,
        })),
      };
    case "terms":
      return {
        _key: blockKey,
        _type: "explainerTerms",
        items: block.items.map((item, i) => ({
          _key: key(blockKey, "term", i),
          _type: "explainerTerm",
          term: item.term,
          ...(item.qualifier ? { qualifier: item.qualifier } : {}),
          definition: item.definition,
        })),
      };
    case "compare":
      return {
        _key: blockKey,
        _type: "explainerCompare",
        caption: block.caption,
        leftHeading: block.columns[0],
        rightHeading: block.columns[1],
        rows: block.rows.map((row, i) => ({
          _key: key(blockKey, "row", i),
          _type: "explainerCompareRow",
          label: row.label,
          left: row.left,
          right: row.right,
        })),
      };
    case "reading":
      return {
        _key: blockKey,
        _type: "explainerReading",
        items: block.items.map((item, i) => ({
          _key: key(blockKey, "read", i),
          _type: "explainerReadingItem",
          title: item.title,
          note: item.note,
        })),
      };
    case "image":
      return { _key: blockKey, _type: "explainerImage", ...block.image };
    default: {
      const unreachable = block;
      throw new Error(`Unknown explainer block: ${unreachable?.type}`);
    }
  }
}

for (const explainer of explainers) {
  const id = `explainer-${explainer.slug}`;
  const doc = {
    _id: id,
    _type: "explainer",
    title: explainer.title,
    slug: { _type: "slug", current: explainer.slug },
    dek: explainer.dek,
    publishedAt: publishedAt(explainer.publishedAt),
    ...(explainer.author?.slug === "phil"
      ? { author: { _type: "reference", _ref: PHIL_AUTHOR_ID } }
      : {}),
    sections: explainer.sections.map((section, index) => {
      const sectionKey = key(id, "section", index);
      return {
        _key: sectionKey,
        _type: "explainerSection",
        title: section.title,
        anchor: section.id,
        blocks: section.blocks.map((item, blockIndex) => block(id, sectionKey, item, blockIndex)),
      };
    }),
  };
  process.stdout.write(`${JSON.stringify(doc)}\n`);
}
