import { defineArrayMember, defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";

export const character = defineType({
  name: "character",
  title: "Character",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alias",
      type: "string",
      description: "Civilian name or other well-known alias.",
    }),
    defineField({
      name: "corps",
      type: "reference",
      to: [{ type: "corps" }],
    }),
    defineField({
      name: "portrait",
      type: "image",
      options: { hotspot: true },
      description: "Use art you have the rights to. Fan art with credit is fine.",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({ name: "species", type: "string" }),
    defineField({ name: "homeSector", type: "string" }),
    defineField({
      name: "firstAppearance",
      type: "string",
      description: "Title, issue or episode, and year.",
    }),
    defineField({
      name: "appearsIn",
      type: "array",
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
    defineField({ name: "bio", type: "blockContent" }),
  ],
  preview: {
    select: { title: "name", subtitle: "alias", media: "portrait" },
  },
});
