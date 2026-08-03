import fs from "node:fs";
import { fileURLToPath } from "node:url";
import createJiti from "jiti";

const loadTypeScript = createJiti(import.meta.url);
const { PUBLIC_PATHS } = loadTypeScript("../src/config/public-routes.ts");
const { SUPPORTED_LOCALES, buildLocalizedPath } = loadTypeScript("../src/i18n/locales.ts");

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
