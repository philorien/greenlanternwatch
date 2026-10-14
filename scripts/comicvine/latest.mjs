// Syncs the newest issues of every current Lantern series from ComicVine into
// Sanity as comicIssue documents, for Latest Comics on the home page.
//
//   set -a; source .env.local; set +a
//   npx sanity exec scripts/comicvine/latest.mjs --with-user-token
//
// Series are found by searching DC volumes with "Lantern" in the name; add IDs to
// EXTRA_VOLUMES for series that don't have it (a Sinestro solo book, say). Each run
// keeps the last few released issues of each series plus anything solicited, so
// upcoming issues appear on their release day without another run. Only ComicVine
// fields are written, so a linked review set in the Studio is kept.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";
import { api, sleep, USER_AGENT } from "./api.mjs";

const EXTRA_VOLUMES = [];
const REPRINT = /facsimile|dc finest|omnibus|compendium|deluxe edition|box set/i;
// ComicVine files trade paperbacks under the series name, with issues titled "Vol. 2: Sojourner".
const COLLECTED_EDITION = /^vol(ume)?\.? \d/i;
const MAX_VOLUME_AGE_YEARS = 5;
const RELEASED_PER_SERIES = 3;
const LOOKBACK_DAYS = 180;
const LOOKAHEAD_DAYS = 90;
const BULK_DELAY_MS = 1500;
const DETAIL_DELAY_MS = 2000;

const CACHE_DIR = fileURLToPath(new URL("../.cache/comicvine/", import.meta.url));
const CREDITS_FILE = `${CACHE_DIR}latest-credits.json`;
mkdirSync(CACHE_DIR, { recursive: true });
const credits = existsSync(CREDITS_FILE) ? JSON.parse(readFileSync(CREDITS_FILE, "utf8")) : {};

const client = getCliClient({ apiVersion: "2026-10-14" });
const isoDate = (offsetDays) => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
const today = isoDate(0);

async function findVolumes() {
  const volumes = new Map();
  const minYear = new Date().getFullYear() - MAX_VOLUME_AGE_YEARS;
  for (let offset = 0; ; offset += 100) {
    const page = await api("volumes/", {
      filter: "name:Lantern",
      limit: "100",
      offset: String(offset),
      field_list: "id,name,start_year,publisher",
    });
    for (const v of page.results) {
      if (v.publisher?.name !== "DC Comics" || REPRINT.test(v.name)) continue;
      if (Number(v.start_year) >= minYear) volumes.set(v.id, v);
    }
    if (offset + 100 >= page.number_of_total_results) break;
    await sleep(BULK_DELAY_MS);
  }
  for (const id of EXTRA_VOLUMES) {
    const { results } = await api(`volume/4050-${id}/`, { field_list: "id,name,start_year,publisher" });
    volumes.set(results.id, results);
  }
  return volumes;
}

async function findIssues(volumes) {
  const { results } = await api("issues/", {
    filter: `volume:${[...volumes.keys()].join("|")},store_date:${isoDate(-LOOKBACK_DAYS)}|${isoDate(LOOKAHEAD_DAYS)}`,
    sort: "store_date:desc",
    limit: "100",
    field_list: "id,name,issue_number,store_date,image,site_detail_url,volume",
  });
  const released = new Map();
  return results.filter((issue) => {
    if (COLLECTED_EDITION.test(issue.name ?? "")) return false;
    if (issue.store_date > today) return true;
    const count = released.get(issue.volume.id) ?? 0;
    released.set(issue.volume.id, count + 1);
    return count < RELEASED_PER_SERIES;
  });
}

async function issueCredits(issue) {
  if (credits[issue.id]) return credits[issue.id];
  await sleep(DETAIL_DELAY_MS);
  const { results } = await api(`issue/4000-${issue.id}/`, { field_list: "id,person_credits" });
  const people = (results.person_credits ?? []).map((p) => ({ name: p.name, role: p.role }));
  if (issue.store_date <= today && people.length) {
    credits[issue.id] = people;
    writeFileSync(CREDITS_FILE, JSON.stringify(credits, null, 1));
  }
  return people;
}

const creditedAs = (people, matchesRole) =>
  people
    .filter((p) => p.role.split(",").some((r) => matchesRole(r.trim())))
    .map((p) => p.name);

const hasCover = (issue) => issue.image?.super_url && !/blank\.\w+$/.test(issue.image.super_url);

async function coverAsset(issue, assets) {
  const key = String(issue.id);
  if (assets.has(key)) return assets.get(key);
  const res = await fetch(issue.image.super_url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Cover download failed for ${issue.id}: HTTP ${res.status}`);
  const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), {
    filename: `comicvine-${issue.id}.jpg`,
    source: { name: "comicvine", id: key, url: issue.site_detail_url },
  });
  assets.set(key, asset._id);
  return asset._id;
}

const volumes = await findVolumes();
console.log(`Series: ${[...volumes.values()].map((v) => `${v.name} (${v.start_year})`).join(", ")}`);
const issues = await findIssues(volumes);

const assets = new Map(
  (
    await client.fetch(
      `*[_type == "sanity.imageAsset" && source.name == "comicvine" && source.id in $ids]{ _id, "id": source.id }`,
      { ids: issues.map((i) => String(i.id)) },
    )
  ).map((a) => [a.id, a._id]),
);

const tx = client.transaction();
for (const issue of issues) {
  const volume = volumes.get(issue.volume.id);
  const title = `${volume.name} #${issue.issue_number}`;
  const people = await issueCredits(issue);
  const fields = {
    title,
    series: `${volume.name} (${volume.start_year})`,
    issueNumber: issue.issue_number,
    storyTitle: issue.name ?? undefined,
    releaseDate: issue.store_date,
    writers: creditedAs(people, (r) => r === "writer"),
    artists: creditedAs(people, (r) => r === "penciler" || r === "artist"),
    comicVineUrl: issue.site_detail_url,
    comicVineId: issue.id,
  };
  if (hasCover(issue)) {
    fields.cover = {
      _type: "image",
      asset: { _type: "reference", _ref: await coverAsset(issue, assets) },
      alt: `Cover of ${title}`,
      credit: "ComicVine",
    };
  }
  const _id = `comicIssue-cv-${issue.id}`;
  tx.createIfNotExists({ _id, _type: "comicIssue", title, releaseDate: issue.store_date });
  tx.patch(_id, (p) => p.set(fields));
  const status = issue.store_date > today ? "upcoming" : "released";
  console.log(`${issue.store_date}  ${title}  (${status}${fields.cover ? "" : ", no cover yet"})`);
}
await tx.commit();
console.log(`${issues.length} issues synced.`);
