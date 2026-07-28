export const PUBLIC_PATHS = [
  "/",
  "/how-it-works",
  "/guides/palmistry-basics",
  "/guides/science-and-limitations",
  "/guides/hand-photo-guide",
  "/about",
  "/privacy",
  "/terms",
] as const;

export type PublicPath = (typeof PUBLIC_PATHS)[number];
export type GuidePath = Extract<PublicPath, `/guides/${string}`>;

// Compatibility type until Task 4 migrates the existing two-language content.
export type Locale = "zh" | "en";
export type { Locale as LocalizedLocale } from "../i18n/locales";

export function isPublicPath(value: string): value is PublicPath {
  return (PUBLIC_PATHS as readonly string[]).includes(value);
}
