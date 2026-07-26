import { ABOUT_CONTENT } from "@/content/policies";
import { useLanguageStore } from "@/store/language-store";
import { EditorialArticle } from "./GuidePage";

export default function AboutPage() {
  const locale = useLanguageStore((state) => state.currentLanguage);

  return (
    <EditorialArticle
      content={ABOUT_CONTENT[locale]}
      locale={locale}
      relatedPaths={["/how-it-works", "/guides/palmistry-basics"]}
      eyebrow={locale === "zh" ? "關於本站" : "About this site"}
    />
  );
}
