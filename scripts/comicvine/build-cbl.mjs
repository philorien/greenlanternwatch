// Writes a CBL reading list for one reading order, with a ComicVine ID for every issue,
// so fetch.mjs and sync.mjs can work with orders that aren't in the existing lists.
//
//   node scripts/character-reading-orders.mjs > /tmp/character-orders.ndjson
//   node scripts/comicvine/build-cbl.mjs /tmp/character-orders.ndjson \
//     reading-order-character-kyle-rayner scripts/data/kyle-rayner.cbl \
//     --name "[DC] [1994-2026] Kyle Rayner" --character "Kyle Rayner"
//
// Issues already in a CBL list keep their ID. The rest are found by series name and
// launch year (volume search), then issue number (volume detail). Lookups are cached in
// scripts/.cache/comicvine/volumes.json, and issue details go into issues.json just as
// fetch.mjs would write them. --character lists issues ComicVine doesn't credit that
// character in, as a check that every entry is really about them.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { api, sleep } from "./api.mjs";
import { issueNumbers, loadCblIndex } from "./cbl.mjs";

const DELAY_MS = 1500;
const [ndjsonFile, orderId, outFile] = process.argv.slice(2);
const option = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
};
if (!ndjsonFile || !orderId || !outFile) {
  throw new Error("Usage: build-cbl.mjs <orders.ndjson> <order id> <out.cbl> [--name <list name>] [--character <name>]");
}

const CACHE_DIR = fileURLToPath(new URL("../.cache/comicvine/", import.meta.url));
mkdirSync(CACHE_DIR, { recursive: true });
const load = (file) =>
  existsSync(`${CACHE_DIR}${file}`) ? JSON.parse(readFileSync(`${CACHE_DIR}${file}`, "utf8")) : {};
const save = (file, data) => writeFileSync(`${CACHE_DIR}${file}`, JSON.stringify(data, null, 1));

// key-issues.mjs caches the same lookups, so start from those.
const keyIssueCache = load("key-issues.json");
const lookups = {
  volumes: { ...keyIssueCache.volumes, ...load("volumes.json").volumes },
  volumeIssues: { ...keyIssueCache.volumeIssues, ...load("volumes.json").volumeIssues },
};
const issues = load("issues.json");

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");

// ComicVine's name search misses some punctuation ("Green Lantern / Sentinel" is spaced),
// so try a few spellings. The match itself still has to be exact.
const searchTerms = (series) => [
  ...new Set([series, series.replace(/\s*\/\s*/g, " / "), series.split(/[:/]/).at(-1).trim()]),
];

async function findVolume(series, year) {
  const cacheKey = `${series}|${year}`;
  if (lookups.volumes[cacheKey]) return lookups.volumes[cacheKey];
  for (const term of searchTerms(series)) {
    for (let offset = 0; ; offset += 100) {
      await sleep(DELAY_MS);
      const page = await api("volumes/", {
        filter: `name:${term}`,
        limit: "100",
        offset: String(offset),
        field_list: "id,name,start_year,publisher",
      });
      const match = page.results.find(
        (v) =>
          normalize(v.name) === normalize(series) &&
          Number(v.start_year) === year &&
          v.publisher?.name === "DC Comics",
      );
      if (match) {
        lookups.volumes[cacheKey] = match.id;
        save("volumes.json", lookups);
        return match.id;
      }
      if (offset + 100 >= page.number_of_total_results) break;
    }
  }
  throw new Error(`No DC volume "${series}" starting in ${year}`);
}

async function findIssueId(series, year, number) {
  const volume = await findVolume(series, year);
  if (!lookups.volumeIssues[volume]) {
    await sleep(DELAY_MS);
    const { results } = await api(`volume/4050-${volume}/`, { field_list: "issues" });
    lookups.volumeIssues[volume] = Object.fromEntries(
      results.issues.map((i) => [i.issue_number, i.id]),
    );
    save("volumes.json", lookups);
  }
  const id = lookups.volumeIssues[volume][number];
  if (!id) throw new Error(`${series} (${year}) has no issue #${number}`);
  return id;
}

const doc = readFileSync(ndjsonFile, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .find((d) => d._id === orderId);
if (!doc) throw new Error(`No reading order "${orderId}" in ${ndjsonFile}`);

const cblIndex = loadCblIndex();
const books = [];
for (const entry of doc.sections.flatMap((s) => s.entries)) {
  const match = entry.title.match(/^(.+) \((\d{4})\)$/);
  if (!match) throw new Error(`Entry title has no volume year: ${entry.title}`);
  const [, series, year] = match;
  for (const number of issueNumbers(entry.issues)) {
    const known = cblIndex.get(`${normalize(series)}|${year}|${number}`);
    books.push({ series, year: Number(year), number, id: known ?? (await findIssueId(series, Number(year), number)) });
  }
}

const missing = [...new Set(books.map((b) => b.id))].filter((id) => !issues[id]);
for (let i = 0; i < missing.length; i += 100) {
  await sleep(DELAY_MS);
  const { results } = await api("issues/", {
    filter: `id:${missing.slice(i, i + 100).join("|")}`,
    limit: "100",
    field_list: "id,name,issue_number,store_date,cover_date,image,site_detail_url,volume",
  });
  for (const r of results) {
    issues[r.id] = {
      name: r.name,
      number: r.issue_number,
      storeDate: r.store_date,
      coverDate: r.cover_date,
      image: r.image?.super_url ?? null,
      url: r.site_detail_url,
      volume: { id: r.volume?.id, name: r.volume?.name, url: r.volume?.site_detail_url },
    };
  }
  save("issues.json", issues);
}

const xml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const book = (b) => {
  const issue = issues[b.id];
  if (!issue) throw new Error(`ComicVine returned nothing for issue ${b.id}`);
  if (normalize(issue.volume.name) !== normalize(b.series)) {
    throw new Error(`Issue ${b.id} is in "${issue.volume.name}", not "${b.series}"`);
  }
  const coverYear = (issue.coverDate ?? issue.storeDate ?? String(b.year)).slice(0, 4);
  return [
    `<Book Series="${xml(issue.volume.name)}" Number="${xml(b.number)}" Volume="${b.year}" Year="${coverYear}">`,
    `<Database Name="cv" Series="${issue.volume.id}" Issue="${b.id}" />`,
    `</Book>`,
  ].join("\n");
};
writeFileSync(
  outFile,
  [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<ReadingList xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`,
    `<Name>${xml(option("name") ?? doc.title)}</Name>`,
    `<NumIssues>${books.length}</NumIssues>`,
    `<Books>`,
    ...books.map(book),
    `</Books>`,
    `<Matchers />`,
    `</ReadingList>`,
    ``,
  ].join("\n"),
);
console.log(`${outFile}: ${books.length} issues`);

const character = option("character");
if (character) {
  await sleep(DELAY_MS);
  const { results: found } = await api("characters/", { filter: `name:${character}`, field_list: "id,name" });
  const match = found.find((c) => c.name === character);
  if (!match) throw new Error(`No ComicVine character named "${character}"`);
  await sleep(DELAY_MS);
  const { results } = await api(`character/4005-${match.id}/`, { field_list: "issue_credits" });
  const credited = new Set(results.issue_credits.map((i) => i.id));
  const uncredited = books.filter((b) => !credited.has(b.id));
  console.log(
    uncredited.length
      ? `ComicVine doesn't credit ${character} in:\n  ${uncredited.map((b) => `${b.series} (${b.year}) #${b.number}`).join("\n  ")}`
      : `ComicVine credits ${character} in every issue.`,
  );
}
