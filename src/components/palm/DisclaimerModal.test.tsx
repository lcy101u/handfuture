import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import DisclaimerModal from "./DisclaimerModal";

describe("DisclaimerModal", () => {
  beforeEach(() => useLanguageStore.getState().setLanguage("en"));

  it("renders only when explicitly opened", () => {
    const { rerender } = render(
      <DisclaimerModal open={false} onClose={vi.fn()} onAccept={vi.fn()} />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(
      <DisclaimerModal open onClose={vi.fn()} onAccept={vi.fn()} />,
    );
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("dismisses without accepting", () => {
    const onClose = vi.fn();
    const onAccept = vi.fn();
    render(<DisclaimerModal open onClose={onClose} onAccept={onAccept} />);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("dismisses with Escape without accepting", () => {
    const onClose = vi.fn();
    const onAccept = vi.fn();
    render(<DisclaimerModal open onClose={onClose} onAccept={onAccept} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledOnce();
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("reports acceptance separately from dismissal", () => {
    const onClose = vi.fn();
    const onAccept = vi.fn();
    render(<DisclaimerModal open onClose={onClose} onAccept={onAccept} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /i understand and agree/i,
      }),
    );

    expect(onAccept).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
  });
});
