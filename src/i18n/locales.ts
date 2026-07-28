import { isPublicPath, type PublicPath } from "../config/public-routes";

export const SUPPORTED_LOCALES = [
  "zh-TW",
  "zh-CN",
  "en",
  "ja",
  "ko",
  "es",
  "pt-BR",
  "fr",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

const localeByLowercaseCode: Record<string, Locale> = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale.toLowerCase(), locale]),
) as Record<string, Locale>;

const countryLocales: Record<string, Locale> = {
  TW: "zh-TW",
  HK: "zh-TW",
  MO: "zh-TW",
  CN: "zh-CN",
  SG: "zh-CN",
  JP: "ja",
  KR: "ko",
  BR: "pt-BR",
  AR: "es",
  BO: "es",
  CL: "es",
  CO: "es",
  CR: "es",
  CU: "es",
  DO: "es",
  EC: "es",
  SV: "es",
  GQ: "es",
  GT: "es",
  HN: "es",
  MX: "es",
  NI: "es",
  PA: "es",
  PY: "es",
  PE: "es",
  PR: "es",
  ES: "es",
  UY: "es",
  VE: "es",
  BE: "fr",
  BJ: "fr",
  BF: "fr",
  BI: "fr",
  CM: "fr",
  CA: "fr",
  CF: "fr",
  TD: "fr",
  KM: "fr",
  CD: "fr",
  CG: "fr",
  CI: "fr",
  DJ: "fr",
  FR: "fr",
  GA: "fr",
  GN: "fr",
  LU: "fr",
  MG: "fr",
  ML: "fr",
  MC: "fr",
  NE: "fr",
  RW: "fr",
  SN: "fr",
  CH: "fr",
  TG: "fr",
};

export function normalizeLocale(value: string): Locale | null {
  const normalized = value.trim().toLowerCase();
  const exactLocale = localeByLowercaseCode[normalized];

  if (exactLocale) return exactLocale;
  if (normalized === "zh" || normalized.startsWith("zh-hant")) return "zh-TW";
  if (normalized.startsWith("zh-hans")) return "zh-CN";
  if (normalized === "ja" || normalized.startsWith("ja-")) return "ja";
  if (normalized === "ko" || normalized.startsWith("ko-")) return "ko";
  if (normalized === "es" || normalized.startsWith("es-")) return "es";
  if (normalized === "fr" || normalized.startsWith("fr-")) return "fr";
  if (normalized === "en" || normalized.startsWith("en-")) return "en";
  if (normalized === "pt" || normalized.startsWith("pt-")) return "pt-BR";

  return null;
}

export function localeFromBrowserLanguages(values: readonly string[]): Locale | null {
  for (const value of values) {
    const locale = normalizeLocale(value);
    if (locale) return locale;
  }

  return null;
}

export function localeFromCountry(country: string): Locale {
  return countryLocales[country.trim().toUpperCase()] ?? "en";
}

export function parseLocalizedPath(
  pathname: string,
): { locale: Locale; publicPath: PublicPath } | null {
  const match = /^\/([^/]+)(\/.*)$/.exec(pathname);
  if (!match) return null;

  const locale = (SUPPORTED_LOCALES as readonly string[]).includes(match[1])
    ? (match[1] as Locale)
    : null;
  const publicPath = match[2];
  if (!locale || !isPublicPath(publicPath)) return null;

  return { locale, publicPath };
}

export function buildLocalizedPath(locale: Locale, path: PublicPath): string {
  return `/${locale}${path === "/" ? "/" : path}`;
}
