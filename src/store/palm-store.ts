import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HandDetectionResult } from "@/lib/hand-detector";
import {
  selectReflectionKey,
  type ReflectionKey,
} from "@/lib/reflection-engine";

export interface PalmState {
  image: string | null;
  detection: Extract<HandDetectionResult, { status: "success" }> | null;
  reflectionKey: ReflectionKey | null;
  isDetecting: boolean;
  error: "no-hand" | "multiple-hands" | "detector-unavailable" | null;
  disclaimerAccepted: boolean;
  setImage: (image: string) => void;
  setDetection: (result: HandDetectionResult) => void;
  createReflection: () => void;
  setDetecting: (value: boolean) => void;
  setError: (error: PalmState["error"]) => void;
  reset: () => void;
  acceptDisclaimer: () => void;
}

export const usePalmStore = create<PalmState>()(
  persist(
    (set, get) => ({
      image: null,
      detection: null,
      reflectionKey: null,
      isDetecting: false,
      error: null,
      disclaimerAccepted: false,

      setImage: (image) => {
        set({
          image,
          detection: null,
          reflectionKey: null,
          isDetecting: false,
          error: null,
        });
      },

      setDetection: (result) => {
        if (result.status === "success") {
          set({
            detection: result,
            reflectionKey: null,
            isDetecting: false,
            error: null,
          });
          return;
        }

        set({
          detection: null,
          reflectionKey: null,
          isDetecting: false,
          error: result.status,
        });
      },

      createReflection: () => {
        const { detection } = get();
        if (!detection) {
          return;
        }

        set({ reflectionKey: selectReflectionKey(detection.landmarks) });
      },

      setDetecting: (isDetecting) => set({ isDetecting }),

      setError: (error) =>
        set({
          error,
          isDetecting: false,
          ...(error
            ? { detection: null, reflectionKey: null }
            : {}),
        }),

      reset: () => {
        set({
          image: null,
          detection: null,
          reflectionKey: null,
          isDetecting: false,
          error: null,
        });
      },

      acceptDisclaimer: () => set({ disclaimerAccepted: true }),
    }),
    {
      name: "palm-reading-storage",
      partialize: (state) => ({
        disclaimerAccepted: state.disclaimerAccepted,
      }),
    },
  ),
);
