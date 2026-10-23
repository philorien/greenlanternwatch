import { site } from "@/config/site";
import { Socials } from "./Socials";
import { Panel } from "./ui";

export function NewsletterPanel() {
  if (!site.newsletterAction) return null;
  return (
    <Panel title="Get the latest">
      <p className="mb-4 text-sm text-muted">
        News, reviews and more, straight to your inbox.
      </p>
      <form action={site.newsletterAction} method="post" className="flex">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Your email address"
          className="min-w-0 flex-1 rounded-l-md border border-muted/70 bg-ink px-3 py-2 text-sm placeholder:text-muted focus:border-glow focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-r-md bg-glow px-4 py-2 font-display text-xs font-extrabold uppercase tracking-wider text-ink hover:brightness-110"
        >
          Subscribe
        </button>
      </form>
    </Panel>
  );
}

export function SocialsPanel() {
  const hasAny = Object.values(site.socials).some(Boolean);
  if (!hasAny) return null;
  return (
    <Panel>
      <Socials className="justify-center" />
    </Panel>
  );
}
