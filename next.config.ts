import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "comicvine.gamespot.com" },
    ],
  },
  async redirects() {
    return [
      // Published as an article, then moved to an explainer.
      {
        source: "/news/hal-jordan-parallax-and-kyle-rayner-explained",
        destination: "/explainers/hal-jordan-parallax-and-kyle-rayner-explained",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
