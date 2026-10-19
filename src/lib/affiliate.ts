/**
 * Amazon Associates tracking ID for this site. Product links are plain
 * /dp/ASIN URLs plus this tag, which is what Amazon counts. SiteStripe
 * short links (link.amazon/...) are minted per product and can't be built here.
 * Override with NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG if the account tag changes.
 */
const AMAZON_ASSOCIATE_TAG =
  process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || "greenlante096-20";

/** Amazon hosts that carry the site's Associates tag. Matches subdomains too (www.amazon.com). */
const AMAZON_HOSTS = ["link.amazon", "amzn.to", "amazon.com", "a.co"];

/** A product page credited to the site's Associates account. */
export function amazonUrl(asin: string) {
  return `https://www.amazon.com/dp/${asin}/ref=nosim?tag=${AMAZON_ASSOCIATE_TAG}`;
}

export function isAmazonLink(href: string) {
  try {
    const host = new URL(href).hostname;
    return AMAZON_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/** rel for a link that opens off-site. Affiliate links are marked sponsored, as Google asks. */
export function externalRel(href: string) {
  return isAmazonLink(href) ? "sponsored noopener noreferrer" : "noopener noreferrer";
}
