import { defineArrayMember, defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";

export const comicIssue = defineType({
  name: "comicIssue",
  title: "Comic issue",
  type: "document",
  icon: ImagesIcon,
  description:
    "New issues of the current Lantern series, synced from ComicVine by scripts/comicvine/latest.mjs. The newest issue of each series leads Latest Comics on the home page.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: 'Series and number, for example "Green Lantern Corps #21".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "series",
      type: "string",
      description: 'Series and launch year, for example "Green Lantern Corps (2025)".',
    }),
    defineField({ name: "issueNumber", type: "string" }),
    defineField({
      name: "storyTitle",
      type: "string",
      description: "The issue's own title, if it has one.",
    }),
    defineField({
      name: "releaseDate",
      type: "date",
      description: "Day the issue goes on sale. Upcoming issues stay hidden until then.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      type: "image",
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
        defineField({ name: "credit", type: "string" }),
      ],
    }),
    defineField({
      name: "writers",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "artists",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "coverage",
      type: "reference",
      to: [{ type: "article" }],
      description:
        "Our review or preview of this issue. The home page card links here instead of ComicVine.",
    }),
    defineField({ name: "comicVineUrl", title: "ComicVine URL", type: "url" }),
    defineField({ name: "comicVineId", title: "ComicVine ID", type: "number", readOnly: true }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "releaseDateDesc",
      by: [{ field: "releaseDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", storyTitle: "storyTitle", date: "releaseDate", media: "cover" },
    prepare: ({ title, storyTitle, date, media }) => ({
      title,
      subtitle: [storyTitle, date].filter(Boolean).join(" / "),
      media,
    }),
  },
});
