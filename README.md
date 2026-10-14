# Green Lantern Watch

greenlanternwatch.com

Next.js (App Router) + Tailwind CSS v4 + Sanity + Vercel.

Content: news articles, a tiered comics reading guide, and character and Corps profiles. Sanity Studio is embedded at `/studio`.

## First-time setup

1. Create a Sanity project and dataset (from this folder):

   ```bash
   npx sanity login
   npx sanity init --env --create-project "Green Lantern Watch" --dataset production
   ```

   If `init` tries to scaffold files, decline. You only need the project ID.

2. Create `.env.local` from `.env.example` and fill in the project ID:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<your project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

3. Run it:

   ```bash
   npm install
   npm run dev
   ```

   Site: http://localhost:3000, Studio: http://localhost:3000/studio

4. Allow the site to talk to the Studio origin. In https://www.sanity.io/manage, open the project, go to API, CORS origins, and add `http://localhost:3000` with credentials allowed. Add your production URL later too.

The site builds and runs without a project ID. Pages show empty states until content exists.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel. The framework preset is detected automatically.
3. Add the same two environment variables under Project Settings, Environment Variables.
4. Add `greenlanternwatch.com` under Project Settings, Domains, and point DNS at Vercel as it instructs. Add the www variant and redirect one to the other.
5. Add `https://greenlanternwatch.com` (and the `www` variant) as CORS origins in Sanity with credentials allowed, so `/studio` works in production.
6. `NEXT_PUBLIC_SITE_URL` defaults to `https://greenlanternwatch.com` in production builds. Override it only if the canonical domain changes.

Content updates show up within 60 seconds (ISR). For instant updates, add a Sanity webhook that calls a revalidation route (not built yet).

## Structure

```
src/app/(site)/        public pages (home, articles, comics, characters, corps)
src/app/studio/        embedded Sanity Studio
src/sanity/            client, queries, image helper, hand-written types
src/sanity/schemaTypes document and object schemas
src/components/        shared UI
sanity.config.ts       Studio config
```

## Content model

- `article`: title, slug, excerpt, publishedAt, categories, mainImage, featured, body
- `category`: title, slug, description
- `comicRun`: title, slug, tier (essential, recommended, deep-cut), readingOrder, creators, years, cover, characters, summary
- `character`: name, slug, alias, corps, portrait, species, homeSector, firstAppearance, appearsIn, bio
- `corps`: name, slug, tagline, description

## Notes

- This is an unofficial fan site. Do not upload official logos, studio stills or scanned comic pages you do not have rights to. The footer disclaimer is in `src/components/SiteFooter.tsx`.
- Types in `src/sanity/types.ts` are written by hand. Sanity TypeGen is a good next step once the schema is stable.
