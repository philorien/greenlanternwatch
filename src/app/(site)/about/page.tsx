import type { Metadata } from "next";
import Link from "next/link";
import { CorpsSymbol, Wordmark } from "@/components/Logo";
import { Socials } from "@/components/Socials";
import { PageHeader } from "@/components/ui";
import { site } from "@/config/site";
import type { SpectrumColor } from "@/sanity/types";

export const metadata: Metadata = {
  title: "About",
  description:
    "Green Lantern Watch is an unofficial, fan-run guide to Green Lantern across comics, TV and film: news, reviews, reading orders and a database of the Lanterns and Corps.",
};

const sections = [
  {
    href: "/news",
    title: "News",
    description: "Announcements, solicitations, casting and release dates from comics, TV and film.",
  },
  {
    href: "/comics",
    title: "The Book of Oa",
    description: "Our comics guide: reading orders, story arc hubs and the key issues worth tracking down.",
  },
  {
    href: "/characters",
    title: "Characters",
    description: "Profiles of the Lanterns, their allies and their enemies, written for people meeting them for the first time.",
  },
  {
    href: "/corps",
    title: "The emotional spectrum",
    description: "Every Corps, the emotion that powers it, and who carries its rings.",
  },
  {
    href: "/category/reviews",
    title: "Reviews",
    description: "Our take on new issues, episodes and films.",
  },
  {
    href: "/category/features",
    title: "Features",
    description: "Explainers, histories and longer reads on the corners of the mythos.",
  },
] as const;

const spectrum: SpectrumColor[] = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

export default function AboutPage() {
  const hasSocials = Object.values(site.socials).some(Boolean);
  const hasContact = hasSocials || Boolean(site.contactEmail);

  return (
    <article className="mx-auto max-w-3xl">
      <Wordmark className="mb-10 w-full max-w-lg" />
      <PageHeader
        eyebrow="About"
        title={site.name}
        intro="An unofficial, fan-run guide to Green Lantern across comics, TV and film. We follow the news, review what's new and help you find the right thing to read next."
      />

      <div className="rich-text">
        <p>
          Green Lantern has been around since 1940. In that time the ring has
          passed between half a dozen heroes from Earth, the Corps has grown to
          thousands of officers, and the emotional spectrum has added a rainbow
          of rival Corps. Those stories are spread across decades of comics,
          animated series, a feature film and now a live-action show.
        </p>
        <p>
          That much history can make it hard to know where to begin, or to keep
          track of what&apos;s coming next. Green Lantern Watch brings it
          together in one place, written by fans who read the books and want
          other people to enjoy them too.
        </p>
      </div>

      <section aria-labelledby="whats-here" className="mt-14">
        <h2 id="whats-here" className="section-title mb-2">
          What you&apos;ll find here
        </h2>
        <ul className="divide-y divide-line border-b border-line">
          {sections.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group grid gap-1 py-4 sm:grid-cols-[15rem_1fr] sm:gap-6"
              >
                <span className="font-display text-lg font-extrabold transition-colors group-hover:text-glow">
                  {s.title}
                </span>
                <span className="text-muted">{s.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="new-here" className="mt-14">
        <p className="eyebrow mb-3">Start here</p>
        <div className="rich-text">
          <h2 id="new-here" className="!mt-0">
            New to Green Lantern?
          </h2>
          <p>
            A Green Lantern is an officer in the Green Lantern Corps, an
            intergalactic police force founded by the Guardians of the Universe
            on the planet Oa. The universe is divided into 3,600 sectors, and
            Earth sits in Sector 2814. Each Lantern wears a power ring that can
            build anything its wearer imagines, as long as their willpower
            holds.
          </p>
          <p>
            Several people from Earth have worn the ring, including Hal Jordan,
            John Stewart, Guy Gardner, Kyle Rayner, Simon Baz and Jessica Cruz.
            The very first Green Lantern, Alan Scott, debuted in 1940 with a
            magic lantern of his own. You don&apos;t need to know all of them
            to start; most stories focus on one or two.
          </p>
          <p>
            Willpower is one color of the emotional spectrum. Rage, greed, fear,
            hope, compassion and love each power a Corps of their own, and they
            rarely get along.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ul aria-hidden="true" className="flex items-center gap-3">
            {spectrum.map((color) => (
              <li key={color}>
                <CorpsSymbol spectrum={color} className="size-8" />
              </li>
            ))}
          </ul>
          <Link
            href="/corps"
            className="font-display text-xs font-bold uppercase tracking-wider text-glow hover:underline"
          >
            Meet every Corps &rarr;
          </Link>
        </div>

        <p className="mt-8 text-lg">
          Ready to read?{" "}
          <Link href="/comics" className="text-glow underline underline-offset-4">
            The Book of Oa
          </Link>{" "}
          has a starter reading order that picks one clear way in, no homework
          required.
        </p>
      </section>

      <div className="rich-text mt-14">
        <h2 className="!mt-0">How we work</h2>
        <p>
          We&apos;re fans, not DC, but we take getting it right seriously.
        </p>
        <ul>
          <li>
            Issue numbers, release dates and creator credits come from the books
            themselves and from{" "}
            <a href="https://comicvine.gamespot.com/" target="_blank" rel="noopener noreferrer">
              ComicVine
            </a>
            . Reading orders and story arc pages link each issue to its source.
          </li>
          <li>
            News stories link to the original announcement, and we label rumors
            and leaks as exactly that.
          </li>
          <li>
            Reviews of new issues and episodes say up front when they contain
            spoilers.
          </li>
          <li>
            When we get something wrong, we fix it and note the correction on
            the page.
          </li>
        </ul>
      </div>

      {hasContact ? (
        <section aria-labelledby="contact">
          <div className="rich-text">
            <h2 id="contact">Get in touch</h2>
            <p>
              Spotted a mistake, have a tip, or think a reading order is
              missing a key issue? We want to hear it.
              {site.contactEmail ? (
                <>
                  {" "}Email{" "}
                  <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                  {hasSocials ? " or find us on social media." : "."}
                </>
              ) : (
                " Find us on social media."
              )}
            </p>
          </div>
          <Socials className="mt-4" />
        </section>
      ) : null}

      <div className="rich-text">
        <h2>Disclaimer</h2>
        <p>
          Green Lantern Watch is an unofficial fan site. Green Lantern and
          related characters and names are trademarks of DC. The site is not
          affiliated with or endorsed by DC or Warner Bros. Discovery. Cover art
          and other images belong to their respective owners and appear here
          for news, commentary and review.
        </p>
      </div>
    </article>
  );
}
