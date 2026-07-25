import { describe, expect, it } from "vitest";
import { REFLECTION_CARDS, selectReflectionKey } from "./reflection-engine";
import type { HandLandmark } from "./hand-detector";

const validLandmarks: HandLandmark[] = Array.from({ length: 21 }, (_, index) => ({
  x: 0.2 + index * 0.01,
  y: 0.8 - index * 0.015,
  z: -index * 0.001,
}));

describe("reflection engine", () => {
  it("returns the same card for the same geometry", () => {
    expect(selectReflectionKey(validLandmarks)).toBe(
      selectReflectionKey(structuredClone(validLandmarks)),
    );
  });

  it("requires exactly 21 finite normalized landmarks", () => {
    expect(() => selectReflectionKey(validLandmarks.slice(0, 20))).toThrow(
      "21 hand landmarks",
    );
    expect(() =>
      selectReflectionKey([
        { x: Number.NaN, y: 0, z: 0 },
        ...validLandmarks.slice(1),
      ]),
    ).toThrow("finite");
  });

  it("contains bilingual non-predictive entertainment copy", () => {
    const copy = JSON.stringify(REFLECTION_CARDS);
    expect(copy).toMatch(/非科學|non-scientific/i);
    expect(copy).not.toMatch(
      /confidence|準確率|健康運勢|財運預測|diagnos|predicts your|guaranteed/i,
    );
  });
});
