import { defineArrayMember, defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons/Book";

const LINK_HINT = "Plain text. To link, write [words](/characters/hal-jordan).";

const textItem = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "text",
    rows: 3,
    description: LINK_HINT,
    validation: (rule) => rule.required(),
  });

export const explainer = defineType({
  name: "explainer",
  title: "Explainer",
  type: "document",
  icon: BookIcon,
  description:
    "A feature that explains one piece of the mythos. Explainers are listed with the other features.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: 'Include "Explained" in the title, for example "The Manhunters, Explained".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dek",
      title: "Standfirst",
      type: "text",
      rows: 3,
      description: "The opening summary. Shown on the feature card and under the headline.",
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "mainImage",
      title: "Hero image",
      type: "image",
      description: "Shown above the explainer, on its feature card and when the page is shared.",
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
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({
          name: "explainerSection",
          type: "object",
          title: "Section",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "anchor",
              type: "string",
              description: "Optional link id. Leave blank to build it from the title.",
            }),
            defineField({
              name: "blocks",
              type: "array",
              of: [
                defineArrayMember({
                  name: "explainerParagraph",
                  type: "object",
                  title: "Paragraph",
                  fields: [textItem("text", "Text")],
                  preview: { select: { title: "text" } },
                }),
                defineArrayMember({
                  name: "explainerPoints",
                  type: "object",
                  title: "Key points",
                  fields: [
                    defineField({
                      name: "items",
                      type: "array",
                      of: [
                        defineArrayMember({
                          name: "explainerPoint",
                          type: "object",
                          fields: [
                            defineField({
                              name: "lead",
                              type: "string",
                              description: "The bold opening sentence, including its period.",
                              validation: (rule) => rule.required(),
                            }),
                            textItem("text", "Rest of the point"),
                          ],
                          preview: { select: { title: "lead" } },
                        }),
                      ],
                      validation: (rule) => rule.required().min(1),
                    }),
                  ],
                  preview: { prepare: () => ({ title: "Key points" }) },
                }),
                defineArrayMember({
                  name: "explainerSteps",
                  type: "object",
                  title: "Numbered steps",
                  fields: [
                    defineField({
                      name: "items",
                      type: "array",
                      of: [defineArrayMember({ type: "text", rows: 3 })],
                      validation: (rule) => rule.required().min(1),
                    }),
                  ],
                  preview: { prepare: () => ({ title: "Numbered steps" }) },
                }),
                defineArrayMember({
                  name: "explainerThesis",
                  type: "object",
                  title: "Short version",
                  fields: [
                    defineField({
                      name: "kicker",
                      type: "string",
                      initialValue: "The short version",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "text",
                      type: "string",
                      description: "The one sentence a reader should remember.",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: { select: { title: "text", subtitle: "kicker" } },
                }),
                defineArrayMember({
                  name: "explainerTimeline",
                  type: "object",
                  title: "Timeline",
                  fields: [
                    defineField({
                      name: "caption",
                      type: "string",
                      initialValue: "Newest first.",
                    }),
                    defineField({
                      name: "rows",
                      type: "array",
                      of: [
                        defineArrayMember({
                          name: "explainerTimelineRow",
                          type: "object",
                          fields: [
                            defineField({
                              name: "when",
                              type: "string",
                              validation: (rule) => rule.required(),
                            }),
                            textItem("what", "What happened"),
                          ],
                          preview: { select: { title: "when", subtitle: "what" } },
                        }),
                      ],
                      validation: (rule) => rule.required().min(1),
                    }),
                  ],
                  preview: { prepare: () => ({ title: "Timeline" }) },
                }),
                defineArrayMember({
                  name: "explainerTerms",
                  type: "object",
                  title: "Terms",
                  fields: [
                    defineField({
                      name: "items",
                      type: "array",
                      of: [
                        defineArrayMember({
                          name: "explainerTerm",
                          type: "object",
                          fields: [
                            defineField({
                              name: "term",
                              type: "string",
                              validation: (rule) => rule.required(),
                            }),
                            defineField({ name: "qualifier", type: "string" }),
                            defineField({
                              name: "definition",
                              type: "text",
                              rows: 2,
                              description: LINK_HINT,
                              validation: (rule) => rule.required(),
                            }),
                          ],
                          preview: { select: { title: "term", subtitle: "definition" } },
                        }),
                      ],
                      validation: (rule) => rule.required().min(1),
                    }),
                  ],
                  preview: { prepare: () => ({ title: "Terms" }) },
                }),
                defineArrayMember({
                  name: "explainerCompare",
                  type: "object",
                  title: "Side by side",
                  fields: [
                    defineField({
                      name: "caption",
                      type: "string",
                      description: "Read out to screen readers. Hidden on the page.",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "leftHeading",
                      title: "Left column",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "rightHeading",
                      title: "Right column",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "rows",
                      type: "array",
                      of: [
                        defineArrayMember({
                          name: "explainerCompareRow",
                          type: "object",
                          fields: [
                            defineField({
                              name: "label",
                              type: "string",
                              validation: (rule) => rule.required(),
                            }),
                            defineField({
                              name: "left",
                              type: "text",
                              rows: 2,
                              description: LINK_HINT,
                              validation: (rule) => rule.required(),
                            }),
                            defineField({
                              name: "right",
                              type: "text",
                              rows: 2,
                              description: LINK_HINT,
                              validation: (rule) => rule.required(),
                            }),
                          ],
                          preview: { select: { title: "label", subtitle: "left" } },
                        }),
                      ],
                      validation: (rule) => rule.required().min(1),
                    }),
                  ],
                  preview: {
                    select: { left: "leftHeading", right: "rightHeading" },
                    prepare: ({ left, right }) => ({ title: "Side by side", subtitle: [left, right].filter(Boolean).join(" / ") }),
                  },
                }),
                defineArrayMember({
                  name: "explainerImage",
                  type: "image",
                  title: "Image",
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
                  preview: { select: { title: "caption", subtitle: "alt", media: "asset" } },
                }),
                defineArrayMember({
                  name: "explainerReading",
                  type: "object",
                  title: "Reading list",
                  fields: [
                    defineField({
                      name: "items",
                      type: "array",
                      of: [
                        defineArrayMember({
                          name: "explainerReadingItem",
                          type: "object",
                          fields: [
                            defineField({
                              name: "title",
                              type: "string",
                              validation: (rule) => rule.required(),
                            }),
                            defineField({
                              name: "note",
                              type: "text",
                              rows: 2,
                              description: LINK_HINT,
                              validation: (rule) => rule.required(),
                            }),
                          ],
                          preview: { select: { title: "title", subtitle: "note" } },
                        }),
                      ],
                      validation: (rule) => rule.required().min(1),
                    }),
                  ],
                  preview: { prepare: () => ({ title: "Reading list" }) },
                }),
              ],
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
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
    select: { title: "title", date: "publishedAt" },
    prepare: ({ title, date }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString() : "Explainer",
    }),
  },
});
