import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Hand,
  MessageCircleQuestion,
  MonitorCheck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
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
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { GuidePath, PublicPath } from "@/config/public-routes";
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

const footerGroups: Array<{
  titleKey: string;
  links: Array<{ path: PublicPath; labelKey: string }>;
}> = [
  {
    titleKey: "footer.explore",
    links: [
      { path: "/", labelKey: "nav.home" },
      { path: "/how-it-works", labelKey: "footer.howItWorks" },
    ],
  },
  {
    titleKey: "footer.guides",
    links: [
      { path: "/guides/palmistry-basics", labelKey: "guide.basics.title" },
      {
        path: "/guides/science-and-limitations",
        labelKey: "guide.science.title",
      },
      { path: "/guides/hand-photo-guide", labelKey: "guide.photo.title" },
    ],
  },
  {
    titleKey: "footer.project",
    links: [
      { path: "/about", labelKey: "nav.about" },
      { path: "/privacy", labelKey: "nav.privacy" },
      { path: "/terms", labelKey: "nav.terms" },
    ],
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
  const { t } = useLanguageStore();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleReflectionClick = () => {
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
      return;
    }
    usePalmStore.getState().createReflection();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b border-white/10 bg-slate-950 text-white">
        <div className="container mx-auto flex flex-wrap items-center gap-5 px-4 py-5">
          <Link to="/" className="flex min-w-fit items-center gap-3">
            <span className="relative" aria-hidden="true">
              <Hand className="h-8 w-8 text-primary" />
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-accent" />
            </span>
            <div>
              <h1 className="text-xl font-bold">{t("app.title")}</h1>
              <p className="text-xs text-white/70">{t("app.subtitle")}</p>
            </div>
          </Link>

          <nav
            className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-3 text-sm"
            aria-label="Primary"
          >
            <Link to="/" className="hover:text-primary">
              {t("nav.home")}
            </Link>
            <Link to="/about" className="hover:text-primary">
              {t("nav.about")}
            </Link>
            <Link to="/privacy" className="hover:text-primary">
              {t("nav.privacy")}
            </Link>
            <Link to="/terms" className="hover:text-primary">
              {t("nav.terms")}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto space-y-12 px-4 py-10 md:py-14">
        <section className="mx-auto max-w-3xl space-y-5 text-center">
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">
            {t("hero.title")}
          </h2>
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

        <section className="grid gap-5 md:grid-cols-3" aria-label="Product facts">
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
                to={guide.path}
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
      </main>

      <footer className="border-t border-border/60 bg-card/70">
        <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-[1.25fr_2fr]">
          <div>
            <p className="text-lg font-bold">HandFuture</p>
            <p className="mt-2 text-sm text-muted-foreground">
              © {new Date().getFullYear()} HandFuture
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.titleKey}>
                <p className="text-sm font-semibold">{t(group.titleKey)}</p>
                <nav className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                  {group.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="hover:text-primary"
                    >
                      {t(link.labelKey)}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
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
