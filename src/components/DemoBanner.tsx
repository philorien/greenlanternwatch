import { isDemo } from "@/sanity/demo";

/** Only shows in development while Sanity is not connected. */
export function DemoBanner() {
  if (!isDemo) return null;
  return (
    <div className="border-b border-line bg-surface-2 px-4 py-2 text-center text-xs text-muted">
      Showing placeholder demo content. Set{" "}
      <code className="text-glow">NEXT_PUBLIC_SANITY_PROJECT_ID</code> to
      connect Sanity and replace it.
    </div>
  );
}
