// Shared by the reading order seed scripts: turns an order written in shorthand into a
// readingOrder document for `sanity dataset import`.
//
// Entry lines use the shorthand "Series (Year) #issues", optionally followed by
// " @arc-slug" to link the entry to a story arc from scripts/story-arcs.mjs (import
// those first), then " | note". GL and GLC expand to Green Lantern and Green Lantern Corps.

import { createHash } from "node:crypto";
import { arcId, arcs, slugify as arcSlug } from "./story-arcs.mjs";

const key = (...parts) =>
  createHash("sha1").update(parts.join("/")).digest("hex").slice(0, 12);

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const expandSeries = (s) =>
  s
    .replace(/\bGLC\b/g, "Green Lantern Corps")
    .replace(/\bGL\b/g, "Green Lantern")
    .replace(" & the ", " and the ");

function formatIssues(nums) {
  const range = nums.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!range) return `Issue ${nums}`;
  const [, from, to] = range;
  return Number(to) - Number(from) === 1
    ? `Issues ${from} and ${to}`
    : `Issues ${from} to ${to}`;
}

const arcIdsBySlug = new Map(arcs.map((a) => [arcSlug(a.title), arcId(a.title)]));

function parseEntry(line, docId, sectionIndex, entryIndex) {
  const [ref, note] = line.split(" | ");
  const match = ref.match(/^(.+) #(\S+?)(?: @(\S+))?$/);
  if (!match) throw new Error(`Unparseable entry: ${line}`);
  const [, series, issues, arc] = match;
  if (arc && !arcIdsBySlug.has(arc)) throw new Error(`Unknown story arc "${arc}": ${line}`);
  return {
    _key: key(docId, sectionIndex, entryIndex),
    _type: "readingEntry",
    title: expandSeries(series),
    issues: formatIssues(issues),
    format: "issues",
    ...(note ? { note } : {}),
    ...(arc ? { arc: { _type: "reference", _ref: arcIdsBySlug.get(arc) } } : {}),
  };
}

// Inline **bold** and [text](url) only.
function spans(text, blockKey, markDefs) {
  const out = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let i = 0;
  const push = (t, marks = []) =>
    t && out.push({ _key: `${blockKey}-${i++}`, _type: "span", text: t, marks });
  for (const m of text.matchAll(pattern)) {
    push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const inner = m[1].match(/^\[(.+?)\]\((.+?)\)$/);
      if (inner) {
        const linkKey = `${blockKey}-l${markDefs.length}`;
        markDefs.push({ _key: linkKey, _type: "link", href: inner[2] });
        push(inner[1], ["strong", linkKey]);
      } else {
        push(m[1], ["strong"]);
      }
    } else {
      const linkKey = `${blockKey}-l${markDefs.length}`;
      markDefs.push({ _key: linkKey, _type: "link", href: m[3] });
      push(m[2], [linkKey]);
    }
    last = m.index + m[0].length;
  }
  push(text.slice(last));
  return out;
}

function toBlocks(paragraphs, docId) {
  return paragraphs.map((p, index) => {
    const blockKey = key(docId, "intro", index);
    const markDefs = [];
    let style = "normal";
    let listItem;
    let text = p;
    if (p.startsWith("## ")) {
      style = "h2";
      text = p.slice(3);
    } else if (p.startsWith("- ")) {
      listItem = "bullet";
      text = p.slice(2);
    }
    const children = spans(text, blockKey, markDefs);
    return {
      _key: blockKey,
      _type: "block",
      style,
      ...(listItem ? { listItem, level: 1 } : {}),
      markDefs,
      children,
    };
  });
}

export function buildReadingOrder(o) {
  return {
    _id: o.id,
    _type: "readingOrder",
    title: o.title,
    slug: { _type: "slug", current: slugify(o.title) },
    audience: o.audience,
    order: o.order,
    tagline: o.tagline,
    intro: toBlocks(o.intro, o.id),
    sections: o.sections.map((s, si) => ({
      _key: key(o.id, si),
      _type: "readingSection",
      title: s.title,
      ...(s.note ? { note: s.note } : {}),
      entries: s.lines
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l, ei) => parseEntry(l, o.id, si, ei)),
    })),
  };
}
