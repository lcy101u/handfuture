import { PUBLIC_PATHS, type GuidePath, type PublicPath } from "../config/public-routes";
import {
  buildLocalizedPublicUrl,
  buildPublicGatewayUrl,
  buildStructuredData,
  getRouteMetadata,
  OPEN_GRAPH_LOCALES,
  SITE_NAME,
} from "../config/site-metadata";
import { GUIDE_CONTENT, HOW_IT_WORKS_CONTENT, type EditorialPage } from "../content/guides";
import { ABOUT_CONTENT, PRIVACY_CONTENT, TERMS_CONTENT } from "../content/policies";
import { getTranslation } from "../i18n/catalogs";
import { buildLocalizedPath, SUPPORTED_LOCALES, type Locale } from "../i18n/locales";
import { escapeAttribute, escapeHtml, serializeJsonForHtml } from "./localized-html";

const ROUTE_HEAD_START = "<!-- handfuture-route-head:start -->";
const ROUTE_HEAD_END = "<!-- handfuture-route-head:end -->";

const navigationLabels: Record<PublicPath, string> = {
  "/": "nav.home",
  "/how-it-works": "footer.howItWorks",
  "/guides/palmistry-basics": "guide.basics.title",
  "/guides/science-and-limitations": "guide.science.title",
  "/guides/hand-photo-guide": "guide.photo.title",
  "/about": "nav.about",
  "/privacy": "nav.privacy",
  "/terms": "nav.terms",
};

const homeFeatures = [
  ["home.feature.browser.title", "home.feature.browser.description"],
  ["home.feature.reflection.title", "home.feature.reflection.description"],
  ["home.feature.privacy.title", "home.feature.privacy.description"],
] as const;

const homeGuides = [
  ["/guides/palmistry-basics", "guide.basics.title", "guide.basics.summary"],
  ["/guides/science-and-limitations", "guide.science.title", "guide.science.summary"],
  ["/guides/hand-photo-guide", "guide.photo.title", "guide.photo.summary"],
] as const;

const homeFaqs = [
  ["faq.detected.q", "faq.detected.a"],
  ["faq.scientific.q", "faq.scientific.a"],
  ["faq.upload.q", "faq.upload.a"],
  ["faq.decisions.q", "faq.decisions.a"],
] as const;

function renderRouteHead(locale: Locale, publicPath: PublicPath): string {
  const metadata = getRouteMetadata(publicPath, locale);
  const alternateLinks = [
    ...SUPPORTED_LOCALES.map(
      (alternateLocale) =>
        `  <link rel="alternate" hreflang="${escapeAttribute(alternateLocale)}" href="${escapeAttribute(buildLocalizedPublicUrl(publicPath, alternateLocale))}" />`,
    ),
    `  <link rel="alternate" hreflang="x-default" href="${escapeAttribute(buildPublicGatewayUrl())}" />`,
  ].join("\n");
  const alternateOpenGraphLocales = SUPPORTED_LOCALES.filter(
    (alternateLocale) => alternateLocale !== locale,
  )
    .map(
      (alternateLocale) =>
        `  <meta property="og:locale:alternate" content="${escapeAttribute(OPEN_GRAPH_LOCALES[alternateLocale])}" />`,
    )
    .join("\n");

  return `  <title>${escapeHtml(metadata.title)}</title>
  <meta name="title" content="${escapeAttribute(metadata.title)}" />
  <meta name="description" content="${escapeAttribute(metadata.description)}" />
  <link rel="canonical" href="${escapeAttribute(metadata.canonical)}" />
${alternateLinks}

  <meta property="og:type" content="${publicPath.startsWith("/guides/") ? "article" : "website"}" />
  <meta property="og:url" content="${escapeAttribute(metadata.ogUrl)}" />
  <meta property="og:title" content="${escapeAttribute(metadata.title)}" />
  <meta property="og:description" content="${escapeAttribute(metadata.description)}" />
  <meta property="og:image" content="${escapeAttribute(metadata.ogImage)}" />
  <meta property="og:image:alt" content="${escapeAttribute(metadata.ogImageAlt)}" />
  <meta property="og:locale" content="${escapeAttribute(OPEN_GRAPH_LOCALES[locale])}" />
${alternateOpenGraphLocales}
  <meta property="og:site_name" content="${SITE_NAME}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeAttribute(metadata.title)}" />
  <meta name="twitter:description" content="${escapeAttribute(metadata.description)}" />
  <meta name="twitter:image" content="${escapeAttribute(metadata.ogImage)}" />
  <meta name="twitter:image:alt" content="${escapeAttribute(metadata.ogImageAlt)}" />

  <script id="route-structured-data" type="application/ld+json">${serializeJsonForHtml(buildStructuredData(publicPath, locale))}</script>`;
}

