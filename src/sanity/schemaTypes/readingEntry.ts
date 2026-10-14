import { defineField, defineType } from "sanity";

/** One step in a reading order: a run of issues, a collected edition, or an event. */
export const readingEntry = defineType({
  name: "readingEntry",
  title: "Reading entry",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "issues",
      type: "string",
      description: 'For example "Issues 1 to 6".',
    }),
    defineField({
      name: "format",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Single issues", value: "issues" },
          { title: "Collected edition", value: "collected" },
          { title: "Event", value: "event" },
        ],
      },
      initialValue: "issues",
    }),
    defineField({
      name: "note",
      type: "text",
      rows: 2,
      description: "Why it belongs here, or what to know before reading.",
    }),
    defineField({
      name: "arc",
      type: "reference",
      to: [{ type: "storyArc" }],
      description: "Link to the arc hub, if one exists.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "issues" } },
});
