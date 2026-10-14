// Builds the starter character database as NDJSON for `sanity dataset import`.
//
//   node scripts/characters.mjs > /tmp/characters.ndjson
//   npx sanity dataset import /tmp/characters.ndjson --dataset production --replace
//
// Document IDs are fixed, so re-running the import replaces these documents in place.
// Corps and reading orders are referenced by the fixed IDs from scripts/corps.mjs and
// scripts/modern-green-lantern-reading-orders.mjs, so import those first.
// Bio and ability lines starting with "## " become headings and "- " become bullets.

import { createHash } from "node:crypto";

const corps = {
  red: "corps-red-lantern-corps",
  orange: "corps-orange-lantern-corps",
  yellow: "corps-sinestro-corps",
  green: "corps-green-lantern-corps",
  blue: "corps-blue-lantern-corps",
  indigo: "corps-indigo-tribe",
  violet: "corps-star-sapphires",
  black: "corps-black-lantern-corps",
  white: "corps-white-lantern-corps",
};

const reading = {
  startHere: "reading-order-modern-gl-start-here",
  johns: "reading-order-modern-gl-johns-era",
  new52: "reading-order-modern-gl-new-52",
  rebirth: "reading-order-modern-gl-rebirth",
  morrison: "reading-order-modern-gl-morrison-thorne",
  dawn: "reading-order-modern-gl-dawn-of-dc-all-in",
};

