import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-glow">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-4xl leading-tight sm:text-5xl">
        {title}
      </h1>
      {intro ? <p className="mt-4 text-lg text-muted">{intro}</p> : null}
    </div>
  );
}

export function Section({
  title,
  href,
  hrefLabel,
  children,
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-20">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl">{title}</h2>
        {href ? (
          <Link
            href={href}
            className="text-sm text-muted transition-colors hover:text-glow"
          >
            {hrefLabel ?? "View all"} &rarr;
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface p-8 text-center text-muted">
      {children}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
      {children}
    </span>
  );
}
