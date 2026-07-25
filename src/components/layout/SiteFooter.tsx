import { Link } from "react-router-dom";
import { PUBLIC_PATHS, type PublicPath } from "@/config/public-routes";
import { useLanguageStore } from "@/store/language-store";

const labels: Record<PublicPath, { zh: string; en: string }> = {
  "/": { zh: "首頁", en: "Home" },
  "/how-it-works": { zh: "運作方式", en: "How it works" },
  "/guides/palmistry-basics": { zh: "手相文化入門", en: "Palmistry basics" },
  "/guides/science-and-limitations": { zh: "科學與限制", en: "Science and limitations" },
  "/guides/hand-photo-guide": { zh: "手部照片指南", en: "Hand photo guide" },
  "/about": { zh: "關於", en: "About" },
  "/privacy": { zh: "隱私政策", en: "Privacy" },
  "/terms": { zh: "使用條款", en: "Terms" },
};

export default function SiteFooter() {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

  return (
    <footer className="border-t border-border/60 bg-card/70">
      <div className="container mx-auto space-y-5 px-4 py-8">
        <div>
          <p className="text-lg font-bold">HandFuture</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentLanguage === "zh"
              ? "獨立文化探索網頁專案"
              : "Independent cultural exploration web project"}
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
          aria-label={currentLanguage === "zh" ? "頁尾導覽" : "Footer navigation"}
        >
          {PUBLIC_PATHS.map((path) => (
            <Link key={path} to={path} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {labels[path][currentLanguage]}
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
