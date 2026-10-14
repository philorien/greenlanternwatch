import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";

export const corps = defineType({
  name: "corps",
  title: "Corps",
  type: "document",
  icon: UsersIcon,
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
      name: "tagline",
      type: "string",
      description: "One line describing what the Corps is about.",
    }),
    defineField({ name: "description", type: "blockContent" }),
  ],
  preview: { select: { title: "name", subtitle: "tagline" } },
});
