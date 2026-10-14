// Sets each character's Key storylines from the `keyFor` lists in scripts/story-arcs.mjs,
// oldest arc first.
//
//   npx sanity exec scripts/key-storylines.mjs --with-user-token
//
// Only keyStorylines is written, so portraits and other Studio edits are kept. Run it
// again after re-importing characters or changing `keyFor`.

import { getCliClient } from "sanity/cli";
import { arcId, arcs, characterIds, slugify } from "./story-arcs.mjs";

const client = getCliClient({ apiVersion: "2026-10-14" });

const storylines = new Map(Object.keys(characterIds).map((c) => [c, []]));
for (const a of [...arcs].sort((x, y) => x.startYear - y.startYear)) {
  for (const c of a.keyFor) storylines.get(c).push(a.title);
}

const tx = client.transaction();
for (const [c, titles] of storylines) {
  tx.patch(
    characterIds[c],
    titles.length
      ? {
          set: {
            keyStorylines: titles.map((t) => ({
              _type: "reference",
              _ref: arcId(t),
              _key: slugify(t),
            })),
          },
        }
      : { unset: ["keyStorylines"] },
  );
  console.log(`${characterIds[c]}: ${titles.join(", ") || "none"}`);
}
await tx.commit();
