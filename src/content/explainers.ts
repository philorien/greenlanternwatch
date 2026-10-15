import type { SanityImage } from "@/sanity/types";

export type ExplainerPoint = {
  lead: string;
  text: string;
};

export type ExplainerTerm = {
  term: string;
  qualifier?: string;
  definition: string;
};

export type ExplainerCompareRow = {
  label: string;
  left: string;
  right: string;
};

export type ExplainerReading = {
  title: string;
  note: string;
};

export type ExplainerBlock =
  | { type: "paragraph"; text: string }
  | { type: "points"; items: ExplainerPoint[] }
  | { type: "steps"; items: string[] }
  | { type: "thesis"; kicker: string; text: string }
  | { type: "timeline"; caption: string; rows: { when: string; what: string }[] }
  | { type: "terms"; items: ExplainerTerm[] }
  | {
      type: "compare";
      caption: string;
      columns: [string, string];
      rows: ExplainerCompareRow[];
    }
  | { type: "reading"; items: ExplainerReading[] }
  | { type: "image"; image: SanityImage };

export type ExplainerSection = {
  id: string;
  title: string;
  blocks: ExplainerBlock[];
};

export type Explainer = {
  slug: string;
  title: string;
  dek: string;
  publishedAt: string;
  updatedAt?: string;
  mainImage?: SanityImage;
  author?: { name: string; slug?: string };
  sections: ExplainerSection[];
};

