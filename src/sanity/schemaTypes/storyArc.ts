import { defineArrayMember, defineField, defineType } from "sanity";
import { StackIcon } from "@sanity/icons/Stack";

export const storyArc = defineType({
  name: "storyArc",
  title: "Story arc",
  type: "document",
  icon: StackIcon,
  description: "An event or storyline hub, such as a crossover or a creative run.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      description: "One line on why this arc matters.",
    }),
    defineField({
      name: "kind",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Event", value: "event" },
          { title: "Creative run", value: "run" },
          { title: "Storyline", value: "storyline" },
        ],
      },
      initialValue: "storyline",
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
          const startYear = (context.document as { startYear?: number })?.startYear;
          if (endYear && startYear && endYear < startYear) {
            return "End year must not be before start year";
          }
          return true;
        }),
    }),
    defineField({
      name: "cover",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
        defineField({ name: "credit", type: "string" }),
      ],
    }),
    defineField({
      name: "buyLink",
      title: "Buy link",
      type: "url",
      description: "Where to buy the collected edition, such as an Amazon affiliate link. Shows as a button under the arc's details.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({ name: "summary", type: "blockContent" }),
    defineField({
      name: "readingList",
      type: "array",
      of: [defineArrayMember({ type: "readingEntry" })],
    }),
    defineField({
      name: "characters",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "character" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "corps",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "corps" }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "kind", media: "cover" },
  },
});
