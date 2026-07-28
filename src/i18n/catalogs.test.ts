import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "./locales";
import { LANGUAGE_OPTIONS, catalogs, getTranslation } from "./catalogs";

describe("locale catalogs", () => {
  it("provides every current UI key in every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(catalogs[locale]).sort()).toEqual(
        Object.keys(catalogs.en).sort(),
      );
      if (locale !== "en") {
        expect(catalogs[locale]["hero.title"]).not.toBe(catalogs.en["hero.title"]);
      }
    }
  });

  it("lists all supported locales in the language picker order", () => {
    expect(LANGUAGE_OPTIONS.map(({ code }) => code)).toEqual([
      "zh-TW",
      "zh-CN",
      "en",
      "ja",
      "ko",
      "es",
      "pt-BR",
      "fr",
    ]);
  });

  it("returns the English fallback for an unknown translation key", () => {
    expect(getTranslation("ja", "missing.public.copy")).toBe(
      "missing.public.copy",
    );
  });
});
