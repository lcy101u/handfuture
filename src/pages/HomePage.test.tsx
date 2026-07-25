import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import type { HandLandmark } from "@/lib/hand-detector";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import HomePage from "./HomePage";

const landmarks: HandLandmark[] = Array.from({ length: 21 }, (_, index) => ({
  x: 0.2 + index * 0.01,
  y: 0.8 - index * 0.015,
  z: -index * 0.001,
}));

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage truthful reflection flow", () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.getState().setLanguage("en");
    usePalmStore.setState({
      image: null,
      detection: null,
      reflectionKey: null,
      isDetecting: false,
      error: null,
      disclaimerAccepted: false,
    });
  });

  it("renders only truthful hand-joint and reflection claims", () => {
    renderHome();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /hand-joint reflections/i,
    );
    expect(document.body).toHaveTextContent(/non-scientific entertainment/i);
    expect(document.body.textContent).not.toMatch(
      /palm lines?|life line|heart line|fortune|future|health|personality|confidence|prediction/i,
    );
  });

  it("does not open the disclaimer automatically", () => {
    renderHome();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("requires a second explicit click after accepting the disclaimer", () => {
    usePalmStore.setState({
      detection: { status: "success", landmarks, handedness: "Right" },
    });
    renderHome();

    fireEvent.click(
      screen.getByRole("button", { name: /choose reflection card/i }),
    );
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(usePalmStore.getState().reflectionKey).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: /i understand and agree/i }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(usePalmStore.getState().reflectionKey).toBeNull();

    act(() => {
      fireEvent.click(
        screen.getByRole("button", { name: /choose reflection card/i }),
      );
    });
    expect(usePalmStore.getState().reflectionKey).not.toBeNull();
  });
});
