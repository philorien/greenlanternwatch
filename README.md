# Green Lantern Watch

greenlanternwatch.com. Your Sector for All Things Green Lantern.

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

Content updates show up within 60 seconds (ISR). For instant updates, add a Sanity webhook that calls a revalidation route (not built yet).

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

## Notes

- Not built yet: community and forums, the Corps quiz, the Sector map, polls, a light theme, and the newsletter back end. The signup box appears only when `NEXT_PUBLIC_NEWSLETTER_ACTION` is set to your email provider's form URL. Social links appear only for the handles you set.
- This is an unofficial fan site. Do not upload official logos, studio stills or scanned comic pages you do not have rights to. Every image field has a credit field for this reason. The footer disclaimer is in `src/components/SiteFooter.tsx`.
- Types in `src/sanity/types.ts` are written by hand. Sanity TypeGen is a good next step once the schema settles.