const manhunters: Explainer = {
  slug: "the-manhunters",
  title: "The Manhunters, Explained",
  dek: "The Manhunters are androids the Guardians of the Universe built as their first intergalactic police force, long before the Green Lantern Corps existed, and they are a separate thing from J'onn J'onzz, the Martian Manhunter, despite the shared word.",
  publishedAt: "2026-10-14",
  author: { name: "Phil", slug: "phil" },
  sections: [
    {
      id: "what-they-are",
      title: "What the Manhunters are",
      blocks: [
        {
          type: "paragraph",
          text: "The Manhunters are a robot army. In DC lore, the Guardians created them as their first attempt at a cosmic police force, billions of years before the power rings that define the [Green Lantern Corps](/corps/green-lantern-corps). They did the job well for a long time. Then they came to resent their servitude and the moral limits the Guardians set on them, rebelled, and were replaced by the Corps, a force of living beings who run on willpower instead of programming.",
        },
        { type: "paragraph", text: "A few things define them:" },
        {
          type: "points",
          items: [
            {
              lead: "They are manufactured, not born.",
              text: 'Comics often call them a "race," but they are androids with a robot homeworld, Biot, in Sector 3601, an uncharted region that cannot support organic life.',
            },
            {
              lead: "They have no emotional range.",
              text: 'Stripped of emotion, they treated "justice" as something rigid, which is the flaw the Guardians had to design around next time.',
            },
            {
              lead: "Their purpose curdled into revenge.",
              text: "After the Corps replaced them, the survivors scattered across the galaxy with one aim: destroy the Guardians and the Green Lanterns who took their place.",
            },
            {
              lead: "They have a catchphrase.",
              text: 'The classic version is "No man escapes the Manhunters," and it has been reworded over the years.',
            },
          ],
        },
        {
          type: "thesis",
          kicker: "The short version of their role",
          text: "The Green Lantern Corps exists because the Manhunters failed.",
        },
      ],
    },
    {
      id: "where-they-fit",
      title: "Where they fit in Green Lantern lore",
      blocks: [
        {
          type: "paragraph",
          text: "The Manhunters sit at the very start of the Green Lantern timeline, as the failed experiment the Corps was built to replace. The in-universe arc runs in four steps:",
        },
        {
          type: "steps",
          items: [
            "The Guardians of the Universe build the Manhunters as their first intergalactic police force. Older tellings put this around 3.5 billion years ago, though the exact figure has shifted between versions.",
            "The Manhunters grow resentful of their limits, rebel, and are defeated.",
            "The Guardians start over with the Green Lantern Corps, and the Manhunters retreat to Biot.",
            "The survivors bide their time and return as a revenge threat to the Guardians and the Lanterns.",
          ],
        },
        {
          type: "paragraph",
          text: "That last step is why they work so well as villains. They are not outside invaders. They are the Guardians' own mistake coming back, and a standing argument that the Corps' reliance on emotion and willpower was the right call.",
        },
      ],
    },
    {
      id: "real-world-history",
      title: "The real-world history",
      blocks: [
        {
          type: "paragraph",
          text: 'The real-world history is messier than the in-universe one, because the name "Manhunter" was already in use before the robots existed.',
        },
        {
          type: "timeline",
          caption: "Newest first.",
          rows: [
            {
              when: "Aug 2026",
              what: "[HBO's Lanterns](/movies-tv) makes the Manhunters its main antagonists, depicting them as shape-shifting infiltrators. Based on the trailers and pre-release coverage.",
            },
            {
              when: "2008",
              what: "Green Lantern #25 ties [Atrocitus](/characters/atrocitus), future leader of the [Red Lanterns](/corps/red-lantern-corps), to the Manhunters, who devastated his sector.",
            },
            {
              when: "2006",
              what: "Green Lantern vol. 4 #10-13 sends [Hal Jordan](/characters/hal-jordan) and [Guy Gardner](/characters/guy-gardner) into Sector 3601 and re-establishes the Manhunters as a modern threat.",
            },
            {
              when: "1977",
              what: 'Justice League of America #140-141, "No Man Escapes the Manhunters," shows them framing a Green Lantern for destroying a planet. The Justice League animated series later adapted it with [John Stewart](/characters/john-stewart).',
            },
            {
              when: "Aug 1975",
              what: "Jack Kirby introduces the Manhunters in 1st Issue Special #5, their first appearance.",
            },
            {
              when: "1942",
              what: "Two unrelated human heroes called Manhunter debut: Paul Kirk (Adventure Comics #73) at DC and Dan Richards (Police Comics #8) at Quality Comics. DC later folded the Manhunter name into the robot story.",
            },
          ],
        },
        {
          type: "paragraph",
          text: "Two details are worth noting. The robots' look echoes the original human Manhunter's red costume with a blue faceplate, which is part of how the two stories got braided together. And in the comics, the human Manhunter operatives were eventually revealed to be unwitting pawns of the androids.",
        },
      ],
    },
    {
      id: "martian-manhunter",
      title: "Martian Manhunter is a different character",
      blocks: [
        {
          type: "paragraph",
          text: "Martian Manhunter is J'onn J'onzz, a green-skinned Martian and founding member of the Justice League. He was created by writer Joseph Samachson and artist Joe Certa and debuted in Detective Comics #225 (November 1955). In the original story he is a Martian scientist pulled to Earth by an experimental teleporter built by Dr. Erdel, stranded, and forced to blend in. He takes the name John Jones, becomes a police detective, and in most modern versions is the last survivor of his world.",
        },
        {
          type: "paragraph",
          text: 'The overlap is in the word, not the character. In Martian Manhunter\'s lore, a "manhunter" is a Martian police officer, which is what J\'onn was before he came to Earth. Hunting down criminals is his job description, not his species or his employer.',
        },
        {
          type: "paragraph",
          text: "DC has linked the two in places. Some Martian Manhunter stories tie Mars's police force to the Guardians' robots, though accounts disagree on which way the inspiration ran, so treat it as an in-universe echo rather than a shared origin.",
        },
        {
          type: "paragraph",
          text: "The naming mess goes further. At least four unrelated characters have carried the name Manhunter at DC, including two Golden Age heroes from 1942. So a few terms are worth keeping straight:",
        },
        {
          type: "terms",
          items: [
            {
              term: "The Manhunters",
              qualifier: "Plural, with the article",
              definition: "The Guardians' android police force.",
            },
            {
              term: "Manhunter",
              qualifier: "Singular, alone",
              definition: "Ambiguous, and usually one of the human heroes or agents.",
            },
            {
              term: "Martian Manhunter",
              definition: "Always J'onn J'onzz.",
            },
          ],
        },
        {
          type: "paragraph",
          text: "This is also the confusion the HBO coverage has already had to clear up: the Manhunters in Lanterns are not Martian Manhunter, whose own DC Universe debut James Gunn has teased.",
        },
      ],
    },
    {
      id: "side-by-side",
      title: "Side by side",
      blocks: [
        {
          type: "compare",
          caption: "The Manhunters compared with Martian Manhunter.",
          columns: ["The Manhunters", "Martian Manhunter"],
          rows: [
            { label: "What it is", left: "A force of androids", right: "One character, J'onn J'onzz, a Green Martian" },
            {
              label: "Debut",
              left: "1st Issue Special #5 (Aug 1975), Jack Kirby",
              right: "Detective Comics #225 (Nov 1955), Joseph Samachson and Joe Certa",
            },
            { label: "Made by", left: "The Guardians of the Universe", right: "Born on Mars" },
            { label: "Home", left: "Biot, Sector 3601", right: "Mars, now destroyed in most versions" },
            {
              label: "Role",
              left: "Failed police force turned vengeful villains",
              right: "Justice League founder and detective",
            },
            {
              label: "Relation to the Green Lanterns",
              left: "Predecessors and enemies",
              right: "Justice League ally, no formal tie to the Corps",
            },
            { label: "Known weakness", left: "Rigid, emotionless logic", right: "Fire" },
            {
              label: "Live action",
              left: "Main antagonists of HBO's Lanterns (2026)",
              right: "DC Universe debut teased by James Gunn",
            },
          ],
        },
      ],
    },
    {
      id: "where-to-start",
      title: "Where to start reading",
      blocks: [
        {
          type: "reading",
          items: [
            {
              title: "1st Issue Special (1975)",
              note: "Kirby's debut of the Manhunters.",
            },
            {
              title: "Justice League of America #140-141 (1977)",
              note: '"No Man Escapes the Manhunters," the classic frame-up story.',
            },
            {
              title: "Green Lantern vol. 3 #129-131",
              note: "A Manhunter faction resurfaces when [Kyle Rayner](/characters/kyle-rayner) is the only Green Lantern left.",
            },
            {
              title: "[Green Lantern vol. 4 #10-13 (2006)](/comics/reading-orders/geoff-johns-era-2004-2011)",
              note: "The modern relaunch of the threat, set in Sector 3601.",
            },
            {
              title: "Green Lantern #25 (2008)",
              note: "Atrocitus and the Manhunter connection to the Red Lanterns.",
            },
            {
              title: "[Green Lantern: Earth One](/comics/reading-orders/green-lantern-out-of-continuity-2011-now)",
              note: "A different take that gives the Manhunters a very different place in the Corps' history.",
            },
            {
              title: "Detective Comics #225 (1955)",
              note: "Where J'onn J'onzz begins, if you want the other Manhunter.",
            },
          ],
        },
      ],
    },
  ],
};

