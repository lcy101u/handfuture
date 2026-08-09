import type { GuidePath, PublicPath } from "../config/public-routes";
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
import { BREADCRUMB_COPY } from "../i18n/breadcrumbs";
import { buildLocalizedPath, SUPPORTED_LOCALES, type Locale } from "../i18n/locales";
import { escapeAttribute, escapeHtml, serializeJsonForHtml } from "./localized-html";

const ROUTE_HEAD_START = "<!-- handfuture-route-head:start -->";
const ROUTE_HEAD_END = "<!-- handfuture-route-head:end -->";

const learnLabels: Record<Locale, string> = {
  "zh-TW": "學習中心", "zh-CN": "学习中心", en: "Learn", ja: "学ぶ", ko: "학습",
  es: "Aprender", "pt-BR": "Aprender", fr: "Apprendre",
};

const authorRoles: Record<Locale, string> = {
  "zh-TW": "HandFuture 獨立開發者與內容編輯",
  "zh-CN": "HandFuture 独立开发者与内容编辑",
  en: "HandFuture independent developer and content editor",
  ja: "HandFuture 個人開発者・コンテンツ編集者",
  ko: "HandFuture 독립 개발자 및 콘텐츠 편집자",
  es: "desarrollador independiente y editor de contenidos de HandFuture",
  "pt-BR": "desenvolvedor independente e editor de conteúdo do HandFuture",
  fr: "développeur indépendant et éditeur de contenu de HandFuture",
};

const navigationPaths = ["/", "/guides", "/how-it-works", "/about", "/privacy", "/terms"] as const;

function navigationLabel(publicPath: PublicPath, locale: Locale): string {
  if (publicPath === "/") return getTranslation(locale, "nav.home");
  if (publicPath === "/guides") return learnLabels[locale];
  if (publicPath === "/how-it-works") return getTranslation(locale, "footer.howItWorks");
  if (publicPath === "/about") return getTranslation(locale, "nav.about");
  if (publicPath === "/privacy") return getTranslation(locale, "nav.privacy");
  if (publicPath === "/terms") return getTranslation(locale, "nav.terms");
  return GUIDE_CONTENT[publicPath][locale].title;
}

const homeFeatures = [
  ["home.feature.browser.title", "home.feature.browser.description"],
  ["home.feature.reflection.title", "home.feature.reflection.description"],
  ["home.feature.privacy.title", "home.feature.privacy.description"],
] as const;

const homeGuides = [
  "/guides/hand-landmark-atlas",
  "/guides/creases-vs-landmarks",
  "/guides/barnum-effect-lab",
  "/guides/evaluating-palmistry-claims",
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
  return navigationPaths.map(
    (publicPath) =>
      `<a href="${escapeAttribute(buildLocalizedPath(locale, publicPath))}">${escapeHtml(navigationLabel(publicPath, locale))}</a>`,
  ).join("\n        ");
}

function renderGuideHub(locale: Locale): string {
  const meta = getRouteMetadata("/guides", locale);
  const cards = (Object.keys(GUIDE_CONTENT) as GuidePath[]).map((path) => {
    const content = GUIDE_CONTENT[path][locale];
    return `<article>
      <h2><a href="${escapeAttribute(buildLocalizedPath(locale, path))}">${escapeHtml(content.title)}</a></h2>
      <p>${escapeHtml(content.summary)}</p>
    </article>`;
  }).join("\n");

  const breadcrumb = BREADCRUMB_COPY[locale];
  return `<nav aria-label="${escapeAttribute(breadcrumb.ariaLabel)}">
    <a href="${escapeAttribute(buildLocalizedPath(locale, "/"))}">${escapeHtml(breadcrumb.home)}</a>
    <span aria-current="page">${escapeHtml(breadcrumb.learn)}</span>
  </nav>
  <section>
    <p>${escapeHtml(learnLabels[locale])}</p>
    <h1>${escapeHtml(meta.title.replace(/\s*[|｜].*$/, ""))}</h1>
    <p>${escapeHtml(meta.description)}</p>
    <p>Young LIN — ${escapeHtml(authorRoles[locale])}</p>
  </section>
  <section>${cards}</section>`;
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
      (publicPath) => `<article>
        <h3><a href="${escapeAttribute(buildLocalizedPath(locale, publicPath))}">${escapeHtml(GUIDE_CONTENT[publicPath][locale].title)}</a></h3>
        <p>${escapeHtml(GUIDE_CONTENT[publicPath][locale].summary)}</p>
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
      <p>Young LIN — ${escapeHtml(authorRoles[locale])}</p>
      <p><a href="${escapeAttribute(buildLocalizedPath(locale, "/guides"))}">${escapeHtml(learnLabels[locale])}</a></p>
${guides}
    </section>
    <section>
      <h2>${escapeHtml(getTranslation(locale, "faq.title"))}</h2>
${faqs}
    </section>`;
}

