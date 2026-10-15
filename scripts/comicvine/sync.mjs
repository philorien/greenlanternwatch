// Fills in reading-order and story-arc entries from the ComicVine cache: first-issue
// cover, release dates, ComicVine link and, once cached, writer and artist credits.
// Story arcs without a cover get the cover of the first issue in their reading list.
//
//   node scripts/comicvine/fetch.mjs
//   set -a; source .env.local; set +a
//   npx sanity exec scripts/comicvine/sync.mjs --with-user-token
//   npx sanity exec scripts/comicvine/sync.mjs --with-user-token -- --only <document id>
//
// Only the ComicVine fields are written, so notes and other edits are kept. Covers
// are uploaded once and reused on later runs. Entries that aren't in the CBL lists
// are skipped. --only limits the run to one reading order or story arc.

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";
import { comicVineIds, loadCblIndex } from "./cbl.mjs";

const CACHE_DIR = fileURLToPath(new URL("../.cache/comicvine/", import.meta.url));
const load = (file) =>
  existsSync(`${CACHE_DIR}${file}`) ? JSON.parse(readFileSync(`${CACHE_DIR}${file}`, "utf8")) : {};

const issues = load("issues.json");
const credits = load("credits.json");
const index = loadCblIndex();
const client = getCliClient({ apiVersion: "2026-10-14" }).withConfig({ perspective: "raw" });

const MAX_CREDITED = 3;
const onlyArg = process.argv.indexOf("--only");
const only = onlyArg === -1 ? null : process.argv[onlyArg + 1];
const releaseDate = (issue) => issue.storeDate ?? issue.coverDate;

function topCreators(ids, matchesRole) {
  const counts = new Map();
  for (const id of ids) {
    for (const { name, role } of credits[id]) {
      const roles = role.split(",").map((r) => r.trim());
      if (roles.some(matchesRole)) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_CREDITED)
    .map(([name]) => name);
}

const assets = new Map(
  (
    await client.fetch(
      `*[_type == "sanity.imageAsset" && source.name == "comicvine"]{ _id, "id": source.id }`,
    )
  ).map((a) => [a.id, a._id]),
);

async function coverAsset(id) {
  const key = String(id);
  if (assets.has(key)) return assets.get(key);
  const issue = issues[id];
  const res = await fetch(issue.image, { headers: { "User-Agent": "GreenLanternWatch/1.0" } });
  if (!res.ok) throw new Error(`Cover download failed for ${id}: HTTP ${res.status}`);
  const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), {
    filename: `comicvine-${id}.jpg`,
    source: { name: "comicvine", id: key, url: issue.url },
  });
  assets.set(key, asset._id);
  return asset._id;
}

const orders = await client.fetch(
  `*[_type == "readingOrder"]{ _id, title, sections[]{ _key, entries[]{ _key, title, issues } } }`,
);
const arcs = await client.fetch(
  `*[_type == "storyArc"]{ _id, title, "hasCover": defined(cover.asset), readingList[]{ _key, title, issues } }`,
);
const docs = [
  ...orders.map((doc) => ({
    ...doc,
    entries: (doc.sections ?? []).flatMap((s) =>
      (s.entries ?? []).map((e) => [`sections[_key=="${s._key}"].entries[_key=="${e._key}"]`, e]),
    ),
  })),
  ...arcs.map((doc) => ({
    ...doc,
    needsCover: !doc.hasCover,
    entries: (doc.readingList ?? []).map((e) => [`readingList[_key=="${e._key}"]`, e]),
  })),
].filter((doc) => !only || doc._id === only);
if (only && docs.length === 0) throw new Error(`No reading order or story arc with id "${only}"`);

let entriesUpdated = 0;
let entriesWithCredits = 0;
const skipped = [];

for (const doc of docs) {
  const fields = {};
  for (const [path, entry] of doc.entries) {
    let ids;
    try {
      ids = comicVineIds(entry, index);
    } catch (err) {
      skipped.push(`${doc.title}: ${err.message}`);
      continue;
    }
    const first = issues[ids[0]];
    const last = issues[ids.at(-1)];
    if (!first || !last) {
      skipped.push(`${doc.title}: ${entry.title} ${entry.issues} is not in the ComicVine cache`);
      continue;
    }
    const cover = {
      _type: "image",
      asset: { _type: "reference", _ref: await coverAsset(ids[0]) },
      alt: `Cover of ${entry.title} #${first.number}`,
      credit: "ComicVine",
    };
    fields[`${path}.cover`] = cover;
    if (doc.needsCover && !fields.cover) fields.cover = cover;
    fields[`${path}.releaseStart`] = releaseDate(first);
    if (ids.length > 1) fields[`${path}.releaseEnd`] = releaseDate(last);
    fields[`${path}.comicVineUrl`] = ids.length > 1 ? first.volume.url : first.url;
    if (ids.every((id) => credits[id])) {
      fields[`${path}.writers`] = topCreators(ids, (r) => r === "writer");
      fields[`${path}.artists`] = topCreators(ids, (r) => r === "penciler" || r === "artist");
      entriesWithCredits++;
    }
    entriesUpdated++;
  }
  if (Object.keys(fields).length) {
    await client.patch(doc._id).set(fields).commit({ autoGenerateArrayKeys: false });
    console.log(`Updated ${doc._id}`);
  }
}

console.log(
  `${entriesUpdated} entries updated, ${entriesWithCredits} with credits, ${assets.size} covers in Sanity.`,
);
if (skipped.length) console.log(`Skipped:\n  ${skipped.join("\n  ")}`);
