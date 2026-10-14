import { defineArrayMember, defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";

export const character = defineType({
  name: "character",
  title: "Character",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "database", title: "Database" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "profile",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alias",
      type: "string",
      group: "profile",
      description: "Civilian name or other well-known alias.",
    }),
    defineField({
      name: "section",
      type: "string",
      group: "profile",
      description: "Which part of the database the character is listed under.",
      options: {
        layout: "radio",
        list: [
          { title: "Earth Lantern (Sector 2814)", value: "earth" },
          { title: "Alien Lantern or fan favorite", value: "alien" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "earth",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "corps",
      type: "reference",
      group: "profile",
      to: [{ type: "corps" }],
    }),
    defineField({
      name: "order",
      type: "number",
      group: "profile",
      description: "Optional. Lower numbers appear first within a section.",
    }),
    defineField({
      name: "portrait",
      type: "image",
      group: "profile",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
        defineField({ name: "credit", type: "string" }),
      ],
    }),
    defineField({ name: "bio", type: "blockContent", group: "profile" }),
    defineField({ name: "species", type: "string", group: "database" }),
    defineField({ name: "homeSector", type: "string", group: "database" }),
    defineField({
      name: "firstAppearance",
      type: "string",
      group: "database",
      description: "Title, issue or episode, and year.",
    }),
    defineField({
      name: "abilities",
      type: "blockContent",
      group: "database",
      description: "Powers and abilities.",
    }),
    defineField({
      name: "constructStyle",
      type: "text",
      rows: 3,
      group: "database",
      description: "How their ring constructs look and what they favor.",
    }),
    defineField({
      name: "appearsIn",
      type: "array",
      group: "database",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
        list: [
          { title: "Comics", value: "comics" },
          { title: "TV", value: "tv" },
          { title: "Film", value: "film" },
          { title: "Animation", value: "animation" },
          { title: "Games", value: "games" },
        ],
      },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "portrayals",
      type: "array",
      group: "database",
      description: "Live-action or voice portrayals.",
      of: [
        defineArrayMember({
          type: "object",
          name: "portrayal",
          fields: [
            defineField({ name: "actor", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "production", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "actor", subtitle: "production" } },
        }),
      ],
    }),
    defineField({
      name: "keyStorylines",
      type: "array",
      group: "database",
      of: [defineArrayMember({ type: "reference", to: [{ type: "storyArc" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "readingRecommendations",
      type: "array",
      group: "database",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "readingOrder" }, { type: "storyArc" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "alias", media: "portrait" },
  },
});
