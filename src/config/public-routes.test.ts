import { describe, expect, it } from "vitest";
import { PUBLIC_PATHS } from "./public-routes";
import { SITE_ORIGIN, buildStructuredData, getRouteMetadata } from "./site-metadata";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";

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

  it.each(SUPPORTED_LOCALES)("has unique complete %s metadata", (locale) => {
    const records = PUBLIC_PATHS.map((path) => getRouteMetadata(path, locale));
    expect(new Set(records.map(({ title }) => title)).size).toBe(records.length);
    for (const [index, record] of records.entries()) {
      const path = PUBLIC_PATHS[index];
      const suffix = path === "/" ? "/" : path;
      expect(record.description.length).toBeGreaterThanOrEqual(50);
      expect(record.canonical).toBe(`${SITE_ORIGIN}${suffix}`);
      expect(record.ogUrl).toBe(record.canonical);
      expect(record.ogImage).toBe(`${SITE_ORIGIN}/og-image.jpg`);
      expect(record.ogImageAlt.trim()).not.toBe("");
    }
  });

  it("publishes complete metadata for all 64 localized public routes", () => {
    const records = SUPPORTED_LOCALES.flatMap((locale) =>
      PUBLIC_PATHS.map((path) => ({ locale, path, meta: getRouteMetadata(path, locale) })),
    );

    expect(records).toHaveLength(64);
    for (const { locale, path, meta } of records) {
      expect(meta.title.trim()).not.toBe("");
      expect(meta.description.trim()).not.toBe("");
      expect(meta.canonical).toBe(`${SITE_ORIGIN}${path === "/" ? "/" : path}`);
      expect(buildStructuredData(path, locale).inLanguage).toBe(locale);
    }
  });

  it.each([
    ["zh-TW", "手相文化探索"],
    ["zh-CN", "手相文化探索"],
    ["ja", "手相文化"],
    ["ko", "손금 문화"],
    ["es", "cultura de la quiromancia"],
    ["pt-BR", "cultura da quiromancia"],
    ["fr", "culture de la chiromancie"],
  ] as const)("uses native home metadata in %s", (locale, phrase) => {
    const metadata = getRouteMetadata("/", locale as Locale);
    expect(`${metadata.title} ${metadata.description}`.toLocaleLowerCase()).toContain(
      phrase.toLocaleLowerCase(),
    );
  });

  it.each(
    SUPPORTED_LOCALES.filter((locale) => locale !== "en").flatMap((locale) =>
      PUBLIC_PATHS.map((path) => [locale, path] as const),
    ),
  )("translates every metadata field for %s%s", (locale, path) => {
    const localized = getRouteMetadata(path, locale);
    const english = getRouteMetadata(path, "en");

    expect(localized.title).not.toBe(english.title);
    expect(localized.description).not.toBe(english.description);
    expect(localized.ogImageAlt).not.toBe(english.ogImageAlt);
  });

  it("uses WebApplication only for home and Article only for guides", () => {
    expect(buildStructuredData("/", "zh-TW")["@type"]).toBe("WebApplication");
    expect(buildStructuredData("/guides/palmistry-basics", "en")["@type"]).toBe("Article");
    expect(JSON.stringify(buildStructuredData("/", "zh-TW"))).not.toContain("aggregateRating");
  });
});
