import { Component, type ErrorInfo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Locale } from "@/config/public-routes";
import { useLanguageStore } from "@/store/language-store";

interface BoundaryProps {
  children: ReactNode;
  locale: Locale;
  resetKey: string;
}

interface BoundaryState {
  error: Error | null;
}

class RouteErrorBoundaryImpl extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("A public route failed to render", error, info);
  }

  componentDidUpdate(previousProps: BoundaryProps) {
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    const isChinese = this.props.locale === "zh";
    return (
      <section
        role="alert"
        aria-labelledby="route-error-title"
        className="container mx-auto flex min-h-[45vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 py-16 text-center"
      >
        <h1 id="route-error-title" className="text-3xl font-bold">
          {isChinese ? "頁面無法載入" : "The page could not load"}
        </h1>
        <p className="leading-7 text-muted-foreground">
          {isChinese
            ? "頁面元件載入時發生問題。請重新載入後再試一次。"
            : "A page component failed to load. Reload the page and try again."}
        </p>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => window.location.reload()}
        >
          {isChinese ? "重新載入" : "Reload page"}
        </button>
      </section>
    );
  }
}

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

export default function RouteErrorBoundary({ children }: RouteErrorBoundaryProps) {
  const locale = useLanguageStore((state) => state.currentLanguage);
  const location = useLocation();

  return (
    <RouteErrorBoundaryImpl locale={locale} resetKey={location.pathname}>
      {children}
    </RouteErrorBoundaryImpl>
  );
}
