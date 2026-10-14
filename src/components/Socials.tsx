import { site } from "@/config/site";

const labels: Record<string, string> = {
  x: "X",
  youtube: "YouTube",
  instagram: "Instagram",
  bluesky: "Bluesky",
  discord: "Discord",
};

/** Text links, rendered only for the handles set in the environment. */
export function Socials({ className = "" }: { className?: string }) {
  const entries = Object.entries(site.socials).filter(([, url]) => url);
  if (entries.length === 0) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${className}`}>
      {entries.map(([key, url]) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text/80 transition-colors hover:text-glow"
          >
            {labels[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}
