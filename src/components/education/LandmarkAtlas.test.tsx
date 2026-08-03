import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import LandmarkAtlas from "./LandmarkAtlas";

describe("LandmarkAtlas", () => {
  beforeEach(() => useLanguageStore.getState().setLanguage("en", false));

  it("exposes all 21 standard landmark indices through diagram and list", () => {
    render(<LandmarkAtlas />);

    expect(screen.getAllByTestId("atlas-point")).toHaveLength(21);
    expect(screen.getAllByTestId("atlas-list-item")).toHaveLength(21);
    expect(screen.getByRole("button", { name: /0 · wrist/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/model estimate near the wrist/i)).toBeVisible();
  });

  it("keeps pointer/list selection synchronized and can reset to the wrist", () => {
    render(<LandmarkAtlas />);

    fireEvent.click(screen.getByRole("button", { name: /8 · index_finger_tip/i }));
    expect(screen.getAllByRole("button", { name: /8 · index_finger_tip/i })[0]).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/tip of the index finger/i)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /reset atlas/i }));
    expect(screen.getByRole("button", { name: /0 · wrist/i })).toHaveAttribute("aria-pressed", "true");
  });
});
