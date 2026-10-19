export type ScreenTitle = {
  title: string;
  year: string;
  format: "Animated film" | "Live-action film" | "Animated series" | "Live-action series";
  note: string;
  /** Amazon Associates link. SiteStripe short links already carry the tag. */
  buy?: string;
  buyLabel?: string;
};

export type ScreenSection = {
  id: string;
  title: string;
  titles: ScreenTitle[];
};

export const screenGuide: ScreenSection[] = [
  {
    id: "focused-movies",
    title: "Green Lantern focused movies",
    titles: [
      {
        title: "Justice League: The New Frontier",
        year: "2008",
        format: "Animated film",
        note: "Hal Jordan becomes a Green Lantern as the Justice League comes together.",
        buy: "https://link.amazon/B01UlLWr4",
      },
      {
        title: "Green Lantern: First Flight",
        year: "2009",
        format: "Animated film",
        note: "Hal Jordan's first mission with the Corps, and his clash with Sinestro.",
        buy: "https://link.amazon/B097cq2t4",
      },
      {
        title: "Green Lantern: Emerald Knights",
        year: "2011",
        format: "Animated film",
        note: "Stories from the Corps, told by Hal Jordan.",
        buy: "https://link.amazon/B0gyADljz",
      },
      {
        title: "Green Lantern",
        year: "2011",
        format: "Live-action film",
        note: "Ryan Reynolds as Hal Jordan.",
        buy: "https://link.amazon/B0hvPG3Zy",
      },
      {
        title: "Justice League vs. the Fatal Five",
        year: "2019",
        format: "Animated film",
        note: "The Fatal Five hunt Jessica Cruz, a new Green Lantern, and the Justice League has to stop them.",
        buy: "https://link.amazon/B0hp2LQSS",
      },
      {
        title: "Green Lantern: Beware My Power",
        year: "2022",
        format: "Animated film",
        note: "John Stewart is recruited as Earth's Green Lantern.",
        buy: "https://link.amazon/B0dFaiRyp",
      },
    ],
  },
  {
    id: "focused-shows",
    title: "Green Lantern focused TV shows",
    titles: [
      {
        title: "The Superman/Aquaman Hour of Adventure",
        year: "1967–1968",
        format: "Animated series",
        note: "Hal Jordan's first cartoons, shown as short segments in this Filmation hour.",
      },
      {
        title: "Green Lantern: The Animated Series",
        year: "2011–2013",
        format: "Animated series",
        note: "Hal Jordan and Kilowog patrol the edge of Guardian space.",
        buy: "https://link.amazon/B0dqQwFuY",
      },
      {
        title: "Lanterns",
        year: "2026",
        format: "Live-action series",
        note: "Kyle Chandler as Hal Jordan and Aaron Pierre as John Stewart. HBO.",
      },
    ],
  },
  {
    id: "also-featuring",
    title: "Other movies and TV shows featuring Green Lanterns",
    titles: [
      {
        title: "Super Friends",
        year: "1973–1985",
        format: "Animated series",
        note: "Hal Jordan joins the team.",
      },
      {
        title: "Superman: The Animated Series",
        year: "1996–2000",
        format: "Animated series",
        note: "Kyle Rayner crosses paths with Superman.",
      },
      {
        title: "Justice League",
        year: "2001–2004",
        format: "Animated series",
        note: "John Stewart is the team's Green Lantern.",
      },
      {
        title: "Justice League Unlimited",
        year: "2004–2006",
        format: "Animated series",
        note: "John Stewart stays on as the League grows.",
        buy: "https://link.amazon/B0b9ExxCf",
        buyLabel: "Buy the complete series",
      },
      {
        title: "Stargirl",
        year: "2020–2022",
        format: "Live-action series",
        note: "Jade carries on from her father, Green Lantern Alan Scott.",
      },
      {
        title: "Zack Snyder's Justice League",
        year: "2021",
        format: "Live-action film",
        note: "A Green Lantern falls in Darkseid's ancient invasion of Earth.",
      },
      {
        title: "Superman",
        year: "2025",
        format: "Live-action film",
        note: "Guy Gardner, played by Nathan Fillion.",
        buy: "https://link.amazon/B0adfPPHT",
      },
    ],
  },
];
