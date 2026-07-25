import { HOW_IT_WORKS_CONTENT } from "@/content/guides";
import { useLanguageStore } from "@/store/language-store";
import { EditorialArticle } from "./GuidePage";

export default function HowItWorksPage() {
  const locale = useLanguageStore((state) => state.currentLanguage);

  return (
    <EditorialArticle
      content={HOW_IT_WORKS_CONTENT[locale]}
      locale={locale}
      relatedPaths={[
        "/guides/palmistry-basics",
        "/guides/science-and-limitations",
        "/guides/hand-photo-guide",
      ]}
    />
  );
}
