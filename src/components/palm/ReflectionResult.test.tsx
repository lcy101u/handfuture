import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import ReflectionResult from "./ReflectionResult";

const localizedBalancePrompts = [
  ["zh-TW", "最近有哪些事情值得你重新分配時間與注意力？"],
  ["zh-CN", "最近有哪些事情值得你重新分配时间与注意力？"],
  ["en", "What deserves a different share of your time and attention right now?"],
  ["ja", "今、時間と注意の配分を見直したいことは何ですか？"],
  ["ko", "지금 시간과 관심을 다르게 배분할 만한 일은 무엇인가요?"],
  ["es", "¿Qué merece ahora una distribución diferente de tu tiempo y atención?"],
  ["pt-BR", "O que merece uma distribuição diferente do seu tempo e atenção agora?"],
  ["fr", "Qu’est-ce qui mérite une autre part de votre temps et de votre attention en ce moment ?"],
] as const;

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

    act(() => useLanguageStore.getState().setLanguage("zh-TW"));

    expect(
      screen.getByText("最近有哪些事情值得你重新分配時間與注意力？"),
    ).toBeVisible();
    expect(screen.getByText(/非科學推論/)).toBeVisible();
  });

  it.each(localizedBalancePrompts)(
    "provides a complete, non-scientific balance card in %s",
    (locale, prompt) => {
      useLanguageStore.getState().setLanguage(locale);
      render(<ReflectionResult />);

      expect(screen.getByText(prompt)).toBeVisible();
      expect(document.body).not.toHaveTextContent(/undefined/);
    },
  );
});
