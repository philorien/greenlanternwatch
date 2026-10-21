import { defineQuery } from "next-sanity";

const articleSummary = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage { asset, hotspot, alt },
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

const keyIssueSummary = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  kind,
  publicationYear,
  whyItMatters,
  cover { asset, alt },
  "characters": characters[]->{ name, "slug": slug.current }
`;

/** Rich text with internal links resolved to the linked page's type and current slug. */
const richText = (field: string) => /* groq */ `
  ${field}[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => { "page": reference->{ _type, "slug": slug.current } }
    }
  }
`;

const readingEntry = /* groq */ `
  _key,
  title,
  issues,
  format,
  note,
  "arc": arc->{ title, "slug": slug.current },
  buyLink,
  cover { asset, alt, credit },
  releaseStart,
  releaseEnd,
  writers,
  artists,
  comicVineUrl
`;

export const HOME_QUERY = defineQuery(/* groq */ `{
  "hero": *[_type == "article" && defined(slug.current) && featured == true]
    | order(publishedAt desc)[0...4]{ ${articleSummary} },
  "latest": *[_type == "article" && defined(slug.current)]
    | order(publishedAt desc)[0...12]{ ${articleSummary} },
  "comics": *[_type == "comicIssue" && dateTime(releaseDate + "T00:00:00Z") <= dateTime(now())]
    | order(releaseDate desc)[0...30]{
      _id, title, series, storyTitle, releaseDate, cover { asset, alt },
      writers, artists, comicVineUrl,
      "coverage": coverage->{ "slug": slug.current, "coverageType": comicRelease.coverageType }
    },
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
    _updatedAt,
    mainImage { asset, hotspot, alt, caption, credit },
    comicRelease { title, publisher, releaseDate, coverageType, cover { asset, alt }, buyLink },
    ${richText("body")},
    "lead": pt::text(body[_type == "block" && style == "normal"][0...2]),
    tags,
    "related": *[_type == "article" && defined(slug.current) && _id != ^._id
        && category._ref == ^.category._ref]
      | order(publishedAt desc)[0...3]{ ${articleSummary} }
  }
`);

export const AUTHOR_PAGE_QUERY = defineQuery(/* groq */ `{
  "author": *[_type == "author" && slug.current == $slug][0]{
    _id, name, "slug": slug.current, role, avatar { asset, hotspot, alt },
    ${richText("bio")},
    "bioText": pt::text(bio),
    socials
  },
  "articles": *[_type == "article" && defined(slug.current) && author->slug.current == $slug]
    | order(publishedAt desc)[0...60]{ ${articleSummary} }
}`);

export const AUTHOR_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "author" && defined(slug.current)]{ "slug": slug.current }
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
    | order(publicationYear asc, coverDate asc){ ${keyIssueSummary} },
  "coverage": *[_type == "article" && defined(slug.current) && defined(comicRelease.title)]
    | order(comicRelease.releaseDate desc, publishedAt desc)[0...6]{ ${articleSummary} }
}`);

export const READING_ORDER_QUERY = defineQuery(/* groq */ `
  *[_type == "readingOrder" && slug.current == $slug][0]{
    _id, _updatedAt, title, "slug": slug.current, audience, tagline, ${richText("intro")},
    "lead": pt::text(intro[_type == "block" && style == "normal"][0...2]),
    sections[]{ _key, title, note, entries[]{ ${readingEntry} } }
  }
`);

export const READING_ORDER_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "readingOrder" && defined(slug.current)]{ "slug": slug.current }
`);

export const STORY_ARC_QUERY = defineQuery(/* groq */ `
  *[_type == "storyArc" && slug.current == $slug][0]{
    ${arcSummary},
    _updatedAt,
    seoDescription,
    buyLink,
    ${richText("summary")},
    "lead": pt::text(summary[_type == "block" && style == "normal"][0...2]),
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
    ${richText("bio")},
    "lead": pt::text(bio[_type == "block" && style == "normal"][0...2]),
    species,
    homeSector,
    firstAppearance,
    ${richText("abilities")},
    constructStyle,
    appearsIn,
    portrayals[]{ _key, actor, production },
    "keyStorylines": keyStorylines[]->{ ${arcSummary} },
    "keyIssues": *[_type == "keyIssue" && defined(slug.current) && ^._id in characters[]._ref]
      | order(publicationYear asc, coverDate asc){ ${keyIssueSummary} },
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
    seoDescription,
    keyFigures,
    "keyFigureCharacters": *[_type == "character" && defined(slug.current)
      && (name in ^.keyFigures || alias in ^.keyFigures)]{ name, alias, "slug": slug.current },
    ${richText("description")},
    "lead": pt::text(description[_type == "block" && style == "normal"][0...2]),
    "storylines": *[_type == "storyArc" && ^._id in corps[]._ref]
      | order(startYear asc){ ${arcSummary} },
    "members": *[_type == "character" && corps._ref == ^._id]
      | order(order asc, name asc){ ${characterSummary} }
  }
`);

export const CORPS_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "corps" && defined(slug.current)]{ "slug": slug.current }
`);

const explainerDoc = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  dek,
  seoDescription,
  publishedAt,
  "updatedAt": _updatedAt,
  mainImage { asset, hotspot, alt, caption, credit },
  "author": author->{ name, "slug": slug.current },
  sections[]{
    _key,
    title,
    anchor,
    blocks[]{
      ...,
      items[]{ ... },
      rows[]{ ... }
    }
  }
`;

export const EXPLAINERS_QUERY = defineQuery(/* groq */ `
  *[_type == "explainer" && defined(slug.current)]
    | order(publishedAt desc){ ${explainerDoc} }
`);

export const EXPLAINER_QUERY = defineQuery(/* groq */ `
  *[_type == "explainer" && slug.current == $slug][0]{ ${explainerDoc} }
`);

export const EXPLAINER_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "explainer" && defined(slug.current)]{ "slug": slug.current }
`);

export const SITEMAP_QUERY = defineQuery(/* groq */ `
  *[_type in ["article", "explainer", "character", "storyArc", "readingOrder", "corps", "category", "author"]
      && defined(slug.current) && !(_id in path("drafts.**"))]{
    _type,
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
`);

export const SEARCH_QUERY = defineQuery(/* groq */ `
  *[_type in ["article", "explainer", "character", "storyArc", "readingOrder", "corps"]
      && defined(slug.current)
      && (
        title match $q || name match $q || excerpt match $q || tagline match $q || dek match $q
        || sections[].blocks[].text match $q
        || sections[].blocks[].items[].text match $q
        || sections[].blocks[].items[].lead match $q
        || sections[].blocks[].rows[].what match $q
      )]
    | order(_type asc){
      _id,
      _type,
      "title": coalesce(title, name),
      "slug": slug.current,
      "excerpt": coalesce(excerpt, tagline, dek)
    }[0...40]
`);
