import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import SiteLayout from "@/components/layout/SiteLayout";
import RouteErrorBoundary from "@/components/routing/RouteErrorBoundary";
import RouteMeta from "@/components/seo/RouteMeta";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { useLanguageStore } from "@/store/language-store";

const HomePage = lazy(() => import("@/pages/HomePage"));
const HowItWorksPage = lazy(() => import("@/pages/HowItWorksPage"));
const GuidePage = lazy(() => import("@/pages/GuidePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function LoadingFallback() {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

  return (
    <div role="status" aria-live="polite" className="container mx-auto px-4 py-16 text-center">
      {currentLanguage === "zh" ? "正在載入頁面…" : "Loading page…"}
    </div>
  );
}

function App() {
  // Initialize theme on app startup
  useEffect(() => {
    // Prevent flash of unstyled content
    document.documentElement.classList.add('no-transition');
    
    // Remove the no-transition class after a brief delay
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <TooltipProvider>
      <BrowserRouter>
        <SiteLayout>
          <RouteErrorBoundary>
            <RouteMeta />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route
                  path="/guides/palmistry-basics"
                  element={<GuidePage path="/guides/palmistry-basics" />}
                />
                <Route
                  path="/guides/science-and-limitations"
                  element={<GuidePage path="/guides/science-and-limitations" />}
                />
                <Route
                  path="/guides/hand-photo-guide"
                  element={<GuidePage path="/guides/hand-photo-guide" />}
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </RouteErrorBoundary>
        </SiteLayout>
      </BrowserRouter>
      <Toaster />
      <Analytics />
    </TooltipProvider>
  );
}

export default App;
