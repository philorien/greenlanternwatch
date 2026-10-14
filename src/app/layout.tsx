import type { Metadata } from "next";
import "@fontsource-variable/archivo";
import "@fontsource-variable/inter";
import { site } from "@/config/site";
import { defaultShareImage, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Green Lantern Watch covers the TV show, movies and comics, with news, a comics reading guide and character profiles.",
  openGraph: {
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: [defaultShareImage],
  },
  twitter: { card: "summary_large_image", images: [defaultShareImage] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
