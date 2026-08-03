import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { HandLandmark } from "@/lib/hand-detector";
import LandmarkOverlay from "./LandmarkOverlay";

const landmarks: HandLandmark[] = Array.from({ length: 21 }, (_, index) => ({
  x: 0.05 + index * 0.04,
  y: 0.9 - index * 0.035,
  z: 0,
}));

describe("LandmarkOverlay", () => {
  it("plots all 21 normalized points and the fixed hand connections", () => {
    render(<LandmarkOverlay image="data:image/png;base64,hand" alt="Selected hand" landmarks={landmarks} overlayLabel="Detected 21-point hand skeleton" />);

    expect(screen.getByRole("img", { name: "Selected hand" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Detected 21-point hand skeleton" })).toHaveAttribute("viewBox", "0 0 100 100");
    expect(screen.getAllByTestId("detected-landmark")).toHaveLength(21);
    expect(screen.getAllByTestId("detected-connection")).toHaveLength(21);
  });
});
