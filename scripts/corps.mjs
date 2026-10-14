// Builds the nine emotional spectrum Corps as NDJSON for `sanity dataset import`.
//
//   node scripts/corps.mjs > /tmp/corps.ndjson
//   npx sanity dataset import /tmp/corps.ndjson --dataset production --replace
//
// Document IDs are fixed, so re-running the import replaces these documents in place.
// Description lines starting with "## " become headings and "- " become bullets.

import { createHash } from "node:crypto";

const corps = [
  {
    id: "corps-red-lantern-corps",
    name: "Red Lantern Corps",
    spectrum: "red",
    emotion: "Rage",
    order: 10,
    tagline: "Atrocitus' army of the furious, powered by blood and rage.",
    keyFigures: ["Atrocitus", "Bleez", "Dex-Starr", "Guy Gardner", "Skallox", "Zilius Zox"],
    description: [
      "The Red Lanterns are what happens when rage is given a ring. Atrocitus, one of the few survivors of the Manhunter massacre in Sector 666, built the Corps on the planet Ysmault to take revenge on the Guardians of the Universe who sent those Manhunters.",
      "A red ring doesn't just choose its bearer, it consumes them. It replaces their blood with a burning red plasma that they vomit at their enemies, and most new recruits lose their minds to fury. Only a handful, Atrocitus among them, can think clearly while wearing one.",
      "## Where to start",
      "- **Rage of the Red Lanterns**, in Geoff Johns' Green Lantern, where the Corps first appears in force.",
      "- **Red Lanterns (2011)**, the New 52 series that later puts Guy Gardner in charge.",
    ],
  },
  {
    id: "corps-orange-lantern-corps",
    name: "Orange Lantern Corps",
    spectrum: "orange",
    emotion: "Avarice",
    order: 20,
    tagline: "A Corps of one: Larfleeze and everything he has ever taken.",
    keyFigures: ["Larfleeze", "Glomulus"],
    description: [
      "The Orange Light of avarice belongs to Larfleeze, and he isn't sharing. He took the Orange Lantern long ago and struck a deal with the Guardians: they leave the Vega system alone, and he stays inside it.",
      "That's why the Orange Lantern Corps is really just one being. Anyone Larfleeze kills with the ring becomes an orange construct under his control, so his \"Corps\" is an army of stolen identities. Lex Luthor did briefly get an orange ring during Blackest Night, and promptly wanted everything.",
      "## Where to start",
      "- **Agent Orange**, in Geoff Johns' Green Lantern, which introduces Larfleeze.",
      "- **Larfleeze (2013)**, his own surprisingly funny solo series.",
    ],
  },
  {
    id: "corps-sinestro-corps",
    name: "Sinestro Corps",
    spectrum: "yellow",
    emotion: "Fear",
    order: 30,
    tagline: "Sinestro's answer to the Green Lanterns: order through fear.",
    keyFigures: ["Sinestro", "Arkillo", "Lyssa Drak", "Mongul", "Soranik Natu"],
    description: [
      "Thaal Sinestro was once the greatest Green Lantern of all, until the Guardians found out he was ruling his home sector through fear and threw him out of the Corps. He took a yellow ring from the Weaponers of Qward and built a Corps of his own around the emotion he understood best.",
      "Sinestro Corps members are chosen for their ability to instill great fear. The light of fear is the same yellow that the Green Lantern rings were long unable to touch, and the fear entity Parallax is bound up in its history.",
      "## Where to start",
      "- **The Sinestro Corps War**, the 2007 event that made the Corps famous and opened up the whole emotional spectrum.",
      "- **Sinestro (2014)**, a solo series that follows Sinestro rebuilding his Corps.",
    ],
  },
  {
    id: "corps-green-lantern-corps",
    name: "Green Lantern Corps",
    spectrum: "green",
    emotion: "Willpower",
    order: 40,
    tagline: "The Guardians' intergalactic police force, two Lanterns per sector.",
    keyFigures: ["Hal Jordan", "John Stewart", "Guy Gardner", "Kyle Rayner", "Simon Baz", "Jessica Cruz", "Kilowog"],
    description: [
      "The Green Lantern Corps is the oldest and best known of the Corps. The Guardians of the Universe founded it on Oa to keep the peace across 3,600 sectors of space, with two Lanterns assigned to each one. Earth is in Sector 2814.",
      "A green ring is powered by willpower and chooses beings who can overcome great fear. Earth has produced an unusual number of them, from test pilot Hal Jordan and architect John Stewart to Guy Gardner, Kyle Rayner, Simon Baz and Jessica Cruz.",
      "## Where to start",
      "- **Green Lantern: Rebirth**, Geoff Johns' 2004 return of Hal Jordan, and the start of the modern era.",
      "- **Green Lantern Corps (2006)**, which follows the rank-and-file Lanterns rather than the headliners.",
    ],
  },
  {
    id: "corps-blue-lantern-corps",
    name: "Blue Lantern Corps",
    spectrum: "blue",
    emotion: "Hope",
    order: 50,
    tagline: "Ganthet and Sayd's Corps of hope, built to back up the Green Lanterns.",
    keyFigures: ["Saint Walker", "Ganthet", "Sayd", "Brother Warth"],
    description: [
      "When Ganthet and Sayd were cast out of the Guardians, they founded the Blue Lantern Corps on the planet Odym. Their rings run on hope, and they were made to support the Green Lantern Corps rather than compete with it.",
      "Blue rings are most powerful near a green ring, which they can supercharge. Saint Walker, the first Blue Lantern, is the face of the Corps and one of the kindest characters in the whole saga.",
      "## Where to start",
      "- **Rage of the Red Lanterns**, in Geoff Johns' Green Lantern, where the Blue Lanterns are introduced.",
      "- **Green Lantern: New Guardians (2011)**, where Saint Walker joins Kyle Rayner's team.",
    ],
  },
  {
    id: "corps-indigo-tribe",
    name: "Indigo Tribe",
    spectrum: "indigo",
    emotion: "Compassion",
    order: 60,
    tagline: "Former killers and criminals, forced to feel what their victims felt.",
    keyFigures: ["Indigo-1", "Abin Sur", "Munk", "Natromo"],
    description: [
      "The Indigo Tribe is the most mysterious of the Corps. It was founded with the help of Abin Sur, the Green Lantern who gave Hal Jordan his ring, and most of its members were once murderers and monsters. The indigo light makes them feel compassion for everyone they've ever hurt.",
      "The Tribe speaks its own language, carries staffs instead of wearing rings, and can channel the power of other Corps' rings nearby. Their leader, Indigo-1, was one of the first to be converted.",
      "## Where to start",
      "- **Blackest Night**, where the Tribe steps out of the shadows.",
      "- **Green Lantern (2011)**, Geoff Johns' New 52 run, which reveals how the Tribe began.",
    ],
  },
  {
    id: "corps-star-sapphires",
    name: "Star Sapphires",
    spectrum: "violet",
    emotion: "Love",
    order: 70,
    tagline: "The Zamarons' Corps of love, and Carol Ferris' calling.",
    keyFigures: ["Carol Ferris", "Queen Aga'po", "Fatality", "Miri Riam"],
    description: [
      "The Star Sapphires are the Corps of love, founded by the Zamarons, the female counterparts of the Guardians, on the planet Zamaron. For decades the Star Sapphire was a single villainous identity forced on Hal Jordan's love Carol Ferris. In the modern era it became a full Corps, and Carol became one of its heroes.",
      "Love is one of the most powerful lights on the spectrum, and the Star Sapphires can trap their foes in violet crystal and sense the bonds between people. Their oath ends with a promise: love conquers all with violet light.",
      "## Where to start",
      "- **Blackest Night**, where Carol Ferris fights alongside the other Corps as a Star Sapphire.",
      "- **Green Lantern: New Guardians (2011)**, which features the Star Sapphire Fatality.",
    ],
  },
  {
    id: "corps-black-lantern-corps",
    name: "Black Lantern Corps",
    spectrum: "black",
    emotion: "Death",
    order: 80,
    tagline: "Nekron's army of the dead, and the threat at the heart of Blackest Night.",
    keyFigures: ["Nekron", "Black Hand", "Scar"],
    description: [
      "The Black Lanterns aren't really part of the emotional spectrum. They stand outside it, as the opposite of life itself. Black rings raise the dead, including fallen heroes and villains, and turn them against the living, tearing out hearts to fuel their power.",
      "Nekron, the lord of the unliving, commands the Corps, with Black Hand as his herald and the rogue Guardian Scar working in the shadows. Every other Corps had to fight together to stop them.",
      "## Where to start",
      "- **Blackest Night**, the 2009-2010 event that the Black Lanterns were created for.",
    ],
  },
  {
    id: "corps-white-lantern-corps",
    name: "White Lantern Corps",
    spectrum: "white",
    emotion: "Life",
    order: 90,
    tagline: "The light of life itself, made from every color of the spectrum.",
    keyFigures: ["The Entity", "Kyle Rayner", "Deadman", "Sinestro"],
    description: [
      "The White Light is life itself, the combination of every color on the spectrum. It first appears at the climax of Blackest Night, when it's used to defeat Nekron, and its source is the Entity, the embodiment of life in the universe.",
      "There has never been a large White Lantern Corps. A few beings have carried the white ring, including Sinestro, Deadman and, most notably, Kyle Rayner, who becomes the White Lantern by mastering every color of the spectrum.",
      "## Where to start",
      "- **Brightest Day**, the 2010-2011 follow-up to Blackest Night, built around the White Lantern.",
      "- **Green Lantern: New Guardians (2011)**, where Kyle Rayner becomes the White Lantern.",
    ],
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

// Inline **bold** only.
function spans(text, blockKey) {
  return text
    .split(/(\*\*.+?\*\*)/)
    .filter(Boolean)
    .map((t, i) => {
      const bold = t.startsWith("**") && t.endsWith("**");
      return {
        _key: `${blockKey}-${i}`,
        _type: "span",
        text: bold ? t.slice(2, -2) : t,
        marks: bold ? ["strong"] : [],
      };
    });
}

function toBlocks(paragraphs, docId) {
  return paragraphs.map((p, index) => {
    const blockKey = key(docId, "description", index);
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
      children: spans(text, blockKey),
    };
  });
}

for (const c of corps) {
  const doc = {
    _id: c.id,
    _type: "corps",
    name: c.name,
    slug: { _type: "slug", current: slugify(c.name) },
    spectrum: c.spectrum,
    emotion: c.emotion,
    order: c.order,
    tagline: c.tagline,
    keyFigures: c.keyFigures,
    description: toBlocks(c.description, c.id),
  };
  process.stdout.write(`${JSON.stringify(doc)}\n`);
}
