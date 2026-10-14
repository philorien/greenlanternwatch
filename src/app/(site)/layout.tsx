import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { DemoBanner } from "@/components/DemoBanner";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <DemoBanner />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <SiteFooter />
      {/* Here rather than the root layout so /studio visits are not counted. */}
      <Analytics />
    </>
  );
}
