export type Edition = {
  id: string;
  title: string;
  by: string;
  format: string;
  /** Amazon ASIN. Books usually match the ISBN-10. */
  asin: string;
  /** Comic Vine cover. Absent when the collected edition is not in their database. */
  cover?: string;
  why: string;
  /** What the book collects, when that is the useful detail. */
  collects?: string;
  orderHref?: string;
  orderLabel?: string;
};

export type BuySection = {
  id: string;
  title: string;
  lede: string;
  editions: Edition[];
};

export const featured: Edition = {
  id: "the-one-to-buy",
  title: "Green Lantern by Geoff Johns Omnibus Vol. 1",
  by: "Geoff Johns, Ivan Reis, Ethan Van Sciver",
  format: "Omnibus",
  asin: "140125134X",
  cover: "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/4361908-01.jpg",
  why: "This is the modern Green Lantern story in one hardcover. Hal Jordan comes back, the Corps is rebuilt, and the book ends with the Sinestro Corps War. It is long, and it is the one to own if you buy a single volume of the saga.",
  collects:
    "Collects Green Lantern: Rebirth, Green Lantern Corps: Recharge, Green Lantern #1–25, and the Sinestro Corps War.",
  orderHref: "/comics/reading-orders/geoff-johns-era-2004-2011",
  orderLabel: "Geoff Johns reading order",
};

