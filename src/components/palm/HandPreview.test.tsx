import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  HandDetectionResult,
  HandDetector,
  HandLandmark,
  HandsLike,
} from "@/lib/hand-detector";
import { createHandDetector } from "@/lib/hand-detector";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import HandPreview from "./HandPreview";

const landmarks: HandLandmark[] = Array.from({ length: 21 }, (_, index) => ({
  x: 0.2 + index * 0.01,
  y: 0.8 - index * 0.015,
  z: -index * 0.001,
}));

class DecodableImage {
  src = "";
  alt = "";
  width = 640;
  height = 480;
  naturalWidth = 640;
  naturalHeight = 480;
  complete = true;
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;

  decode() {
    return Promise.resolve();
  }
}

function detectorWith(result: HandDetectionResult): HandDetector {
  return {
    detect: vi.fn().mockResolvedValue(result),
    close: vi.fn().mockResolvedValue(undefined),
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

class PendingInitializationHands implements HandsLike {
  initialize = vi.fn(() => new Promise<void>(() => undefined));
  send = vi.fn(async () => undefined);
  close = vi.fn(async () => undefined);
  setOptions = vi.fn();
  onResults = vi.fn();
}

describe("HandPreview", () => {
  beforeEach(() => {
    vi.stubGlobal("Image", DecodableImage);
    useLanguageStore.getState().setLanguage("en");
    usePalmStore.setState({
      image: "data:image/png;base64,palm",
      detection: null,
      reflectionKey: null,
      isDetecting: false,
      error: null,
      disclaimerAccepted: false,
    });
  });

  it("shows real hand-joint detection success", async () => {
    const factory = vi.fn().mockResolvedValue(
      detectorWith({ status: "success", landmarks, handedness: "Right" }),
    );

    render(<HandPreview detectorFactory={factory} />);

    expect(await screen.findByText(/21 hand joints detected/i)).toBeVisible();
    expect(usePalmStore.getState().detection?.landmarks).toHaveLength(21);
  });

  it.each([
    [
      { status: "no-hand" } as const,
      /show one fully visible hand against a plain background, then retry/i,
    ],
    [
      { status: "multiple-hands", count: 2 } as const,
      /keep only one hand in frame, then retry/i,
    ],
  ])("shows an actionable message for %s", async (result, message) => {
    render(
      <HandPreview
        detectorFactory={vi.fn().mockResolvedValue(detectorWith(result))}
      />,
    );

    expect(await screen.findByText(message)).toBeVisible();
    expect(screen.getByRole("button", { name: /retry detection/i })).toBeVisible();
  });

  it("keeps the image and offers retry when detector initialization fails", async () => {
    render(
      <HandPreview
        detectorFactory={vi.fn().mockRejectedValue(new Error("offline"))}
      />,
    );

    expect(
      await screen.findByText(
        /the hand model or image could not be loaded\. keep this image and retry/i,
      ),
    ).toBeVisible();
    expect(screen.getByRole("img", { name: /uploaded hand/i })).toHaveAttribute(
      "src",
      "data:image/png;base64,palm",
    );
  });

  it("retries detection without replacing the image", async () => {
    const factory = vi
      .fn<() => Promise<HandDetector>>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(
        detectorWith({ status: "success", landmarks, handedness: "Left" }),
      );

    render(<HandPreview detectorFactory={factory} />);

    await screen.findByText(/the hand model or image could not be loaded/i);
    await act(async () => {
      screen.getByRole("button", { name: /retry detection/i }).click();
    });

    expect(await screen.findByText(/21 hand joints detected/i)).toBeVisible();
    await waitFor(() => expect(factory).toHaveBeenCalledTimes(2));
  });

  it("ignores a decoded image after a newer image is selected", async () => {
    const firstDecode = deferred<void>();
    const secondDecode = deferred<void>();
    const decodes = [firstDecode, secondDecode];
    let imageCount = 0;
    vi.stubGlobal(
      "Image",
      class extends DecodableImage {
        private readonly pendingDecode = decodes[imageCount++];
        decode() {
          return this.pendingDecode.promise;
        }
      },
    );
    const factory = vi.fn().mockResolvedValue(
      detectorWith({ status: "success", landmarks, handedness: "Left" }),
    );

    render(<HandPreview detectorFactory={factory} />);
    act(() => usePalmStore.getState().setImage("data:image/png;base64,new"));
    await act(async () => secondDecode.resolve());
    await screen.findByText(/21 hand joints detected/i);
    await act(async () => firstDecode.resolve());

    expect(usePalmStore.getState().image).toBe("data:image/png;base64,new");
    expect(usePalmStore.getState().detection?.handedness).toBe("Left");
    expect(factory).toHaveBeenCalledOnce();
  });

  it("closes a detector that initializes after unmount without storing a result", async () => {
    const pendingFactory = deferred<HandDetector>();
    const detector = detectorWith({
      status: "success",
      landmarks,
      handedness: "Right",
    });
    const factory = vi.fn(() => pendingFactory.promise);
    const { unmount } = render(<HandPreview detectorFactory={factory} />);
    await waitFor(() => expect(factory).toHaveBeenCalledOnce());

    unmount();
    await act(async () => pendingFactory.resolve(detector));

    await waitFor(() => expect(detector.close).toHaveBeenCalledOnce());
    expect(usePalmStore.getState().detection).toBeNull();
  });

  it.each(["reset", "unmount"] as const)(
    "aborts and closes pending real-adapter initialization on %s",
    async (action) => {
      const hands = new PendingInitializationHands();
      const detectorFactory = vi.fn((options?: { signal?: AbortSignal }) =>
        createHandDetector(() => hands, options),
      );
      const rendered = render(<HandPreview detectorFactory={detectorFactory} />);
      await waitFor(() => expect(hands.initialize).toHaveBeenCalledOnce());

      if (action === "reset") {
        act(() => usePalmStore.getState().reset());
      } else {
        rendered.unmount();
      }

      await waitFor(() => expect(hands.close).toHaveBeenCalledOnce());
      expect(detectorFactory.mock.calls[0]?.[0]?.signal?.aborted).toBe(true);
      expect(usePalmStore.getState().detection).toBeNull();
    },
  );

  it("closes the one-shot detector after a successful result", async () => {
    const detector = detectorWith({
      status: "success",
      landmarks,
      handedness: "Right",
    });

    render(<HandPreview detectorFactory={vi.fn().mockResolvedValue(detector)} />);

    await screen.findByText(/21 hand joints detected/i);
    expect(detector.close).toHaveBeenCalledOnce();
  });

  it("closes an active detector and ignores its result after reset", async () => {
    const pendingDetection = deferred<HandDetectionResult>();
    const detector: HandDetector = {
      detect: vi.fn(() => pendingDetection.promise),
      close: vi.fn().mockResolvedValue(undefined),
    };
    const factory = vi.fn().mockResolvedValue(detector);
    render(<HandPreview detectorFactory={factory} />);
    await waitFor(() => expect(detector.detect).toHaveBeenCalledOnce());

    act(() => usePalmStore.getState().reset());
    await waitFor(() => expect(detector.close).toHaveBeenCalledOnce());
    await act(async () =>
      pendingDetection.resolve({
        status: "success",
        landmarks,
        handedness: "Right",
      }),
    );

    expect(usePalmStore.getState()).toMatchObject({
      image: null,
      detection: null,
      reflectionKey: null,
      isDetecting: false,
      error: null,
    });
  });
});
