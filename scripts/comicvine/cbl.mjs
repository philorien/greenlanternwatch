// Maps reading-order entries to ComicVine issue IDs using the CBL reading lists,
// which record a ComicVine ID for every issue.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CBL_FILES = [
  "../data/modern-green-lantern-complete.cbl",
  "../data/modern-green-lantern-out-of-continuity.cbl",
  "../data/kyle-rayner.cbl",
];

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const normalize = (series) =>
  series
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");

const bookKey = (series, year, number) => `${normalize(series)}|${year}|${number}`;

export function loadCblIndex() {
  const index = new Map();
  const book =
    /<Book Series="([^"]*)" Number="([^"]*)" Volume="([^"]*)"[^>]*>\s*<Database Name="cv" Series="(\d+)" Issue="(\d+)"/g;
  for (const file of CBL_FILES) {
    const xml = readFileSync(fileURLToPath(new URL(file, import.meta.url)), "utf8");
    for (const [, series, number, volume, , issueId] of xml.matchAll(book)) {
      index.set(bookKey(decode(series), volume, number), Number(issueId));
    }
  }
  return index;
}

/** Issue numbers covered by an entry's "Issues 1 to 6" / "Issues 1 and 2" / "Issue 7" text. */
export function issueNumbers(issues) {
  const range = issues.match(/^Issues ([\d.]+) (?:to|and) ([\d.]+)$/);
  if (range) {
    const numbers = [];
    for (let n = Number(range[1]); n <= Number(range[2]); n++) numbers.push(String(n));
    return numbers;
  }
  const single = issues.match(/^Issue ([\d.]+)$/);
  if (single) return [single[1]];
  throw new Error(`Unrecognized issues text: ${issues}`);
}

/** ComicVine issue IDs for an entry, in reading order. Throws if any issue is missing. */
export function comicVineIds(entry, index) {
  const match = entry.title.match(/^(.+) \((\d{4})\)$/);
  if (!match) throw new Error(`Entry title has no volume year: ${entry.title}`);
  const [, series, year] = match;
  return issueNumbers(entry.issues).map((number) => {
    const id = index.get(bookKey(series, year, number));
    if (!id) throw new Error(`No ComicVine ID for ${series} (${year}) #${number}`);
    return id;
  });
}