export const buySections: BuySection[] = [
  {
    id: "smaller-start",
    title: "A smaller start",
    lede: "The omnibus is more than a thousand pages. These two paperbacks are the same era, in pieces you can finish.",
    editions: [
      {
        id: "secret-origin",
        title: "Green Lantern: Secret Origin",
        by: "Geoff Johns, Ivan Reis",
        format: "Paperback",
        asin: "1799517950",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/3498066-01.jpg",
        why: "Hal Jordan's origin: a grounded test pilot, a dying alien, and the ring. You can read it with no other Green Lantern comic. The same story is inside Omnibus Vol. 2, so skip this if you are buying the set.",
        collects: "Collects Green Lantern #29–35. This link is the 2026 printing.",
      },
      {
        id: "rebirth",
        title: "Green Lantern: Rebirth",
        by: "Geoff Johns, Ethan Van Sciver",
        format: "Paperback",
        asin: "1401227554",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/11112/111121983/6481899-3687605604-GREEN.jpg",
        why: "Six issues that start the Johns era. Kyle Rayner brings Hal back, and the book explains Parallax, the fear entity that had been using him. Buy this if you want the saga and the omnibus is too much book. It is the opening of Omnibus Vol. 1, so you do not need both.",
      },
    ],
  },
  {
    id: "johns-run",
    title: "The rest of the Johns run",
    lede: "Only after Vol. 1. These are the sequels. The hardcovers go in and out of print, and a new copy is sometimes priced like a collector's item. A used copy is the same book.",
    editions: [
      {
        id: "johns-omnibus-2",
        title: "Green Lantern by Geoff Johns Omnibus Vol. 2",
        by: "Geoff Johns, Ivan Reis, Doug Mahnke",
        format: "Omnibus",
        asin: "1401255264",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/4719236-02.jpg",
        why: "The emotional spectrum goes to war. The dead rise wearing black rings, and the other Corps have to pick a side. This is the Blackest Night volume.",
        collects: "Collects Green Lantern #26–52 and Blackest Night.",
      },
      {
        id: "johns-omnibus-3",
        title: "Green Lantern by Geoff Johns Omnibus Vol. 3",
        by: "Geoff Johns, Doug Mahnke",
        format: "Omnibus",
        asin: "1401258204",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/5151685-03.jpg",
        why: "The last act of Johns's run, from the War of the Green Lanterns through Wrath of the First Lantern. Read it after Vol. 2.",
      },
    ],
  },
  {
    id: "one-book",
    title: "One book, no homework",
    lede: "None of these need the Johns run, or any other Green Lantern comic.",
    editions: [
      {
        id: "far-sector",
        title: "Far Sector",
        by: "N.K. Jemisin, Jamal Campbell",
        format: "Compact paperback",
        asin: "1779527292",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/8205326-01.jpg",
        why: "Sojourner Mullein, a new Lantern, is assigned to a city that deleted its own emotions, then has to solve its first murder in five hundred years. The full twelve-issue series, in DC's smaller compact edition. The best one-and-done Green Lantern book in years.",
      },
      {
        id: "absolute-green-lantern",
        title: "Absolute Green Lantern Vol. 1: Without Fear",
        by: "Al Ewing, Jahnoy Lindsay",
        format: "Paperback",
        asin: "1799505553",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/11161/111615891/9933438-cover.jpg",
        why: "A different universe, not a sequel. A monolith cuts the town of Evergreen off from the world, and Jo Mullein and Hal Jordan are both caught in whatever is judging it. This is the first volume of the current Absolute series. Start here if that line is what brought you in.",
        collects: "Collects Absolute Green Lantern #1–6.",
      },
      {
        id: "earth-one",
        title: "Green Lantern: Earth One Vol. 1",
        by: "Gabriel Hardman, Corinna Bechko",
        format: "Hardcover",
        asin: "1401241867",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/6326203-01.jpg",
        why: "Hal Jordan as an asteroid prospector who finds a ring after the Corps has already been wiped out. Science fiction first. It is the first of three volumes, and it ends on a hook.",
      },
      {
        id: "intergalactic-lawman",
        title: "The Green Lantern Vol. 1: Intergalactic Lawman",
        by: "Grant Morrison, Liam Sharp",
        format: "Paperback",
        asin: "1401291392",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/6999163-01.jpg",
        why: "Hal played as a space cop. Strange, funny, and almost entirely its own comic. The first volume of Morrison and Sharp's series.",
      },
    ],
  },
  {
    id: "other-lanterns",
    title: "Other Lanterns",
    lede: "Hal is the default on the shelf. These are the books to buy when you want someone else wearing the ring.",
    editions: [
      {
        id: "war-journal",
        title: "Green Lantern: War Journal Vol. 1: Contagion",
        by: "Phillip Kennedy Johnson, Montos",
        format: "Paperback",
        asin: "1779527381",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/1/15776/9562444-greenlanternwarjournal.jpg",
        why: "John Stewart, after he has put the ring down and been pulled back. The current John Stewart series. You do not need the Johns omnibus first.",
      },
      {
        id: "rage-planet",
        title: "Green Lanterns Vol. 1: Rage Planet",
        by: "Sam Humphries, Robson Rocha",
        format: "Paperback",
        asin: "1401267750",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/5665085-01.jpg",
        why: "Jessica Cruz and Simon Baz, new Lanterns assigned to Earth, up against the Red Lanterns. A good introduction to both of them. It is the first volume of their series.",
      },
      {
        id: "alan-scott",
        title: "Alan Scott: The Green Lantern",
        by: "Tim Sheridan, Cian Tormey",
        format: "Paperback",
        asin: "1779527217",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/11/110645/9519020-81ri9liba6l._sl1500_.jpg",
        why: "The original Green Lantern, from the 1940s, before the Corps existed. His power comes from a magic lantern, not a Guardian's ring. A short, complete story. Alan Scott is gay, and the book is about him keeping that life a secret as much as it is about the mystery.",
        collects: "Collects Alan Scott: The Green Lantern #1–6.",
      },
      {
        id: "kyle-rayner",
        title: "Green Lantern: Kyle Rayner Rising Compendium",
        by: "Ron Marz, Darryl Banks",
        format: "Compendium",
        asin: "177952627X",
        why: "Hal has fallen, the Corps is gone, and the last ring goes to Kyle Rayner, an artist. This is the start of his 1990s run. The storytelling is of that era. Buy it because you want Kyle, not as a first Green Lantern comic.",
        orderHref: "/comics/reading-orders/kyle-rayner-reading-order",
        orderLabel: "Kyle Rayner reading order",
      },
      {
        id: "corps-omnibus",
        title: "Green Lantern Corps by Peter J. Tomasi and Patrick Gleason Omnibus",
        by: "Peter J. Tomasi, Patrick Gleason",
        format: "Omnibus",
        asin: "1779522916",
        why: "Guy Gardner and the Corps away from Earth. It overlaps the Sinestro Corps War, which is already in the Johns omnibus. Buy it for Guy and the rest of the Corps, not to read that war again.",
      },
    ],
  },
  {
    id: "current",
    title: "Reading now",
    lede: "The monthly Hal Jordan comic, collected. It assumes you already know him.",
    editions: [
      {
        id: "back-in-action",
        title: "Green Lantern Vol. 1: Back in Action",
        by: "Jeremy Adams, Xermanico",
        format: "Paperback",
        asin: "1779525095",
        cover: "https://comicvine.gamespot.com/a/uploads/scale_large/1/15776/9562473-greenlanternvol.1.jpg",
        why: "The 2023 series. The Guardians have cut Earth off from the Corps, and Hal goes home. A good read if Hal is already your Lantern. A hard place to meet him.",
        orderHref: "/comics/reading-orders/dawn-of-dc-and-all-in-2022-now",
        orderLabel: "Current era reading order",
      },
    ],
  },
];

export const buyingGuideEditions: Edition[] = [
  featured,
  ...buySections.flatMap((section) => section.editions),
];
