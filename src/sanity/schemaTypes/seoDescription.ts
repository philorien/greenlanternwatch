import { defineField } from "sanity";

/** Meta description override. `fallback` names the field the page uses when this is blank. */
export const seoDescriptionField = (fallback: string) =>
  defineField({
    name: "seoDescription",
    title: "Search description",
    type: "text",
    rows: 2,
    description: `Shown under the title in Google results. Answer what searchers are looking for, in 160 characters or fewer. Leave blank to use the ${fallback}.`,
    validation: (rule) => rule.max(160),
  });
