import { defineQuery } from "next-sanity";

const articleSummary = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage { asset, alt },
  "category": category->{ title, "slug": slug.current },
  "author": author->{ name, "slug": slug.current },
  "bodyLength": length(pt::text(body)),
  comicRelease {
    title, publisher, releaseDate, coverageType,
    cover { asset, alt }
  }
`;

const characterSummary = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  alias,
  section,
  portrait { asset, alt },
  "corps": corps->{ name, "slug": slug.current, spectrum }
`;

const corpsSummary = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  spectrum,
  emotion,
  tagline
`;

const arcSummary = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  tagline,
  kind,
  creators,
  publisher,
  startYear,
  endYear,
  cover { asset, alt }
`;

const readingEntry = /* groq */ `
  _key,
  title,
  issues,
  format,
  note,
  "arc": arc->{ title, "slug": slug.current }
`;

export const HOME_QUERY = defineQuery(/* groq */ `{
  "hero": *[_type == "article" && defined(slug.current) && featured == true]
    | order(publishedAt desc)[0...4]{ ${articleSummary} },
  "latest": *[_type == "article" && defined(slug.current)]
    | order(publishedAt desc)[0...12]{ ${articleSummary} },
  "comics": *[_type == "article" && defined(slug.current) && defined(comicRelease.title)]
    | order(comicRelease.releaseDate desc, publishedAt desc)[0...5]{ ${articleSummary} },
  "features": *[_type == "article" && defined(slug.current)
      && category._ref in *[_type == "category" && slug.current == "features"]._id]
    | order(publishedAt desc)[0...3]{ ${articleSummary} },
  "categories": *[_type == "category" && defined(slug.current)]
    | order(order asc){ _id, title, "slug": slug.current, description },
  "startHere": *[_type == "readingOrder" && audience == "new-reader"]
    | order(order asc)[0]{ title, "slug": slug.current, tagline }
}`);

export const NEWS_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && defined(slug.current)]
    | order(publishedAt desc)[0...60]{ ${articleSummary} }
`);

export const CATEGORY_PAGE_QUERY = defineQuery(/* groq */ `{
  "category": *[_type == "category" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, description
  },
  "articles": *[_type == "article" && defined(slug.current)
      && category._ref in *[_type == "category" && slug.current == $slug]._id]
    | order(publishedAt desc)[0...60]{ ${articleSummary} }
}`);

export const CATEGORY_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`);

export const ARTICLE_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && slug.current == $slug][0]{
    ${articleSummary},
    mainImage { asset, alt, caption, credit },
    body,
    tags,
    "related": *[_type == "article" && defined(slug.current) && _id != ^._id
        && category._ref == ^.category._ref]
      | order(publishedAt desc)[0...3]{ ${articleSummary} }
  }
`);

export const ARTICLE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`);

export const COMICS_HUB_QUERY = defineQuery(/* groq */ `{
  "orders": *[_type == "readingOrder" && defined(slug.current)]
    | order(order asc){
      _id, title, "slug": slug.current, audience, tagline,
      "entryCount": count(sections[].entries[])
    },
  "arcs": *[_type == "storyArc" && defined(slug.current)]
    | order(startYear asc){ ${arcSummary} },
  "keyIssues": *[_type == "keyIssue" && defined(slug.current)]
    | order(publicationYear asc){
      _id, title, "slug": slug.current, kind, publicationYear,
      whyItMatters, cover { asset, alt },
      "characters": characters[]->{ name, "slug": slug.current }
    },
  "coverage": *[_type == "article" && defined(slug.current) && defined(comicRelease.title)]
    | order(comicRelease.releaseDate desc, publishedAt desc)[0...6]{ ${articleSummary} }
}`);

export const READING_ORDER_QUERY = defineQuery(/* groq */ `
  *[_type == "readingOrder" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, audience, tagline, intro,
    sections[]{ _key, title, note, entries[]{ ${readingEntry} } }
  }
`);

export const READING_ORDER_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "readingOrder" && defined(slug.current)]{ "slug": slug.current }
`);

export const STORY_ARC_QUERY = defineQuery(/* groq */ `
  *[_type == "storyArc" && slug.current == $slug][0]{
    ${arcSummary},
    summary,
    readingList[]{ ${readingEntry} },
    "characters": characters[]->{ ${characterSummary} },
    "corps": corps[]->{ ${corpsSummary} }
  }
`);

export const STORY_ARC_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "storyArc" && defined(slug.current)]{ "slug": slug.current }
`);

export const CHARACTERS_QUERY = defineQuery(/* groq */ `{
  "characters": *[_type == "character" && defined(slug.current)]
    | order(order asc, name asc){ ${characterSummary} },
  "corps": *[_type == "corps" && defined(slug.current)]
    | order(order asc){ ${corpsSummary} }
}`);

export const CHARACTER_QUERY = defineQuery(/* groq */ `
  *[_type == "character" && slug.current == $slug][0]{
    ${characterSummary},
    bio,
    species,
    homeSector,
    firstAppearance,
    abilities,
    constructStyle,
    appearsIn,
    portrayals[]{ _key, actor, production },
    "keyStorylines": keyStorylines[]->{ ${arcSummary} },
    "readingRecommendations": readingRecommendations[]->{
      _id, _type, title, "slug": slug.current
    }
  }
`);

export const CHARACTER_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "character" && defined(slug.current)]{ "slug": slug.current }
`);

export const CORPS_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "corps" && defined(slug.current)]
    | order(order asc){ ${corpsSummary} }
`);

export const CORPS_QUERY = defineQuery(/* groq */ `
  *[_type == "corps" && slug.current == $slug][0]{
    ${corpsSummary},
    keyFigures,
    description,
    "members": *[_type == "character" && corps._ref == ^._id]
      | order(order asc, name asc){ ${characterSummary} }
  }
`);

export const CORPS_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "corps" && defined(slug.current)]{ "slug": slug.current }
`);

export const SEARCH_QUERY = defineQuery(/* groq */ `
  *[_type in ["article", "character", "storyArc", "readingOrder", "corps"]
      && defined(slug.current)
      && (title match $q || name match $q || excerpt match $q || tagline match $q)]
    | order(_type asc){
      _id,
      _type,
      "title": coalesce(title, name),
      "slug": slug.current,
      "excerpt": coalesce(excerpt, tagline)
    }[0...40]
`);
