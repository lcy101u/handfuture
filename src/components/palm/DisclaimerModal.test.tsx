import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import DisclaimerModal from "./DisclaimerModal";

describe("DisclaimerModal", () => {
  beforeEach(() => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    useLanguageStore.getState().setLanguage("en");
    usePalmStore.setState({ disclaimerAccepted: false });
  });

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

  it("dismisses after an outside pointer interaction without accepting", async () => {
    const onClose = vi.fn();
    const onAccept = vi.fn();
    render(<DisclaimerModal open onClose={onClose} onAccept={onAccept} />);
    const dialog = screen.getByRole("dialog");
    const overlay = dialog.previousElementSibling;
    if (!(overlay instanceof HTMLElement)) {
      throw new Error("The dialog overlay was not rendered.");
    }
    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));

    fireEvent.pointerDown(overlay, {
      button: 0,
      ctrlKey: false,
      pointerType: "mouse",
    });
    fireEvent.click(overlay);

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
    expect(onAccept).not.toHaveBeenCalled();
    expect(usePalmStore.getState().disclaimerAccepted).toBe(false);
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