function renderSiteNavigation(locale: Locale): string {
  return PUBLIC_PATHS.map(
    (publicPath) =>
      `<a href="${escapeAttribute(buildLocalizedPath(locale, publicPath))}">${escapeHtml(getTranslation(locale, navigationLabels[publicPath]))}</a>`,
  ).join("\n        ");
}

function renderHome(locale: Locale): string {
  const features = homeFeatures
    .map(
      ([titleKey, descriptionKey]) => `<article>
        <h2>${escapeHtml(getTranslation(locale, titleKey))}</h2>
        <p>${escapeHtml(getTranslation(locale, descriptionKey))}</p>
      </article>`,
    )
    .join("\n");
  const guides = homeGuides
    .map(
      ([publicPath, titleKey, summaryKey]) => `<article>
        <h3><a href="${escapeAttribute(buildLocalizedPath(locale, publicPath))}">${escapeHtml(getTranslation(locale, titleKey))}</a></h3>
        <p>${escapeHtml(getTranslation(locale, summaryKey))}</p>
      </article>`,
    )
    .join("\n");
  const faqs = homeFaqs
    .map(
      ([questionKey, answerKey]) => `<details>
        <summary>${escapeHtml(getTranslation(locale, questionKey))}</summary>
        <p>${escapeHtml(getTranslation(locale, answerKey))}</p>
      </details>`,
    )
    .join("\n");

  return `<section>
      <h1>${escapeHtml(getTranslation(locale, "hero.title"))}</h1>
      <p>${escapeHtml(getTranslation(locale, "hero.description"))}</p>
    </section>
    <section aria-label="${escapeAttribute(getTranslation(locale, "home.productFacts"))}">
${features}
    </section>
    <section>
      <h2>${escapeHtml(getTranslation(locale, "home.continue.title"))}</h2>
${guides}
    </section>
    <section>
      <h2>${escapeHtml(getTranslation(locale, "faq.title"))}</h2>
${faqs}
    </section>`;
}

function editorialContent(publicPath: Exclude<PublicPath, "/">, locale: Locale): EditorialPage {
  if (publicPath === "/how-it-works") return HOW_IT_WORKS_CONTENT[locale];
  if (publicPath.startsWith("/guides/")) {
    return GUIDE_CONTENT[publicPath as GuidePath][locale];
  }
  if (publicPath === "/about") return ABOUT_CONTENT[locale];
  if (publicPath === "/privacy") return PRIVACY_CONTENT[locale];
  return TERMS_CONTENT[locale];
}

function editorialEyebrow(publicPath: Exclude<PublicPath, "/">, locale: Locale): string {
  if (publicPath === "/about") return getTranslation(locale, "editorial.eyebrow.about");
  if (publicPath === "/privacy") return getTranslation(locale, "editorial.eyebrow.privacy");
  if (publicPath === "/terms") return getTranslation(locale, "editorial.eyebrow.terms");
  return getTranslation(locale, "editorial.eyebrow.guide");
}

