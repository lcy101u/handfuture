import { TERMS_CONTENT } from "@/content/policies";
import { useLanguageStore } from "@/store/language-store";
import { EditorialArticle } from "./GuidePage";

export default function TermsPage() {
  const locale = useLanguageStore((state) => state.currentLanguage);

  return (
    <EditorialArticle
      content={TERMS_CONTENT[locale]}
      locale={locale}
      relatedPaths={["/how-it-works", "/guides/science-and-limitations"]}
    />
  );
}
