import { beforeEach, describe, expect, it } from "vitest";
import type { HandDetectionResult, HandLandmark } from "@/lib/hand-detector";
import { usePalmStore } from "./palm-store";

const landmarks: HandLandmark[] = Array.from({ length: 21 }, (_, index) => ({
  x: 0.2 + index * 0.01,
  y: 0.8 - index * 0.015,
  z: -index * 0.001,
}));

const success: HandDetectionResult = {
  status: "success",
  landmarks,
  handedness: "Right",
};

describe("palm store", () => {
  beforeEach(() => {
    localStorage.clear();
    usePalmStore.setState({
      image: null,
      detection: null,
      reflectionKey: null,
      isDetecting: false,
      error: null,
      disclaimerAccepted: false,
    });
  });

  it("creates a deterministic reflection key from a valid detection", () => {
    const store = usePalmStore.getState();
    store.setDetection(success);
    store.createReflection();

    expect(usePalmStore.getState().reflectionKey).toMatch(
      /^(balance|curiosity|connection|rhythm)$/,
    );
  });

  it.each([
    [{ status: "no-hand" } as const, "no-hand"],
    [{ status: "multiple-hands", count: 2 } as const, "multiple-hands"],
  ])("maps %s detector outcomes to %s errors", (result, error) => {
    usePalmStore.getState().setDetection(result);

    expect(usePalmStore.getState()).toMatchObject({
      detection: null,
      reflectionKey: null,
      isDetecting: false,
      error,
    });
  });

  it("clears transient state on reset while retaining disclaimer consent", () => {
    const store = usePalmStore.getState();
    store.acceptDisclaimer();
    store.setImage("data:image/png;base64,palm");
    store.setDetection(success);
    store.createReflection();
    store.setError("detector-unavailable");
    store.reset();

    expect(usePalmStore.getState()).toMatchObject({
      image: null,
      detection: null,
      reflectionKey: null,
      isDetecting: false,
      error: null,
      disclaimerAccepted: true,
    });
  });

  it("persists only disclaimer consent", () => {
    const store = usePalmStore.getState();
    store.acceptDisclaimer();
    store.setImage("data:image/png;base64,palm");
    store.setDetection(success);
    store.createReflection();

    const persisted = JSON.parse(
      localStorage.getItem("palm-reading-storage") ?? "{}",
    );

    expect(persisted.state).toEqual({ disclaimerAccepted: true });
  });
});
