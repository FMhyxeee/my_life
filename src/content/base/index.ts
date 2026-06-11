import { baseEndings } from "./endings";
import { baseEvents } from "./events";

export const baseContent = {
  events: baseEvents,
  endings: baseEndings,
};

export type BaseContent = typeof baseContent;
