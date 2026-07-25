import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import SocialShare from "./SocialShare";

describe("SocialShare", () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage("en");
    window.history.replaceState(
      {},
      "",
      "/guides/science-and-limitations?source=test#details",
    );
    document.querySelector('link[rel="canonical"]')?.remove();
  });

  it("uses native sharing with safe copy and the clean current URL", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });

    render(<SocialShare />);
    fireEvent.click(screen.getByRole("button", { name: /share this page/i }));

    await waitFor(() =>
      expect(share).toHaveBeenCalledWith({
        title: "HandFuture",
        text: "I’m exploring palmistry culture and a non-scientific reflection prompt on HandFuture.",
        url: `${window.location.origin}/guides/science-and-limitations`,
      }),
    );
  });

  it("copies the canonical link with the exact Chinese safe message as fallback", async () => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    useLanguageStore.getState().setLanguage("zh");

    render(<SocialShare />);
    fireEvent.click(screen.getByRole("button", { name: "複製分享連結" }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        `我正在 HandFuture 探索手相文化與非科學的反思提示。\n\n${window.location.origin}/guides/science-and-limitations`,
      ),
    );
  });
});
