// Builds the story arc hubs as NDJSON for `sanity dataset import`.
//
//   node scripts/story-arcs.mjs > /tmp/story-arcs.ndjson
//   npx sanity dataset import /tmp/story-arcs.ndjson --dataset production --replace
//   npx sanity exec scripts/key-storylines.mjs --with-user-token
//   npx sanity exec scripts/comicvine/sync.mjs --with-user-token
//
// Document IDs are fixed, so re-running the import replaces these documents in place.
// Characters and corps are referenced by the fixed IDs from scripts/characters.mjs and
// scripts/corps.mjs, so import those first. key-storylines.mjs then sets each character's
// Key storylines from the `keyFor` lists below, and the ComicVine sync fills in covers.
//
// `keyFor` is who the arc is a key storyline for. `featuring` adds other key characters
// to the arc page. Reading list lines use the same "Series (Year) #issues | note"
// shorthand as the reading orders.

import { createHash } from "node:crypto";

export const characterIds = {
  hal: "character-hal-jordan",
  john: "character-john-stewart",
  guy: "character-guy-gardner",
  kyle: "character-kyle-rayner",
  jo: "character-jo-mullein",
  kilowog: "character-kilowog",
  tomarRe: "character-tomar-re",
  mogo: "character-mogo",
  sinestro: "character-sinestro",
  atrocitus: "character-atrocitus",
  dexStarr: "character-dex-starr",
  larfleeze: "character-larfleeze",
  saintWalker: "character-saint-walker",
  ganthet: "character-ganthet",
  indigo1: "character-indigo-1",
  carol: "character-carol-ferris",
  blackHand: "character-black-hand",
  nekron: "character-nekron",
  // Added in the Studio rather than by scripts/characters.mjs.
  bleez: "6793dfa0-8123-4770-be06-d6c33e277a12",
};

