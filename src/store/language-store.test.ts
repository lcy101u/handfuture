import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "./language-store";

describe("language store public copy", () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ currentLanguage: "en" });
    document.documentElement.lang = "en";
  });

  it("preserves the explicit manual disclaimer meaning in both languages", () => {
    useLanguageStore.getState().setLanguage("zh-TW");
    expect(useLanguageStore.getState().t("disclaimer.prompt")).toBe(
      "開始分析前請先閱讀並同意免責聲明。",
    );
    expect(useLanguageStore.getState().t("button.viewDisclaimer")).toBe(
      "閱讀免責聲明",
    );

    useLanguageStore.getState().setLanguage("en");
    expect(useLanguageStore.getState().t("disclaimer.prompt")).toBe(
      "Please review and accept the disclaimer before starting an analysis.",
    );
    expect(useLanguageStore.getState().t("button.viewDisclaimer")).toBe(
      "View Disclaimer",
    );
  });

  it("falls back to an unknown key without inventing copy", () => {
    useLanguageStore.getState().setLanguage("en");
    expect(useLanguageStore.getState().t("missing.public.copy")).toBe(
      "missing.public.copy",
    );
  });

  it("records an explicit language choice and updates the document language", () => {
    useLanguageStore.getState().setLanguage("ja", true);

    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "ja",
      hasExplicitPreference: true,
    });
    expect(document.documentElement.lang).toBe("ja");
  });

  it("keeps automatic language initialization distinct from an explicit choice", () => {
    useLanguageStore.getState().setLanguage("ko", false);

    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "ko",
      hasExplicitPreference: false,
    });
  });

  it("migrates a persisted legacy zh preference to zh-TW", async () => {
    localStorage.setItem(
      "language-store",
      JSON.stringify({ state: { currentLanguage: "zh" }, version: 0 }),
    );

    await useLanguageStore.persist.rehydrate();

    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "zh-TW",
      hasExplicitPreference: true,
    });
  });
});
