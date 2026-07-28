import { BrowserRouter } from "react-router-dom";
import { Suspense, useEffect } from "react";
import SiteLayout from "@/components/layout/SiteLayout";
import LocaleRouter from "@/components/routing/LocaleRouter";
import RouteErrorBoundary from "@/components/routing/RouteErrorBoundary";
import RouteMeta from "@/components/seo/RouteMeta";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { useLanguageStore } from "@/store/language-store";

function LoadingFallback() {
  const t = useLanguageStore((state) => state.t);

  return (
    <div role="status" aria-live="polite" className="container mx-auto px-4 py-16 text-center">
      {t("route.loading")}
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
              <LocaleRouter />
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
