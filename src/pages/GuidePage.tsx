import { ChevronRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import BarnumLab from "@/components/education/BarnumLab";
import ConceptComparison from "@/components/education/ConceptComparison";
import LandmarkAtlas from "@/components/education/LandmarkAtlas";
import SocialShare from "@/components/social/SocialShare";
import type { EditorialPage } from "@/content/guides";
import { GUIDE_CONTENT, HOW_IT_WORKS_CONTENT } from "@/content/guides";
import type { GuidePath, Locale, PublicPath } from "@/config/public-routes";
import { getTranslation } from "@/i18n/catalogs";
import { BREADCRUMB_COPY } from "@/i18n/breadcrumbs";
import { buildLocalizedPath } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

const authorRole: Record<Locale, string> = {
  "zh-TW": "HandFuture 獨立開發者與內容編輯",
  "zh-CN": "HandFuture 独立开发者与内容编辑",
  en: "HandFuture independent developer and content editor",
  ja: "HandFuture 個人開発者・コンテンツ編集者",
  ko: "HandFuture 독립 개발자 및 콘텐츠 편집자",
  es: "desarrollador independiente y editor de contenidos de HandFuture",
  "pt-BR": "desenvolvedor independente e editor de conteúdo do HandFuture",
  fr: "développeur indépendant et éditeur de contenu de HandFuture",
};

const guidePaths = Object.keys(GUIDE_CONTENT) as GuidePath[];

function isGuidePath(path: PublicPath): path is GuidePath {
  return guidePaths.includes(path as GuidePath);
}

interface EditorialArticleProps {
  content: EditorialPage;
  locale: Locale;
  relatedPaths: PublicPath[];
  eyebrow?: string;
  interactive?: ReactNode;
}

function isInternalPath(url: string): url is PublicPath {
  return url.startsWith("/");
}

export function EditorialArticle({
  content,
  locale,
  relatedPaths,
  eyebrow,
  interactive,
}: EditorialArticleProps) {
  const relatedLabel = (path: PublicPath) => {
    if (path === "/how-it-works") {
      return HOW_IT_WORKS_CONTENT[locale].title;
    }
    if (isGuidePath(path)) return GUIDE_CONTENT[path][locale].title;
    return path;
  };
  const resolvedEyebrow =
    eyebrow ?? getTranslation(locale, "editorial.eyebrow.guide");

  return (
    <article className="container mx-auto max-w-4xl space-y-10 px-4 py-10 md:py-14">
      <div className="space-y-4 border-b border-border/70 pb-8">
        <p className="text-sm font-medium text-primary">{resolvedEyebrow}</p>
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">{content.title}</h1>
        <p className="text-lg leading-8 text-muted-foreground">{content.summary}</p>
        <p className="flex flex-wrap gap-x-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Young LIN</span>
          <span>— {authorRole[locale]}</span>
          <span aria-hidden="true">·</span>
          <span>{getTranslation(locale, "editorial.updated")}:</span>
          <time dateTime={content.updatedAt}>{content.updatedAt}</time>
        </p>
      </div>

      <div className="space-y-10">
        {content.sections.map((section) => (
          <section key={section.heading} className="space-y-4">
            <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-8 text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {interactive}

      {content.sources.length > 0 && (
        <section className="space-y-4 border-t border-border/70 pt-8" aria-labelledby="article-sources">
          <h2 id="article-sources" className="text-2xl font-semibold">
            {getTranslation(locale, "editorial.sources")}
          </h2>
          <ul className="space-y-3">
            {content.sources.map((source) => (
              <li key={source.url}>
                {isInternalPath(source.url) ? (
                  <Link
                    to={buildLocalizedPath(locale, source.url)}
                    className="inline-flex items-start gap-2 text-primary underline-offset-4 hover:underline"
                  >
                    <span>{source.label}</span>
                  </Link>
                ) : (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-2 text-primary underline-offset-4 hover:underline"
                  >
                    <span>{source.label}</span>
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <SocialShare />

      <nav
        className="space-y-3 rounded-xl border border-border/70 bg-card p-6"
        aria-label={getTranslation(locale, "editorial.related")}
      >
        <h2 className="text-xl font-semibold">
          {getTranslation(locale, "editorial.related")}
        </h2>
        <ul className="space-y-2">
          {relatedPaths.map((path) => (
            <li key={path}>
              <Link
                to={buildLocalizedPath(locale, path)}
                className="text-primary underline-offset-4 hover:underline"
              >
                {relatedLabel(path)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}

interface GuidePageProps {
  path: GuidePath;
}

export default function GuidePage({ path }: GuidePageProps) {
  const locale = useLanguageStore((state) => state.currentLanguage);
  const breadcrumb = BREADCRUMB_COPY[locale];
  const relatedPaths: PublicPath[] = [
    "/how-it-works",
    ...guidePaths.filter((guidePath) => guidePath !== path),
  ];
  const interactive = path === "/guides/hand-landmark-atlas"
    ? <LandmarkAtlas />
    : path === "/guides/barnum-effect-lab"
      ? <BarnumLab />
      : path === "/guides/creases-vs-landmarks"
        ? <ConceptComparison />
      : null;

  return (
    <>
      <nav
        aria-label={breadcrumb.ariaLabel}
        className="container mx-auto max-w-4xl px-4 pt-8 text-sm text-muted-foreground"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link className="hover:text-primary hover:underline" to={buildLocalizedPath(locale, "/")}>{breadcrumb.home}</Link></li>
          <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
          <li><Link className="hover:text-primary hover:underline" to={buildLocalizedPath(locale, "/guides")}>{breadcrumb.learn}</Link></li>
          <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
          <li className="font-medium text-foreground" aria-current="page">{GUIDE_CONTENT[path][locale].title}</li>
        </ol>
      </nav>
      <EditorialArticle
      content={GUIDE_CONTENT[path][locale]}
      locale={locale}
      relatedPaths={relatedPaths}
      interactive={interactive}
      />
    </>
  );
}
