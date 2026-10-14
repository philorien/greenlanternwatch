import { site } from "@/config/site";

const labels: Record<string, string> = {
  x: "X",
  youtube: "YouTube",
  instagram: "Instagram",
  bluesky: "Bluesky",
  discord: "Discord",
  website: "Website",
};

/** "@handle" for a profile URL, or the domain for a website. */
function handleFor(key: string, url: string) {
  try {
    const { hostname, pathname } = new URL(url);
    if (key === "website") return hostname.replace(/^www\./, "");
    const name = pathname.split("/").filter(Boolean).at(-1);
    return name ? `@${name.replace(/^@/, "")}` : null;
  } catch {
    return null;
  }
}

/** Text links, rendered only for the ones that are set. Defaults to the site's own accounts. */
export function Socials({
  className = "",
  links = site.socials,
  showHandles = false,
}: {
  className?: string;
  links?: Partial<Record<string, string | null>>;
  showHandles?: boolean;
}) {
  const entries = Object.entries(links).flatMap(([key, url]) =>
    url && labels[key] ? [[key, url] as const] : [],
  );
  if (entries.length === 0) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${className}`}>
      {entries.map(([key, url]) => {
        const handle = showHandles ? handleFor(key, url) : null;
        return (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text/80 transition-colors hover:text-glow"
            >
              {labels[key]}
              {handle ? <span className="text-muted"> {handle}</span> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
