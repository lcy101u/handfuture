import { Hands, type Options, type Results } from "@mediapipe/hands";

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export type Handedness = "Left" | "Right";

export type HandDetectionResult =
  | { status: "success"; landmarks: HandLandmark[]; handedness: Handedness }
  | { status: "no-hand" }
  | { status: "multiple-hands"; count: number };

export interface HandDetector {
  detect(image: HTMLImageElement | HTMLCanvasElement): Promise<HandDetectionResult>;
  close(): Promise<void>;
}

export interface HandsLike {
  onResults(listener: (results: Results) => Promise<void> | void): void;
  setOptions(options: Options): void;
  initialize(): Promise<void>;
  send(input: { image: HTMLImageElement | HTMLCanvasElement }): Promise<void>;
  close(): Promise<void>;
}

export type HandsFactory = () => HandsLike;

const createDefaultHands: HandsFactory = () => {
  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
  });

  hands.setOptions({
    selfieMode: false,
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.65,
    minTrackingConfidence: 0.65,
  });

  return hands;
};

const toHandedness = (label: string | undefined): Handedness => {
  if (label === "Left" || label === "Right") {
    return label;
  }

  throw new Error("MediaPipe returned an invalid handedness label.");
};

const toLandmarks = (landmarks: Results["multiHandLandmarks"][number]): HandLandmark[] => {
  if (landmarks.length !== 21) {
    throw new Error("MediaPipe returned a hand without exactly 21 landmarks.");
  }

  return landmarks.map(({ x, y, z }) => {
    if (![x, y, z].every(Number.isFinite)) {
      throw new Error("MediaPipe returned a hand with a non-finite landmark.");
    }

    return { x, y, z };
  });
};

const toResult = (results: Results): HandDetectionResult => {
  const count = results.multiHandLandmarks.length;

  if (count === 0) {
    return { status: "no-hand" };
  }

  if (count > 1) {
    return { status: "multiple-hands", count };
  }

  return {
    status: "success",
    landmarks: toLandmarks(results.multiHandLandmarks[0]),
    handedness: toHandedness(results.multiHandedness[0]?.label),
  };
};

export async function createHandDetector(
  factory: HandsFactory = createDefaultHands,
): Promise<HandDetector> {
  const hands = factory();
  await hands.initialize();

  let pending:
    | {
        resolve: (result: HandDetectionResult) => void;
        reject: (reason?: unknown) => void;
      }
    | undefined;
  let closed = false;
  let closePromise: Promise<void> | undefined;

  hands.onResults((results) => {
    const request = pending;
    if (!request) {
      return;
    }

    try {
      request.resolve(toResult(results));
    } catch (error) {
      request.reject(error);
    } finally {
      if (pending === request) {
        pending = undefined;
      }
    }
  });

  return {
    detect(image) {
      if (closed) {
        return Promise.reject(new Error("The hand detector is closed."));
      }

      if (pending) {
        return Promise.reject(new Error("A hand detection request is already pending."));
      }

      return new Promise<HandDetectionResult>((resolve, reject) => {
        const request = { resolve, reject };
        pending = request;

        try {
          hands.send({ image }).catch((error: unknown) => {
            if (pending === request) {
              pending = undefined;
              reject(error);
            }
          });
        } catch (error) {
          pending = undefined;
          reject(error);
        }
      });
    },

    close() {
      if (!closePromise) {
        closed = true;

        if (pending) {
          pending.reject(new Error("The hand detector was closed before detection completed."));
          pending = undefined;
        }

        closePromise = hands.close();
      }

      return closePromise;
    },
  };
}
