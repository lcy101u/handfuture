import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "./language-store";

function persistedLanguageState() {
  return JSON.parse(localStorage.getItem("language-store") ?? "{}");
}

async function rehydrateFrom(payload: unknown) {
  useLanguageStore.setState({
    currentLanguage: "en",
    hasExplicitPreference: false,
  });
  document.documentElement.lang = "en";
  document.title = "Before rehydration";
  localStorage.setItem("language-store", JSON.stringify(payload));

  await useLanguageStore.persist.rehydrate();
}

describe("language store public copy", () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({
      currentLanguage: "en",
      hasExplicitPreference: false,
    });
    document.documentElement.lang = "en";
    document.title = "HandFuture";
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

  it("persists and restores an explicit language choice with document metadata", async () => {
    useLanguageStore.getState().setLanguage("ja", true);

    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "ja",
      hasExplicitPreference: true,
    });
    expect(document.documentElement.lang).toBe("ja");
    expect(persistedLanguageState()).toEqual({
      state: { currentLanguage: "ja", hasExplicitPreference: true },
      version: 1,
    });

    await rehydrateFrom(persistedLanguageState());

    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "ja",
      hasExplicitPreference: true,
    });
    expect(document.documentElement.lang).toBe("ja");
    expect(document.title).toBe("HandFuture");
  });

  it("persists and restores automatic language initialization separately", async () => {
    useLanguageStore.getState().setLanguage("ko", false);

    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "ko",
      hasExplicitPreference: false,
    });
    expect(persistedLanguageState()).toEqual({
      state: { currentLanguage: "ko", hasExplicitPreference: false },
      version: 1,
    });

    await rehydrateFrom(persistedLanguageState());

    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "ko",
      hasExplicitPreference: false,
    });
    expect(document.documentElement.lang).toBe("ko");
    expect(document.title).toBe("HandFuture");
  });

  it("migrates a persisted legacy zh preference to zh-TW", async () => {
    await rehydrateFrom({ state: { currentLanguage: "zh" }, version: 0 });

    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "zh-TW",
      hasExplicitPreference: true,
    });
    expect(document.documentElement.lang).toBe("zh-TW");
    expect(document.title).toBe("HandFuture");
  });
});
