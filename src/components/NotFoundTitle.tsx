"use client";

import { useEffect } from "react";
import { site } from "@/config/site";

/** Nested not-found files don't set the document title, so the tab would keep the previous one. */
export function NotFoundTitle() {
  useEffect(() => {
    document.title = `Page not found | ${site.name}`;
  }, []);
  return null;
}
