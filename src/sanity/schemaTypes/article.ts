import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "comic", title: "Comic coverage" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "The opening line, shown above the story and on cards. The article should continue from it, not repeat it.",
      validation: (rule) => rule.max(240).warning("Keep it under 240 characters."),
    }),
    defineField({
      name: "category",
      type: "reference",
      group: "content",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      group: "content",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "content",
      description: "Show in the home page hero carousel (up to four, newest first).",
      initialValue: false,
    }),
    defineField({
      name: "mainImage",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "caption", type: "string" }),
        defineField({
          name: "credit",
          type: "string",
          description: "Who owns the image, for example the studio or artist.",
        }),
      ],
    }),
    defineField({ name: "body", type: "blockContent", group: "content" }),
    defineField({
      name: "tags",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "comicRelease",
      type: "object",
      group: "comic",
      description:
        "Fill this in for new-release coverage so it appears on the Comics page. To feature it in Latest Comics on the home page, link it from the issue's Comic issue document.",
      fields: [
        defineField({
          name: "title",
          type: "string",
          description: 'For example "Series Name #25".',
        }),
        defineField({ name: "publisher", type: "string" }),
        defineField({ name: "releaseDate", type: "date" }),
        defineField({
          name: "coverageType",
          type: "string",
          options: {
            layout: "radio",
            list: [
              { title: "Review", value: "review" },
              { title: "Preview", value: "preview" },
              { title: "Recap", value: "recap" },
            ],
          },
        }),
        defineField({
          name: "cover",
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
        }),
        defineField({
          name: "buyLink",
          title: "Buy link",
          type: "url",
          description: "Where to buy this comic, such as an Amazon affiliate link. When filled, a Buy on Amazon button shows at the end of the article.",
          validation: (rule) => rule.uri({ scheme: ["https"] }),
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "publishedAt",
      category: "category.title",
      media: "mainImage",
    },
    prepare: ({ title, date, category, media }) => ({
      title,
      subtitle: [category, date ? new Date(date).toLocaleDateString() : null]
        .filter(Boolean)
        .join(" / "),
      media,
    }),
  },
});
