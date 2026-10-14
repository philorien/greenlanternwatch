export const apiVersion = "2026-10-14";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Falls back to a placeholder so the site still builds before a Sanity
// project is connected. Content fetches return empty results in that case.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const isSanityConfigured = projectId.length > 0;
