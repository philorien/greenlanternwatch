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
    <div className="mb-10 max-w-3xl">
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h1 className="font-display text-4xl font-black leading-tight sm:text-5xl">
        {title}
      </h1>
      {intro ? <p className="mt-4 text-lg text-muted">{intro}</p> : null}
    </div>
  );
}

export function SectionTitle({
  children,
  href,
  hrefLabel = "View all",
}: {
  children: ReactNode;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="section-title">{children}</h2>
      {href ? (
        <Link
          href={href}
          className="font-display text-xs font-bold uppercase tracking-wider text-glow hover:underline"
        >
          {hrefLabel} &rarr;
        </Link>
      ) : null}
    </div>
  );
}

export function Panel({
  title,
  href,
  children,
  className = "",
}: {
  title?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel p-5 ${className}`}>
      {title ? (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.12em]">
            {title}
          </h2>
          {href ? (
            <Link href={href} className="font-display text-[0.7rem] font-bold uppercase tracking-wider text-glow hover:underline">
              View all &rarr;
            </Link>
          ) : null}
        </div>
      ) : null}
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

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-sm text-muted transition-colors hover:text-glow">
      &larr; {children}
    </Link>
  );
}

/** Colored dot and label for an emotional spectrum color. */
export function SpectrumDot({ spectrum }: { spectrum: string }) {
  return (
    <span
      data-spectrum={spectrum}
      aria-hidden
      className="inline-block size-2.5 rounded-full bg-[var(--spec)] shadow-[0_0_8px_var(--spec)]"
    />
  );
}
