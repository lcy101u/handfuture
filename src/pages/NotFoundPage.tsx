import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { buildLocalizedPath } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

function NotFoundPage() {
  const { currentLanguage, t } = useLanguageStore();

  return (
    <section className="container mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-6xl">404</h1>
      <p className="mb-6 text-muted-foreground">
        {t("notFound.message")}
      </p>
      <Button asChild variant="link">
        <Link to={buildLocalizedPath(currentLanguage, "/")}>
          {t("notFound.home")}
        </Link>
      </Button>
    </section>
  );
}

export default NotFoundPage;
