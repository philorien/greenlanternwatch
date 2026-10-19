import { externalRel, isAmazonLink } from "@/lib/affiliate";

/** Outbound link to buy a comic, filled in from a Sanity "Buy link" field. */
export function BuyButton({ href, className = "" }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel={externalRel(href)}
      className={`inline-block rounded-full border border-glow px-5 py-2 font-display text-xs font-bold uppercase tracking-wider text-glow transition-colors hover:bg-glow hover:text-ink ${className}`}
    >
      {isAmazonLink(href) ? "Buy on Amazon" : "Where to buy"}
    </a>
  );
}
