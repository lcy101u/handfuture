import { describe, expect, it } from "vitest";
import {
  buildLocalizedPath,
  localeFromBrowserLanguages,
  localeFromCountry,
  normalizeLocale,
  parseLocalizedPath,
} from "./locales";

describe("locale domain", () => {
  it.each([
    ["zh-Hant-HK", "zh-TW"],
    ["zh-Hans-CN", "zh-CN"],
    ["zh-HK", "zh-TW"],
    ["zh-mo", "zh-TW"],
    ["ZH-sg", "zh-CN"],
    ["zh-TW-u-nu-hanidec", "zh-TW"],
    ["zh-Hant-CN-u-ca-chinese", "zh-TW"],
    ["zh-Hans-TW-x-private", "zh-CN"],
    ["PT-br", "pt-BR"],
    ["de-DE", null],
  ])("normalizes %s using BCP-47 language tags", (value, expected) => {
    expect(normalizeLocale(value)).toBe(expected);
  });

  it("chooses the first supported browser language", () => {
    expect(localeFromBrowserLanguages(["de-DE", "ja-JP"])).toBe("ja");
  });

  it.each([
    ["TW", "zh-TW"],
    ["MX", "es"],
    ["FR", "fr"],
    ["DE", "en"],
  ])("maps country %s to %s", (country, expected) => {
    expect(localeFromCountry(country)).toBe(expected);
  });

  it("parses a supported locale prefix and exact public path", () => {
    expect(parseLocalizedPath("/pt-BR/guides/hand-photo-guide")).toEqual({
      locale: "pt-BR",
      publicPath: "/guides/hand-photo-guide",
    });
  });

  it.each([
    "/de/about",
    "/ja-JP/about",
    "/zh-Hant-HK/about",
    "/fr/not-a-public-page",
  ])("rejects non-canonical or non-public localized paths: %s", (pathname) => {
    expect(parseLocalizedPath(pathname)).toBeNull();
  });

  it("builds a slash-safe localized home path", () => {
    expect(buildLocalizedPath("fr", "/")).toBe("/fr/");
  });
});
