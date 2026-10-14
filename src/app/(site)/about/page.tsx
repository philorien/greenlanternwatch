import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="About" title={site.name} intro={`${site.tagline}.`} />
      <div className="rich-text">
        <p>
          Green Lantern Watch is a fan-run site covering Green Lantern across
          comics, television and film: news, a reading guide for the comics,
          and a database of the Lanterns and Corps.
        </p>
        <p>
          This is draft copy. Replace it with your own story before launch.
        </p>
        <h2>Disclaimer</h2>
        <p>
          This is an unofficial fan site. Green Lantern and related characters
          and names are trademarks of DC. The site is not affiliated with or
          endorsed by DC or Warner Bros. Discovery.
        </p>
      </div>
    </div>
  );
}
