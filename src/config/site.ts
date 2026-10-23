export const site = {
  name: "Green Lantern Watch",
  tagline: "Your Sector for All Things Green Lantern",
  // Must match the domain Vercel serves; the apex redirects here.
  url: "https://www.greenlanternwatch.com",
  nav: [
    { href: "/news", label: "News", group: "latest" },
    { href: "/category/reviews", label: "Reviews", group: "latest" },
    { href: "/comics", label: "Comics", group: "read" },
    { href: "/movies-tv", label: "Movies & TV", group: "read" },
    { href: "/characters", label: "Characters", group: "read" },
    { href: "/category/features", label: "Features", group: "read" },
    { href: "/about", label: "About", group: "about" },
  ],
  // Shown on the About page for corrections and tips. Hidden while empty.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  // Fill these in. Icons only render for the links that are set.
  socials: {
    x: process.env.NEXT_PUBLIC_SOCIAL_X ?? "",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "",
    bluesky: process.env.NEXT_PUBLIC_SOCIAL_BLUESKY ?? "",
    discord: process.env.NEXT_PUBLIC_SOCIAL_DISCORD ?? "",
  },
  // Form action URL from your email provider (for example a Buttondown or
  // Mailchimp embed form). The signup box is hidden while this is empty.
  newsletterAction: process.env.NEXT_PUBLIC_NEWSLETTER_ACTION ?? "",
} as const;
