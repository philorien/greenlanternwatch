// Builds the character guide reading orders as NDJSON for `sanity dataset import`.
//
//   node scripts/character-reading-orders.mjs > /tmp/character-orders.ndjson
//   npx sanity dataset import /tmp/character-orders.ndjson --dataset production --replace
//
// Document IDs are fixed, so re-running the import replaces these documents in place.
// Each guide has a CBL list in scripts/data/ so scripts/comicvine/sync.mjs can match its
// issues to ComicVine. Build it with scripts/comicvine/build-cbl.mjs.
//
// Entry shorthand is described in scripts/reading-order-build.mjs.

import { buildReadingOrder } from "./reading-order-build.mjs";

const KYLE_CBL_URL =
  "https://github.com/DieselTech/CBL-ReadingLists/tree/main/DC/Characters/Green%20Lantern/Kyle%20Rayner";

const VOLUME_YEAR_NOTE =
  "The year in parentheses is the year the series launched, which tells the different Green Lantern volumes apart.";

const orders = [
  {
    id: "reading-order-character-kyle-rayner",
    title: "Kyle Rayner Reading Order",
    audience: "character",
    order: 70,
    tagline: "From the last ring to the White Lantern and back to Los Angeles. 317 issues.",
    intro: [
      "Kyle Rayner was a struggling freelance artist when he got the last Green Lantern ring in 1994, and for years he was the only Green Lantern there was. This guide follows him from that ring through Ion, the White Lantern and The Omega Men to the 600th issue of Green Lantern, where he becomes Earth's Green Lantern again.",
      "## Where to start",
      "- **New to Kyle?** Start with **Green Lantern #51**, his first story with the ring, and keep going.",
      "- **Want something recent?** **Green Lantern (2023) #33** brings Kyle back to Los Angeles and makes him the lead of the book.",
      "- **Want one story that stands on its own?** Tom King and Barnaby Bagenda's **The Omega Men** is twelve issues and needs no homework.",
      "## What's in it",
      "- Only stories where Kyle is a lead or co-lead. We started from every issue ComicVine lists him in and kept the ones he drives.",
      "- Chapters from other series are included when Kyle co-stars, like his crossovers with Green Arrow and the Flash.",
      "- Left out: his years on the JLA, Countdown and the big events where he's one of many heroes. The era guides cover those.",
      "- Emerald Twilight is the one exception. It's Hal Jordan's story, but it's where Kyle gets the ring.",
      VOLUME_YEAR_NOTE,
      "Released issues only, as of October 14, 2026.",
      "## Reading list for comic servers",
      `If you use Kavita, Komga, ComicRack or another comic server, there's a CBL reading list file for this guide with all 317 issues in order. Every issue's ComicVine ID was checked against the ComicVine API, so it should match cleanly. **[Get the Kyle Rayner CBL file](${KYLE_CBL_URL})**.`,
    ],
    sections: [
      {
        title: "The last Green Lantern (1994-1996)",
        note: "Ron Marz's run, from the last ring to Hal Jordan's funeral.",
        lines: `
          GL (1990) #48-50 @emerald-twilight | Hal Jordan's fall. Kyle appears at the end of issue 48 and gets the last ring in issue 50.
          GL (1990) #51-55 | Kyle's first stories with the ring. Major Force murders his girlfriend, Alex DeWitt, in issue 54.
          GL (1990) #0 | A Zero Hour tie-in. Kyle and Hal, now Parallax, end up on Oa together.
          GL (1990) #56-62 | Kyle moves to New York.
          GL (1990) #63-64 | Parallax View. Hal comes back and fights Kyle for the ring.
          GL (1990) #65-75 | Includes Fast Friends with the Flash (66 and 67) and Hero Quest (71 to 73), where Kyle looks for advice from Batman, Captain Marvel and Wonder Woman.
          GL (1990) #76 | Hard-Traveling Heroes: The Next Generation. Kyle and Connor Hawke's Green Arrow pick up where Hal and Oliver Queen left off.
          Green Arrow (1988) #110
          GL (1990) #77
          Green Arrow (1988) #111
          GL (1990) #78-80 | Issue 80 ties in to The Final Night.
          GL (1990) #81 | Hal Jordan's funeral.
        `,
      },
      {
        title: "Growing into the ring (1997-2000)",
        note: "The rest of Ron Marz's run, with Kyle's team-ups with the Flash, Green Arrow and Alan Scott.",
        lines: `
          GL (1990) #82 | Kyle, John Stewart, Guy Gardner and Alan Scott raise a glass to Hal.
          GL/Flash: Faster Friends (1997) #1-2 | Kyle and Wally West team up again.
          GL (1990) #83-91 | In Retribution (83 to 85), Kyle faces Fatality, who hunts Green Lanterns.
          Green Arrow (1988) #125 | Hate Crimes, a crossover with Green Arrow.
          GL (1990) #92
          Green Arrow (1988) #126
          GL (1990) #93-96 | Issue 96 starts Three of a Kind, with Kyle, the Flash and Green Arrow on vacation.
          Green Arrow (1988) #130
          The Flash (1987) #135
          GL/Sentinel: Heart of Darkness (1998) #1-3 | Kyle teams up with Alan Scott, the first Green Lantern.
          GL (1990) #97-99 | Future Shock (98 and 99) throws Kyle into a future where the Corps is a criminal organization.
          GL (1990) #100-107 | Kyle and a young Hal Jordan from the past fight side by side, then Hal follows him home for Emerald Knights. Kyle isn't in issue 104.
          GL: The New Corps (1999) #1-2 | Kyle builds a new Corps. Jade stars in Green Lantern 108 to 111 while Kyle is off in space, so they're skipped.
          GL: Fear Itself (1999) #1
          GL (1990) #112-128 | Kyle comes home in issue 112.
          GL: Circle of Fire (2000) #1 @circle-of-fire | Oblivion, born from Kyle's own fears, attacks.
          GL/Adam Strange (2000) #1
          GL/Atom (2000) #1
          GL/Firestorm (2000) #1
          GL/Power Girl (2000) #1
          GL/Green Lantern (2000) #1
          GL: Circle of Fire (2000) #2
        `,
      },
      {
        title: "Judd Winick (2000-2002)",
        note: "Kyle gets an assistant, Terry Berg, and for a while becomes Ion.",
        lines: `
          GL (1990) #129-131 | Winick's first issues.
          GL (1990) #132-136 | While Rome Burned. Kyle and the JLA against Alex Nero, who has a yellow power ring.
          GL (1990) #137-143
          GL (1990) #144-150 | Kyle's power keeps growing until he becomes Ion. Issue 150 ends that chapter.
          GL (1990) #151-155 | Hate Crime (154 and 155) follows the homophobic attack on Terry.
        `,
      },
      {
        title: "To the end of the series (2003-2004)",
        note: "Winick's last issues, Ben Raab's run in space and Ron Marz's return for the finale.",
        lines: `
          GL (1990) #157-161 | Winick's last issues. Issue 156 is a John Stewart story, so it's skipped.
          Green Arrow (2001) #23 | Black Circle: Urban Knights, a crossover with Green Arrow.
          GL (1990) #162
          Green Arrow (2001) #24
          GL (1990) #163
          Green Arrow (2001) #25
          GL (1990) #164
          GL (1990) #165-175 | Kyle heads into space to restore order in Sector 2814.
          GL (1990) #176-181 | Homecoming?, the last six issues of the series, ends with Kyle's showdown with Major Force.
        `,
      },
      {
        title: "Rebirth, Ion and the Sinestro Corps War (2004-2008)",
        note: "For the Sinestro Corps War this follows Kyle's chapters. The full crossover order, with the Green Lantern Corps issues he isn't in, is on the Sinestro Corps War page.",
        lines: `
          GL: Rebirth (2004) #1-6 @green-lantern-rebirth | Hal Jordan comes back, and Kyle, John, Guy and Kilowog all have a part in freeing him.
          GLC: Recharge (2005) #1-5 | Kyle and Guy Gardner help rebuild the Corps.
          Rann/Thanagar War: Infinite Crisis Special (2006) #1 | Jade's sacrifice leaves Kyle with the power he carries in Ion.
          Ion (2006) #1-12 @ion-the-torchbearer | Ron Marz's twelve-issue series about Kyle and the power of Ion.
          Sinestro Corps Special (2007) #1 @the-sinestro-corps-war | Parallax takes Kyle as its new host.
          GL (2005) #21-22
          Tales of the Sinestro Corps: Parallax (2007) #1 | Kyle's fall, from inside his own head.
          GL (2005) #23-25
          Tales of the Sinestro Corps: Ion (2008) #1 | The power of Ion looks for a new bearer.
          GLC (2006) #19
        `,
      },
      {
        title: "Green Lantern Corps (2008-2011)",
        note: "Kyle co-leads Green Lantern Corps, first with Guy Gardner and later with John Stewart.",
        lines: `
          GLC (2006) #20 | Ring Quest begins. Issues 21 and 22 are an Alpha Lantern story without Kyle, so they're skipped.
          GLC (2006) #23-28 | Kyle and Guy open Warriors, a bar on Oa, in issue 27.
          GLC (2006) #29-32 | Sins of the Star Sapphire.
          GLC (2006) #33-38 @emerald-eclipse
          GLC (2006) #39-47 @blackest-night | Kyle's side of Blackest Night.
          GLC (2006) #48-57 | Revolt of the Alpha-Lanterns and The Weaponer.
          GL (2005) #64 @war-of-the-green-lanterns | Earth's four Lanterns fight their own Corps with other rings, and Kyle takes the blue one.
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
          GLC (2006) #62-63 | The last two issues. Kyle isn't in issue 61.
        `,
      },
      {
        title: "The White Lantern (2011-2016)",
        note: "Kyle's New 52 series, then Tom King's The Omega Men.",
        lines: `
          GL: New Guardians (2011) #1-7 @the-ring-bearer | Rings from every Corps choose Kyle at once.
          GL: New Guardians (2011) #8-12
          GL: New Guardians (2011) #0
          GL: New Guardians (2011) #13-15 | Kyle trains with the other Corps, one emotion at a time.
          GL: New Guardians Annual (2013) #1
          GL: New Guardians (2011) #16-17
          GL: New Guardians (2011) #19-20 | Wrath of the First Lantern. Kyle comes out of it as the White Lantern. He isn't in issue 18.
          GL: New Guardians (2011) #21-27 | A new creative team sends Kyle out with the Templar Guardians.
          GL: New Guardians Annual (2013) #2
          GL: New Guardians (2011) #28-40 | Ends with It All Ends Here (38 to 40) and the fate of the White Lantern.
          Convergence: GL/Parallax (2015) #1-2 | A Convergence tie-in with the Zero Hour era's Kyle and Hal.
          The Omega Men (2015) #1-12 @the-omega-men | Tom King and Barnaby Bagenda's political science fiction thriller.
        `,
      },
      {
        title: "Hal Jordan and the Green Lantern Corps (2016-2018)",
        note: "Kyle is part of an ensemble here. These are the arcs built around him.",
        lines: `
          Hal Jordan & the GLC (2016) #9-12 | Bottled Light. Kyle and Hal are the Corps' only hope against Larfleeze.
          Hal Jordan & the GLC (2016) #14-17 | Quest for Hope. Kyle and Hal look for the Blue Lanterns, and Kyle chooses which ring to wear.
          Hal Jordan & the GLC (2016) #26-29 | Fall of the Gods. Kyle and Hal protect Orion from the God Killers. Kyle sits out issue 28.
          Hal Jordan & the GLC (2016) #33-36 | Twilight of the Guardians. Hal, John, Guy and Kyle rescue the last Guardians.
        `,
      },
      {
        title: "Back in Los Angeles (2026-now)",
        lines: `
          DC K.O.: Green Lantern Galactic Slam (2026) #1 | A DC K.O. tie-in. Kyle gets knocked across the galaxy and into a wrestling federation.
          GL (2023) #33-39 | Kyle moves back to Los Angeles and becomes Earth's Green Lantern again, starting with the 600th issue.
        `,
      },
    ],
  },
];

for (const o of orders) {
  process.stdout.write(`${JSON.stringify(buildReadingOrder(o))}\n`);
}
