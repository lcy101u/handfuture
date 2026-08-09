import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createJiti from "jiti";

const loadTypeScript = createJiti(import.meta.url);
const { SUPPORTED_LOCALES, buildLocalizedPath } = loadTypeScript(
  "../src/i18n/locales.ts",
);
const { INDEXABLE_CONTENT_PATHS } = loadTypeScript("../src/config/public-routes.ts");
const { SITE_ORIGIN } = loadTypeScript("../src/config/site-metadata.ts");
const { GUIDE_CONTENT, HOW_IT_WORKS_CONTENT } = loadTypeScript("../src/content/guides.ts");
const { ABOUT_CONTENT } = loadTypeScript("../src/content/policies.ts");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
}

function newestGuideDate(locale) {
  // ISO dates sort lexicographically, so plain string comparison is enough.
  return Object.values(GUIDE_CONTENT)
    .map((guide) => guide[locale].updatedAt)
    .reduce((newest, date) => (date > newest ? date : newest));
}

// Each page reports the date its own content was last edited, taken from the
// updatedAt already shown to readers, rather than a single site-wide constant
// somebody has to remember to bump. A lastmod that moves on deploys which did
// not touch content is inaccurate, and Google's response to inaccurate lastmod
// is to ignore the field everywhere on the site.
export function lastModifiedFor(publicPath, locale) {
  if (publicPath === "/how-it-works") return HOW_IT_WORKS_CONTENT[locale].updatedAt;
  if (publicPath === "/about") return ABOUT_CONTENT[locale].updatedAt;
  if (publicPath.startsWith("/guides/")) return GUIDE_CONTENT[publicPath][locale].updatedAt;
  // "/" and "/guides" own no prose of their own — both are indexes over the
  // guides, so they are exactly as fresh as the newest guide they list.
  return newestGuideDate(locale);
}

export function renderSitemap(entries) {
  const urls = entries.map(
    ({ location, lastModified }) => `  <url>
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
  const entries = SUPPORTED_LOCALES.flatMap((locale) =>
    INDEXABLE_CONTENT_PATHS.map((publicPath) => ({
      location: `${SITE_ORIGIN}${buildLocalizedPath(locale, publicPath)}`,
      lastModified: lastModifiedFor(publicPath, locale),
    })),
  );

  const locations = entries.map(({ location }) => location);
  if (new Set(locations).size !== locations.length) {
    throw new Error("Localized sitemap locations must be unique.");
  }

  const malformed = entries.filter(({ lastModified }) => !ISO_DATE.test(lastModified ?? ""));
  if (malformed.length > 0) {
    throw new Error(
      `Sitemap lastmod must be YYYY-MM-DD: ${malformed
        .map(({ location, lastModified }) => `${location} -> ${lastModified}`)
        .join(", ")}`,
    );
  }

  return renderSitemap(entries);
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
