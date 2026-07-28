import { lazy, type ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isPublicPath, type GuidePath, type PublicPath } from "@/config/public-routes";
import {
  SUPPORTED_LOCALES,
  buildLocalizedPath,
  parseLocalizedPath,
  type Locale,
} from "@/i18n/locales";
import {
  fetchCountryCode,
  resolveInitialLocale,
} from "@/i18n/locale-detection";
import { useLanguageStore } from "@/store/language-store";
import {
  finishManualLocaleChange,
  getPendingManualLocale,
} from "./locale-routing";

const HomePage = lazy(() => import("@/pages/HomePage"));
const HowItWorksPage = lazy(() => import("@/pages/HowItWorksPage"));
const GuidePage = lazy(() => import("@/pages/GuidePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function setRobots(indexable: boolean) {
  const selector = 'meta[name="robots"]';
  const matches = Array.from(
    document.head.querySelectorAll<HTMLMetaElement>(selector),
  );
  const meta = matches.shift() ?? document.createElement("meta");
  meta.name = "robots";
  meta.content = indexable ? "index, follow" : "noindex, follow";
  if (!meta.isConnected) document.head.append(meta);
  matches.forEach((duplicate) => duplicate.remove());
}

function localePrefix(pathname: string): Locale | null {
  const firstSegment = pathname.split("/")[1];
  return (SUPPORTED_LOCALES as readonly string[]).includes(firstSegment)
    ? (firstSegment as Locale)
    : null;
}

function LocaleBoundary({
  locale,
  indexable,
  children,
}: {
  locale: Locale;
  indexable: boolean;
  children: ReactNode;
}) {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const synchronized = currentLanguage === locale;

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    const pendingManualLocale = getPendingManualLocale();
    if (pendingManualLocale === locale) {
      if (!synchronized) {
        useLanguageStore.getState().setLanguage(locale, true);
      }
      finishManualLocaleChange();
    } else if (pendingManualLocale === null && !synchronized) {
      useLanguageStore.getState().setLanguage(locale, false);
    }
  }, [indexable, locale, synchronized]);

  useEffect(() => {
    document.documentElement.lang = locale;
    setRobots(indexable);
  }, [indexable, locale, synchronized]);

  return synchronized ? children : null;
}

function PublicPage({ path }: { path: PublicPath }) {
  if (path === "/") return <HomePage />;
  if (path === "/how-it-works") return <HowItWorksPage />;
  if (path.startsWith("/guides/")) {
    return <GuidePage path={path as GuidePath} />;
  }
  if (path === "/about") return <AboutPage />;
  if (path === "/privacy") return <PrivacyPolicyPage />;
  return <TermsPage />;
}

function Gateway() {
  const preferredLanguage = useLanguageStore(
    (state) => state.preferredLanguage,
  );
  const [locale, setLocale] = useState<Locale | null>(null);

  useEffect(() => {
    let active = true;

    void resolveInitialLocale({
      explicitLocale: preferredLanguage,
      browserLanguages: navigator.languages,
      fetchCountry: fetchCountryCode,
    }).then((resolvedLocale) => {
      if (active) setLocale(resolvedLocale);
    });

    return () => {
      active = false;
    };
  }, [preferredLanguage]);

  if (!locale) return null;

  return <Navigate replace to={buildLocalizedPath(locale, "/")} />;
}

export default function LocaleRouter() {
  const { pathname } = useLocation();

  if (pathname === "/") return <Gateway />;

  if (isPublicPath(pathname)) {
    return (
      <Navigate
        replace
        to={buildLocalizedPath("zh-TW", pathname)}
      />
    );
  }

  const localized = parseLocalizedPath(pathname);
  if (localized) {
    return (
      <LocaleBoundary
        locale={localized.locale}
        indexable
      >
        <PublicPage path={localized.publicPath} />
      </LocaleBoundary>
    );
  }

  const supportedPrefix = localePrefix(pathname);
  const locale = supportedPrefix ?? "en";

  return (
    <LocaleBoundary locale={locale} indexable={false}>
      <NotFoundPage />
    </LocaleBoundary>
  );
}
