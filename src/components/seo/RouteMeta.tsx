import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isPublicPath } from "@/config/public-routes";
import { buildStructuredData, getRouteMetadata } from "@/config/site-metadata";
import { getTranslation } from "@/i18n/catalogs";
import { SUPPORTED_LOCALES, parseLocalizedPath, type Locale } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

const OPEN_GRAPH_LOCALES = {
  "zh-TW": "zh_TW",
  "zh-CN": "zh_CN",
  en: "en_US",
  ja: "ja_JP",
  ko: "ko_KR",
  es: "es_ES",
  "pt-BR": "pt_BR",
  fr: "fr_FR",
} satisfies Record<Locale, string>;

function exactLocalePrefix(pathname: string): Locale | null {
  const prefix = pathname.split("/")[1];
  return (SUPPORTED_LOCALES as readonly string[]).includes(prefix)
    ? (prefix as Locale)
    : null;
}

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  const matches = Array.from(
    document.head.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`),
  );
  const meta = matches.shift() ?? document.createElement("meta");
  meta.setAttribute(attribute, key);
  meta.content = content;
  if (!meta.isConnected) document.head.append(meta);
  matches.forEach((duplicate) => duplicate.remove());
}

function upsertLink(rel: string, href: string) {
  const matches = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>(`link[rel="${rel}"]`),
  );
  const link = matches.shift() ?? document.createElement("link");
  link.rel = rel;
  link.href = href;
  if (!link.isConnected) document.head.append(link);
  matches.forEach((duplicate) => duplicate.remove());
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  const matches = Array.from(
    document.head.querySelectorAll<HTMLScriptElement>(`script#${id}`),
  );
  const script = matches.shift() ?? document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  if (!script.isConnected) document.head.append(script);
  matches.forEach((duplicate) => duplicate.remove());
}

export default function RouteMeta() {
  const { pathname } = useLocation();
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

  useEffect(() => {
    const localizedRoute = parseLocalizedPath(pathname);
    const publicPath =
      localizedRoute?.publicPath ?? (isPublicPath(pathname) ? pathname : null);
    const routeLocale =
      localizedRoute?.locale ?? exactLocalePrefix(pathname) ?? currentLanguage;
    document.documentElement.lang = routeLocale;

    if (!publicPath) {
      document.title = getTranslation(routeLocale, "notFound.documentTitle");
      upsertMeta("name", "robots", "noindex, follow");
      document.querySelectorAll("#route-structured-data").forEach((script) => script.remove());
      return;
    }

    const meta = getRouteMetadata(publicPath, routeLocale);
    upsertMeta("name", "robots", "index, follow");
    document.title = meta.title;
    upsertMeta("name", "title", meta.title);
    upsertMeta("name", "description", meta.description);
    upsertMeta("property", "og:type", publicPath.startsWith("/guides/") ? "article" : "website");
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("property", "og:url", meta.ogUrl);
    upsertMeta("property", "og:image", meta.ogImage);
    upsertMeta("property", "og:image:alt", meta.ogImageAlt);
    upsertMeta("property", "og:locale", OPEN_GRAPH_LOCALES[routeLocale]);
    upsertMeta(
      "property",
      "og:locale:alternate",
      routeLocale === "en" ? "zh_TW" : "en_US",
    );
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
    upsertMeta("name", "twitter:image", meta.ogImage);
    upsertMeta("name", "twitter:image:alt", meta.ogImageAlt);
    upsertLink("canonical", meta.canonical);
    upsertJsonLd("route-structured-data", buildStructuredData(publicPath, routeLocale));
  }, [currentLanguage, pathname]);

  return null;
}
