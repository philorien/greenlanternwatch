import { defineField, defineType } from "sanity";

/** One step in a reading order: a run of issues, a collected edition, or an event. */
export const readingEntry = defineType({
  name: "readingEntry",
  title: "Reading entry",
  type: "object",
  fieldsets: [
    {
      name: "details",
      title: "Issue details",
      description: "Filled in from ComicVine by scripts/comicvine/sync.mjs.",
      options: { collapsible: true, collapsed: true },
    },
  ],
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
    defineField({
      name: "buyLink",
      title: "Buy link",
      type: "url",
      description: "Where to buy these issues collected, such as an Amazon affiliate link.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "cover",
      type: "image",
      fieldset: "details",
      description: "Cover of the first issue.",
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
        defineField({ name: "credit", type: "string" }),
      ],
    }),
    defineField({
      name: "releaseStart",
      title: "First release date",
      type: "date",
      fieldset: "details",
    }),
    defineField({
      name: "releaseEnd",
      title: "Last release date",
      type: "date",
      fieldset: "details",
      description: "Leave empty for a single issue.",
    }),
    defineField({
      name: "writers",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      fieldset: "details",
    }),
    defineField({
      name: "artists",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      fieldset: "details",
    }),
    defineField({
      name: "comicVineUrl",
      title: "ComicVine link",
      type: "url",
      fieldset: "details",
    }),
  ],
  preview: { select: { title: "title", subtitle: "issues", media: "cover" } },
});
