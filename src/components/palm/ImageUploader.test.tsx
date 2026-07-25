import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import ImageUploader from "./ImageUploader";

function upload(file: File) {
  const input = document.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error("Upload input was not rendered.");
  }
  fireEvent.change(input, { target: { files: [file] } });
}

describe("ImageUploader errors", () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage("en");
    usePalmStore.setState({ image: null });
  });

  it("keeps an unsupported file type error visible", async () => {
    render(<ImageUploader />);

    upload(new File(["text"], "notes.txt", { type: "text/plain" }));

    expect(
      await screen.findByText(/choose a jpg, png, or webp image/i),
    ).toBeVisible();
    expect(usePalmStore.getState().image).toBeNull();
  });

  it("keeps an oversize image error visible", async () => {
    render(<ImageUploader />);
    const file = new File(["image"], "large.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 10 * 1024 * 1024 + 1 });

    upload(file);

    expect(await screen.findByText(/image is larger than 10mb/i)).toBeVisible();
    expect(usePalmStore.getState().image).toBeNull();
  });

  it("keeps an unreadable image error visible", async () => {
    vi.spyOn(FileReader.prototype, "readAsDataURL").mockImplementation(
      function (this: FileReader) {
        this.onerror?.(
          new ProgressEvent("error") as ProgressEvent<FileReader>,
        );
      },
    );
    render(<ImageUploader />);

    upload(new File(["image"], "hand.png", { type: "image/png" }));

    expect(await screen.findByText(/image could not be read/i)).toBeVisible();
    await waitFor(() => expect(usePalmStore.getState().image).toBeNull());
  });
});
