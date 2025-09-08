import { useState, useEffect } from "react";
import {
  Hand,
  Upload,
  Camera,
  AlertTriangle,
  Sparkles,
  Star,
  Heart,
  Brain,
  Briefcase,
  Zap,
  Share2,
  Grid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import ImageUploader from "@/components/palm/ImageUploader";
import HandPreview from "@/components/palm/HandPreview";
import PalmAnalysis from "@/components/palm/PalmAnalysis";
import DisclaimerModal from "@/components/palm/DisclaimerModal";
import SocialShare from "@/components/social/SocialShare";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import FeedbackSection from "@/components/feedback/FeedbackSection";
import FeedbackModal from "@/components/feedback/FeedbackModal";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { usePalmStore } from "@/store/palm-store";
import { useAnalyticsStore } from "@/store/analytics-store";
import { useLanguageStore } from "@/store/language-store";
import { useOnboardingStore } from "@/store/onboarding-store";

function HomePage() {
  const { image, landmarks, analysis, disclaimerAccepted, isAnalyzing } =
    usePalmStore();

  const { initSession, endSession, trackEvent, trackAnalysis, trackPageView } =
    useAnalyticsStore();
  const { t, currentLanguage } = useLanguageStore();
  const {
    hasCompletedOnboarding,
    showWelcome,
    showWelcomeModal,
    hideWelcomeModal,
  } = useOnboardingStore();
  const [showDisclaimer, setShowDisclaimer] = useState(!disclaimerAccepted);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [languageTransition, setLanguageTransition] = useState(false);

  // Initialize analytics session
  useEffect(() => {
    initSession();
    trackPageView("/");

    // Show welcome modal for first-time users
    if (!hasCompletedOnboarding) {
      const timer = setTimeout(() => {
        showWelcomeModal();
      }, 1500); // Show after 1.5 seconds to let the page load
      return () => clearTimeout(timer);
    }

    // Cleanup on unmount
    return () => {
      endSession();
    };
  }, [
    initSession,
    endSession,
    trackPageView,
    hasCompletedOnboarding,
    showWelcomeModal,
  ]);

  // Language transition animation with content flash prevention
  useEffect(() => {
    setLanguageTransition(true);

    // Add body class for global transition
    document.body.classList.add("language-switching");

    const midTransition = setTimeout(() => {
      // Update any dynamic content here if needed
      document.body.classList.remove("language-switching");
      document.body.classList.add("language-switched");
    }, 150);

    const endTransition = setTimeout(() => {
      setLanguageTransition(false);
      document.body.classList.remove("language-switched");
    }, 300);

    return () => {
      clearTimeout(midTransition);
      clearTimeout(endTransition);
      document.body.classList.remove("language-switching", "language-switched");
    };
  }, [currentLanguage]);

  // Track analysis completion
  useEffect(() => {
    if (analysis) {
      trackAnalysis();
      trackEvent("analysis_completed", {
        topics: analysis.interpretation.map((i) => i.topic),
        avgConfidence:
          analysis.interpretation.reduce((sum, i) => sum + i.confidence, 0) /
          analysis.interpretation.length,
        qualityWarnings: analysis.qualityWarnings.length,
      });
    }
  }, [analysis, trackAnalysis, trackEvent]);

  // Dynamic meta tags update based on analysis results
  useEffect(() => {
    if (analysis && analysis.interpretation.length > 0) {
      const topInterpretation = analysis.interpretation[0];
      const confidence = Math.round(topInterpretation.confidence * 100);
      const title = `我的AI手相分析結果 - 準確度${confidence}% | 免費掌相解讀`;
      const description = `手相分析完成！${
        topInterpretation.topic
      }運勢: ${topInterpretation.text.slice(0, 80)}... 立即查看完整解讀結果。`;

      document.title = title;

      // Update Open Graph tags
      const ogTitle = document.querySelector(
        'meta[property="og:title"]'
      ) as HTMLMetaElement;
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      ) as HTMLMetaElement;
      const twitterTitle = document.querySelector(
        'meta[property="twitter:title"]'
      ) as HTMLMetaElement;
      const twitterDescription = document.querySelector(
        'meta[property="twitter:description"]'
      ) as HTMLMetaElement;

      if (ogTitle) ogTitle.content = title;
      if (ogDescription) ogDescription.content = description;
      if (twitterTitle) twitterTitle.content = title;
      if (twitterDescription) twitterDescription.content = description;
    }
  }, [analysis]);

  // Show analytics dashboard if toggled
  if (showAnalytics) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border/50 bg-card/80">
          <div className="container mx-auto px-4 py-4">
            <Button
              onClick={() => setShowAnalytics(false)}
              variant="outline"
              size="sm"
            >
              ← {t("button.back")}
            </Button>
          </div>
        </div>
        <AnalyticsDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/20">
      {/* Header with proper SEO structure */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                const newCount = logoClickCount + 1;
                setLogoClickCount(newCount);
                if (newCount >= 5) {
                  setShowAnalytics(!showAnalytics);
                  setLogoClickCount(0);
                  trackEvent("analytics_dashboard_accessed");
                }
              }}
              data-onboarding="logo"
            >
              <div className="relative">
                <Hand className="w-8 h-8 text-primary" />
                <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t("app.title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("app.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  {t("header.badges.rating")}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {t("header.badges.users")}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div data-onboarding="theme-toggle">
                  <ThemeToggle />
                </div>
                <LanguageSwitcher />
              </div>
              <SocialShare className="hidden md:block" />
            </div>
          </div>
        </div>
      </header>

      <main
        className={`container mx-auto px-4 py-8 space-y-8 transition-all duration-300 ${
          languageTransition
            ? "opacity-70 translate-y-1"
            : "opacity-100 translate-y-0"
        }`}
      >
        {/* SEO-optimized introduction section */}
        <section
          className="text-center space-y-4 mb-8"
          aria-labelledby="main-heading"
        >
          <h2
            id="main-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {t("hero.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge
              variant="default"
              className="bg-primary/10 text-primary hover:bg-primary/20"
            >
              <Heart className="w-3 h-3 mr-1" />
              {t("analysis.topics.emotion")}
            </Badge>
            <Badge
              variant="default"
              className="bg-accent/10 text-accent hover:bg-accent/20"
            >
              <Briefcase className="w-3 h-3 mr-1" />
              {t("analysis.topics.career")}
            </Badge>
            <Badge
              variant="default"
              className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/30 dark:text-green-400"
            >
              <Brain className="w-3 h-3 mr-1" />
              {t("analysis.topics.intelligence")}
            </Badge>
            <Badge
              variant="default"
              className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950/30 dark:text-orange-400"
            >
              <Zap className="w-3 h-3 mr-1" />
              {t("analysis.topics.energy")}
            </Badge>
          </div>
        </section>

        {/* Disclaimer Alert - Important for SEO and user trust */}
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>{t("disclaimer.notice")}</strong>
            {t("footer.disclaimer")}
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        {!image ? (
          <div className="space-y-8">
            {/* Upload Section */}
            <section aria-labelledby="upload-section">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upload Card */}
                <Card className="palm-card mystical-glow md:col-span-2 lg:col-span-2">
                  <CardHeader>
                    <CardTitle
                      className="flex items-center gap-2"
                      id="upload-section"
                    >
                      <Upload className="w-5 h-5" />
                      {t("upload.title_with_action")}
                    </CardTitle>
                    <CardDescription
                      dangerouslySetInnerHTML={{
                        __html: t("upload.description"),
                      }}
                    />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div data-onboarding="image-uploader">
                      <ImageUploader />
                    </div>

                    {/* Batch Processing Option */}
                    <div className="pt-4 border-t border-muted">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">
                            {t("batch.title")}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {t("batch.subtitle")}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            trackEvent("batch_mode_clicked", {
                              language: currentLanguage,
                            });
                            window.open("/batch", "_blank");
                          }}
                          className="ml-3"
                          data-onboarding="batch-link"
                        >
                          <Grid className="w-4 h-4 mr-2" />
                          {t("batch.mode")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Instructions Card */}
                <Card className="palm-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      {t("instructions.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">
                          {t("instructions.item1.title")}
                        </h4>
                        <p
                          className="text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: t("instructions.item1.description"),
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">
                          {t("instructions.item2.title")}
                        </h4>
                        <p
                          className="text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: t("instructions.item2.description"),
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">
                          {t("instructions.item3.title")}
                        </h4>
                        <p
                          className="text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: t("instructions.item3.description"),
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">
                          {t("instructions.item4.title")}
                        </h4>
                        <p
                          className="text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: t("instructions.item4.description"),
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Palm Reading Knowledge Section */}
            <section aria-labelledby="knowledge-section">
              <Card className="palm-card">
                <CardHeader className="text-center">
                  <CardTitle id="knowledge-section" className="text-2xl">
                    {t("knowledge.title")}
                  </CardTitle>
                  <CardDescription
                    className="text-base"
                    dangerouslySetInnerHTML={{
                      __html: t("knowledge.description"),
                    }}
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <article className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="w-8 h-1 bg-primary rounded-full transform rotate-45" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {t("knowledge.lifeline.title")}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: t("knowledge.lifeline.description"),
                        }}
                      />
                    </article>
                    <article className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                        <div className="w-8 h-1 bg-accent rounded-full" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {t("knowledge.wisdomline.title")}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: t("knowledge.wisdomline.description"),
                        }}
                      />
                    </article>
                    <article className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                        <div className="w-8 h-1 bg-red-500 rounded-full" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {t("knowledge.loveline.title")}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: t("knowledge.loveline.description"),
                        }}
                      />
                    </article>
                    <article className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                        <div className="w-8 h-1 bg-green-500 rounded-full transform -rotate-12" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {t("knowledge.careerline.title")}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: t("knowledge.careerline.description"),
                        }}
                      />
                    </article>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Features Section */}
            <section
              aria-labelledby="features-section"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <h2 id="features-section" className="sr-only">
                {t("features.section_title")}
              </h2>

              <Card className="palm-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    {t("features.item1.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: t("features.item1.description"),
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="palm-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    {t("features.item2.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: t("features.item2.description"),
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="palm-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    {t("features.item3.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: t("features.item3.description"),
                    }}
                  />
                </CardContent>
              </Card>
            </section>

            {/* FAQ Section for SEO */}
            <section aria-labelledby="faq-section">
              <Card className="palm-card">
                <CardHeader>
                  <CardTitle id="faq-section" className="text-xl">
                    {t("faq.section_title")}
                  </CardTitle>
                  <CardDescription>
                    {t("faq.section_description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-2 text-sm font-medium rounded border">
                      <span>{t("faq.item1.question")}</span>
                      <span className="ml-auto transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div
                      className="mt-2 p-2 text-sm text-muted-foreground bg-muted/50 rounded"
                      dangerouslySetInnerHTML={{
                        __html: t("faq.item1.answer"),
                      }}
                    />
                  </details>

                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-2 text-sm font-medium rounded border">
                      <span>{t("faq.item2.question")}</span>
                      <span className="ml-auto transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div
                      className="mt-2 p-2 text-sm text-muted-foreground bg-muted/50 rounded"
                      dangerouslySetInnerHTML={{
                        __html: t("faq.item2.answer"),
                      }}
                    />
                  </details>

                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-2 text-sm font-medium rounded border">
                      <span>{t("faq.item3.question")}</span>
                      <span className="ml-auto transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div
                      className="mt-2 p-2 text-sm text-muted-foreground bg-muted/50 rounded"
                      dangerouslySetInnerHTML={{
                        __html: t("faq.item3.answer"),
                      }}
                    />
                  </details>
                </CardContent>
              </Card>
            </section>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Preview */}
            <Card className="palm-card">
              <CardHeader>
                <CardTitle>{t("analysis.card.title")}</CardTitle>
                <CardDescription>
                  {landmarks
                    ? t("analysis.card.description_landmarks")
                    : t("analysis.card.description_no_landmarks")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HandPreview />
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => usePalmStore.getState().reset()}
                  >
                    {t("analysis.card.button_reset")}
                  </Button>
                  {landmarks && !analysis && (
                    <Button
                      size="sm"
                      onClick={() => usePalmStore.getState().analyzeFeatures()}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing
                        ? t("analysis.card.button_analyzing")
                        : t("analysis.card.button_start")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <div className="space-y-6">
              {analysis ? (
                <>
                  <div data-onboarding="analysis-section">
                    <PalmAnalysis />
                  </div>

                  {/* Social Sharing Component */}
                  <div data-onboarding="social-share">
                    <SocialShare
                      result={{
                        palmType: "綜合手相",
                        confidence:
                          analysis.interpretation.length > 0
                            ? analysis.interpretation[0].confidence
                            : 0.8,
                        interpretations: analysis.interpretation.map(
                          (interp) => ({
                            category: interp.topic,
                            description: interp.text,
                            confidence: interp.confidence,
                          })
                        ),
                      }}
                      className="mt-6"
                    />
                  </div>
                </>
              ) : (
                <Card className="palm-card">
                  <CardHeader>
                    <CardTitle>{t("analysis.wait.title")}</CardTitle>
                    <CardDescription>
                      {t("analysis.wait.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center space-y-2">
                        <Hand className="w-12 h-12 mx-auto opacity-50" />
                        <p>{t("analysis.wait.message")}</p>
                        <p className="text-xs">
                          {t("analysis.wait.submessage")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      {/* User Feedback Section */}
      <FeedbackSection />

      {/* Footer with internal links for SEO */}
      <footer className="border-t border-border/50 bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold mb-3">
                {t("footer.links.tools.title")}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.tools.item1")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.tools.item2")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.tools.item3")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.tools.item4")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">
                {t("footer.links.readings.title")}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.readings.item1")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.readings.item2")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.readings.item3")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.readings.item4")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">
                {t("footer.links.knowledge.title")}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.knowledge.item1")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.knowledge.item2")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.knowledge.item3")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.knowledge.item4")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">
                {t("footer.links.about.title")}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.about.item1")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.about.item2")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t("footer.links.about.item3")}
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:coralgroper398@dontsp.am"
                    className="hover:text-primary transition-colors"
                  >
                    {t("footer.links.about.item4")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("footer.copyright_full")}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t("footer.keywords")}
            </p>
          </div>
        </div>
      </footer>

      {/* Disclaimer Modal */}
      <DisclaimerModal
        open={showDisclaimer}
        onAccept={() => {
          usePalmStore.getState().acceptDisclaimer();
          setShowDisclaimer(false);
          trackEvent("disclaimer_accepted");
        }}
      />
      <FeedbackModal />

      {/* Onboarding Components */}
      <OnboardingOverlay />
      <WelcomeModal open={showWelcome} onOpenChange={hideWelcomeModal} />
    </div>
  );
}

export default HomePage;
