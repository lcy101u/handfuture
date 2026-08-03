import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import BarnumLab from "./BarnumLab";

describe("BarnumLab", () => {
  beforeEach(() => useLanguageStore.getState().setLanguage("en", false));

  it("reveals the explanation only after a statement or neither is selected", () => {
    render(<BarnumLab />);

    expect(screen.getAllByRole("button", { name: /statement [ab]|neither/i })).toHaveLength(3);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /neither/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/both statements were written to apply broadly/i);
  });

  it("does not persist or send the answer and resets the exercise", () => {
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<BarnumLab />);

    fireEvent.click(screen.getByRole("button", { name: /statement a/i }));
    expect(storageSpy).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /reset lab/i }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