function editorialContent(publicPath: Exclude<PublicPath, "/" | "/guides">, locale: Locale): EditorialPage {
  if (publicPath === "/how-it-works") return HOW_IT_WORKS_CONTENT[locale];
  if (publicPath.startsWith("/guides/")) {
    return GUIDE_CONTENT[publicPath as GuidePath][locale];
  }
  if (publicPath === "/about") return ABOUT_CONTENT[locale];
  if (publicPath === "/privacy") return PRIVACY_CONTENT[locale];
  return TERMS_CONTENT[locale];
}

type EditorialPath = Exclude<PublicPath, "/" | "/guides">;

const guidePaths = Object.keys(GUIDE_CONTENT) as GuidePath[];

// Mirrors the relatedPaths each page hands to EditorialArticle. Until this
// existed the crawlable HTML linked guides only from the locale hub, giving
// every guide a single internal inbound link — the client added the rest after
// hydration, which Google discovers late and weights less.
function relatedPathsFor(publicPath: EditorialPath): EditorialPath[] {
  if (publicPath === "/how-it-works") {
    return [
      "/guides/palmistry-basics",
      "/guides/science-and-limitations",
      "/guides/hand-photo-guide",
    ];
  }
  if (publicPath === "/about") return ["/how-it-works", "/guides/palmistry-basics"];
  if (publicPath === "/privacy") return ["/how-it-works", "/guides/hand-photo-guide"];
  if (publicPath === "/terms") return ["/how-it-works", "/guides/science-and-limitations"];
  return ["/how-it-works", ...guidePaths.filter((guidePath) => guidePath !== publicPath)];
}

function renderRelated(publicPath: EditorialPath, locale: Locale): string {
  const heading = getTranslation(locale, "editorial.related");
  const items = relatedPathsFor(publicPath)
    .map(
      (relatedPath) =>
        `<li><a href="${escapeAttribute(buildLocalizedPath(locale, relatedPath))}">${escapeHtml(editorialContent(relatedPath, locale).title)}</a></li>`,
    )
    .join("");

  return `<nav aria-label="${escapeAttribute(heading)}">
      <h2>${escapeHtml(heading)}</h2>
      <ul>${items}</ul>
    </nav>`;
}

function editorialEyebrow(publicPath: Exclude<PublicPath, "/" | "/guides">, locale: Locale): string {
  if (publicPath === "/about") return getTranslation(locale, "editorial.eyebrow.about");
  if (publicPath === "/privacy") return getTranslation(locale, "editorial.eyebrow.privacy");
  if (publicPath === "/terms") return getTranslation(locale, "editorial.eyebrow.terms");
  return getTranslation(locale, "editorial.eyebrow.guide");
}

function renderEditorial(publicPath: Exclude<PublicPath, "/" | "/guides">, locale: Locale): string {
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

  const breadcrumb = publicPath.startsWith("/guides/")
    ? `<nav aria-label="${escapeAttribute(BREADCRUMB_COPY[locale].ariaLabel)}">
      <a href="${escapeAttribute(buildLocalizedPath(locale, "/"))}">${escapeHtml(BREADCRUMB_COPY[locale].home)}</a>
      <a href="${escapeAttribute(buildLocalizedPath(locale, "/guides"))}">${escapeHtml(BREADCRUMB_COPY[locale].learn)}</a>
      <span aria-current="page">${escapeHtml(content.title)}</span>
    </nav>`
    : "";

  return `${breadcrumb}<article>
    <header>
      <p>${escapeHtml(editorialEyebrow(publicPath, locale))}</p>
      <h1>${escapeHtml(content.title)}</h1>
      <p>${escapeHtml(content.summary)}</p>
      <p>Young LIN — ${escapeHtml(authorRoles[locale])} · ${escapeHtml(getTranslation(locale, "editorial.updated"))}: <time datetime="${escapeAttribute(content.updatedAt)}">${escapeHtml(content.updatedAt)}</time></p>
    </header>
    ${sections}
    ${sources}
    ${renderRelated(publicPath, locale)}
  </article>`;
}

function renderRouteBody(locale: Locale, publicPath: PublicPath): string {
  const content = publicPath === "/"
    ? renderHome(locale)
    : publicPath === "/guides"
      ? renderGuideHub(locale)
      : renderEditorial(publicPath, locale);
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
    .replace('<div id="root"></div>', `<div id="root">${renderRouteBody(locale, publicPath)}</div>`)
    .replace(/[ \t]+$/gm, "");
}