const characters = [
  // Earth's Green Lanterns
  {
    name: "Hal Jordan",
    section: "earth",
    order: 1,
    corps: "green",
    species: "Human",
    homeSector: "Sector 2814 (Coast City, Earth)",
    firstAppearance: "Showcase #22 (1959)",
    appearsIn: ["comics", "tv", "film", "animation", "games"],
    portrayals: [
      ["Ryan Reynolds", "Green Lantern (2011)"],
      ["Kyle Chandler", "Lanterns (2026)"],
      ["Josh Keaton (voice)", "Green Lantern: The Animated Series (2011)"],
    ],
    reading: ["startHere", "johns"],
    bio: [
      "Hal Jordan is the Green Lantern most people picture. A test pilot at Ferris Aircraft, he was chosen by the dying Lantern Abin Sur because he was \"entirely honest and born without fear.\" Later stories refined that: Hal feels fear like anyone, he just overcomes it.",
      "Hal's history includes some of the biggest turns in comics. He was possessed by the fear entity Parallax, died, came back as the Spectre's host, and returned as a Green Lantern in Green Lantern: Rebirth. He has since led the Corps and remains its most famous member.",
    ],
    abilities: [
      "- Power ring fueled by willpower, one of the strongest wills in the Corps",
      "- Expert test pilot and aerial combatant",
      "- Has worn rings from several other Corps, including the blue and yellow",
    ],
    constructStyle:
      "Practical and fast: fighter jets, giant fists, missiles, chains and shields. Hal favors whatever ends the fight quickly, often with a pilot's flair.",
  },
  {
    name: "John Stewart",
    section: "earth",
    order: 2,
    corps: "green",
    species: "Human",
    homeSector: "Sector 2814 (Detroit, Earth)",
    firstAppearance: "Green Lantern #87 (1971)",
    appearsIn: ["comics", "tv", "animation", "games"],
    portrayals: [
      ["Phil LaMarr (voice)", "Justice League (2001)"],
      ["Aaron Pierre", "Lanterns (2026)"],
    ],
    reading: ["startHere", "dawn"],
    bio: [
      "John Stewart was first chosen as Hal Jordan's backup and went on to become one of the most important Lanterns in the Corps. An architect, and in modern stories a former Marine, he brings planning and discipline to everything he does.",
      "For a generation of fans, the Justice League animated series made John the definitive Green Lantern. In the comics he has led the Corps, carried its heaviest losses, and starred in Green Lantern: War Journal.",
    ],
    abilities: [
      "- Power ring fueled by willpower",
      "- Trained architect and military tactician",
    ],
    constructStyle:
      "Engineered and structurally sound. As an architect, John builds constructs with real internal structure, and they tend to be detailed and hard to break.",
  },
  {
    name: "Guy Gardner",
    section: "earth",
    order: 3,
    corps: "green",
    species: "Human",
    homeSector: "Sector 2814 (Baltimore, Earth)",
    firstAppearance: "Green Lantern #59 (1968)",
    appearsIn: ["comics", "film", "animation", "games"],
    portrayals: [["Nathan Fillion", "Superman (2025)"]],
    reading: ["johns", "new52"],
    bio: [
      "Guy Gardner was in line to receive Abin Sur's ring before Hal Jordan, and has been making up for it loudly ever since. He's brash, rude and very hard to like, until it counts.",
      "Under the bluster Guy is one of the most reliable Lanterns there is. He has served as a Green Lantern Honor Guard, trained recruits alongside Kilowog, and even led the Red Lantern Corps in the New 52.",
    ],
    abilities: [
      "- Power ring fueled by willpower",
      "- Has also wielded a red ring, which he kept in check better than most",
    ],
    constructStyle:
      "Blunt force. Boxing gloves, baseball bats, big guns and anything else that hits hard.",
  },
  {
    name: "Kyle Rayner",
    section: "earth",
    order: 4,
    corps: "green",
    species: "Human",
    homeSector: "Sector 2814 (Los Angeles, Earth)",
    firstAppearance: "Green Lantern #48 (1994)",
    appearsIn: ["comics", "animation", "games"],
    reading: ["johns", "new52"],
    bio: [
      "When the Corps fell in the 1990s, Ganthet gave the last ring to a freelance artist named Kyle Rayner. For years he was the only Green Lantern, and he rebuilt the Corps' legacy almost on his own.",
      "Kyle's imagination makes him unique among Lanterns. He later became the first being to master every color of the emotional spectrum, which made him the White Lantern.",
    ],
    abilities: [
      "- Power ring fueled by willpower",
      "- Can wield all seven colors of the emotional spectrum as the White Lantern",
    ],
    constructStyle:
      "The most imaginative in the Corps. Kyle's constructs are elaborate and often look like they came off a sketchbook page: giant robots, monsters and comic-book creations.",
  },
  {
    name: "Simon Baz",
    section: "earth",
    order: 5,
    corps: "green",
    species: "Human",
    homeSector: "Sector 2814 (Dearborn, Earth)",
    firstAppearance: "Green Lantern #0 (2012)",
    appearsIn: ["comics", "animation", "games"],
    reading: ["new52", "rebirth"],
    bio: [
      "Simon Baz is an Arab-American from Dearborn, Michigan, who got his ring while he was being wrongly accused of terrorism. His start as a Green Lantern was anything but smooth.",
      "Simon has a rare gift called Emerald Sight, which lets him see glimpses of the future. In Rebirth he was partnered with Jessica Cruz in Green Lanterns, and the two became one of the best duos in the Corps.",
    ],
    abilities: [
      "- Power ring fueled by willpower",
      "- Emerald Sight, which gives him visions of the future",
      "- Has used his ring to heal, which most Lanterns can't do",
    ],
  },
  {
    name: "Jessica Cruz",
    section: "earth",
    order: 6,
    corps: "green",
    species: "Human",
    homeSector: "Sector 2814 (Earth)",
    firstAppearance: "Justice League #30 (2014)",
    appearsIn: ["comics", "animation", "games"],
    reading: ["rebirth"],
    bio: [
      "Jessica Cruz is the Green Lantern who lives with anxiety. She was first forced to wear the ring of the villain Power Ring before earning a Green Lantern ring of her own, and her struggle to overcome fear every day makes her one of the most relatable Lanterns.",
      "She joined the Justice League and was partnered with Simon Baz in Green Lanterns, where she slowly learned to trust herself and her ring.",
    ],
    abilities: ["- Power ring fueled by willpower"],
  },
  {
    name: "Jo Mullein",
    section: "earth",
    order: 7,
    corps: "green",
    species: "Human",
    homeSector: "The Far Sector",
    firstAppearance: "Far Sector #1 (2019)",
    appearsIn: ["comics"],
    reading: ["morrison"],
    bio: [
      "Sojourner \"Jo\" Mullein is a former New York police officer posted to the Far Sector, outside the Guardians' usual territory. Her assignment is the City Enduring, a city of 20 billion people whose citizens long ago gave up their emotions.",
      "Jo was created by N.K. Jemisin and Jamal Campbell for Far Sector, a self-contained story that's one of the best places to start with Green Lantern.",
    ],
    abilities: ["- Power ring fueled by willpower"],
  },
  {
    name: "Alan Scott",
    section: "earth",
    order: 8,
    species: "Human",
    firstAppearance: "All-American Comics #16 (1940)",
    appearsIn: ["comics", "animation"],
    bio: [
      "Alan Scott is the original Green Lantern, from 1940. He isn't a member of the Corps. His power comes from the Starheart, a mystical source rather than the Guardians' battery, and he wields it through a ring he charges from a green lantern.",
      "Alan was a founding member of the Justice Society of America, and many of the Earth Lanterns look up to him as a mentor figure.",
    ],
    abilities: [
      "- Magic ring powered by the Starheart",
      "- Traditionally vulnerable to wood, rather than the color yellow",
    ],
  },

  // Alien Lanterns and fan favorites
  {
    name: "Kilowog",
    section: "alien",
    order: 1,
    corps: "green",
    species: "Bolovaxian",
    homeSector: "Sector 674",
    firstAppearance: "Green Lantern Corps #201 (1986)",
    appearsIn: ["comics", "film", "animation", "games"],
    portrayals: [["Michael Clarke Duncan (voice)", "Green Lantern (2011)"]],
    reading: ["johns"],
    bio: [
      "Kilowog is the Corps' legendary drill sergeant, and every new recruit has to get through him. He calls them all \"poozer.\"",
      "Underneath the barking he's one of the warmest characters in the franchise. He's also a gifted engineer and one of the last survivors of his homeworld, Bolovax Vik.",
    ],
    abilities: [
      "- Power ring fueled by willpower",
      "- Enormous physical strength",
      "- Scientist and engineer",
    ],
  },
  {
    name: "Tomar-Re",
    section: "alien",
    order: 2,
    corps: "green",
    species: "Xudarian",
    homeSector: "Sector 2813",
    firstAppearance: "Green Lantern #6 (1961)",
    appearsIn: ["comics", "film", "animation"],
    portrayals: [["Geoffrey Rush (voice)", "Green Lantern (2011)"]],
    reading: ["johns"],
    bio: [
      "Tomar-Re was a bird-like Lantern from the sector next to Earth's, and a close friend of Hal Jordan. He's remembered as one of the Corps' kindest and most dedicated members.",
      "His legacy lives on through his son Tomar-Tu, who also became a Green Lantern.",
    ],
    abilities: ["- Power ring fueled by willpower", "- Scientist"],
  },
  {
    name: "Mogo",
    section: "alien",
    order: 3,
    corps: "green",
    species: "Sentient planet",
    homeSector: "Sector 2261",
    firstAppearance: "Green Lantern #188 (1985)",
    appearsIn: ["comics", "animation"],
    reading: ["johns"],
    bio: [
      "Mogo is a Green Lantern who is an entire living planet. Its first appearance, in Alan Moore's story \"Mogo Doesn't Socialize,\" ends with the reveal that the Lantern everyone has been searching for is the planet under their feet.",
      "Mogo has served as a meeting place and a home base for the Corps, and in the modern era it guides new rings toward their bearers.",
    ],
    abilities: ["- Power ring fueled by willpower, worn as a band of foliage around its equator"],
  },
  {
    name: "Sinestro",
    alias: "Thaal Sinestro",
    section: "alien",
    order: 4,
    corps: "yellow",
    species: "Korugarian",
    homeSector: "Sector 1417 (Korugar)",
    firstAppearance: "Green Lantern #7 (1961)",
    appearsIn: ["comics", "tv", "film", "animation", "games"],
    portrayals: [
      ["Mark Strong", "Green Lantern (2011)"],
      ["Ulrich Thomsen", "Lanterns (2026)"],
    ],
    reading: ["johns", "new52"],
    bio: [
      "Sinestro was Hal Jordan's mentor and once the greatest Green Lantern of all, until it came out that he was ruling his homeworld of Korugar through fear. The Guardians expelled him, and he became the Corps' greatest enemy.",
      "Sinestro truly believes order is worth any price. He built the Sinestro Corps around the yellow light of fear, and his rivalry with Hal is the backbone of the modern Green Lantern saga.",
    ],
    abilities: [
      "- Power ring fueled by fear",
      "- Brilliant strategist and one of the most skilled ring-wielders in history",
    ],
  },
  {
    name: "Atrocitus",
    section: "alien",
    order: 5,
    corps: "red",
    homeSector: "Sector 666",
    appearsIn: ["comics", "animation", "games"],
    reading: ["johns", "new52"],
    bio: [
      "Atrocitus is one of the few survivors of the Manhunter massacre in Sector 666, which the Guardians caused. His rage at them is so complete that he founded the Red Lantern Corps to channel it.",
      "He's a monster, but an unusually clear-headed one. Unlike most Red Lanterns he keeps his intelligence while wearing a red ring.",
    ],
    abilities: ["- Power ring fueled by rage", "- Blood magic"],
  },
  {
    name: "Dex-Starr",
    section: "alien",
    order: 6,
    corps: "red",
    species: "Cat",
    homeSector: "Sector 2814 (Earth)",
    appearsIn: ["comics", "animation"],
    reading: ["johns"],
    bio: [
      "Dex-Starr was a house cat in New York whose owner was killed in a burglary. His rage was strong enough to draw a red ring, and he became the Red Lantern Corps' most unexpectedly popular member.",
    ],
    abilities: ["- Power ring fueled by rage"],
  },
  {
    name: "Larfleeze",
    alias: "Agent Orange",
    section: "alien",
    order: 7,
    corps: "orange",
    homeSector: "The Vega system",
    appearsIn: ["comics", "animation"],
    reading: ["johns", "new52"],
    bio: [
      "Larfleeze is the sole true Orange Lantern, and he wants everything. He took the orange lantern of avarice long ago and keeps it in the Vega system, where the Guardians agreed never to go.",
      "He's both terrifying and very funny, a creature of pure greed who once asked Santa Claus for everything in the universe.",
    ],
    abilities: [
      "- Power ring fueled by avarice",
      "- Can turn anyone he kills with the ring into an orange construct under his control",
    ],
  },
  {
    name: "Saint Walker",
    section: "alien",
    order: 8,
    corps: "blue",
    appearsIn: ["comics", "animation"],
    reading: ["johns", "new52"],
    bio: [
      "Saint Walker was the first Blue Lantern. His world was dying, and he kept hope alive through a pilgrimage that cost him his family. When a blue ring found him, his hope saved his people.",
      "He's one of the kindest characters in the saga, and was a key member of Kyle Rayner's New Guardians.",
    ],
    abilities: ["- Power ring fueled by hope", "- Can heal others"],
  },
  {
    name: "Ganthet",
    section: "alien",
    order: 9,
    corps: "blue",
    species: "Guardian of the Universe",
    appearsIn: ["comics", "animation"],
    reading: ["johns"],
    bio: [
      "Ganthet is the Guardian who has always believed in emotion. When the Corps was destroyed in the 1990s, he gave the last ring to Kyle Rayner.",
      "Ganthet and his partner Sayd were later exiled from the Guardians, and together they founded the Blue Lantern Corps of hope.",
    ],
  },
  {
    name: "Indigo-1",
    alias: "Iroque",
    section: "alien",
    order: 10,
    corps: "indigo",
    appearsIn: ["comics"],
    reading: ["johns", "new52"],
    bio: [
      "Indigo-1 leads the Indigo Tribe, the Corps of compassion. Like most of the Tribe, she was once someone who would never have felt compassion on her own.",
      "She speaks the Tribe's language, Nok, and is one of the few members who can communicate with the other Corps when she needs to.",
    ],
    abilities: [
      "- Indigo staff fueled by compassion",
      "- Can teleport and channel the power of other Corps' rings nearby",
    ],
  },

  // Others
  {
    name: "Carol Ferris",
    alias: "Star Sapphire",
    section: "other",
    order: 1,
    corps: "violet",
    species: "Human",
    homeSector: "Sector 2814 (Coast City, Earth)",
    firstAppearance: "Showcase #22 (1959)",
    appearsIn: ["comics", "film", "animation", "games"],
    portrayals: [["Blake Lively", "Green Lantern (2011)"]],
    reading: ["johns"],
    bio: [
      "Carol Ferris runs Ferris Aircraft and has been Hal Jordan's great love since his very first appearance. For decades the Zamarons forced the villainous Star Sapphire identity on her.",
      "In the modern era Carol accepted a violet ring on her own terms, and she's now one of the Star Sapphires' heroes.",
    ],
    abilities: [
      "- Violet ring fueled by love",
      "- Experienced pilot and business leader",
    ],
  },
  {
    name: "Black Hand",
    alias: "William Hand",
    section: "other",
    order: 2,
    corps: "black",
    species: "Human",
    homeSector: "Sector 2814 (Coast City, Earth)",
    firstAppearance: "Green Lantern #29 (1964)",
    appearsIn: ["comics", "animation", "games"],
    reading: ["johns"],
    bio: [
      "William Hand started out as a minor Green Lantern villain from Coast City. Geoff Johns reinvented him as a death-obsessed outcast, and he became Nekron's herald and the first Black Lantern.",
      "His story is the thread that runs through Blackest Night.",
    ],
    abilities: ["- Black ring fueled by death", "- Can raise the dead as Black Lanterns"],
  },
  {
    name: "Nekron",
    section: "other",
    order: 3,
    corps: "black",
    firstAppearance: "Tales of the Green Lantern Corps #2 (1981)",
    appearsIn: ["comics", "animation", "games"],
    reading: ["johns"],
    bio: [
      "Nekron is the lord of the unliving, the embodiment of death. In Blackest Night he raised an army of Black Lanterns from the universe's dead to wipe out all life.",
      "It took every Corps on the emotional spectrum working together to stop him.",
    ],
    abilities: ["- Commands the Black Lantern Corps", "- Effectively unkillable while death exists"],
  },
];

