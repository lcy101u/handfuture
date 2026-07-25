import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/language-store";

function NotFoundPage() {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

  return (
    <section className="container mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-6xl">404</h1>
      <p className="mb-6 text-muted-foreground">
        {currentLanguage === "zh" ? "找不到這個頁面。" : "Page not found."}
      </p>
      <Button asChild variant="link">
        <Link to="/">{currentLanguage === "zh" ? "返回首頁" : "Return home"}</Link>
      </Button>
    </section>
  );
}

export default NotFoundPage;
