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
export type Locale = "zh" | "en";

export function isPublicPath(value: string): value is PublicPath {
  return (PUBLIC_PATHS as readonly string[]).includes(value);
}
