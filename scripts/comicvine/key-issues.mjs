// Writes the Key issues in scripts/key-issues.mjs to Sanity, with ComicVine covers.
//
//   set -a; source .env.local; set +a
//   npx sanity exec scripts/comicvine/key-issues.mjs --with-user-token -- --dry-run
//   npx sanity exec scripts/comicvine/key-issues.mjs --with-user-token
//
// Issues already cached for the reading orders are used as is. The rest are found by
// series name and launch year (volume search), then issue number (volume detail), and
// fetched in one batch, so a run costs a few requests per new series. Lookups are cached
// in scripts/.cache/comicvine/key-issues.json. --dry-run prints ComicVine's cover dates
// and story titles without writing to Sanity. Covers are uploaded once and reused, and a
// story arc named in `coverFor` gets the issue's cover if it has none yet.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";
import { characterIds, issueSlug, issueTitle, keyIssueId, keyIssues } from "../key-issues.mjs";
import { arcId, arcs } from "../story-arcs.mjs";
import { api, sleep, USER_AGENT } from "./api.mjs";
import { loadCblIndex } from "./cbl.mjs";

const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = 1500;

const CACHE_DIR = fileURLToPath(new URL("../.cache/comicvine/", import.meta.url));
const CACHE_FILE = `${CACHE_DIR}key-issues.json`;
mkdirSync(CACHE_DIR, { recursive: true });
const load = (file) =>
  existsSync(`${CACHE_DIR}${file}`) ? JSON.parse(readFileSync(`${CACHE_DIR}${file}`, "utf8")) : {};
const cache = { volumes: {}, volumeIssues: {}, issues: {}, ...load("key-issues.json") };
const save = () => writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1));
const readingOrderIssues = load("issues.json");
const cblIndex = loadCblIndex();

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
const cvKey = (k) => `${normalize(k.series)}|${k.volume}|${k.number}`;

function fromReadingOrderCache(k) {
  const id = cblIndex.get(cvKey(k));
  const issue = id && readingOrderIssues[id];
  if (!issue) return null;
  const { name, coverDate, storeDate, image, url } = issue;
  return { id, name, coverDate, storeDate, image, url, volume: issue.volume.name };
}

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
for (const k of keyIssues) {
  if (cache.issues[cvKey(k)]) continue;
  const known = fromReadingOrderCache(k);
  if (known) {
    cache.issues[cvKey(k)] = known;
    continue;
  }
  try {
    pending.set(await findIssueId(k), cvKey(k));
  } catch (err) {
    failed.push(`${issueTitle(k)} (${k.volume}): ${err.message}`);
  }
}
if (pending.size) {
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

if (DRY_RUN) {
  for (const k of keyIssues) {
    const cv = cache.issues[cvKey(k)];
    if (!cv) continue;
    const coverYear = Number(cv.coverDate?.slice(0, 4));
    const flag = coverYear && coverYear !== k.year ? `  YEAR: cover date ${cv.coverDate}` : "";
    console.log(`${issueTitle(k)} (${k.year})${flag}`);
    console.log(`  ${cv.volume}  "${cv.name ?? ""}"  cover ${cv.coverDate}, on sale ${cv.storeDate ?? "?"}`);
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

const hasCover = (cv) => cv?.image && !/blank\.\w+$/.test(cv.image);

const arcTitles = new Set(arcs.map((a) => a.title));
const tx = client.transaction();
for (const k of keyIssues) {
  const cv = cache.issues[cvKey(k)];
  const title = issueTitle(k);
  for (const c of k.characters) {
    if (!characterIds[c]) throw new Error(`Unknown character "${c}" in ${title}`);
  }
  if (k.coverFor && !arcTitles.has(k.coverFor)) {
    throw new Error(`Unknown story arc "${k.coverFor}" in ${title}`);
  }
  const fields = {
    title,
    slug: { _type: "slug", current: issueSlug(k) },
    kind: k.kind,
    publicationYear: k.year,
    whyItMatters: k.why,
  };
  if (cv?.coverDate) fields.coverDate = cv.coverDate;
  if (k.characters.length) {
    fields.characters = k.characters.map((c) => ({
      _type: "reference",
      _ref: characterIds[c],
      _key: c,
    }));
  }
  if (hasCover(cv)) {
    fields.cover = {
      _type: "image",
      asset: { _type: "reference", _ref: await coverAsset(cv) },
      alt: `Cover of ${title}`,
      credit: "ComicVine",
    };
    if (k.coverFor) tx.patch(arcId(k.coverFor), (p) => p.setIfMissing({ cover: fields.cover }));
  }
  const _id = keyIssueId(k);
  tx.createIfNotExists({ _id, _type: "keyIssue", title, kind: k.kind, whyItMatters: k.why });
  tx.patch(_id, (p) => {
    const patch = p.set(fields);
    return k.characters.length ? patch : patch.unset(["characters"]);
  });
  console.log(`${_id}${fields.cover ? "" : "  (no cover)"}`);
}
await tx.commit();
console.log(`${keyIssues.length} key issues written.`);
if (failed.length) console.log(`No ComicVine match, so no cover:\n  ${failed.join("\n  ")}`);
