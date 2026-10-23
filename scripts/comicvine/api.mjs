// Shared ComicVine API access. Reads comicvine_api_key from .env.local.

import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// CI passes the key as an environment variable instead of a file.
const envFile = fileURLToPath(new URL("../../.env.local", import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
const apiKey = process.env.comicvine_api_key;
if (!apiKey) throw new Error("Set comicvine_api_key in .env.local");

const RATE_LIMIT_WAIT_MS = 10 * 60_000;

export const USER_AGENT = "GreenLanternWatch/1.0";
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function api(path, params) {
  const url = new URL(`https://comicvine.gamespot.com/api/${path}`);
  url.search = new URLSearchParams({ api_key: apiKey, format: "json", ...params });
  for (;;) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const body = res.ok ? await res.json() : null;
    if (body?.status_code === 1) return body;
    if (res.status === 420 || res.status === 429 || body?.status_code === 107) {
      console.log(`Rate limited. Waiting ${RATE_LIMIT_WAIT_MS / 60_000} minutes.`);
      await sleep(RATE_LIMIT_WAIT_MS);
      continue;
    }
    throw new Error(`ComicVine ${path} failed: HTTP ${res.status} ${body?.error ?? ""}`);
  }
}
