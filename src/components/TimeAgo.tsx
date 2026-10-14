"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function relative(iso: string): string | null {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return null;
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return `${Math.max(1, Math.floor(diff / 60_000))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return "Yesterday";
  return null;
}

/** Renders the absolute date on the server, then a relative time on the client for recent items. */
export function TimeAgo({ iso, fallback }: { iso: string; fallback: string }) {
  const text = useSyncExternalStore(
    subscribe,
    () => relative(iso) ?? fallback,
    () => fallback,
  );
  return <time dateTime={iso}>{text}</time>;
}
