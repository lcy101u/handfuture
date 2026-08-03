import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { buildLocalizedPath, type Locale } from "@/i18n/locales";
import {
  createHandDetector,
  type HandDetector,
  type HandDetectorOptions,
} from "@/lib/hand-detector";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import LandmarkOverlay from "./LandmarkOverlay";

const educationCopy: Record<Locale, { overlay: string; explanation: string; atlas: string; limits: string }> = {
  "zh-TW": { overlay: "偵測到的 21 點手部關節骨架", explanation: "畫面上的點是關節座標估計，不是掌褶；它們不包含健康、性格或未來資訊。", atlas: "開啟 21 點互動圖譜", limits: "閱讀偵測限制" },
  "zh-CN": { overlay: "检测到的 21 点手部关节骨架", explanation: "画面上的点是关节坐标估计，不是掌褶；它们不包含健康、性格或未来信息。", atlas: "打开 21 点互动图谱", limits: "阅读检测局限" },
  en: { overlay: "Detected 21-point hand skeleton", explanation: "The points are coordinate estimates, not palm creases. They contain no health, personality, or future information.", atlas: "Open the 21-point atlas", limits: "Read detection limitations" },
  ja: { overlay: "検出された21点の手の骨格", explanation: "点は関節座標の推定で、掌線ではありません。健康、性格、未来の情報は含みません。", atlas: "21点図鑑を開く", limits: "検出の限界を読む" },
  ko: { overlay: "감지된 21점 손 뼈대", explanation: "점은 관절 좌표 추정치이며 손금 주름이 아닙니다. 건강, 성격이나 미래 정보가 없습니다.", atlas: "21점 지도 열기", limits: "감지 한계 읽기" },
  es: { overlay: "Esqueleto detectado de 21 puntos", explanation: "Los puntos son coordenadas estimadas, no pliegues. No contienen salud, personalidad ni futuro.", atlas: "Abrir el atlas de 21 puntos", limits: "Leer las limitaciones" },
  "pt-BR": { overlay: "Esqueleto detectado de 21 pontos", explanation: "Os pontos são coordenadas estimadas, não pregas. Não contêm saúde, personalidade nem futuro.", atlas: "Abrir o atlas de 21 pontos", limits: "Ler as limitações" },
  fr: { overlay: "Squelette détecté de 21 repères", explanation: "Les points sont des coordonnées estimées, pas des plis. Ils ne contiennent ni santé, personnalité ni avenir.", atlas: "Ouvrir l’atlas des 21 repères", limits: "Lire les limites" },
};

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
  const locale = useLanguageStore((state) => state.currentLanguage);
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

      {detection ? (
        <>
          <LandmarkOverlay image={image} alt={t("detector.alt")} landmarks={detection.landmarks} overlayLabel={educationCopy[locale].overlay} />
          <div className="mx-auto max-w-md space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm leading-6">
            <p>{educationCopy[locale].explanation}</p>
            <p className="flex flex-wrap gap-x-4 gap-y-2">
              <a className="font-medium text-primary underline-offset-4 hover:underline" href={buildLocalizedPath(locale, "/guides/hand-landmark-atlas")}>{educationCopy[locale].atlas}</a>
              <a className="font-medium text-primary underline-offset-4 hover:underline" href={buildLocalizedPath(locale, "/guides/science-and-limitations")}>{educationCopy[locale].limits}</a>
            </p>
          </div>
        </>
      ) : (
        <img src={image} alt={t("detector.alt")} className="mx-auto max-h-[300px] w-full max-w-md rounded-lg border border-border object-contain shadow-lg" />
      )}
    </div>
  );
}
