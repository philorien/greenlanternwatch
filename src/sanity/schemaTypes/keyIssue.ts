import { defineArrayMember, defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons/Pin";

export const keyIssue = defineType({
  name: "keyIssue",
  title: "Key issue",
  type: "document",
  icon: PinIcon,
  description: "A spotlight on a first appearance, origin, villain debut or milestone.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: 'Series and issue, for example "Series Name #1".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "First appearance", value: "first-appearance" },
          { title: "Origin", value: "origin" },
          { title: "Villain debut", value: "villain-debut" },
          { title: "Historic ring", value: "historic-ring" },
          { title: "Milestone", value: "milestone" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "publicationYear", type: "number" }),
    defineField({
      name: "whyItMatters",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "characters",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "character" }] })],
      validation: (rule) => rule.unique(),
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
  ],
  preview: { select: { title: "title", subtitle: "kind", media: "cover" } },
});
