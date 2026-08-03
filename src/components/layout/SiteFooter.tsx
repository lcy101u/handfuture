import { Link } from "react-router-dom";
import type { Locale } from "@/i18n/locales";
import { buildLocalizedPath } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

const learnLabel: Record<Locale, string> = {
  "zh-TW": "學習中心", "zh-CN": "学习中心", en: "Learn", ja: "学ぶ", ko: "학습",
  es: "Aprender", "pt-BR": "Aprender", fr: "Apprendre",
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
          {[
            { path: "/" as const, label: t("nav.home") },
            { path: "/guides" as const, label: learnLabel[currentLanguage] },
            { path: "/how-it-works" as const, label: t("footer.howItWorks") },
            { path: "/about" as const, label: t("nav.about") },
            { path: "/privacy" as const, label: t("nav.privacy") },
            { path: "/terms" as const, label: t("nav.terms") },
          ].map(({ path, label }) => (
            <Link key={path} to={buildLocalizedPath(currentLanguage, path)} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {label}
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
