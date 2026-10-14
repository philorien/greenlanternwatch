export const site = {
  name: "Green Lantern Watch",
  tagline: "Your Sector for All Things Green Lantern",
  url: "https://greenlanternwatch.com",
  nav: [
    { href: "/news", label: "News" },
    { href: "/comics", label: "Comics" },
    { href: "/category/movies-tv", label: "Movies & TV" },
    { href: "/characters", label: "Characters" },
    { href: "/category/features", label: "Features" },
    { href: "/category/reviews", label: "Reviews" },
    { href: "/about", label: "About" },
  ],
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
