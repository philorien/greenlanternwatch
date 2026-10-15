import type { SchemaTypeDefinition } from "sanity";
import { article } from "./article";
import { author } from "./author";
import { blockContent } from "./blockContent";
import { category } from "./category";
import { character } from "./character";
import { comicIssue } from "./comicIssue";
import { corps } from "./corps";
import { explainer } from "./explainer";
import { keyIssue } from "./keyIssue";
import { readingEntry } from "./readingEntry";
import { readingOrder } from "./readingOrder";
import { storyArc } from "./storyArc";

export const schemaTypes: SchemaTypeDefinition[] = [
  article,
  explainer,
  comicIssue,
  category,
  author,
  readingOrder,
  storyArc,
  keyIssue,
  character,
  corps,
  readingEntry,
  blockContent,
];
