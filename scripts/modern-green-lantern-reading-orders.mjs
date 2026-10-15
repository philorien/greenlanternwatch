// Builds the Modern Green Lantern reading orders as NDJSON for `sanity dataset import`.
//
//   node scripts/modern-green-lantern-reading-orders.mjs > /tmp/modern-gl.ndjson
//   npx sanity dataset import /tmp/modern-gl.ndjson --dataset production --replace
//
// Document IDs are fixed, so re-running the import replaces these documents in place.
//
// Entry shorthand is described in scripts/reading-order-build.mjs.

import { buildReadingOrder } from "./reading-order-build.mjs";

const CBL_URL =
  "https://github.com/philorien/CBL-ReadingLists/tree/green-lantern-modern-lists/DC/Characters/Green%20Lantern/Modern%20Green%20Lantern";
const COMMUNITY_ORDER_URL =
  "https://www.reddit.com/r/Greenlantern/comments/lcq6zv/an_updated_complete_green_lantern_reading_order/";

const VOLUME_YEAR_NOTE =
  "The year in parentheses is the year the series launched, which tells the different Green Lantern volumes apart.";

const orders = [
  {
    id: "reading-order-modern-gl-start-here",
    title: "Where to Start with Modern Green Lantern",
    audience: "new-reader",
    order: 1,
    tagline: "Three ways in, from Geoff Johns' Rebirth to the comics coming out now.",
    intro: [
      `"Where do I start?" is the most common Green Lantern question there is, so here is a full modern reading order, from Green Lantern: Rebirth (2004) through everything released as of October 2026. It's built on [the 2021 community reading order from r/Greenlantern](${COMMUNITY_ORDER_URL}), extended to the present with some fixes and additions.`,
      "## The short answer",
      "- **Want the big modern saga?** Start with **Green Lantern: Rebirth #1-6** and read Geoff Johns' run straight through to **Green Lantern (2011) #20**. Almost everything since builds on it.",
      "- **Want to read what's coming out now?** **Green Lantern (2023) #1** by Jeremy Adams is a clean starting point, with **Green Lantern Corps (2025) #1** running alongside it. Green Lantern **#16** works too, since that's where the DC All In era begins.",
      "- **Want something standalone?** Geoff Johns and Ivan Reis' **Secret Origin**, Grant Morrison and Liam Sharp's **The Green Lantern** and N.K. Jemisin and Jamal Campbell's **Far Sector** all read fine on their own.",
      "People also ask about reading **Secret Origin** (Green Lantern #29-35) first, since it's Hal's origin. You can, but it was written after Rebirth, and the full order keeps it where it came out.",
      "## The eras at a glance",
      "- **Geoff Johns era (2004-2011):** Green Lantern, Green Lantern Corps, Sinestro Corps War, Blackest Night. 277 issues.",
      "- **New 52 (2011-2016):** Green Lantern, Green Lantern Corps, New Guardians, Red Lanterns, Sinestro. 290 issues.",
      "- **Rebirth (2016-2018):** Hal Jordan and the Green Lantern Corps, Green Lanterns. 112 issues.",
      "- **Morrison & Thorne (2018-2022):** The Green Lantern, Far Sector, Green Lantern (2021). 57 issues.",
      "- **Dawn of DC & All In (2022-now):** Green Lantern (2023), War Journal, Green Lantern Corps (2025). 87 issues.",
      "That's 823 issues in total, plus a separate out-of-continuity list. Each era has its own reading order in the comics guide.",
      "## Scope",
      "- Lantern events are included in full. Other DC events are only included where Lanterns are central, so you get the Flashpoint Lantern minis but not all of Flashpoint, and only Batman: The Dawnbreaker from Dark Nights: Metal.",
      "- It's a reading order, not strictly release order, though most stretches follow release dates.",
      "- Released issues only, as of October 14, 2026.",
      "## Reading lists for comic servers",
      `If you use Kavita, Komga, ComicRack or another comic server, there are CBL reading list files for all of this: one complete list, one per era, and the out-of-continuity list. Every issue's ComicVine ID was checked against the ComicVine API, so they should match cleanly. **[Get the Modern Green Lantern CBL files](${CBL_URL})**.`,
    ],
    sections: [
      {
        title: "The big modern saga",
        note: "Geoff Johns' run, from Hal Jordan's return to the end of his New 52 issues.",
        lines: `
          GL: Rebirth (2004) #1-6 @green-lantern-rebirth | Start here, then read the Geoff Johns era and the first part of the New 52 order straight through to Green Lantern (2011) #20.
        `,
      },
      {
        title: "What's coming out now",
        note: "The current era is the easiest one to jump into.",
        lines: `
          GL (2023) #1 | Jeremy Adams brings Hal back to Coast City. A clean starting point.
          GLC (2025) #1 | The Corps' own book, alongside Green Lantern. The two cross over in The Starbreaker Supremacy.
        `,
      },
      {
        title: "Standalone picks",
        lines: `
          GL (2005) #29-35 @secret-origin | Geoff Johns and Ivan Reis retell Hal's origin, with Sinestro as his mentor.
          The Green Lantern (2018) #1-12 | Grant Morrison and Liam Sharp's Hal as an intergalactic cop. Continue with Green Lantern: Blackstars and The Green Lantern Season Two.
          Far Sector (2019) #1-12 | N.K. Jemisin and Jamal Campbell's standalone Jo Mullein story.
        `,
      },
    ],
  },

  {
    id: "reading-order-modern-gl-johns-era",
    title: "Geoff Johns Era (2004-2011)",
    audience: "era",
    order: 10,
    tagline: "Rebirth to Flashpoint: the run almost everything since builds on. 277 issues.",
    intro: [
      "Rebirth brings Hal Jordan back, and Geoff Johns builds from there: the Sinestro Corps War, Secret Origin, the rest of the emotional spectrum, then Blackest Night, Brightest Day and War of the Green Lanterns. Green Lantern Corps (Dave Gibbons, then Peter Tomasi) runs alongside the main book and matters for every big event.",
      "If you want a leaner read, the most skippable parts are Ion, Emerald Warriors, the Blackest Night tie-in minis and the Rise of the Black Lanterns one-shots. Brightest Day is only half a Lantern story, but it's the direct follow-up to Blackest Night.",
      VOLUME_YEAR_NOTE,
    ],
    sections: [
      {
        title: "Rebirth",
        note: "Hal Jordan returns and the Corps is rebuilt.",
        lines: `
          GL: Rebirth (2004) #1-6 @green-lantern-rebirth | Hal Jordan's return. The starting point for the modern era.
          GL Secret Files and Origins 2005 (2005) #1
          GL (2005) #1-6
          Guy Gardner: Collateral Damage (2006) #1-2
          Rann/Thanagar War (2005) #1-6
          Rann/Thanagar War: Infinite Crisis Special (2006) #1
          GLC: Recharge (2005) #1-5
        `,
      },
      {
        title: "Infinite Crisis and One Year Later",
        note: "Ion is one of the most skippable parts of the era if you want a leaner read.",
        lines: `
          Infinite Crisis (2005) #1
          GL (2005) #7-8
          Infinite Crisis (2005) #2-7
          Infinite Crisis Secret Files 2006 (2006) #1
          GL (2005) #9-13 @revenge-of-the-green-lanterns
          GLC (2006) #1-6
          Ion (2006) #1-12 @ion-the-torchbearer
          GL (2005) #14-20
          GLC (2006) #7-13
        `,
      },
      {
        title: "The Sinestro Corps War",
        lines: `
          Sinestro Corps Special (2007) #1 @the-sinestro-corps-war
          GL (2005) #21
          GLC (2006) #14
          GL (2005) #22
          Tales of the Sinestro Corps: Parallax (2007) #1
          GLC (2006) #15
          GL (2005) #23
          GLC (2006) #16
          Tales of the Sinestro Corps: Cyborg-Superman (2007) #1
          GL (2005) #24
          Blue Beetle (2006) #20
          GLC (2006) #17
          Tales of the Sinestro Corps: Superman-Prime (2007) #1
          GLC (2006) #18
          GL (2005) #25
          Tales of the Sinestro Corps: Ion (2008) #1
          GLC (2006) #19
          GL/Sinestro Corps: Secret Files (2008) #1
        `,
      },
      {
        title: "Secret Origin and the emotional spectrum",
        note: "The road to Blackest Night, as the rest of the emotional spectrum comes into play.",
        lines: `
          The Brave and the Bold (2007) #1-2
          The Brave and the Bold (2007) #19-22
          The Brave and the Bold (2007) #30
          GLC (2006) #20-26
          GL (2005) #26-35 @secret-origin | Issues 29 to 35 are Secret Origin, Hal's origin retold. It was written after Rebirth, so it stays where it came out.
          Final Crisis: Rage of the Red Lanterns (2008) #1 @rage-of-the-red-lanterns
          GL (2005) #36-38
          GLC (2006) #27-32
          GL (2005) #39-42 @agent-orange
          GLC (2006) #33-38 @emerald-eclipse
          GL (2005) #43
        `,
      },
      {
        title: "Blackest Night",
        note: "The tie-in minis and the Rise of the Black Lanterns one-shots (Starman #81, The Question #37 and the rest) are optional if you want a leaner read.",
        lines: `
          Blackest Night (2009) #0-1 @blackest-night
          GLC (2006) #39
          GL (2005) #44
          Blackest Night (2009) #2
          Starman (1994) #81
          The Power of SHAZAM! (1995) #48
          Blackest Night: Batman (2009) #1
          Blackest Night: Superman (2009) #1
          Blackest Night: Titans (2009) #1
          GL (2005) #45
          GLC (2006) #40
          Blackest Night: Batman (2009) #2
          The Question (1986) #37
          Blackest Night (2009) #3
          Adventure Comics (2009) #4-5
          Blackest Night: Superman (2009) #2
          Blackest Night: Titans (2009) #2
          GL (2005) #46
          Blackest Night: Batman (2009) #3
          The Phantom Stranger (1969) #42
          Catwoman (2002) #83
          GLC (2006) #41
          Blackest Night: Superman (2009) #3
          Suicide Squad (1987) #67
          Blackest Night: Titans (2009) #3
          Weird Western Tales (1972) #71
          Blackest Night (2009) #4
          GL (2005) #47
          Blackest Night: The Flash (2010) #1
          Blackest Night: JSA (2009) #1-3
          GLC (2006) #42
          Blackest Night: Wonder Woman (2010) #1
          GL (2005) #48
          Blackest Night (2009) #5
          GLC (2006) #43
          GL (2005) #49
          Blackest Night (2009) #6
          Blackest Night: Wonder Woman (2010) #2-3
          Blackest Night: The Flash (2010) #2
          Green Arrow (2010) #30
          GLC (2006) #44
          Blackest Night: The Flash (2010) #3
          GL (2005) #50
          The Atom & Hawkman (1968) #46
          Adventure Comics (2009) #7
          GL (2005) #51
          GLC (2006) #45
          Blackest Night (2009) #7
          GLC (2006) #46
          GL (2005) #52
          Blackest Night (2009) #8
          GLC (2006) #47
          Blackest Night: Tales of the Corps (2009) #1-3
          Untold Tales of Blackest Night (2010) #1
        `,
      },
      {
        title: "Brightest Day",
        note: "Only half a Lantern story, but the direct follow-up to Blackest Night. Emerald Warriors is one of the more skippable books here.",
        lines: `
          Brightest Day (2010) #0
          GL (2005) #53
          Brightest Day (2010) #1
          GL (2005) #54-55
          GLC (2006) #48-52
          GL: Emerald Warriors (2010) #1-6 @emerald-warriors
          Brightest Day (2010) #2-12
          GL (2005) #56-58
          Brightest Day (2010) #13-14
          GL (2005) #59
          GLC (2006) #53-57
          Brightest Day (2010) #15-18
          GL (2005) #60-62
          Brightest Day (2010) #19-24
          GL: Larfleeze Christmas Special (2011) #1
          GL/Plastic Man: Weapons of Mass Deception (2011) #1
        `,
      },
      {
        title: "War of the Green Lanterns",
        lines: `
          GL: Emerald Warriors (2010) #7
          GL (2005) #63-64 @war-of-the-green-lanterns
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
          GLC (2006) #61-63
          GL: Emerald Warriors (2010) #11-13
        `,
      },
      {
        title: "Flashpoint",
        note: "Only the Lantern minis from Flashpoint are included.",
        lines: `
          Flashpoint: Abin Sur - The Green Lantern (2011) #1-3
          Flashpoint: Hal Jordan (2011) #1-3
        `,
      },
    ],
  },

  {
    id: "reading-order-modern-gl-new-52",
    title: "New 52 (2011-2016)",
    audience: "era",
    order: 20,
    tagline: "Johns' finale, Simon Baz's debut and Robert Venditti's run. 290 issues.",
    intro: [
      "Geoff Johns finishes his run in Green Lantern #1-20, with Sinestro back in a green ring, Simon Baz's debut and Wrath of the First Lantern. Robert Venditti takes over the main book from #21. The line-wide crossovers (Rise of the Third Army, Wrath of the First Lantern, Lights Out, Uprising and Godhead) are interleaved in the order.",
      "Red Lanterns, New Guardians, Sinestro, Larfleeze, Threshold and Lost Army are optional, depending on how much of the wider Lantern universe you want. Tom King's The Omega Men is mostly standalone.",
      VOLUME_YEAR_NOTE,
    ],
    sections: [
      {
        title: "The New 52 launch",
        note: "Johns continues the main book with Sinestro back in a green ring, and three Lantern books launch alongside it.",
        lines: `
          GL (2011) #1-12 @sinestro
          GLC (2011) #1-12
          GLC (2011) #0
          GL: New Guardians (2011) #1-8 @the-ring-bearer
          Blue Beetle (2011) #9
          GL: New Guardians (2011) #9-12
          GL: New Guardians (2011) #0
          Red Lanterns (2011) #1-8
          Stormwatch (2011) #9
          Red Lanterns (2011) #9-12
          Red Lanterns (2011) #0
        `,
      },
      {
        title: "Rise of the Third Army",
        lines: `
          GL (2011) #0 | Simon Baz's debut.
          GL Annual (2012) #1
          GL (2011) #13-14
          GLC (2011) #13-15
          GL: New Guardians (2011) #13-15
          GL: New Guardians Annual (2013) #1
          GL: New Guardians (2011) #16
          Red Lanterns (2011) #13-16
          GL (2011) #15-16
          GLC (2011) #16
          GLC Annual (2013) #1
        `,
      },
      {
        title: "Wrath of the First Lantern",
        lines: `
          GL (2011) #17
          GLC (2011) #17
          GL: New Guardians (2011) #17
          Red Lanterns (2011) #17
          GL (2011) #18
          GLC (2011) #18
          GL: New Guardians (2011) #18
          Red Lanterns (2011) #18
          GL (2011) #19
          GLC (2011) #19
          GL: New Guardians (2011) #19
          Red Lanterns (2011) #19
          GL (2011) #20 | The end of Geoff Johns' run.
          GLC (2011) #20
          GL: New Guardians (2011) #20
          Red Lanterns (2011) #20
        `,
      },
      {
        title: "Venditti takes over",
        lines: `
          GL (2011) #21-23 | Robert Venditti takes over the main book.
          GL (2011) #23.2
          GL (2011) #23.3
          The Flash Annual (2012) #2
          GLC (2011) #21-23
          GL: New Guardians (2011) #21-23
          Red Lanterns (2011) #21-23
          GL (2011) #23.1
        `,
      },
      {
        title: "Lights Out",
        lines: `
          GL (2011) #24
          GLC (2011) #24
          GL: New Guardians (2011) #24
          Red Lanterns (2011) #24
          GL Annual (2012) #2
        `,
      },
      {
        title: "Threshold, Larfleeze and Red Lanterns",
        note: "Threshold, Larfleeze and Red Lanterns are optional. Supergirl crosses over with Red Lanterns in this stretch.",
        lines: `
          Threshold (2013) #1-8
          Larfleeze (2013) #1-12
          Red Lanterns (2011) #25-27
          GL (2011) #25-27
          GLC (2011) #25-27
          GLC Annual (2013) #2
          Supergirl (2011) #26-29
          GL (2011) #28
          Red Lanterns (2011) #28-29
          Supergirl (2011) #30
          Red Lanterns (2011) #30
          Supergirl (2011) #31
          Red Lanterns (2011) #31-32
          Supergirl (2011) #32-33
          Red Lanterns (2011) #33
          Red Lanterns Annual (2014) #1
          Red Lanterns (2011) #34
        `,
      },
      {
        title: "Uprising",
        lines: `
          GL (2011) #29-30
          GLC (2011) #28-30
          GL (2011) #31
          GLC (2011) #31
          GL (2011) #32
          GLC (2011) #32
          GL (2011) #33
          GLC (2011) #33
          GL (2011) #34
          GLC (2011) #34
        `,
      },
      {
        title: "Sinestro and New Guardians",
        lines: `
          GL (2011) #23.4
          Sinestro (2014) #1-5
          Sinestro: Futures End (2014) #1
          GL: New Guardians (2011) #25-30
          GL: New Guardians Annual (2013) #2
          GL: New Guardians (2011) #31-34
        `,
      },
      {
        title: "Godhead",
        lines: `
          GL/New Gods: Godhead (2014) #1
          GL (2011) #35
          GLC (2011) #35
          GL: New Guardians (2011) #35
          Infinity Man and the Forever People (2014) #4
          Red Lanterns (2011) #35
          Sinestro (2014) #6
          GL (2011) #36
          GLC (2011) #36
          Infinity Man and the Forever People (2014) #5
          GL: New Guardians (2011) #36
          Red Lanterns (2011) #36
          Sinestro (2014) #7
          GL (2011) #37
          GLC (2011) #37
          Infinity Man and the Forever People (2014) #6
          GL: New Guardians (2011) #37
          Red Lanterns (2011) #37
          Sinestro (2014) #8
          GL Annual (2012) #3
        `,
      },
      {
        title: "Futures End and Convergence",
        lines: `
          GL (2011) #38-40
          GL: Futures End (2014) #1
          Justice League: Darkseid War: Green Lantern (2015) #1
          GLC (2011) #38-40
          GLC: Futures End (2014) #1
          GL: New Guardians (2011) #38-40
          GL: New Guardians: Futures End (2014) #1
          Red Lanterns (2011) #38-40
          Red Lanterns: Futures End (2014) #1
          Sinestro (2014) #9-11
          Sinestro Annual (2015) #1
          Convergence (2015) #1-3
          Convergence Green Lantern/Parallax (2015) #1-2
          Convergence Green Lantern Corps (2015) #1-2
        `,
      },
      {
        title: "The final stretch",
        lines: `
          The Omega Men (2015) #1-12 @the-omega-men | Tom King's run. Mostly standalone.
          GL: Lost Army (2015) #1-6 @the-lost-army
          GL (2011) #41-44
          GL Annual (2012) #4
          GL (2011) #45-46
          Sinestro (2014) #12-14
          Lobo Annual (2015) #1
          Lobo (2014) #10-11
          Sinestro (2014) #15
          GL (2011) #47-52
          Sinestro (2014) #16-23
          Lobo (2014) #12-13
          GLC: Edge of Oblivion (2016) #1-6
        `,
      },
    ],
  },

  {
    id: "reading-order-modern-gl-rebirth",
    title: "Rebirth (2016-2018)",
    audience: "era",
    order: 30,
    tagline: "Hal and the Corps, plus Jessica Cruz and Simon Baz as rookie partners. 112 issues.",
    intro: [
      "Two books: Robert Venditti's Hal Jordan and the Green Lantern Corps, and Green Lanterns, starring Jessica Cruz and Simon Baz as rookie partners. The order goes back and forth between them by arc.",
      VOLUME_YEAR_NOTE,
    ],
    sections: [
      {
        title: "Hal Jordan and the Green Lantern Corps and Green Lanterns",
        note: "Batman: The Dawnbreaker is the only Dark Nights: Metal tie-in included.",
        lines: `
          Hal Jordan & the GLC: Rebirth (2016) #1 @sinestros-law
          Hal Jordan & the GLC (2016) #1-7
          Green Lanterns: Rebirth (2016) #1
          Green Lanterns (2016) #1-6
          Hal Jordan & the GLC (2016) #8-13
          Green Lanterns (2016) #7-14
          Hal Jordan & the GLC (2016) #14-21
          Green Lanterns (2016) #15-21
          Hal Jordan & the GLC (2016) #22-29
          Green Lanterns (2016) #22-31
          Hal Jordan & the GLC (2016) #30-31
          Batman: The Dawnbreaker (2017) #1
          Hal Jordan & the GLC (2016) #32-36
          Green Lanterns (2016) #32-39
          Hal Jordan & the GLC (2016) #37-41
          Green Lanterns (2016) #40-43
          Green Lanterns Annual (2018) #1
          Green Lanterns (2016) #44-47
          Hal Jordan & the GLC (2016) #42-50
          Green Lanterns (2016) #48-57
          Sinestro: Year of the Villain (2019) #1
        `,
      },
    ],
  },

  {
    id: "reading-order-modern-gl-morrison-thorne",
    title: "Morrison & Thorne (2018-2022)",
    audience: "era",
    order: 40,
    tagline: "Grant Morrison's space cop Hal, Far Sector and John Stewart. 57 issues.",
    intro: [
      "Grant Morrison and Liam Sharp's The Green Lantern, Blackstars and Season Two is Hal as an intergalactic cop. It's weird and dense, and it reads well on its own. Far Sector is N.K. Jemisin's standalone Jo Mullein story. After that, Future State: Green Lantern leads into Geoffrey Thorne's Green Lantern (2021), starring John Stewart and the Lanterns of Earth.",
      VOLUME_YEAR_NOTE,
    ],
    sections: [
      {
        title: "Grant Morrison and Liam Sharp",
        note: "Reads well on its own.",
        lines: `
          The Green Lantern (2018) #1-8
          The Green Lantern Annual (2018) #1
          The Green Lantern (2018) #9-12
          GL: Blackstars (2019) #1-3
          The Green Lantern Season Two (2020) #1-6
          GL 80th Anniversary 100-Page Super Spectacular (2020) #1
          The Green Lantern Season Two (2020) #7-12
        `,
      },
      {
        title: "Far Sector",
        lines: `
          Far Sector (2019) #1-12 | N.K. Jemisin and Jamal Campbell's standalone Jo Mullein story.
        `,
      },
      {
        title: "Geoffrey Thorne and John Stewart",
        lines: `
          Future State: Green Lantern (2021) #1-2
          GL (2021) #1-5
          GL 2021 Annual (2021) #1
          GL (2021) #6-12
          John Stewart: The Emerald Knight (2022) #1
        `,
      },
    ],
  },

  {
    id: "reading-order-modern-gl-dawn-of-dc-all-in",
    title: "Dawn of DC & All In (2022-Now)",
    audience: "era",
    order: 50,
    tagline: "Hal back in Coast City, John Stewart's War Journal and the new Corps. 87 issues.",
    intro: [
      "Jeremy Adams' Green Lantern (2023) brings Hal back to Coast City, with Phillip Kennedy Johnson's Green Lantern: War Journal (John Stewart) running alongside it. DC All In starts at #16, and Green Lantern Corps (2025), co-written by Adams and Morgan Hampton, launches a few months later. The two books cross over in The Starbreaker Supremacy. This is the easiest era to jump into.",
      "Released issues only, as of October 14, 2026.",
      VOLUME_YEAR_NOTE,
    ],
    sections: [
      {
        title: "Dawn of DC",
        lines: `
          Dark Crisis: Worlds Without a Justice League - Green Lantern (2022) #1
          GL (2023) #1-2 | Jeremy Adams' run begins. A clean starting point.
          Knight Terrors: Green Lantern (2023) #1-2
          GL (2023) #3-7
          GL: War Journal (2023) #1-6 @green-lantern-war-journal
          GL (2023) #8-12
          Alan Scott: The Green Lantern (2023) #1-6
          GL: War Journal (2023) #7-12
          GL (2023) #13
          Absolute Power: Task Force VII (2024) #3
          GL (2023) #14-15
          GL: Civil Corps Special (2024) #1
        `,
      },
      {
        title: "DC All In",
        note: "Green Lantern Corps (2025) launches a few months into DC All In, and the two books cross over in The Starbreaker Supremacy.",
        lines: `
          GL (2023) #16-18 | DC All In begins. Another good jumping-on point.
          GL/Green Arrow: World's Finest Special (2025) #1
          GL: Fractured Spectrum (2025) #1
          GL (2023) #19-24
          GLC (2025) #1-6
          GL (2023) #25 @the-starbreaker-supremacy
          GLC (2025) #7
          GL (2023) #26
          GLC (2025) #8
          GL (2023) #27
          GLC (2025) #9
          GL (2023) #28-29
          GLC (2025) #10-12
          DC K.O.: Green Lantern Galactic Slam (2026) #1
          GLC (2025) #13
          GL (2023) #30-33
          GLC (2025) #14-19
          Tales of the Green Lantern Corps: Guy Gardner (2026) #1
          GL (2023) #34-39
          GLC (2025) #20-21
        `,
      },
    ],
  },

  {
    id: "reading-order-modern-gl-out-of-continuity",
    title: "Green Lantern: Out of Continuity (2011-Now)",
    audience: "era",
    order: 60,
    tagline: "Absolute Green Lantern, Earth One, crossovers and tie-ins outside the main timeline. 76 issues.",
    intro: [
      "Everything here sits outside the main timeline, so you can read any of it on its own: Absolute Green Lantern (Al Ewing and Jahnoy Lindsay), Green Lantern: Dark, Green Lantern: Earth One, Tales from the Dark Multiverse: Blackest Night, the young adult graphic novels, the movie prequels and animated series comic, Smallville: Lantern, and the crossovers with Star Trek, Planet of the Apes, Space Ghost and Huckleberry Hound.",
      VOLUME_YEAR_NOTE,
    ],
    sections: [
      {
        title: "Alternate takes",
        lines: `
          GL: Earth One (2018) #1-2
          Tales From the Dark Multiverse: Blackest Night (2019) #1
          GL: Dark (2024) #1-7
          Absolute Green Lantern (2025) #1-19 @absolute-green-lantern | Al Ewing and Jahnoy Lindsay.
        `,
      },
      {
        title: "Young adult graphic novels",
        lines: `
          GL: Legacy (2020) #1
          Unearthed: A Jessica Cruz Story (2021) #1
          GL: Alliance (2022) #1
        `,
      },
      {
        title: "Movie and TV tie-ins",
        lines: `
          GL Movie Prequel: Kilowog (2011) #1
          GL Movie Prequel: Tomar Re (2011) #1
          GL Movie Prequel: Abin Sur (2011) #1
          GL Movie Prequel: Hal Jordan (2011) #1
          GL Movie Prequel: Sinestro (2011) #1
          GL: The Animated Series (2012) #0-14
          Smallville: Lantern (2014) #1-4
        `,
      },
      {
        title: "Crossovers",
        lines: `
          Star Trek/Green Lantern (2015) #1-6
          Star Trek/Green Lantern (2016) #1-6
          Planet of the Apes/Green Lantern (2017) #1-6
          GL/Space Ghost Special (2017) #1
          GL/Huckleberry Hound Special (2018) #1
        `,
      },
    ],
  },
];

for (const o of orders) {
  process.stdout.write(`${JSON.stringify(buildReadingOrder(o))}\n`);
}
