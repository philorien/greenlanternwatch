// Caches ComicVine data for every issue in the CBL reading lists.
//
//   node scripts/comicvine/fetch.mjs            covers, dates and links (bulk, about 10 requests)
//   node scripts/comicvine/fetch.mjs --credits  creator credits (one request per issue)
//
// ComicVine allows 200 requests per resource per hour, so --credits paces itself
// and takes a few hours for the full list. It is safe to stop and re-run: anything
// already in the cache is skipped.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { api, sleep } from "./api.mjs";
import { loadCblIndex } from "./cbl.mjs";

const CACHE_DIR = fileURLToPath(new URL("../.cache/comicvine/", import.meta.url));
const ISSUES_FILE = `${CACHE_DIR}issues.json`;
const CREDITS_FILE = `${CACHE_DIR}credits.json`;
const BULK_DELAY_MS = 1500;
const DETAIL_DELAY_MS = 18_500;

mkdirSync(CACHE_DIR, { recursive: true });
const load = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {});
const save = (file, data) => writeFileSync(file, JSON.stringify(data, null, 1));

const ids = [...new Set(loadCblIndex().values())];

async function fetchIssues() {
  const issues = load(ISSUES_FILE);
  const missing = ids.filter((id) => !issues[id]);
  for (let i = 0; i < missing.length; i += 100) {
    const batch = missing.slice(i, i + 100);
    const { results } = await api("issues/", {
      filter: `id:${batch.join("|")}`,
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
    save(ISSUES_FILE, issues);
    console.log(`Issues: ${Object.keys(issues).length}/${ids.length}`);
    await sleep(BULK_DELAY_MS);
  }
  const stillMissing = ids.filter((id) => !issues[id]);
  if (stillMissing.length) console.log(`ComicVine returned nothing for: ${stillMissing.join(", ")}`);
}

async function fetchCredits() {
  const credits = load(CREDITS_FILE);
  const missing = ids.filter((id) => !credits[id]);
  console.log(`Credits: ${ids.length - missing.length}/${ids.length} cached, ${missing.length} to fetch`);
  for (const [i, id] of missing.entries()) {
    const { results: result } = await api(`issue/4000-${id}/`, { field_list: "id,person_credits" });
    credits[id] = (result.person_credits ?? []).map((p) => ({ name: p.name, role: p.role }));
    save(CREDITS_FILE, credits);
    console.log(`Credits: ${ids.length - missing.length + i + 1}/${ids.length}`);
    if (i < missing.length - 1) await sleep(DETAIL_DELAY_MS);
  }
}

await fetchIssues();
if (process.argv.includes("--credits")) await fetchCredits();
