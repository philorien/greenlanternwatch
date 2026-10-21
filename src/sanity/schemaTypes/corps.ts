import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";
import { seoDescriptionField } from "./seoDescription";

export const spectrumColors = [
  "green",
  "yellow",
  "red",
  "blue",
  "violet",
  "orange",
  "indigo",
  "black",
  "white",
] as const;

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
      name: "spectrum",
      title: "Spectrum color",
      type: "string",
      options: {
        list: spectrumColors.map((value) => ({
          title: value[0].toUpperCase() + value.slice(1),
          value,
        })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emotion",
      type: "string",
      description: "The emotion this Corps draws power from, for example Willpower.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Position in the spectrum listing. Lower numbers appear first.",
      initialValue: 100,
    }),
    defineField({
      name: "tagline",
      type: "string",
      description: "One line describing what the Corps is about.",
    }),
    seoDescriptionField("emotion and tagline"),
    defineField({
      name: "keyFigures",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Leaders or defining members, as plain text.",
    }),
    defineField({ name: "description", type: "blockContent" }),
  ],
  orderings: [
    {
      title: "Spectrum order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "name", subtitle: "emotion" } },
});
