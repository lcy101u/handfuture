import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import ConceptComparison from "./ConceptComparison";

describe("ConceptComparison", () => {
  beforeEach(() => useLanguageStore.getState().setLanguage("en", false));

  it("distinguishes four concepts and never marks a detector landmark as a crease", () => {
    render(<ConceptComparison />);
    const table = screen.getByRole("table", { name: /creases, joints, landmarks, and cultural labels/i });
    expect(within(table).getAllByRole("row")).toHaveLength(5);
    const landmarkRow = within(table).getByRole("row", { name: /model landmark/i });
    expect(landmarkRow).toHaveTextContent(/returned by this model/i);
    expect(landmarkRow).toHaveTextContent(/not a crease/i);
  });
});
