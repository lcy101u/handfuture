import { describe, expect, it } from "vitest";
import { INDEXABLE_CONTENT_PATHS, PUBLIC_PATHS } from "./public-routes";
import { SITE_ORIGIN, buildStructuredData, getRouteMetadata } from "./site-metadata";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";

const expectedPaths = [
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

describe("public route contract", () => {
  it("contains the 13 approved public paths and 11 indexable content paths", () => {
    expect(PUBLIC_PATHS).toEqual(expectedPaths);
    expect(new Set(PUBLIC_PATHS).size).toBe(PUBLIC_PATHS.length);
    expect(INDEXABLE_CONTENT_PATHS).toEqual(
      expectedPaths.filter((path) => path !== "/privacy" && path !== "/terms"),
    );
  });

  it.each(SUPPORTED_LOCALES)("has unique complete %s metadata", (locale) => {
    const records = PUBLIC_PATHS.map((path) => getRouteMetadata(path, locale));
    expect(new Set(records.map(({ title }) => title)).size).toBe(records.length);
    for (const [index, record] of records.entries()) {
      const path = PUBLIC_PATHS[index];
      const suffix = `/${locale}${path === "/" ? "/" : path}`;
      expect(record.description.length).toBeGreaterThanOrEqual(50);
      expect(record.canonical).toBe(`${SITE_ORIGIN}${suffix}`);
      expect(record.ogUrl).toBe(record.canonical);
      expect(record.ogImage).toBe(`${SITE_ORIGIN}/og-image.jpg`);
      expect(record.ogImageAlt.trim()).not.toBe("");
    }
  });

  it("publishes complete metadata for all 104 localized public routes", () => {
    const records = SUPPORTED_LOCALES.flatMap((locale) =>
      PUBLIC_PATHS.map((path) => ({ locale, path, meta: getRouteMetadata(path, locale) })),
    );

    expect(records).toHaveLength(104);
    for (const { locale, path, meta } of records) {
      expect(meta.title.trim()).not.toBe("");
      expect(meta.description.trim()).not.toBe("");
      expect(meta.canonical).toBe(
        `${SITE_ORIGIN}/${locale}${path === "/" ? "/" : path}`,
      );
      expect(buildStructuredData(path, locale)).toMatchObject({
        inLanguage: locale,
        url: meta.canonical,
      });
    }
  });

  it.each([
    ["zh-TW", "手部文化"],
    ["zh-CN", "手部文化"],
    ["ja", "手の文化"],
    ["ko", "손 문화"],
    ["es", "tradición quiromántica"],
    ["pt-BR", "tradição da quiromancia"],
    ["fr", "tradition chiromantique"],
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

  it("uses WebApplication for home, CollectionPage for the hub, and Article for guides", () => {
    expect(buildStructuredData("/", "zh-TW")["@type"]).toBe("WebApplication");
    expect(buildStructuredData("/guides", "en")["@type"]).toBe("CollectionPage");
    expect(buildStructuredData("/guides/palmistry-basics", "en")["@type"]).toBe("Article");
    expect(JSON.stringify(buildStructuredData("/", "zh-TW"))).not.toContain("aggregateRating");
  });
});
