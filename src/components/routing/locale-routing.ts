import { isPublicPath } from "@/config/public-routes";
import {
  buildLocalizedPath,
  parseLocalizedPath,
  type Locale,
} from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

let pendingManualLocale: Locale | null = null;

export function buildSamePageLocalePath(
  pathname: string,
  locale: Locale,
): string {
  const localized = parseLocalizedPath(pathname);
  if (localized) return buildLocalizedPath(locale, localized.publicPath);
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
