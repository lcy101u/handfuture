import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isPublicPath } from "@/config/public-routes";
import { buildStructuredData, getRouteMetadata } from "@/config/site-metadata";
import { useLanguageStore } from "@/store/language-store";

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
    if (!isPublicPath(pathname)) {
      document.title =
        currentLanguage === "zh"
          ? "找不到頁面｜HandFuture"
          : "Page not found | HandFuture";
      upsertMeta("name", "robots", "noindex, follow");
      document.querySelectorAll("#route-structured-data").forEach((script) => script.remove());
      return;
    }

    const meta = getRouteMetadata(pathname, currentLanguage);
    const htmlLanguage = currentLanguage === "zh" ? "zh-TW" : "en";
    upsertMeta("name", "robots", "index, follow");
    document.documentElement.lang = htmlLanguage;
    document.title = meta.title;
    upsertMeta("name", "title", meta.title);
    upsertMeta("name", "description", meta.description);
    upsertMeta("property", "og:type", pathname.startsWith("/guides/") ? "article" : "website");
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("property", "og:url", meta.ogUrl);
    upsertMeta("property", "og:image", meta.ogImage);
    upsertMeta("property", "og:image:alt", meta.ogImageAlt);
    upsertMeta("property", "og:locale", currentLanguage === "zh" ? "zh_TW" : "en_US");
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
    upsertMeta("name", "twitter:image", meta.ogImage);
    upsertMeta("name", "twitter:image:alt", meta.ogImageAlt);
    upsertLink("canonical", meta.canonical);
    upsertJsonLd("route-structured-data", buildStructuredData(pathname, currentLanguage));
  }, [currentLanguage, pathname]);

  return null;
}
