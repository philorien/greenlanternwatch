import { defineArrayMember, defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons/Book";

export const readingOrder = defineType({
  name: "readingOrder",
  title: "Reading order",
  type: "document",
  icon: BookIcon,
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
      name: "audience",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "New readers", value: "new-reader" },
          { title: "Era guide", value: "era" },
          { title: "Character guide", value: "character" },
        ],
      },
      initialValue: "era",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first in the guide.",
      initialValue: 100,
    }),
    defineField({
      name: "tagline",
      type: "string",
      description: "One line on who this order is for.",
    }),
    defineField({ name: "intro", type: "blockContent" }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "readingSection",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "note", type: "text", rows: 2 }),
            defineField({
              name: "entries",
              type: "array",
              of: [defineArrayMember({ type: "readingEntry" })],
            }),
          ],
          preview: { select: { title: "title", entries: "entries" }, prepare: ({ title, entries }) => ({ title, subtitle: `${entries?.length ?? 0} entries` }) },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "audience" } },
});