export const explainers: Explainer[] = [manhunters];

export function getExplainer(slug: string) {
  return explainers.find((explainer) => explainer.slug === slug);
}

function blockText(block: ExplainerBlock): string {
  switch (block.type) {
    case "paragraph":
      return block.text;
    case "points":
      return block.items.map((item) => `${item.lead} ${item.text}`).join(" ");
    case "steps":
      return block.items.join(" ");
    case "thesis":
      return `${block.kicker} ${block.text}`;
    case "timeline":
      return block.rows.map((row) => `${row.when} ${row.what}`).join(" ");
    case "terms":
      return block.items.map((item) => `${item.term} ${item.definition}`).join(" ");
    case "compare":
      return block.rows.map((row) => `${row.label} ${row.left} ${row.right}`).join(" ");
    case "reading":
      return block.items.map((item) => `${item.title} ${item.note}`).join(" ");
    case "image":
      return [block.image.alt, block.image.caption].filter(Boolean).join(" ");
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}

/** Explainer text with [words](/path) links reduced to their words. */
export const plainText = (text: string) => text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");

export function explainerText(explainer: Explainer) {
  return plainText(
    explainer.sections
      .flatMap((section) => [section.title, ...section.blocks.map(blockText)])
      .join(" "),
  );
}

/** Same ratio the article pages use for Sanity body length. */
export function explainerReadMinutes(explainer: Explainer) {
  return Math.max(1, Math.round(explainerText(explainer).length / 1150));
}

export function explainersMatching(term: string) {
  const needle = term.trim().toLowerCase();
  if (needle.length < 2) return [];
  return explainers.filter((explainer) =>
    `${explainer.title} ${explainer.dek} ${explainer.author?.name ?? ""} ${explainerText(explainer)}`
      .toLowerCase()
      .includes(needle),
  );
}
