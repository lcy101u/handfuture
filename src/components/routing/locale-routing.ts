import { isPublicPath } from "@/config/public-routes";
import {
  SUPPORTED_LOCALES,
  buildLocalizedPath,
  type Locale,
} from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

let pendingManualLocale: Locale | null = null;

export function localizedPathForCurrentRoute(
  pathname: string,
  locale: Locale,
): string {
  const firstSegment = pathname.split("/")[1];
  if ((SUPPORTED_LOCALES as readonly string[]).includes(firstSegment)) {
    const suffix = pathname.slice(firstSegment.length + 1);
    return `/${locale}${suffix || "/"}`;
  }
  if (isPublicPath(pathname)) return buildLocalizedPath(locale, pathname);
  return buildLocalizedPath(locale, "/");
}

export function beginManualLocaleChange(locale: Locale) {
  pendingManualLocale = locale;
  useLanguageStore.getState().setLanguage(locale, true);
}

export function getPendingManualLocale(): Locale | null {
  return pendingManualLocale;
}

export function finishManualLocaleChange() {
  pendingManualLocale = null;
}
