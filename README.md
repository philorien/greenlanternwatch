# Green Lantern Watch

[greenlanternwatch.com](https://greenlanternwatch.com). Your Sector for All Things Green Lantern. An unofficial fan site, not affiliated with or endorsed by DC.

Next.js (App Router) + Tailwind CSS v4 + Sanity + Vercel. Sanity Studio is embedded at `/studio`.

## First-time setup

1. Create a Sanity project and dataset (from this folder):

   ```bash
   npx sanity login
   npx sanity init --env --create-project "Green Lantern Watch" --dataset production
   ```

   If `init` tries to scaffold files, decline. You only need the project ID.

2. Create `.env.local` from `.env.example` and fill in the project ID.

3. Run it:

   ```bash
   npm install
   npm run dev
   ```

   Site: http://localhost:3000, Studio: http://localhost:3000/studio

4. In https://www.sanity.io/manage, open the project, go to API, CORS origins, and add `http://localhost:3000` with credentials allowed.

5. Create five categories in the Studio with these exact slugs: `comics`, `movies-tv`, `characters`, `features`, `reviews`. The nav and home page link to them.

## Demo mode

While `NEXT_PUBLIC_SANITY_PROJECT_ID` is empty, `npm run dev` fills every page with clearly labelled placeholder content so you can check the layout. A banner says so. Production builds never show demo content, only empty states.

## Deploy to Vercel

1. Import the repo in Vercel. The framework preset is detected automatically.
2. Add the environment variables from `.env.example` under Project Settings, Environment Variables.
3. Add `greenlanternwatch.com` under Project Settings, Domains, and point DNS at Vercel as it instructs. Add the www variant and redirect one to the other.
4. Add `https://greenlanternwatch.com` (and the www variant) as CORS origins in Sanity with credentials allowed, so `/studio` works in production.

Content updates go live through a Sanity webhook. Pages are cached for a day otherwise, because short ISR timers re-render pages on nearly every visit and burn through Vercel's CPU allowance.

This is already set up (October 2026). To recreate it:

1. Generate a secret (`openssl rand -base64 32`) and add it in Vercel as `SANITY_REVALIDATE_SECRET` (Production).
2. In sanity.io/manage, under API, Webhooks, create a webhook: URL `https://www.greenlanternwatch.com/api/revalidate` (the `www` host, since Sanity won't follow a redirect on POST), dataset `production`, trigger on create, update and delete, filter `!(_type in ["sanity.imageAsset", "sanity.fileAsset"])`, projection `{_type}`, HTTP method POST, drafts off, and the same secret.

Any publish clears the whole site's cache, and each page re-renders the next time someone visits it. If the webhook fails, content still refreshes within a day.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero carousel, latest news, featured articles, latest comics, recent features, sidebar |
| `/news`, `/news/[slug]` | All articles, article page |
| `/category/[slug]` | Articles by category (Movies & TV, Features, Reviews, and so on) |
| `/comics` | The Book of Oa: reading orders, story arcs, key issues, new-comic coverage |
| `/comics/reading-orders/[slug]`, `/comics/arcs/[slug]` | Reading order and story arc hubs |
| `/characters`, `/characters/[slug]` | The character database |
| `/corps`, `/corps/[slug]` | The emotional spectrum and each Corps |
| `/search` | Search across articles, characters, arcs, reading orders and Corps |

## Content model

- `article`: title, slug, excerpt, category, author, publishedAt, featured, mainImage (alt, caption, credit), body, tags, and an optional `comicRelease` group that feeds Latest Comics
- `category`, `author`
- `readingOrder`: audience (new reader, era, character), sections of `readingEntry` items
- `storyArc`: kind (event, run, storyline), creators, years, summary, reading list, characters, Corps
- `keyIssue`: kind (first appearance, origin, villain debut, historic ring, milestone), why it matters, characters
- `character`: section (Earth, alien, other), Corps, bio, abilities, construct style, portrayals, key storylines, reading recommendations
- `corps`: spectrum color, emotion, tagline, key figures, description

## Content pipeline

Most reference content is written as code in `scripts/` and imported into Sanity, so it can be reviewed in diffs and rebuilt from scratch. ComicVine fills in the facts.

- **Seed scripts** (`characters.mjs`, `corps.mjs`, `story-arcs.mjs`, `explainers.mjs` and the reading order scripts) write NDJSON for `sanity dataset import`. Document IDs are fixed, so re-running an import replaces documents in place. Reading orders use a shorthand (`GL (2005) #29-35 @secret-origin | note`) that `reading-order-build.mjs` expands.
- **ComicVine** (`scripts/comicvine/`): the CBL reading lists in `scripts/data/` record a ComicVine ID for every issue. `fetch.mjs` caches covers, release dates and creator credits, pacing itself under ComicVine's rate limit and picking up where it left off. `sync.mjs` writes those fields into Sanity without touching editorial notes and uploads each cover once. `key-issues.mjs` and `latest.mjs` do the same for key issues and for the newest issues of every current Lantern series.

Each script's header comment has its exact commands. The ComicVine scripts read `comicvine_api_key` from `.env.local`.

## Notes

- Not built yet: community and forums, the Corps quiz, the Sector map, polls, a light theme, and the newsletter back end. The signup box appears only when `NEXT_PUBLIC_NEWSLETTER_ACTION` is set to your email provider's form URL. Social links appear only for the handles you set.
- This is an unofficial fan site. Do not upload official logos, studio stills or scanned comic pages you do not have rights to. Every image field has a credit field for this reason. The footer disclaimer is in `src/components/SiteFooter.tsx`.
- Types in `src/sanity/types.ts` are written by hand. Sanity TypeGen is a good next step once the schema settles.
