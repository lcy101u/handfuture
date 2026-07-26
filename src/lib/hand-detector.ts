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

export interface HandDetectorOptions {
  signal?: AbortSignal;
  initializationTimeoutMs?: number;
  resultTimeoutMs?: number;
}

const DEFAULT_INITIALIZATION_TIMEOUT_MS = 20_000;
const DEFAULT_RESULT_TIMEOUT_MS = 10_000;

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

  const normalized: HandLandmark[] = [];

  for (let index = 0; index < 21; index += 1) {
    const landmark = landmarks[index];

    if (
      !landmark ||
      !Number.isFinite(landmark.x) ||
      !Number.isFinite(landmark.y) ||
      !Number.isFinite(landmark.z)
    ) {
      throw new Error("MediaPipe returned a hand with a non-finite landmark.");
    }

    normalized.push({ x: landmark.x, y: landmark.y, z: landmark.z });
  }

  return normalized;
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

function boundedInitialization(
  initialization: Promise<void>,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", cancel);
    };
    const succeed = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    const cancel = () =>
      fail(new Error("Hand detector initialization was cancelled."));
    const timeout = setTimeout(
      () => fail(new Error("Hand detector initialization timed out.")),
      timeoutMs,
    );

    if (signal?.aborted) {
      cancel();
      return;
    }

    signal?.addEventListener("abort", cancel, { once: true });
    initialization.then(succeed, fail);
  });
}

export async function createHandDetector(
  factory: HandsFactory = createDefaultHands,
  options: HandDetectorOptions = {},
): Promise<HandDetector> {
  if (options.signal?.aborted) {
    throw new Error("Hand detector initialization was cancelled.");
  }

  const hands = factory();
  let pending:
    | {
        resolve: (result: HandDetectionResult) => void;
        reject: (reason?: unknown) => void;
        timeout?: ReturnType<typeof setTimeout>;
      }
    | undefined;
  let closed = false;
  let closePromise: Promise<void> | undefined;
  let lifecycleAbortListener: (() => void) | undefined;
  const initializationTimeoutMs =
    options.initializationTimeoutMs ?? DEFAULT_INITIALIZATION_TIMEOUT_MS;
  const resultTimeoutMs = options.resultTimeoutMs ?? DEFAULT_RESULT_TIMEOUT_MS;

  const clearPending = (request: NonNullable<typeof pending>) => {
    if (pending !== request) return false;

    pending = undefined;
    if (request.timeout !== undefined) {
      clearTimeout(request.timeout);
    }
    return true;
  };

  const close = () => {
    if (!closePromise) {
      closed = true;

      if (lifecycleAbortListener) {
        options.signal?.removeEventListener("abort", lifecycleAbortListener);
        lifecycleAbortListener = undefined;
      }

      if (pending) {
        const request = pending;
        clearPending(request);
        request.reject(
          new Error("The hand detector was closed before detection completed."),
        );
      }

      try {
        closePromise = Promise.resolve(hands.close());
      } catch (error) {
        closePromise = Promise.reject(error);
      }
    }

    return closePromise;
  };

  try {
    const initialization = hands.initialize();
    await boundedInitialization(
      initialization,
      initializationTimeoutMs,
      options.signal,
    );
  } catch (error) {
    void close().catch(() => undefined);
    throw error;
  }

  if (options.signal?.aborted) {
    const error = new Error("Hand detector initialization was cancelled.");
    void close().catch(() => undefined);
    throw error;
  }

  lifecycleAbortListener = () => {
    void close().catch(() => undefined);
  };
  options.signal?.addEventListener("abort", lifecycleAbortListener, {
    once: true,
  });

  hands.onResults((results) => {
    const request = pending;
    if (!request || !clearPending(request)) {
      return;
    }

    try {
      request.resolve(toResult(results));
    } catch (error) {
      request.reject(error);
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
        const request: NonNullable<typeof pending> = { resolve, reject };
        pending = request;
        request.timeout = setTimeout(() => {
          if (!clearPending(request)) return;

          reject(
            new Error("Hand detection timed out before MediaPipe returned a result."),
          );
          void close().catch(() => undefined);
        }, resultTimeoutMs);

        try {
          hands.send({ image }).catch((error: unknown) => {
            if (clearPending(request)) {
              reject(error);
            }
          });
        } catch (error) {
          if (clearPending(request)) {
            reject(error);
          }
        }
      });
    },

    close,
  };
}
