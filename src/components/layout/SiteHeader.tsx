import { Hand, Sparkles } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Locale } from "@/i18n/locales";
import { buildLocalizedPath } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

const learnLabel: Record<Locale, string> = {
  "zh-TW": "學習中心", "zh-CN": "学习中心", en: "Learn", ja: "学ぶ", ko: "학습",
  es: "Aprender", "pt-BR": "Aprender", fr: "Apprendre",
};

export default function SiteHeader() {
  const { currentLanguage, t } = useLanguageStore();

  return (
    <header className="border-b border-white/10 bg-slate-950 text-white">
      <div className="container mx-auto flex flex-wrap items-center gap-x-6 gap-y-4 px-4 py-5">
        <Link
          to={buildLocalizedPath(currentLanguage, "/")}
          className="flex min-w-fit items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t("nav.homeAria")}
        >
          <span className="relative" aria-hidden="true">
            <Hand className="h-8 w-8 text-primary" />
            <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-accent" />
          </span>
          <span>
            <span className="block text-xl font-bold">{t("app.title")}</span>
            <span className="block text-xs text-white/70">{t("app.subtitle")}</span>
          </span>
        </Link>

        <nav
          className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-3 text-sm"
          aria-label={t("nav.primaryAria")}
        >
          {[
            { path: "/guides" as const, label: learnLabel[currentLanguage] },
            { path: "/how-it-works" as const, label: t("footer.howItWorks") },
            { path: "/about" as const, label: t("nav.about") },
          ].map(({ path, label }) => (
            <NavLink
              key={path}
              to={buildLocalizedPath(currentLanguage, path)}
              className={({ isActive }) =>
                `rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive ? "font-semibold text-primary" : "text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
