// Adds ComicVine covers to "The best Green Lantern team-ups", one under each pairing's heading.
//
//   set -a; source .env.local; set +a
//   npx sanity exec scripts/comicvine/article-covers.mjs --with-user-token -- --dry-run
//   npx sanity exec scripts/comicvine/article-covers.mjs --with-user-token
//
// Writes to the article's draft, so nothing goes live until it is published in Studio.
// Re-running skips covers already in the body. Issues are found by series name and launch
// year, sharing the lookup cache with key-issues.mjs. --dry-run prints what ComicVine
// returns without writing to Sanity.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";
import { api, sleep, USER_AGENT } from "./api.mjs";

const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = 1500;
const ARTICLE_ID = "article-the-best-green-lantern-team-ups";

// `after` is the start of the heading the cover goes under.
const covers = [
  { after: "1. Hal Jordan & Green Arrow", series: "Green Lantern", volume: 1960, number: "76" },
  { after: "2. Hal Jordan & Barry Allen", series: "Flash & Green Lantern: The Brave and the Bold", volume: 1999, number: "1" },
  { after: "3. Hal Jordan & Sinestro", series: "Green Lantern", volume: 2011, number: "5" },
  { after: "4. Jessica Cruz & Simon Baz", series: "Green Lanterns", volume: 2016, number: "1" },
  { after: "5. Hal Jordan & John Stewart", series: "Green Lantern", volume: 1960, number: "87" },
  { after: "6. Hal Jordan & Alan Scott", series: "Green Lantern", volume: 1960, number: "40" },
  { after: "7. Kyle Rayner & Jade", series: "Green Lantern", volume: 1990, number: "137" },
  { after: "Honorable mention: Guy Gardner", series: "Guy Gardner: Warrior", volume: 1994, number: "28" },
  { after: "Honorable mention: Hal Jordan & Kyle", series: "Green Lantern", volume: 1990, number: "101" },
];

const CACHE_DIR = fileURLToPath(new URL("../.cache/comicvine/", import.meta.url));
const CACHE_FILE = `${CACHE_DIR}key-issues.json`;
mkdirSync(CACHE_DIR, { recursive: true });
const cache = {
  volumes: {},
  volumeIssues: {},
  issues: {},
  ...(existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {}),
};
const save = () => writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1));

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
const cvKey = (k) => `${normalize(k.series)}|${k.volume}|${k.number}`;
const issueTitle = (k) => `${k.series} #${k.number}`;

async function findVolume(series, year) {
  const cacheKey = `${series}|${year}`;
  if (cache.volumes[cacheKey]) return cache.volumes[cacheKey];
  for (let offset = 0; ; offset += 100) {
    await sleep(DELAY_MS);
    const page = await api("volumes/", {
      filter: `name:${series}`,
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
      cache.volumes[cacheKey] = match.id;
      save();
      return match.id;
    }
    if (offset + 100 >= page.number_of_total_results) {
      throw new Error(`No DC volume "${series}" starting in ${year}`);
    }
  }
}

async function findIssueId(k) {
  const volume = await findVolume(k.series, k.volume);
  if (!cache.volumeIssues[volume]) {
    await sleep(DELAY_MS);
    const { results } = await api(`volume/4050-${volume}/`, { field_list: "issues" });
    cache.volumeIssues[volume] = Object.fromEntries(
      results.issues.map((i) => [i.issue_number, i.id]),
    );
    save();
  }
  const id = cache.volumeIssues[volume][k.number];
  if (!id) throw new Error(`${k.series} (${k.volume}) has no issue #${k.number}`);
  return id;
}

const failed = [];
const pending = new Map();
for (const k of covers) {
  if (cache.issues[cvKey(k)]) continue;
  try {
    pending.set(await findIssueId(k), cvKey(k));
  } catch (err) {
    failed.push(`${issueTitle(k)} (${k.volume}): ${err.message}`);
  }
}
if (pending.size) {
  await sleep(DELAY_MS);
  const { results } = await api("issues/", {
    filter: `id:${[...pending.keys()].join("|")}`,
    limit: "100",
    field_list: "id,name,cover_date,store_date,image,site_detail_url,volume",
  });
  for (const r of results) {
    cache.issues[pending.get(r.id)] = {
      id: r.id,
      name: r.name,
      coverDate: r.cover_date,
      storeDate: r.store_date,
      image: r.image?.super_url ?? null,
      url: r.site_detail_url,
      volume: r.volume?.name,
    };
  }
}
save();

const hasCover = (cv) => cv?.image && !/blank\.\w+$/.test(cv.image);
const MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
const dateLabel = (coverDate) => {
  const [y, m] = coverDate.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
};

if (DRY_RUN) {
  for (const k of covers) {
    const cv = cache.issues[cvKey(k)];
    console.log(`${issueTitle(k)} (${k.volume})`);
    if (cv) console.log(`  ${cv.volume}  "${cv.name ?? ""}"  cover ${cv.coverDate}  ${hasCover(cv) ? cv.image : "NO COVER"}`);
  }
  if (failed.length) console.log(`\nNot found:\n  ${failed.join("\n  ")}`);
  process.exit(0);
}

const client = getCliClient({ apiVersion: "2026-10-14" });
const assets = new Map(
  (
    await client.fetch(
      `*[_type == "sanity.imageAsset" && source.name == "comicvine"]{ _id, "id": source.id }`,
    )
  ).map((a) => [a.id, a._id]),
);

async function coverAsset(cv) {
  const key = String(cv.id);
  if (assets.has(key)) return assets.get(key);
  const res = await fetch(cv.image, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Cover download failed for ${cv.id}: HTTP ${res.status}`);
  const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), {
    filename: `comicvine-${cv.id}.jpg`,
    source: { name: "comicvine", id: key, url: cv.url },
  });
  assets.set(key, asset._id);
  return asset._id;
}

const draftId = `drafts.${ARTICLE_ID}`;
const doc = (await client.getDocument(draftId)) ?? (await client.getDocument(ARTICLE_ID));
if (!doc) throw new Error(`${ARTICLE_ID} not found`);

const body = [...doc.body];
const headingText = (b) => b.children.map((c) => c.text).join("");
for (const k of covers) {
  const cv = cache.issues[cvKey(k)];
  if (!hasCover(cv)) {
    console.log(`${issueTitle(k)}: no cover, skipped`);
    continue;
  }
  const _key = `cover-${cv.id}`;
  if (body.some((b) => b._key === _key)) {
    console.log(`${issueTitle(k)}: already in the article`);
    continue;
  }
  const at = body.findIndex((b) => b.style === "h2" && headingText(b).startsWith(k.after));
  if (at === -1) throw new Error(`No heading starting "${k.after}"`);
  body.splice(at + 1, 0, {
    _type: "image",
    _key,
    asset: { _type: "reference", _ref: await coverAsset(cv) },
    alt: `Cover of ${issueTitle(k)}`,
    caption: `${issueTitle(k)} (${dateLabel(cv.coverDate)}). Cover via ComicVine. DC Comics.`,
  });
  console.log(`${issueTitle(k)}: added under "${k.after}"`);
}

await client.createOrReplace({ ...doc, _id: draftId, body });
console.log(`Draft ${draftId} updated. Review it in Studio, then publish.`);
if (failed.length) console.log(`No ComicVine match:\n  ${failed.join("\n  ")}`);
