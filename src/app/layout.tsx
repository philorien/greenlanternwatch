import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://greenlanternwatch.com"
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Green Lantern Watch",
    template: "%s | Green Lantern Watch",
  },
  description:
    "Green Lantern Watch covers the TV show, movies and comics, with news, a comics reading guide and character profiles.",
  openGraph: {
    siteName: "Green Lantern Watch",
    type: "website",
    url: siteUrl,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
