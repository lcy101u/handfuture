import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "./language-store";

describe("language store public copy", () => {
  beforeEach(() => localStorage.clear());

  it("preserves the explicit manual disclaimer meaning in both languages", () => {
    useLanguageStore.getState().setLanguage("zh");
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
});
