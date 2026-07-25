import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import ReflectionResult from "./ReflectionResult";

describe("ReflectionResult", () => {
  beforeEach(() => {
    usePalmStore.setState({ reflectionKey: "balance" });
    useLanguageStore.getState().setLanguage("en");
  });

  it("shows the selected localized reflection and its non-scientific disclaimer", () => {
    render(<ReflectionResult />);

    expect(
      screen.getByText(
        "What deserves a different share of your time and attention right now?",
      ),
    ).toBeVisible();
    expect(screen.getByText(/non-scientific prompt/i)).toBeVisible();
  });

  it("updates the card when the language changes", () => {
    render(<ReflectionResult />);

    act(() => useLanguageStore.getState().setLanguage("zh"));

    expect(
      screen.getByText("最近有哪些事情值得你重新分配時間與注意力？"),
    ).toBeVisible();
    expect(screen.getByText(/非科學推論/)).toBeVisible();
  });
});
