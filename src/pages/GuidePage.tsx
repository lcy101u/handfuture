import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { EditorialPage } from "@/content/guides";
import { GUIDE_CONTENT } from "@/content/guides";
import type { GuidePath, Locale, PublicPath } from "@/config/public-routes";
import { useLanguageStore } from "@/store/language-store";

const guidePaths = Object.keys(GUIDE_CONTENT) as GuidePath[];

function isGuidePath(path: PublicPath): path is GuidePath {
  return guidePaths.includes(path as GuidePath);
}

interface EditorialArticleProps {
  content: EditorialPage;
  locale: Locale;
  relatedPaths: PublicPath[];
  eyebrow?: string;
}

function isInternalPath(url: string): url is PublicPath {
  return url.startsWith("/");
}

export function EditorialArticle({
  content,
  locale,
  relatedPaths,
  eyebrow,
}: EditorialArticleProps) {
  const relatedLabel = (path: PublicPath) => {
    if (path === "/how-it-works") {
      return locale === "zh" ? "HandFuture 如何運作" : "How HandFuture works";
    }
    if (isGuidePath(path)) return GUIDE_CONTENT[path][locale].title;
    return path;
  };
  const resolvedEyebrow =
    eyebrow ?? (locale === "zh" ? "文化與技術指南" : "Culture and technology guide");

  return (
    <article className="container mx-auto max-w-4xl space-y-10 px-4 py-10 md:py-14">
      <div className="space-y-4 border-b border-border/70 pb-8">
        <p className="text-sm font-medium text-primary">{resolvedEyebrow}</p>
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">{content.title}</h1>
        <p className="text-lg leading-8 text-muted-foreground">{content.summary}</p>
        <p className="flex flex-wrap gap-x-2 text-sm text-muted-foreground">
          <span>{locale === "zh" ? "發布者" : "Publisher"}:</span>
          <span className="font-medium text-foreground">HandFuture</span>
          <span aria-hidden="true">·</span>
          <span>{locale === "zh" ? "更新" : "Updated"}:</span>
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

      {content.sources.length > 0 && (
        <section className="space-y-4 border-t border-border/70 pt-8" aria-labelledby="article-sources">
          <h2 id="article-sources" className="text-2xl font-semibold">
            {locale === "zh" ? "參考資料" : "Sources"}
          </h2>
          <ul className="space-y-3">
            {content.sources.map((source) => (
              <li key={source.url}>
                {isInternalPath(source.url) ? (
                  <Link
                    to={source.url}
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

      <nav
        className="space-y-3 rounded-xl border border-border/70 bg-card p-6"
        aria-label={locale === "zh" ? "相關閱讀" : "Related reading"}
      >
        <h2 className="text-xl font-semibold">
          {locale === "zh" ? "相關閱讀" : "Related reading"}
        </h2>
        <ul className="space-y-2">
          {relatedPaths.map((path) => (
            <li key={path}>
              <Link to={path} className="text-primary underline-offset-4 hover:underline">
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
  const relatedPaths: PublicPath[] = [
    "/how-it-works",
    ...guidePaths.filter((guidePath) => guidePath !== path),
  ];

  return (
    <EditorialArticle
      content={GUIDE_CONTENT[path][locale]}
      locale={locale}
      relatedPaths={relatedPaths}
    />
  );
}
