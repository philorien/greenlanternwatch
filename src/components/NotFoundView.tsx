import Link from "next/link";
import { NotFoundTitle } from "./NotFoundTitle";

const primary =
  "inline-flex items-center rounded-full bg-glow px-5 py-2.5 font-display text-xs font-extrabold uppercase tracking-wider text-ink hover:brightness-110";
const secondary =
  "inline-flex items-center rounded-full border border-line px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-text hover:border-glow-dim hover:text-glow";

/** Missing-page message. Callers supply the site chrome. */
export function NotFoundView() {
  return (
    <div className="max-w-xl py-16 sm:py-24">
      <NotFoundTitle />
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-4xl font-black leading-tight sm:text-5xl">
        This page isn&apos;t here.
      </h1>
      <p className="mt-4 text-lg text-muted">
        That address doesn&apos;t match a story, a character, or a reading order.
        The link may be out of date, or the page may have moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={primary}>
          Homepage
        </Link>
        <Link href="/comics" className={secondary}>
          Reading guide
        </Link>
      </div>
    </div>
  );
}
