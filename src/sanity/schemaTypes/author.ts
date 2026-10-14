import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";

export const author = defineType({
  name: "author",
  title: "Author",
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
    defineField({ name: "role", type: "string", description: "For example Editor or Contributor." }),
    defineField({
      name: "avatar",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "bio",
      type: "blockContent",
      description: "Shown on the author page. Supports links and photos.",
    }),
    defineField({
      name: "socials",
      type: "object",
      description: "Full profile URLs. Only the ones filled in appear on the author page.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "x", title: "X", type: "url" }),
        defineField({ name: "bluesky", title: "Bluesky", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "website", title: "Website", type: "url" }),
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "avatar" } },
});
