import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createJiti from "jiti";

const loadTypeScript = createJiti(import.meta.url);
const { SUPPORTED_LOCALES, buildLocalizedPath } = loadTypeScript(
  "../src/i18n/locales.ts",
);
const { PUBLIC_PATHS } = loadTypeScript("../src/config/public-routes.ts");
const { LAST_UPDATED, SITE_ORIGIN } = loadTypeScript(
  "../src/config/site-metadata.ts",
);

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
}

export function renderSitemap(locations, lastModified) {
  const urls = locations.map(
    (location) => `  <url>
    <loc>${escapeXml(location)}</loc>
    <lastmod>${escapeXml(lastModified)}</lastmod>
  </url>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

export function generateSitemap() {
  const locations = SUPPORTED_LOCALES.flatMap((locale) =>
    PUBLIC_PATHS.map((publicPath) => `${SITE_ORIGIN}${buildLocalizedPath(locale, publicPath)}`),
  );

  if (new Set(locations).size !== locations.length) {
    throw new Error("Localized sitemap locations must be unique.");
  }

  return renderSitemap(locations, LAST_UPDATED);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";

if (currentFile === invokedFile) {
  const outputPath = process.env.SITEMAP_OUTPUT
    ? path.resolve(process.env.SITEMAP_OUTPUT)
    : fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generateSitemap(), "utf8");
}
