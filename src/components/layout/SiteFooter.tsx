import { Link } from "react-router-dom";
import { PUBLIC_PATHS, type PublicPath } from "@/config/public-routes";
import { buildLocalizedPath } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

const labelKeys: Record<PublicPath, string> = {
  "/": "nav.home",
  "/how-it-works": "footer.howItWorks",
  "/guides/palmistry-basics": "guide.basics.title",
  "/guides/science-and-limitations": "guide.science.title",
  "/guides/hand-photo-guide": "guide.photo.title",
  "/about": "nav.about",
  "/privacy": "nav.privacy",
  "/terms": "nav.terms",
};

export default function SiteFooter() {
  const { currentLanguage, t } = useLanguageStore();

  return (
    <footer className="border-t border-border/60 bg-card/70">
      <div className="container mx-auto space-y-5 px-4 py-8">
        <div>
          <p className="text-lg font-bold">HandFuture</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
          aria-label={t("nav.footerAria")}
        >
          {PUBLIC_PATHS.map((path) => (
            <Link key={path} to={buildLocalizedPath(currentLanguage, path)} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {t(labelKeys[path])}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} HandFuture
        </p>
      </div>
    </footer>
  );
}