const corpsIds = {
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

const PUBLISHER = "DC Comics";

export const arcs = [
  {
    title: "Emerald Dawn",
    kind: "storyline",
    creators: ["Keith Giffen", "Gerard Jones", "Jim Owsley", "M.D. Bright"],
    startYear: 1989,
    endYear: 1990,
    tagline: "Hal Jordan's post-Crisis origin, from Abin Sur's ring to his first fight on Oa.",
    keyFor: ["hal"],
    featuring: ["kilowog", "tomarRe", "sinestro", "carol"],
    corps: ["green"],
    summary: [
      "Emerald Dawn retold Hal Jordan's origin for the post-Crisis DC Universe. Hal is a former test pilot whose life is falling apart when the dying Abin Sur crashes on Earth and his ring chooses Hal as his successor. The killer Abin Sur was chasing, Legion, follows the ring's trail to Earth.",
      "Hal meets Tomar-Re, trains under Kilowog on Oa and has to stop Legion when it breaks into the Guardians' home. It was later followed by Emerald Dawn II, and replaced in modern continuity by Secret Origin.",
    ],
    reading: `
      GL: Emerald Dawn (1989) #1-6
    `,
  },
  {
    title: "Green Lantern: Mosaic",
    kind: "run",
    creators: ["Gerard Jones", "Cully Hamner"],
    startYear: 1992,
    endYear: 1993,
    tagline: "John Stewart tries to turn a patchwork of stolen cities on Oa into one world.",
    keyFor: ["john"],
    corps: ["green"],
    summary: [
      "The mad Guardian Appa Ali Apsa, driven insane by loneliness, uprooted cities from across the universe, including Evergreen City on Earth, and set them down on Oa. When the Guardians return, they decide to let the experiment play out, and they put John Stewart in charge of the Mosaic World.",
      "Mosaic is a quieter, more thoughtful Green Lantern book. John has to keep the peace between communities that never chose to live together and try to build one society out of them. It's one of John's defining stories, and ends with him becoming the first mortal Guardian.",
    ],
    reading: `
      GL: Mosaic (1992) #1-18
    `,
  },
  {
    title: "Emerald Twilight",
    kind: "storyline",
    creators: ["Ron Marz", "Bill Willingham", "Fred Haynes", "Darryl Banks"],
    startYear: 1994,
    tagline: "Coast City is gone, Hal Jordan breaks, and the Corps falls with him.",
    keyFor: ["hal", "kyle", "ganthet"],
    featuring: ["kilowog", "sinestro"],
    corps: ["green"],
    summary: [
      "After Coast City is destroyed, Hal Jordan uses his ring to rebuild it, and the Guardians reprimand him for it. Hal snaps. He flies to Oa, takes the rings of every Lantern who gets in his way, kills Kilowog and Sinestro, and absorbs the Central Power Battery.",
      "With the Corps and the Guardians gone, Ganthet, the last Guardian, gives the final ring to a young artist named Kyle Rayner. It's one of the most controversial stories in comics, and Green Lantern: Rebirth later revealed that Hal was possessed by the fear entity Parallax.",
    ],
    reading: `
      GL (1990) #48-50 | Kyle Rayner gets the ring at the end of issue 50.
    `,
  },
  {
    title: "Circle of Fire",
    kind: "storyline",
    creators: [
      "Brian K. Vaughan",
      "Judd Winick",
      "Jay Faerber",
      "Scott Beatty",
      "Cary Nord",
      "Norm Breyfogle",
    ],
    startYear: 2000,
    tagline: "Kyle Rayner faces Oblivion, a monster born from his own fears and imagination.",
    keyFor: ["kyle"],
    corps: ["green"],
    summary: [
      "Oblivion, a being born from Kyle Rayner's own doubts and fears, attacks the Justice League. Kyle's imagination answers with new Green Lanterns of its own, and each one teams up with another hero: Adam Strange, the Atom, Firestorm and Power Girl.",
      "It's one of Kyle's most distinctive stories, about his creativity, his fears and what kind of hero he is. Two bookend issues frame the five team-up one-shots.",
    ],
    reading: `
      GL: Circle of Fire (2000) #1
      GL/Adam Strange (2000) #1
      GL/Atom (2000) #1
      GL/Firestorm (2000) #1
      GL/Power Girl (2000) #1
      GL/Green Lantern (2000) #1
      GL: Circle of Fire (2000) #2
    `,
  },
  {
    title: "The Last Will and Testament of Hal Jordan",
    kind: "storyline",
    creators: ["Joe Kelly", "Brent Anderson", "Bill Sienkiewicz"],
    startYear: 2002,
    tagline: "Hal's old friend Tom Kalmaku is left a boy, a power ring and a note that says \"fix it.\"",
    keyFor: ["hal"],
    featuring: ["carol", "kyle", "john", "guy", "kilowog"],
    corps: ["green"],
    summary: [
      "After Hal Jordan's death, his old friend Tom Kalmaku is down on his luck when Hal's will names him guardian of a boy who seems to be Hal's son, and who wears a power ring. The Justice League wants the ring, and a Dark Lantern built from Kilowog's spirit is hunting anything left of Hal's legacy.",
      "It's a graphic novel about grief and what we owe the people we've lost, told from the point of view of someone who never had a ring.",
    ],
    reading: [
      {
        title: "Green Lantern: Legacy - The Last Will and Testament of Hal Jordan",
        issues: "Original graphic novel",
        format: "collected",
      },
    ],
  },
  {
    title: "Green Lantern: Rebirth",
    kind: "storyline",
    creators: ["Geoff Johns", "Ethan Van Sciver"],
    startYear: 2004,
    endYear: 2005,
    tagline: "Hal Jordan returns, Parallax is revealed, and the modern era begins.",
    keyFor: ["hal", "sinestro", "kyle"],
    featuring: ["john", "guy", "kilowog", "ganthet"],
    corps: ["green"],
    summary: [
      "Geoff Johns and Ethan Van Sciver bring Hal Jordan back from the dead and explain his fall: the yellow impurity in the rings was Parallax, a fear entity that possessed Hal. Kyle Rayner, John Stewart, Guy Gardner and Kilowog all have a part to play in freeing him, and Sinestro returns as the villain behind it all.",
      "Rebirth is the starting point for the modern Green Lantern saga, and almost everything since builds on it.",
    ],
    reading: `
      GL: Rebirth (2004) #1-6
    `,
  },
  {
    title: "Revenge of the Green Lanterns",
    kind: "storyline",
    creators: ["Geoff Johns", "Ivan Reis"],
    startYear: 2006,
    tagline: "The Lanterns Hal thought he killed as Parallax may still be alive.",
    keyFor: ["hal"],
    featuring: ["guy"],
    corps: ["green"],
    summary: [
      "One year after Infinite Crisis, Hal Jordan learns that some of the Lanterns he was thought to have killed as Parallax are still alive, held by the Manhunters and Cyborg Superman. Hal and Guy Gardner head into enemy territory to bring them home, and Hal has to convince them he isn't the man who attacked them.",
      "It's an early piece of Johns' run that sets up the Manhunters and Cyborg Superman for the Sinestro Corps War.",
    ],
    reading: `
      GL (2005) #10-13
    `,
  },
  {
    title: "Ion: The Torchbearer",
    kind: "run",
    creators: ["Ron Marz", "Greg Tocchini"],
    startYear: 2006,
    endYear: 2007,
    tagline: "Kyle Rayner carries the power of Ion, and it's slipping out of his control.",
    keyFor: ["kyle"],
    corps: ["green"],
    summary: [
      "After Infinite Crisis, Kyle Rayner carries the power of Ion, the embodiment of willpower. Ron Marz, who co-created Kyle, returns for a twelve-issue series that follows him across the universe as he tries to understand that power and what it costs him.",
      "The first six issues are the Torch Bearer story. The series leads straight into the Sinestro Corps War, where Kyle's connection to Ion becomes a target.",
    ],
    reading: `
      Ion (2006) #1-6 | Torch Bearer.
      Ion (2006) #7-12
    `,
  },
  {
    title: "The Sinestro Corps War",
    kind: "event",
    creators: [
      "Geoff Johns",
      "Dave Gibbons",
      "Peter J. Tomasi",
      "Ethan Van Sciver",
      "Ivan Reis",
      "Patrick Gleason",
    ],
    startYear: 2007,
    endYear: 2008,
    tagline: "Sinestro's army of fear goes to war with the Green Lantern Corps.",
    keyFor: ["hal", "john", "guy", "kyle", "sinestro", "mogo"],
    featuring: ["kilowog", "ganthet"],
    corps: ["yellow", "green"],
    summary: [
      "Sinestro builds a Corps of his own around the yellow light of fear, backed by Parallax, the Anti-Monitor, Cyborg Superman and Superman-Prime, and declares war on the Green Lanterns. Kyle Rayner is taken as Parallax's new host, Mogo becomes a battlefield, and the Guardians finally let their Lanterns use lethal force.",
      "It's the event that made modern Green Lantern a phenomenon, and the story that opened up the whole emotional spectrum. Its last chapter reveals the Blackest Night prophecy.",
    ],
    reading: `
      Sinestro Corps Special (2007) #1
      GL (2005) #21
      GLC (2006) #14
      GL (2005) #22
      GLC (2006) #15
      GL (2005) #23
      GLC (2006) #16
      GL (2005) #24
      GLC (2006) #17-18
      GL (2005) #25 | Birth of the Black Lantern, the first glimpse of Blackest Night.
      GLC (2006) #19
    `,
  },
  {
    title: "Secret Origin",
    kind: "storyline",
    creators: ["Geoff Johns", "Ivan Reis"],
    startYear: 2008,
    tagline: "Hal Jordan's origin, retold for the modern era, with Sinestro as his mentor.",
    keyFor: ["hal", "sinestro"],
    featuring: ["carol", "atrocitus", "blackHand"],
    corps: ["green"],
    summary: [
      "Geoff Johns and Ivan Reis retell how Hal Jordan got his ring, and how he was trained by the greatest Green Lantern of all, Sinestro. Along the way they introduce Atrocitus and a young William Hand, and plant the seeds for the Red Lanterns and Blackest Night.",
      "It was written after Rebirth and reads well on its own, which makes it a popular first Green Lantern book.",
    ],
    reading: `
      GL (2005) #29-35
    `,
  },
  {
    title: "Rage of the Red Lanterns",
    kind: "storyline",
    creators: ["Geoff Johns", "Ivan Reis", "Shane Davis"],
    startYear: 2008,
    endYear: 2009,
    tagline: "Atrocitus' Red Lanterns attack, and the Blue Lanterns of hope arrive.",
    keyFor: ["atrocitus", "dexStarr", "saintWalker", "bleez", "hal"],
    featuring: ["sinestro", "ganthet"],
    corps: ["red", "blue", "yellow", "green"],
    summary: [
      "Atrocitus and the Red Lantern Corps ambush the Sinestro Corps and take Sinestro prisoner. Ganthet and Sayd send Saint Walker to bring Hal Jordan to Odym, home of the new Blue Lanterns, and Hal ends up wearing a red ring and then a blue one.",
      "It's the debut of Saint Walker, Bleez and Dex-Starr, and the War of Light starts here.",
    ],
    reading: `
      Final Crisis: Rage of the Red Lanterns (2008) #1
      GL (2005) #36-38
    `,
  },
  {
    title: "Agent Orange",
    kind: "storyline",
    creators: ["Geoff Johns", "Philip Tan"],
    startYear: 2009,
    tagline: "The Guardians break their deal with Larfleeze, keeper of the orange light of avarice.",
    keyFor: ["larfleeze"],
    featuring: ["hal", "saintWalker", "sinestro", "atrocitus"],
    corps: ["orange", "blue", "green"],
    summary: [
      "The Guardians break their ancient pact to leave the Vega system alone, and Larfleeze, the only true Orange Lantern, comes after them. Hal Jordan, still wearing a blue ring, is caught in the middle.",
      "It introduces Larfleeze and his army of orange constructs, and it's the last stop before Blackest Night.",
    ],
    reading: `
      GL (2005) #39-42
    `,
  },
  {
    title: "Emerald Eclipse",
    kind: "storyline",
    creators: ["Peter J. Tomasi", "Patrick Gleason"],
    startYear: 2009,
    tagline: "Mongul seizes Daxam, and a prison riot breaks out on Oa.",
    keyFor: ["guy", "kyle"],
    featuring: ["kilowog"],
    corps: ["green", "yellow"],
    summary: [
      "Mongul has taken over the Sinestro Corps and makes the planet Daxam its new home. Sodam Yat, the Daxamite Green Lantern who carries the power of Ion, has to go back to the homeworld he swore he'd never return to.",
      "Meanwhile, on Oa, a Red Lantern breaks out of the sciencells and starts a riot that Kyle Rayner, Guy Gardner and Kilowog have to contain. It's the last Green Lantern Corps arc before Blackest Night.",
    ],
    reading: `
      GLC (2006) #33-38
    `,
  },
  {
    title: "Blackest Night",
    kind: "event",
    creators: ["Geoff Johns", "Ivan Reis", "Peter J. Tomasi", "Patrick Gleason", "Doug Mahnke"],
    startYear: 2009,
    endYear: 2010,
    tagline: "The dead rise as Black Lanterns, and every Corps on the spectrum has to fight together.",
    keyFor: [
      "hal",
      "sinestro",
      "atrocitus",
      "larfleeze",
      "saintWalker",
      "indigo1",
      "carol",
      "blackHand",
      "nekron",
    ],
    featuring: ["john", "guy", "kyle", "kilowog", "ganthet", "dexStarr"],
    corps: ["black", "green", "yellow", "red", "orange", "blue", "indigo", "violet", "white"],
    summary: [
      "Black rings fall across the universe and raise the dead as Black Lanterns, led by Nekron and his herald, Black Hand. Fallen heroes and villains return to tear out the hearts of the living, and the only way to stop them is for every Corps on the emotional spectrum to fight side by side.",
      "It's the payoff to everything Geoff Johns had built since Rebirth, and the event that introduced the White Light of life. The main series and the two Green Lantern books tell the core story. The tie-ins are optional.",
    ],
    reading: `
      Blackest Night (2009) #0 | Free Comic Book Day prologue.
      GL (2005) #43 | The origin of Black Hand.
      Blackest Night (2009) #1
      GLC (2006) #39
      GL (2005) #44
      Blackest Night (2009) #2
      GL (2005) #45
      GLC (2006) #40
      Blackest Night (2009) #3
      GL (2005) #46
      GLC (2006) #41
      Blackest Night (2009) #4
      GL (2005) #47
      GLC (2006) #42
      GL (2005) #48
      Blackest Night (2009) #5
      GLC (2006) #43
      GL (2005) #49
      Blackest Night (2009) #6
      GLC (2006) #44
      GL (2005) #50-51
      GLC (2006) #45
      Blackest Night (2009) #7
      GLC (2006) #46
      GL (2005) #52
      Blackest Night (2009) #8
      GLC (2006) #47
    `,
  },
  {
    title: "Emerald Warriors",
    kind: "storyline",
    creators: ["Peter J. Tomasi", "Fernando Pasarin"],
    startYear: 2010,
    endYear: 2011,
    tagline: "Guy Gardner's secret pact with Atrocitus takes him into the Unknown Sectors.",
    keyFor: ["guy"],
    featuring: ["kilowog", "atrocitus", "bleez", "ganthet"],
    corps: ["green", "red"],
    summary: [
      "Guy Gardner, Kilowog and Arisia head into the Unknown Sectors, the uncharted edges of the universe, to shine a light where the Corps has never been. What his friends don't know is that Guy is there on a secret mission, part of a blood pact with Ganthet and the Red Lantern Atrocitus.",
      "It's a darker, more violent Lantern book, and one of the prologues to War of the Green Lanterns.",
    ],
    reading: `
      GL: Emerald Warriors (2010) #1-7 | Issues 8 to 10 continue in War of the Green Lanterns.
    `,
  },
  {
    title: "War of the Green Lanterns",
    kind: "event",
    creators: [
      "Geoff Johns",
      "Peter J. Tomasi",
      "Tony Bedard",
      "Doug Mahnke",
      "Fernando Pasarin",
      "Tyler Kirkham",
    ],
    startYear: 2011,
    tagline: "Krona turns the Corps against Earth's Lanterns, who have to fight with other Corps' rings.",
    keyFor: ["hal", "john", "guy", "kyle", "mogo"],
    featuring: ["sinestro", "ganthet", "kilowog"],
    corps: ["green", "yellow", "red", "indigo", "blue"],
    summary: [
      "The renegade Guardian Krona puts Parallax back in the Central Power Battery, and the Green Lantern Corps falls under his control. Only Earth's four Lanterns break free, and to fight their own Corps they put on other rings: yellow for Hal, red for Guy, indigo for John and blue for Kyle.",
      "It ends with Mogo dead, Sinestro chosen by a green ring and Hal thrown out of the Corps, which sets up Geoff Johns' New 52 run.",
    ],
    reading: `
      GL (2005) #63 | Prologue.
      GL (2005) #64
      GLC (2006) #58
      GL: Emerald Warriors (2010) #8
      GL (2005) #65
      GLC (2006) #59
      GL: Emerald Warriors (2010) #9
      GL (2005) #66
      GLC (2006) #60
      GL: Emerald Warriors (2010) #10
      GL (2005) #67
      War of the Green Lanterns: Aftermath (2011) #1-2
    `,
  },
  {
    title: "The Ring Bearer",
    kind: "storyline",
    creators: ["Tony Bedard", "Tyler Kirkham"],
    startYear: 2011,
    endYear: 2012,
    tagline: "Rings from every Corps choose Kyle Rayner at once, and their owners want them back.",
    keyFor: ["kyle", "saintWalker", "bleez"],
    corps: ["green", "red", "orange", "yellow", "blue", "indigo", "violet"],
    summary: [
      "Rings from every Corps on the emotional spectrum leave their bearers and choose Kyle Rayner at the same time. Everyone thinks he stole them. To find out who's behind it, Kyle pulls together a team from across the spectrum, including Saint Walker, Bleez, Arkillo, Munk, Fatality and Glomulus.",
      "It's the first arc of Green Lantern: New Guardians, and the start of Kyle's road to becoming the White Lantern.",
    ],
    reading: `
      GL: New Guardians (2011) #1-7
    `,
  },
  {
    title: "Sinestro",
    kind: "storyline",
    creators: ["Geoff Johns", "Doug Mahnke"],
    startYear: 2011,
    endYear: 2012,
    tagline: "Sinestro is a Green Lantern again, and Hal Jordan is back on Earth without a ring.",
    keyFor: ["sinestro", "hal"],
    corps: ["green", "yellow"],
    summary: [
      "Geoff Johns opens the New 52 with Sinestro back in a green ring and Hal Jordan grounded on Earth. Sinestro wants to free Korugar from the Corps that carries his name, and he can't do it alone, so he gives Hal a ring of his own making.",
      "The two old enemies are forced to work together, and the Guardians start planning to replace the Corps altogether.",
    ],
    reading: `
      GL (2011) #1-6
    `,
  },
  {
    title: "The Lost Army",
    kind: "storyline",
    creators: ["Cullen Bunn", "Jesús Saíz"],
    startYear: 2015,
    tagline: "Most of the Corps wakes up lost in another universe, with no power battery in reach.",
    keyFor: ["john", "kilowog"],
    featuring: ["guy", "mogo"],
    corps: ["green"],
    summary: [
      "Almost the entire Green Lantern Corps is thrown into a strange universe, cut off from their power battery and with no idea how they got there. John Stewart leads a small group, including Kilowog, Arisia and Guy Gardner, as they try to survive and find a way home.",
      "The story continues in Green Lantern Corps: Edge of Oblivion.",
    ],
    reading: `
      GL: Lost Army (2015) #1-6
    `,
  },
  {
    title: "The Omega Men",
    kind: "storyline",
    creators: ["Tom King", "Barnaby Bagenda"],
    startYear: 2015,
    endYear: 2016,
    tagline: "Kyle Rayner is taken hostage by rebels in a brutal war over the Vega system.",
    keyFor: ["kyle"],
    corps: ["white"],
    summary: [
      "The Citadel rules the Vega system and sells its rare metal to thousands of worlds. Kyle Rayner, the White Lantern, is sent to broker a deal, loses his ring, and is kidnapped by the Omega Men, rebels the Citadel calls terrorists. They fake his death and make him see what the empire has done.",
      "Tom King and Barnaby Bagenda's story is about freedom, faith, propaganda and political violence. It's as much a political science fiction thriller as a Green Lantern book, and one of the most ambitious stories Kyle has been part of.",
    ],
    reading: `
      The Omega Men (2015) #1-12
    `,
  },
  {
    title: "Sinestro's Law",
    kind: "storyline",
    creators: ["Robert Venditti", "Rafa Sandoval", "Ethan Van Sciver"],
    startYear: 2016,
    tagline: "Sinestro has made the universe fear him, and Hal Jordan may be the last Green Lantern.",
    keyFor: ["hal", "sinestro"],
    featuring: ["john", "guy", "kilowog"],
    corps: ["green", "yellow"],
    summary: [
      "With the Green Lantern Corps gone, Sinestro's Corps has become the universe's police force, keeping order through fear. Hal Jordan, powered by a ring he has to forge from his own willpower, sets out to stop him, and finds that the rest of the Corps is on its way back.",
      "It's the first arc of Hal Jordan and the Green Lantern Corps, and a good place to start with the Rebirth era.",
    ],
    reading: `
      Hal Jordan & the GLC: Rebirth (2016) #1
      Hal Jordan & the GLC (2016) #1-7
    `,
  },
  {
    title: "Green Lantern: War Journal",
    kind: "run",
    creators: ["Phillip Kennedy Johnson", "Montos"],
    startYear: 2023,
    endYear: 2024,
    tagline: "John Stewart is retired and caring for his mother, until the Revenant Queen comes for him.",
    keyFor: ["john"],
    corps: ["green"],
    summary: [
      "John Stewart has left the Corps to look after his mother in Detroit. Then the Revenant Queen and her contagious Radiant Dead arrive on Earth, and a Green Lantern from another universe comes looking for the one warrior who can stop them: the \"Guardian and Builder,\" John Stewart.",
      "Phillip Kennedy Johnson and Montos make it a character study about duty and family as much as a cosmic war story.",
    ],
    reading: `
      GL: War Journal (2023) #1-6
      GL: War Journal (2023) #7-12
    `,
  },
  {
    title: "The Starbreaker Supremacy",
    kind: "event",
    creators: ["Jeremy Adams", "Morgan Hampton", "Xermánico", "V. Ken Marion", "Fernando Pasarin"],
    startYear: 2025,
    tagline: "Starbreaker drains the emotional spectrum, and John Stewart pays the price.",
    keyFor: ["john", "hal"],
    featuring: ["guy", "carol", "atrocitus", "dexStarr", "bleez"],
    corps: ["green", "red", "orange", "yellow", "blue", "indigo", "violet"],
    summary: [
      "Just as the Corps relights the rebuilt Central Power Batteries on Oa, Starbreaker and his Sun-Eaters hijack them and drain the emotion out of the universe. Every Corps has to race to restore the spectrum before the Starbreakers can feed on Oa.",
      "The six-part crossover between Green Lantern and Green Lantern Corps ends with a heroic sacrifice from John Stewart and a new arrangement on Oa, with every Corps sharing a home.",
    ],
    reading: `
      GL (2023) #25
      GLC (2025) #7
      GL (2023) #26
      GLC (2025) #8
      GL (2023) #27
      GLC (2025) #9
    `,
  },
  {
    title: "Absolute Green Lantern",
    kind: "run",
    creators: ["Al Ewing", "Jahnoy Lindsay"],
    startYear: 2025,
    tagline: "A cosmic horror take on Green Lantern, outside the main continuity. Ongoing.",
    keyFor: ["jo"],
    featuring: ["hal", "john", "guy"],
    corps: [],
    summary: [
      "In DC's Absolute Universe, a giant green lantern descends on the small town of Evergreen, Nevada, seals it under a dome, and an alien calling himself Abin Sur starts passing judgment on the people inside. Jo Mullein, Hal Jordan and John Stewart are among them. Jo comes away with strange new powers, and Hal with something much darker.",
      "Al Ewing and Jahnoy Lindsay reinvent the whole mythology, including the spectrum, so no Green Lantern knowledge is needed. It's outside the main continuity and still ongoing.",
    ],
    reading: `
      Absolute Green Lantern (2025) #1-6 | Collected as Vol. 1: Without Fear.
      Absolute Green Lantern (2025) #7-19
    `,
  },
];

const key = (...parts) =>
  createHash("sha1").update(parts.join("/")).digest("hex").slice(0, 12);

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const arcId = (title) => `story-arc-${slugify(title)}`;

const expandSeries = (s) =>
  s
    .replace(/\bGLC\b/g, "Green Lantern Corps")
    .replace(/\bGL\b/g, "Green Lantern")
    .replace(" & the ", " and the ");

function formatIssues(nums) {
  const range = nums.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!range) return `Issue ${nums}`;
  const [, from, to] = range;
  return Number(to) - Number(from) === 1
    ? `Issues ${from} and ${to}`
    : `Issues ${from} to ${to}`;
}

