import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const BatchPage = lazy(() => import("@/pages/BatchPage").then(module => ({ default: module.BatchPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

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
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/batch" element={<BatchPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
      <Analytics />
    </TooltipProvider>
  );
}

export default App;
