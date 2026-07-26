import { PRIVACY_CONTENT } from "@/content/policies";
import { useLanguageStore } from "@/store/language-store";
import { EditorialArticle } from "./GuidePage";

export default function PrivacyPolicyPage() {
  const locale = useLanguageStore((state) => state.currentLanguage);

  return (
    <EditorialArticle
      content={PRIVACY_CONTENT[locale]}
      locale={locale}
      relatedPaths={["/how-it-works", "/guides/hand-photo-guide"]}
    />
  );
}
