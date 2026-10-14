import { defineArrayMember, defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons/Book";

export const comicRun = defineType({
  name: "comicRun",
  title: "Comic run",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "A series, a creative run, or a collected storyline.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tier",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Essential", value: "essential" },
          { title: "Recommended", value: "recommended" },
          { title: "Deep cut", value: "deep-cut" },
        ],
      },
      initialValue: "recommended",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readingOrder",
      type: "number",
      description: "Lower numbers appear first in the reading guide.",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "tagline",
      type: "string",
      description: "One line on why someone should read this.",
    }),
    defineField({
      name: "creators",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({ name: "publisher", type: "string" }),
    defineField({ name: "startYear", type: "number" }),
    defineField({
      name: "endYear",
      type: "number",
      validation: (rule) =>
        rule.custom((endYear, context) => {
          const startYear = (context.document as { startYear?: number })
            ?.startYear;
          if (endYear && startYear && endYear < startYear) {
            return "End year must not be before start year";
          }
          return true;
        }),
    }),
    defineField({
      name: "issueRange",
      type: "string",
      description: 'For example "Issues 1 to 25".',
    }),
    defineField({
      name: "cover",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "characters",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "character" }] }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({ name: "summary", type: "blockContent" }),
  ],
  orderings: [
    {
      title: "Reading order",
      name: "readingOrderAsc",
      by: [{ field: "readingOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", tier: "tier", media: "cover" },
    prepare: ({ title, tier, media }) => ({
      title,
      subtitle: tier,
      media,
    }),
  },
});
