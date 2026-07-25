import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "@/components/ui/toaster";
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

interface ControlledReader {
  result: string | ArrayBuffer | null;
  onload: FileReader["onload"];
  onerror: FileReader["onerror"];
  onabort: FileReader["onabort"];
  readAsDataURL: (file: Blob) => void;
  abort: () => void;
}

function completeReader(reader: ControlledReader, result: string) {
  reader.result = result;
  reader.onload?.call(
    reader as unknown as FileReader,
    { target: reader } as unknown as ProgressEvent<FileReader>,
  );
}

describe("ImageUploader request lifecycle", () => {
  const readers: ControlledReader[] = [];

  beforeEach(() => {
    readers.length = 0;
    useLanguageStore.getState().setLanguage("en");
    usePalmStore.setState({ image: null });

    vi.stubGlobal(
      "FileReader",
      class {
        result: string | ArrayBuffer | null = null;
        onload: FileReader["onload"] = null;
        onerror: FileReader["onerror"] = null;
        onabort: FileReader["onabort"] = null;
        readAsDataURL = vi.fn();
        abort = vi.fn();

        constructor() {
          readers.push(this);
        }
      },
    );
  });

  it("describes a successful English selection as local joint detection", async () => {
    render(
      <>
        <ImageUploader />
        <Toaster />
      </>,
    );
    upload(new File(["image"], "hand.png", { type: "image/png" }));
    await waitFor(() => expect(readers).toHaveLength(1));

    act(() => completeReader(readers[0], "data:image/png;base64,hand"));

    const title = await screen.findByText("Photo selected locally");
    const message = title.parentElement;
    expect(message).toHaveTextContent(
      "Photo selected locallyHand-joint detection is starting.",
    );
    expect(message).not.toHaveTextContent(/upload/i);
  });

  it("describes a successful Chinese selection as local joint detection", async () => {
    useLanguageStore.getState().setLanguage("zh");
    render(
      <>
        <ImageUploader />
        <Toaster />
      </>,
    );
    upload(new File(["image"], "hand.png", { type: "image/png" }));
    await waitFor(() => expect(readers).toHaveLength(1));

    act(() => completeReader(readers[0], "data:image/png;base64,hand"));

    const title = await screen.findByText("已在本機選擇照片");
    const message = title.parentElement;
    expect(message).toHaveTextContent(
      "已在本機選擇照片正在開始手部關節偵測。",
    );
    expect(message).not.toHaveTextContent(/上傳/);
  });

  it("does not let an older file overwrite the newer image", async () => {
    render(<ImageUploader />);
    upload(new File(["a"], "a.png", { type: "image/png" }));
    await waitFor(() => expect(readers).toHaveLength(1));
    upload(new File(["b"], "b.png", { type: "image/png" }));
    await waitFor(() => expect(readers).toHaveLength(2));

    act(() => completeReader(readers[1], "data:image/png;base64,b"));
    act(() => completeReader(readers[0], "data:image/png;base64,a"));

    expect(usePalmStore.getState().image).toBe("data:image/png;base64,b");
  });

  it("does not update the store after unmount", async () => {
    const { unmount } = render(<ImageUploader />);
    upload(new File(["a"], "a.png", { type: "image/png" }));
    await waitFor(() => expect(readers).toHaveLength(1));
    unmount();

    act(() => completeReader(readers[0], "data:image/png;base64,a"));

    expect(usePalmStore.getState().image).toBeNull();
  });
});
