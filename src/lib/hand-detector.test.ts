import { describe, expect, it, vi } from "vitest";
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

describe("createHandDetector", () => {
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

  it("rejects initialization errors", async () => {
    const fake = new FakeHands();
    fake.initialize.mockRejectedValueOnce(new Error("model unavailable"));
    await expect(createHandDetector(() => fake)).rejects.toThrow("model unavailable");
  });

  it("rejects send errors without fabricating a result", async () => {
    const fake = new FakeHands();
    fake.send.mockRejectedValueOnce(new Error("decode failed"));
    const detector = await createHandDetector(() => fake);
    await expect(detector.detect(document.createElement("canvas"))).rejects.toThrow(
      "decode failed",
    );
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
