import { defineArrayMember, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";

export const blockContent = defineType({
  name: "blockContent",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Web link",
            icon: EarthGlobeIcon,
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto"] }),
              },
            ],
          },
          {
            name: "internalLink",
            type: "object",
            title: "Internal link",
            icon: DocumentIcon,
            fields: [
              {
                name: "reference",
                type: "reference",
                title: "Page",
                description: "An article, character, Corps, story arc or reading order on this site.",
                to: [
                  { type: "article" },
                  { type: "character" },
                  { type: "corps" },
                  { type: "storyArc" },
                  { type: "readingOrder" },
                ],
                validation: (rule) => rule.required(),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required(),
        },
        { name: "caption", type: "string", title: "Caption" },
      ],
    }),
  ],
});
