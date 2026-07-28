import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  MessageCircleQuestion,
  MonitorCheck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import type { GuidePath } from "@/config/public-routes";
import { buildLocalizedPath } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";

const guideLinks: Array<{
  path: GuidePath;
  titleKey: string;
  summaryKey: string;
}> = [
  {
    path: "/guides/palmistry-basics",
    titleKey: "guide.basics.title",
    summaryKey: "guide.basics.summary",
  },
  {
    path: "/guides/science-and-limitations",
    titleKey: "guide.science.title",
    summaryKey: "guide.science.summary",
  },
  {
    path: "/guides/hand-photo-guide",
    titleKey: "guide.photo.title",
    summaryKey: "guide.photo.summary",
  },
];

const features = [
  {
    icon: MonitorCheck,
    titleKey: "home.feature.browser.title",
    descriptionKey: "home.feature.browser.description",
  },
  {
    icon: MessageCircleQuestion,
    titleKey: "home.feature.reflection.title",
    descriptionKey: "home.feature.reflection.description",
  },
  {
    icon: ShieldCheck,
    titleKey: "home.feature.privacy.title",
    descriptionKey: "home.feature.privacy.description",
  },
];

const faqs = [
  { questionKey: "faq.detected.q", answerKey: "faq.detected.a" },
  { questionKey: "faq.scientific.q", answerKey: "faq.scientific.a" },
  { questionKey: "faq.upload.q", answerKey: "faq.upload.a" },
  { questionKey: "faq.decisions.q", answerKey: "faq.decisions.a" },
];

function HomePage() {
  const image = usePalmStore((state) => state.image);
  const detection = usePalmStore((state) => state.detection);
  const reflectionKey = usePalmStore((state) => state.reflectionKey);
  const disclaimerAccepted = usePalmStore(
    (state) => state.disclaimerAccepted,
  );
  const { currentLanguage, t } = useLanguageStore();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleReflectionClick = () => {
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
      return;
    }
    usePalmStore.getState().createReflection();
  };

  return (
    <div>
      <div className="container mx-auto space-y-12 px-4 py-10 md:py-14">
        <section className="mx-auto max-w-3xl space-y-5 text-center">
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="text-base leading-8 text-muted-foreground md:text-lg">
            {t("hero.description")}
          </p>
        </section>

        <section className="mx-auto max-w-4xl" aria-label={t("disclaimer.prompt")}>
          <Alert className="border-amber-300 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/20">
            <ShieldCheck className="h-5 w-5 text-amber-700 dark:text-amber-300" />
            <AlertDescription className="flex flex-col items-start justify-between gap-3 text-amber-950 sm:flex-row sm:items-center dark:text-amber-100">
              <span>{t("disclaimer.prompt")}</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowDisclaimer(true)}
              >
                {t("button.viewDisclaimer")}
              </Button>
            </AlertDescription>
          </Alert>
        </section>

        <section
          className="mx-auto max-w-4xl"
          aria-label={t("tool.uploadTitle")}
        >
          <Card className="overflow-hidden border-border/70 shadow-xl">
            <CardHeader>
              <CardTitle>
                <h2>
                  {image ? t("tool.previewTitle") : t("tool.uploadTitle")}
                </h2>
              </CardTitle>
              <CardDescription>
                {image
                  ? t("tool.previewDescription")
                  : t("tool.uploadDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!image && <ImageUploader />}

              {image && (
                <>
                  <HandPreview />

                  {detection && !reflectionKey && (
                    <Button type="button" onClick={handleReflectionClick}>
                      <MessageCircleQuestion
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                      {t("tool.choose")}
                    </Button>
                  )}

                  {reflectionKey && <ReflectionResult />}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => usePalmStore.getState().reset()}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    {t("tool.reset")}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <section
          className="grid gap-5 md:grid-cols-3"
          aria-label={t("home.productFacts")}
        >
          {features.map(({ icon: Icon, titleKey, descriptionKey }) => (
            <Card key={titleKey} className="h-full border-border/70">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">
                  <h3>{t(titleKey)}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">
                  {t(descriptionKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-bold md:text-3xl">
              {t("home.continue.title")}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {guideLinks.map((guide) => (
              <Link
                key={guide.path}
                to={buildLocalizedPath(currentLanguage, guide.path)}
                className="group rounded-xl border border-border/70 bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold group-hover:text-primary">
                  {t(guide.titleKey)}
                </h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {t(guide.summaryKey)}
                </p>
                <ArrowRight
                  className="mt-4 h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-2xl font-bold md:text-3xl">{t("faq.title")}</h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border/70 bg-card">
            {faqs.map((faq) => (
              <details key={faq.questionKey} className="group p-5">
                <summary className="font-semibold">{t(faq.questionKey)}</summary>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {t(faq.answerKey)}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>

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
