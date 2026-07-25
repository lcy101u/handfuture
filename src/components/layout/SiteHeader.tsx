import { Hand, Sparkles } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { PublicPath } from "@/config/public-routes";
import { useLanguageStore } from "@/store/language-store";

const navigation: Array<{
  path: Exclude<PublicPath, "/">;
  label: { zh: string; en: string };
}> = [
  { path: "/how-it-works", label: { zh: "運作方式", en: "How it works" } },
  {
    path: "/guides/palmistry-basics",
    label: { zh: "手相文化入門", en: "Palmistry basics" },
  },
  {
    path: "/guides/science-and-limitations",
    label: { zh: "科學與限制", en: "Science and limitations" },
  },
  {
    path: "/guides/hand-photo-guide",
    label: { zh: "手部照片指南", en: "Hand photo guide" },
  },
  { path: "/about", label: { zh: "關於", en: "About" } },
  { path: "/privacy", label: { zh: "隱私政策", en: "Privacy" } },
  { path: "/terms", label: { zh: "使用條款", en: "Terms" } },
];

export default function SiteHeader() {
  const { currentLanguage, t } = useLanguageStore();

  return (
    <header className="border-b border-white/10 bg-slate-950 text-white">
      <div className="container mx-auto flex flex-wrap items-center gap-x-6 gap-y-4 px-4 py-5">
        <Link
          to="/"
          className="flex min-w-fit items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={currentLanguage === "zh" ? "HandFuture 首頁" : "HandFuture home"}
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
          aria-label={currentLanguage === "zh" ? "主要導覽" : "Primary navigation"}
        >
          <span className="sr-only">
            {currentLanguage === "zh" ? "指南" : "Guides"}
          </span>
          {navigation.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive ? "font-semibold text-primary" : "text-white"
                }`
              }
            >
              {label[currentLanguage]}
            </NavLink>
          ))}
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
