import { afterEach, describe, expect, it, vi } from "vitest";
import type { Results } from "@mediapipe/hands";
import {
  createHandDetector,
  type HandLandmark,
  type HandsLike,
} from "./hand-detector";

const landmarks = (count: number): HandLandmark[] =>
  Array.from({ length: count }, (_, index) => ({
    x: index / 100,
    y: index / 200,
    z: -index / 1000,
  }));

class FakeHands implements HandsLike {
  listener: ((results: Results) => Promise<void> | void) | undefined;
  initialize = vi.fn(async () => undefined);
  send = vi.fn(async () => undefined);
  close = vi.fn(async () => undefined);
  setOptions = vi.fn();

  onResults(listener: (results: Results) => Promise<void> | void) {
    this.listener = listener;
  }

  emit(multiHandLandmarks: HandLandmark[][], labels: string[]) {
    this.listener?.({
      multiHandLandmarks,
      multiHandedness: labels.map((label) => ({ label })),
      multiHandWorldLandmarks: [],
      image: {} as Results["image"],
    } as unknown as Results);
  }
}

function observeOutcome<T>(promise: Promise<T>) {
  const outcome = vi.fn<(value: string) => void>();
  void promise.then(
    () => outcome("resolved"),
    (error: unknown) =>
      outcome(error instanceof Error ? error.message : String(error)),
  );
  return outcome;
}

describe("createHandDetector", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("maps one 21-point hand to success", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const pending = detector.detect(document.createElement("canvas"));
    fake.emit([landmarks(21)], ["Right"]);
    await expect(pending).resolves.toEqual({
      status: "success",
      landmarks: landmarks(21),
      handedness: "Right",
    });
  });

  it("returns no-hand for zero detected hands", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const pending = detector.detect(document.createElement("canvas"));
    fake.emit([], []);
    await expect(pending).resolves.toEqual({ status: "no-hand" });
  });

  it("returns the actual count for multiple hands", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const pending = detector.detect(document.createElement("canvas"));
    fake.emit([landmarks(21), landmarks(21)], ["Left", "Right"]);
    await expect(pending).resolves.toEqual({ status: "multiple-hands", count: 2 });
  });

  it("closes the MediaPipe instance when initialization rejects", async () => {
    const fake = new FakeHands();
    fake.initialize.mockRejectedValueOnce(new Error("model unavailable"));
    await expect(createHandDetector(() => fake)).rejects.toThrow("model unavailable");
    expect(fake.close).toHaveBeenCalledOnce();
  });

  it("times out and closes a never-settling initialization", async () => {
    vi.useFakeTimers();
    const fake = new FakeHands();
    fake.initialize.mockImplementationOnce(
      () => new Promise<undefined>(() => undefined),
    );
    const outcome = observeOutcome(
      createHandDetector(() => fake, { initializationTimeoutMs: 50 }),
    );

    await vi.advanceTimersByTimeAsync(50);

    expect(outcome).toHaveBeenCalledWith(
      expect.stringMatching(/initialization timed out/i),
    );
    expect(fake.close).toHaveBeenCalledOnce();
  });

  it("cancels and closes a pending initialization", async () => {
    const fake = new FakeHands();
    fake.initialize.mockImplementationOnce(
      () => new Promise<undefined>(() => undefined),
    );
    const controller = new AbortController();
    const outcome = observeOutcome(
      createHandDetector(() => fake, { signal: controller.signal }),
    );

    controller.abort();
    await Promise.resolve();
    await Promise.resolve();

    expect(outcome).toHaveBeenCalledWith(expect.stringMatching(/cancelled/i));
    expect(fake.close).toHaveBeenCalledOnce();
  });

  it("rejects send errors without fabricating a result", async () => {
    const fake = new FakeHands();
    fake.send.mockRejectedValueOnce(new Error("decode failed"));
    const detector = await createHandDetector(() => fake);
    await expect(detector.detect(document.createElement("canvas"))).rejects.toThrow(
      "decode failed",
    );
  });

  it("times out and closes when send resolves without onResults", async () => {
    vi.useFakeTimers();
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake, {
      resultTimeoutMs: 50,
    });
    const outcome = observeOutcome(detector.detect(document.createElement("canvas")));

    await vi.advanceTimersByTimeAsync(50);

    expect(outcome).toHaveBeenCalledWith(
      expect.stringMatching(/detection timed out/i),
    );
    expect(fake.close).toHaveBeenCalledOnce();
    await expect(detector.detect(document.createElement("canvas"))).rejects.toThrow(
      /closed/i,
    );
  });

  it("cancels and closes an in-flight detection", async () => {
    const fake = new FakeHands();
    const controller = new AbortController();
    const detector = await createHandDetector(() => fake, {
      signal: controller.signal,
    });
    const outcome = observeOutcome(detector.detect(document.createElement("canvas")));

    controller.abort();
    await Promise.resolve();
    await Promise.resolve();

    expect(outcome).toHaveBeenCalledWith(expect.stringMatching(/closed|cancelled/i));
    expect(fake.close).toHaveBeenCalledOnce();
  });

  it("closes the MediaPipe instance", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    await detector.close();
    expect(fake.close).toHaveBeenCalledOnce();
  });

  it("allows only one in-flight detection", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const pending = detector.detect(document.createElement("canvas"));

    await expect(detector.detect(document.createElement("canvas"))).rejects.toThrow(
      "already pending",
    );

    fake.emit([], []);
    await expect(pending).resolves.toEqual({ status: "no-hand" });
  });

  it("rejects a pending detection when closed", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const pending = detector.detect(document.createElement("canvas"));

    await detector.close();

    await expect(pending).rejects.toThrow("closed");
  });

  it("rejects a single hand without a handedness label", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const pending = detector.detect(document.createElement("canvas"));

    fake.emit([landmarks(21)], []);

    await expect(pending).rejects.toThrow();
  });

  it("rejects a single hand with an unknown handedness label", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const pending = detector.detect(document.createElement("canvas"));

    fake.emit([landmarks(21)], ["Unknown"]);

    await expect(pending).rejects.toThrow();
  });

  it("rejects a single hand with a landmark count other than 21", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const pending = detector.detect(document.createElement("canvas"));

    fake.emit([landmarks(20)], ["Left"]);

    await expect(pending).rejects.toThrow();
  });

  it("rejects a single hand with a non-finite landmark coordinate", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const invalidLandmarks = landmarks(21);
    invalidLandmarks[10] = { x: Infinity, y: 0.05, z: -0.01 };
    const pending = detector.detect(document.createElement("canvas"));

    fake.emit([invalidLandmarks], ["Left"]);

    await expect(pending).rejects.toThrow();
  });

  it("rejects a sparse 21-slot landmark list", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const sparseLandmarks = landmarks(21);
    delete sparseLandmarks[10];
    const pending = detector.detect(document.createElement("canvas"));

    fake.emit([sparseLandmarks], ["Left"]);

    await expect(pending).rejects.toThrow();
  });

  it("recovers after rejecting malformed runtime output", async () => {
    const fake = new FakeHands();
    const detector = await createHandDetector(() => fake);
    const malformed = detector.detect(document.createElement("canvas"));

    fake.emit([landmarks(21)], ["Unknown"]);
    await expect(malformed).rejects.toThrow();

    const valid = detector.detect(document.createElement("canvas"));
    fake.emit([landmarks(21)], ["Right"]);

    await expect(valid).resolves.toEqual({
      status: "success",
      landmarks: landmarks(21),
      handedness: "Right",
    });
  });
});