function parseEntry(line, docId, index) {
  const [ref, note] = line.split(" | ");
  const match = ref.match(/^(.+) #(\S+)$/);
  if (!match) throw new Error(`Unparseable entry: ${line}`);
  return {
    _key: key(docId, "reading", index),
    _type: "readingEntry",
    title: expandSeries(match[1]),
    issues: formatIssues(match[2]),
    format: "issues",
    ...(note ? { note } : {}),
  };
}

function readingList(reading, docId) {
  if (Array.isArray(reading)) {
    return reading.map((entry, i) => ({
      _key: key(docId, "reading", i),
      _type: "readingEntry",
      ...entry,
    }));
  }
  return reading
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l, i) => parseEntry(l, docId, i));
}

function toBlocks(paragraphs, docId) {
  return paragraphs.map((text, index) => {
    const blockKey = key(docId, "summary", index);
    return {
      _key: blockKey,
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{ _key: `${blockKey}-0`, _type: "span", text, marks: [] }],
    };
  });
}

const ref = (id, k) => ({ _type: "reference", _ref: id, _key: k });

function toDoc(a) {
  const id = arcId(a.title);
  const characters = [...a.keyFor, ...(a.featuring ?? [])];
  for (const c of characters) {
    if (!characterIds[c]) throw new Error(`Unknown character "${c}" in ${a.title}`);
  }
  return {
    _id: id,
    _type: "storyArc",
    title: a.title,
    slug: { _type: "slug", current: slugify(a.title) },
    tagline: a.tagline,
    kind: a.kind,
    creators: a.creators,
    publisher: PUBLISHER,
    startYear: a.startYear,
    ...(a.endYear ? { endYear: a.endYear } : {}),
    summary: toBlocks(a.summary, id),
    readingList: readingList(a.reading, id),
    characters: characters.map((c) => ref(characterIds[c], key(id, "character", c))),
    ...(a.corps.length
      ? { corps: a.corps.map((k) => ref(corpsIds[k], key(id, "corps", k))) }
      : {}),
  };
}

if (import.meta.main) {
  for (const a of arcs) process.stdout.write(`${JSON.stringify(toDoc(a))}\n`);
}
