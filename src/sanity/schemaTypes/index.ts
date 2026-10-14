import type { SchemaTypeDefinition } from "sanity";
import { article } from "./article";
import { blockContent } from "./blockContent";
import { category } from "./category";
import { character } from "./character";
import { comicRun } from "./comicRun";
import { corps } from "./corps";

export const schemaTypes: SchemaTypeDefinition[] = [
  article,
  category,
  comicRun,
  character,
  corps,
  blockContent,
];
