import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  createHandDetector,
  type HandDetector,
  type HandDetectorOptions,
} from "@/lib/hand-detector";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";

interface HandPreviewProps {
  detectorFactory?: (
    options?: Pick<HandDetectorOptions, "signal">,
  ) => Promise<HandDetector>;
}

const createDefaultDetector = (options?: Pick<HandDetectorOptions, "signal">) =>
  createHandDetector(undefined, options);

function decodeImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;

    const succeed = () => {
      if (!settled) {
        settled = true;
        resolve(image);
      }
    };
    const fail = () => {
      if (!settled) {
        settled = true;
        reject(new Error("The uploaded image could not be decoded."));
      }
    };

    image.onload = succeed;
    image.onerror = fail;
    image.src = source;

    if (typeof image.decode === "function") {
      image.decode().then(succeed, fail);
    }
  });
}

export default function HandPreview({
  detectorFactory = createDefaultDetector,
}: HandPreviewProps) {
  const image = usePalmStore((state) => state.image);
  const detection = usePalmStore((state) => state.detection);
  const isDetecting = usePalmStore((state) => state.isDetecting);
  const error = usePalmStore((state) => state.error);
  const setDetection = usePalmStore((state) => state.setDetection);
  const setDetecting = usePalmStore((state) => state.setDetecting);
  const setError = usePalmStore((state) => state.setError);
  const t = useLanguageStore((state) => state.t);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    if (!image) {
      return;
    }

    let active = true;
    let detector: HandDetector | null = null;
    const controller = new AbortController();

    const detect = async () => {
      setError(null);
      setDetecting(true);

      try {
        const decodedImage = await decodeImage(image);
        if (!active) return;

        const createdDetector = await detectorFactory({
          signal: controller.signal,
        });
        if (!active) {
          void createdDetector.close().catch(() => undefined);
          return;
        }

        detector = createdDetector;
        const result = await createdDetector.detect(decodedImage);
        if (!active) return;

        setDetection(result);
      } catch {
        if (active) {
          setError("detector-unavailable");
        }
      } finally {
        if (detector) {
          const completedDetector = detector;
          detector = null;
          void completedDetector.close().catch(() => undefined);
        }
      }
    };

    void detect();

    return () => {
      active = false;
      controller.abort();
      if (detector) {
        void detector.close().catch(() => undefined);
        detector = null;
      }
    };
  }, [
    detectorFactory,
    image,
    retryAttempt,
    setDetection,
    setDetecting,
    setError,
  ]);

  if (!image) return null;

  const errorMessage =
    error === "no-hand"
      ? t("detector.noHand")
      : error === "multiple-hands"
        ? t("detector.multipleHands")
        : error === "detector-unavailable"
          ? t("detector.unavailable")
          : null;

  return (
    <div className="space-y-4" aria-live="polite">
      {isDetecting && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>{t("detector.detecting")}</AlertDescription>
        </Alert>
      )}

      {!isDetecting && detection && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {t("detector.success")}
          </AlertDescription>
        </Alert>
      )}

      {!isDetecting && errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <p>{errorMessage}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRetryAttempt((attempt) => attempt + 1)}
            >
              {t("detector.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <img
        src={image}
        alt={t("detector.alt")}
        className="mx-auto max-h-[300px] w-full max-w-md rounded-lg border border-border object-contain shadow-lg"
      />
    </div>
  );
}
