import { useState } from "react";
import { Link } from "react-router-dom";
import { Hand, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DisclaimerModal from "@/components/palm/DisclaimerModal";
import HandPreview from "@/components/palm/HandPreview";
import ImageUploader from "@/components/palm/ImageUploader";
import ReflectionResult from "@/components/palm/ReflectionResult";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";

const copy = {
  zh: {
    title: "手部關節反思卡",
    subtitle: "在瀏覽器內偵測手部關節，選出一張固定的反思提示卡。",
    entertainment: "非科學娛樂與自我反思用途",
    explanation:
      "上傳一張清楚的單手照片。模型只取得 21 個手部關節座標，並依幾何位置固定選卡；照片不會由本功能上傳。",
    uploadTitle: "選擇手部照片",
    uploadDescription: "請使用單純背景，讓一隻手完整出現在畫面中。",
    previewTitle: "手部關節偵測",
    previewDescription: "偵測完成後，你可以主動選擇一張反思卡。",
    reset: "更換照片",
    resultTitle: "反思卡",
    waiting: "先完成一隻手的關節偵測。",
    choose: "選擇反思卡",
    detecting: "正在偵測關節…",
    disclaimer: "閱讀娛樂用途說明",
    privacy: "隱私政策",
    terms: "使用條款",
    about: "關於本工具",
  },
  en: {
    title: "Hand-joint reflections",
    subtitle:
      "Detect hand joints in your browser and select one stable reflection prompt.",
    entertainment: "Non-scientific entertainment and self-reflection",
    explanation:
      "Upload one clear photo containing a single hand. The model obtains only 21 joint coordinates and uses their geometry for a stable card choice. This feature does not upload the photo.",
    uploadTitle: "Choose a hand photo",
    uploadDescription:
      "Use a plain background and keep one full hand visible in the frame.",
    previewTitle: "Hand-joint detection",
    previewDescription:
      "After detection finishes, you can explicitly choose a reflection card.",
    reset: "Choose another photo",
    resultTitle: "Reflection card",
    waiting: "Complete joint detection for one hand first.",
    choose: "Choose reflection card",
    detecting: "Detecting joints…",
    disclaimer: "Read entertainment notice",
    privacy: "Privacy",
    terms: "Terms",
    about: "About this tool",
  },
} as const;

function HomePage() {
  const image = usePalmStore((state) => state.image);
  const detection = usePalmStore((state) => state.detection);
  const reflectionKey = usePalmStore((state) => state.reflectionKey);
  const isDetecting = usePalmStore((state) => state.isDetecting);
  const disclaimerAccepted = usePalmStore(
    (state) => state.disclaimerAccepted,
  );
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const text = copy[currentLanguage];

  const handleReflectionClick = () => {
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
      return;
    }
    usePalmStore.getState().createReflection();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex flex-wrap items-center gap-4 px-4 py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="relative" aria-hidden="true">
              <Hand className="h-8 w-8 text-primary" />
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-accent" />
            </span>
            <div>
              <h1 className="text-xl font-bold">{text.title}</h1>
              <p className="text-xs text-muted-foreground">
                {text.entertainment}
              </p>
            </div>
          </Link>

          <nav className="ml-auto flex items-center gap-4 text-sm">
            <Link to="/about" className="hover:text-primary">
              {text.about}
            </Link>
            <Link to="/privacy" className="hover:text-primary">
              {text.privacy}
            </Link>
            <Link to="/terms" className="hover:text-primary">
              {text.terms}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-10">
        <section className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{text.subtitle}</h2>
          <p className="leading-relaxed text-muted-foreground">
            {text.explanation}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDisclaimer(true)}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {text.disclaimer}
          </Button>
        </section>

        <section className="grid gap-8 lg:grid-cols-2" aria-label={text.uploadTitle}>
          <Card>
            <CardHeader>
              <CardTitle>{image ? text.previewTitle : text.uploadTitle}</CardTitle>
              <CardDescription>
                {image ? text.previewDescription : text.uploadDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {image ? (
                <div className="space-y-4">
                  <HandPreview />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => usePalmStore.getState().reset()}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    {text.reset}
                  </Button>
                </div>
              ) : (
                <ImageUploader />
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {reflectionKey ? (
              <ReflectionResult />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{text.resultTitle}</CardTitle>
                  <CardDescription>{text.waiting}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    type="button"
                    onClick={handleReflectionClick}
                    disabled={!detection || isDetecting}
                  >
                    {isDetecting ? text.detecting : text.choose}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-sm text-muted-foreground">
        {text.entertainment}
      </footer>

      <DisclaimerModal
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAccept={() => {
          usePalmStore.getState().acceptDisclaimer();
          setShowDisclaimer(false);
        }}
      />
    </div>
  );
}

export default HomePage;
