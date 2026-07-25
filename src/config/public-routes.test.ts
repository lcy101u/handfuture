import { describe, expect, it } from "vitest";
import { PUBLIC_PATHS } from "./public-routes";
import { SITE_ORIGIN, buildStructuredData, getRouteMetadata } from "./site-metadata";

const expectedPaths = [
  "/",
  "/how-it-works",
  "/guides/palmistry-basics",
  "/guides/science-and-limitations",
  "/guides/hand-photo-guide",
  "/about",
  "/privacy",
  "/terms",
] as const;

describe("public route contract", () => {
  it("contains exactly the eight approved public paths", () => {
    expect(PUBLIC_PATHS).toEqual(expectedPaths);
    expect(new Set(PUBLIC_PATHS).size).toBe(PUBLIC_PATHS.length);
  });

  it.each(["zh", "en"] as const)("has unique complete %s metadata", (locale) => {
    const records = PUBLIC_PATHS.map((path) => getRouteMetadata(path, locale));
    expect(new Set(records.map(({ title }) => title)).size).toBe(records.length);
    for (const [index, record] of records.entries()) {
      const path = PUBLIC_PATHS[index];
      const suffix = path === "/" ? "/" : path;
      expect(record.description.length).toBeGreaterThanOrEqual(50);
      expect(record.canonical).toBe(`${SITE_ORIGIN}${suffix}`);
      expect(record.ogUrl).toBe(record.canonical);
      expect(record.ogImage).toBe(`${SITE_ORIGIN}/og-image.jpg`);
    }
  });

  it("uses WebApplication only for home and Article only for guides", () => {
    expect(buildStructuredData("/", "zh")["@type"]).toBe("WebApplication");
    expect(buildStructuredData("/guides/palmistry-basics", "en")["@type"]).toBe("Article");
    expect(JSON.stringify(buildStructuredData("/", "zh"))).not.toContain("aggregateRating");
  });
});
