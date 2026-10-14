import { defineQuery } from "next-sanity";

const articleSummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  mainImage { asset, alt },
  "categories": categories[]->{ title, "slug": slug.current }
`;

const characterSummaryFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  alias,
  portrait { asset, alt },
  "corps": corps->{ name, "slug": slug.current }
`;

const comicRunSummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  tier,
  readingOrder,
  creators,
  startYear,
  endYear,
  tagline,
  cover { asset, alt }
`;

export const HOME_QUERY = defineQuery(/* groq */ `{
  "featured": *[_type == "article" && defined(slug.current) && featured == true]
    | order(publishedAt desc)[0...1]{ ${articleSummaryFields} },
  "latest": *[_type == "article" && defined(slug.current)]
    | order(publishedAt desc)[0...6]{ ${articleSummaryFields} },
  "essentialRuns": *[_type == "comicRun" && defined(slug.current) && tier == "essential"]
    | order(readingOrder asc)[0...4]{ ${comicRunSummaryFields} },
  "corps": *[_type == "corps" && defined(slug.current)]
    | order(name asc){ _id, name, "slug": slug.current, tagline }
}`);

export const ARTICLES_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && defined(slug.current)]
    | order(publishedAt desc){ ${articleSummaryFields} }
`);

export const ARTICLE_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && slug.current == $slug][0]{
    ${articleSummaryFields},
    mainImage { asset, alt, caption },
    body
  }
`);

export const ARTICLE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`);

export const COMIC_RUNS_QUERY = defineQuery(/* groq */ `
  *[_type == "comicRun" && defined(slug.current)]
    | order(readingOrder asc){ ${comicRunSummaryFields} }
`);

export const COMIC_RUN_QUERY = defineQuery(/* groq */ `
  *[_type == "comicRun" && slug.current == $slug][0]{
    ${comicRunSummaryFields},
    issueRange,
    publisher,
    summary,
    "characters": characters[]->{ ${characterSummaryFields} }
  }
`);

export const COMIC_RUN_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "comicRun" && defined(slug.current)]{ "slug": slug.current }
`);

export const CHARACTERS_QUERY = defineQuery(/* groq */ `
  *[_type == "character" && defined(slug.current)]
    | order(name asc){ ${characterSummaryFields} }
`);

export const CHARACTER_QUERY = defineQuery(/* groq */ `
  *[_type == "character" && slug.current == $slug][0]{
    ${characterSummaryFields},
    species,
    homeSector,
    firstAppearance,
    appearsIn,
    bio
  }
`);

export const CHARACTER_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "character" && defined(slug.current)]{ "slug": slug.current }
`);

export const CORPS_QUERY = defineQuery(/* groq */ `
  *[_type == "corps" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    "members": *[_type == "character" && corps._ref == ^._id]
      | order(name asc){ ${characterSummaryFields} }
  }
`);

export const CORPS_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "corps" && defined(slug.current)]{ "slug": slug.current }
`);

export const CORPS_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "corps" && defined(slug.current)]
    | order(name asc){ _id, name, "slug": slug.current, tagline }
`);
