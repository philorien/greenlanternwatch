import Link from "next/link";

const links = [
  { href: "/articles", label: "News" },
  { href: "/comics", label: "Comics guide" },
  { href: "/characters", label: "Characters" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg tracking-wide text-text"
        >
          <span className="text-glow">&#9679;</span> Green Lantern{" "}
          <span className="text-muted">Fan Site</span>
        </Link>
        <nav aria-label="Primary" className="flex gap-5 text-sm sm:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-glow"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
