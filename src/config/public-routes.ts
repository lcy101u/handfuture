export const PUBLIC_PATHS = [
  "/",
  "/guides",
  "/how-it-works",
  "/guides/palmistry-basics",
  "/guides/science-and-limitations",
  "/guides/hand-photo-guide",
  "/guides/hand-landmark-atlas",
  "/guides/creases-vs-landmarks",
  "/guides/barnum-effect-lab",
  "/guides/evaluating-palmistry-claims",
  "/about",
  "/privacy",
  "/terms",
] as const;

export const INDEXABLE_CONTENT_PATHS = PUBLIC_PATHS.filter(
  (path) => path !== "/privacy" && path !== "/terms",
);

export type PublicPath = (typeof PUBLIC_PATHS)[number];
export type GuidePath = Exclude<Extract<PublicPath, `/guides${string}`>, "/guides">;

export type { Locale } from "../i18n/locales.js";

export function isPublicPath(value: string): value is PublicPath {
  return (PUBLIC_PATHS as readonly string[]).includes(value);
}
