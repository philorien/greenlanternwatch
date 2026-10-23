import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFoundView";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: `Page not found | ${site.name}` },
};

export default function NotFound() {
  return <NotFoundView />;
}
