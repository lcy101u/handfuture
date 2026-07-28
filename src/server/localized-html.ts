import { getTranslation } from "../i18n/catalogs.js";
import { buildLocalizedPath, type Locale } from "../i18n/locales.js";

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => htmlEscapes[character]);
}

export function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

export function serializeJsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(
    /[<>&\u2028\u2029]/g,
    (character) =>
      ({
        "<": "\\u003c",
        ">": "\\u003e",
        "&": "\\u0026",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029",
      })[character] ?? character,
  );
}

export function renderLocalizedNotFoundDocument(locale: Locale): string {
  const title = getTranslation(locale, "notFound.documentTitle");
  const message = getTranslation(locale, "notFound.message");
  const home = getTranslation(locale, "notFound.home");
  const homePath = buildLocalizedPath(locale, "/");

  return `<!doctype html>
<html lang="${escapeAttribute(locale)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, follow" />
  <title>${escapeHtml(title)}</title>
  <style>body{margin:0;background:#fffaf0;color:#172033;font-family:system-ui,sans-serif}main{min-height:70vh;display:grid;place-content:center;text-align:center;padding:2rem}h1{font-size:4rem;margin:0}p{font-size:1.125rem}a{color:#8a6400}</style>
</head>
<body>
  <main>
    <h1>404</h1>
    <p>${escapeHtml(message)}</p>
    <a href="${escapeAttribute(homePath)}">${escapeHtml(home)}</a>
  </main>
</body>
</html>
`;
}
