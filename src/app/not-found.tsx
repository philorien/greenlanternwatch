import type { Metadata } from "next";
import { DemoBanner } from "@/components/DemoBanner";
import { NotFoundView } from "@/components/NotFoundView";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: `Page not found | ${site.name}` },
};

/** Unmatched URLs skip the site layout, so this page brings its own chrome. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <DemoBanner />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <NotFoundView />
      </main>
      <SiteFooter />
    </>
  );
}