const key = (...parts) =>
  createHash("sha1").update(parts.join("/")).digest("hex").slice(0, 12);

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function toBlocks(paragraphs, docId, field) {
  return paragraphs.map((p, index) => {
    const blockKey = key(docId, field, index);
    let style = "normal";
    let listItem;
    let text = p;
    if (p.startsWith("## ")) {
      style = "h2";
      text = p.slice(3);
    } else if (p.startsWith("- ")) {
      listItem = "bullet";
      text = p.slice(2);
    }
    return {
      _key: blockKey,
      _type: "block",
      style,
      ...(listItem ? { listItem, level: 1 } : {}),
      markDefs: [],
      children: [{ _key: `${blockKey}-0`, _type: "span", text, marks: [] }],
    };
  });
}

const ref = (id, k) => ({ _type: "reference", _ref: id, ...(k ? { _key: k } : {}) });

for (const c of characters) {
  const slug = slugify(c.name);
  const id = `character-${slug}`;
  const doc = {
    _id: id,
    _type: "character",
    name: c.name,
    slug: { _type: "slug", current: slug },
    section: c.section,
    order: c.order,
    ...(c.alias ? { alias: c.alias } : {}),
    ...(c.corps ? { corps: ref(corps[c.corps]) } : {}),
    bio: toBlocks(c.bio, id, "bio"),
    ...(c.species ? { species: c.species } : {}),
    ...(c.homeSector ? { homeSector: c.homeSector } : {}),
    ...(c.firstAppearance ? { firstAppearance: c.firstAppearance } : {}),
    ...(c.abilities ? { abilities: toBlocks(c.abilities, id, "abilities") } : {}),
    ...(c.constructStyle ? { constructStyle: c.constructStyle } : {}),
    appearsIn: c.appearsIn,
    ...(c.portrayals
      ? {
          portrayals: c.portrayals.map(([actor, production], i) => ({
            _key: key(id, "portrayal", i),
            _type: "portrayal",
            actor,
            production,
          })),
        }
      : {}),
    ...(c.reading
      ? {
          readingRecommendations: c.reading.map((r) =>
            ref(reading[r], key(id, "reading", r)),
          ),
        }
      : {}),
  };
  process.stdout.write(`${JSON.stringify(doc)}\n`);
}
