import fs from "node:fs";
import { fileURLToPath } from "node:url";
import createJiti from "jiti";

const loadTypeScript = createJiti(import.meta.url);
const { PUBLIC_PATHS } = loadTypeScript("../src/config/public-routes.ts");
const { SUPPORTED_LOCALES, buildLocalizedPath } = loadTypeScript("../src/i18n/locales.ts");

// Accept-Language prefixes mapped the way normalizeLocale() in
// src/i18n/locales.ts maps them, ordered most specific first because Vercel
// stops at the first matching redirect. Without this, "/" was the only public
// path with no edge redirect: it served the SPA shell as a self-canonical
// zh-TW duplicate of /zh-TW/ while all eight locales pointed x-default at it,
// so Google picked "/" as the canonical over the sitemap's locale homepages.
const ROOT_LANGUAGE_RULES = [
  ["zh-Hant", "zh-TW"],
  ["zh-TW", "zh-TW"],
  ["zh-HK", "zh-TW"],
  ["zh-MO", "zh-TW"],
  ["zh-Hans", "zh-CN"],
  ["zh-CN", "zh-CN"],
  ["zh-SG", "zh-CN"],
  ["zh", "zh-TW"],
  ["ja", "ja"],
  ["ko", "ko"],
  ["es", "es"],
  ["pt", "pt-BR"],
  ["fr", "fr"],
  ["en", "en"],
];

// Header matching is case sensitive, so spell each letter as a class rather
// than relying on an inline flag the matcher may not support.
const caseInsensitive = (value) =>
  value.replace(/[a-z]/gi, (letter) => `[${letter.toLowerCase()}${letter.toUpperCase()}]`);

// Temporary, never permanent: the destination varies per request, and a 308
// would let browsers and shared caches pin every visitor to one locale.
const rootLocaleRedirects = [
  ...ROOT_LANGUAGE_RULES.map(([languageTag, locale]) => ({
    source: "/",
    has: [
      {
        type: "header",
        key: "accept-language",
        value: `^${caseInsensitive(languageTag)}.*`,
      },
    ],
    destination: buildLocalizedPath(locale, "/"),
    permanent: false,
  })),
  // No Accept-Language, or none we serve: same fallback resolveInitialLocale()
  // lands on in src/i18n/locale-detection.ts.
  { source: "/", destination: buildLocalizedPath("en", "/"), permanent: false },
];

const redirects = [
  {
    source: "/:path*",
    has: [{ type: "host", value: "handfortune.com" }],
    destination: "https://www.handfortune.com/:path*",
    permanent: true,
  },
  ...PUBLIC_PATHS.filter((path) => path !== "/").map((source) => ({
    source,
    destination: buildLocalizedPath("zh-TW", source),
    permanent: true,
  })),
  ...rootLocaleRedirects,
];

const rewrites = [
  ...SUPPORTED_LOCALES.flatMap((locale) =>
    PUBLIC_PATHS.map((publicPath) => ({
      source: buildLocalizedPath(locale, publicPath),
      destination:
        publicPath === "/"
          ? `/_prerender/${locale}/index.html`
          : `/_prerender/${locale}${publicPath}.html`,
    })),
  ),
  ...SUPPORTED_LOCALES.map((locale) => ({
    source: `/${locale}/:path*`,
    destination: `/api/localized-not-found?locale=${locale}`,
  })),
];

const config = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  redirects,
  rewrites,
  headers: [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
      ],
    },
    {
      source: "/ads.txt",
      headers: [
        { key: "Content-Type", value: "text/plain; charset=utf-8" },
        { key: "Cache-Control", value: "public, max-age=3600" },
      ],
    },
    {
      source: "/robots.txt",
      headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
    },
    {
      source: "/sitemap.xml",
      headers: [{ key: "Content-Type", value: "application/xml; charset=utf-8" }],
    },
  ],
};

const outputPath = fileURLToPath(new URL("../vercel.json", import.meta.url));
fs.writeFileSync(outputPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