function renderEditorial(publicPath: Exclude<PublicPath, "/">, locale: Locale): string {
  const content = editorialContent(publicPath, locale);
  const sections = content.sections
    .map((section) => {
      const paragraphs = section.paragraphs
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join("\n");
      const bullets = section.bullets
        ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>`
        : "";
      return `<section>
        <h2>${escapeHtml(section.heading)}</h2>
        ${paragraphs}
        ${bullets}
      </section>`;
    })
    .join("\n");
  const sources = content.sources.length
    ? `<section>
      <h2>${escapeHtml(getTranslation(locale, "editorial.sources"))}</h2>
      <ul>${content.sources
        .map((source) => {
          const href = source.url.startsWith("/")
            ? buildLocalizedPath(locale, source.url as PublicPath)
            : source.url;
          return `<li><a href="${escapeAttribute(href)}">${escapeHtml(source.label)}</a></li>`;
        })
        .join("")}</ul>
    </section>`
    : "";

  return `<article>
    <header>
      <p>${escapeHtml(editorialEyebrow(publicPath, locale))}</p>
      <h1>${escapeHtml(content.title)}</h1>
      <p>${escapeHtml(content.summary)}</p>
      <p>${escapeHtml(getTranslation(locale, "editorial.publisher"))}: HandFuture · ${escapeHtml(getTranslation(locale, "editorial.updated"))}: <time datetime="${escapeAttribute(content.updatedAt)}">${escapeHtml(content.updatedAt)}</time></p>
    </header>
    ${sections}
    ${sources}
  </article>`;
}

function renderRouteBody(locale: Locale, publicPath: PublicPath): string {
  const content = publicPath === "/" ? renderHome(locale) : renderEditorial(publicPath, locale);
  const navigation = renderSiteNavigation(locale);

  return `<div data-prerendered="true" data-locale="${escapeAttribute(locale)}">
  <header>
    <a href="${escapeAttribute(buildLocalizedPath(locale, "/"))}"><strong>${escapeHtml(getTranslation(locale, "app.title"))}</strong></a>
    <p>${escapeHtml(getTranslation(locale, "app.subtitle"))}</p>
    <nav aria-label="${escapeAttribute(getTranslation(locale, "nav.primaryAria"))}">
        ${navigation}
    </nav>
  </header>
  <main id="prerendered-content" data-public-path="${escapeAttribute(publicPath)}">
    ${content}
  </main>
  <footer>
    <p>${escapeHtml(getTranslation(locale, "footer.tagline"))}</p>
    <nav aria-label="${escapeAttribute(getTranslation(locale, "nav.footerAria"))}">
        ${navigation}
    </nav>
  </footer>
</div>`;
}

export function prerenderRelativeFile(locale: Locale, publicPath: PublicPath): string {
  return publicPath === "/" ? `${locale}/index.html` : `${locale}${publicPath}.html`;
}

export function renderPrerenderedDocument(
  template: string,
  locale: Locale,
  publicPath: PublicPath,
): string {
  const headStart = template.indexOf(ROUTE_HEAD_START);
  const headEnd = template.indexOf(ROUTE_HEAD_END);
  if (headStart === -1 || headEnd === -1 || headEnd <= headStart) {
    throw new Error("Built HTML is missing the route-head markers.");
  }
  if (!template.includes('<div id="root"></div>')) {
    throw new Error("Built HTML is missing the empty React root.");
  }

  const afterHeadEnd = headEnd + ROUTE_HEAD_END.length;
  return `${template.slice(0, headStart)}${ROUTE_HEAD_START}\n${renderRouteHead(locale, publicPath)}\n  ${ROUTE_HEAD_END}${template.slice(afterHeadEnd)}`
    .replace(/<html lang="[^"]*">/, `<html lang="${escapeAttribute(locale)}">`)
    .replace('<div id="root"></div>', `<div id="root">${renderRouteBody(locale, publicPath)}</div>`);
}
