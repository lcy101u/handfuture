import { Link as LinkIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useLanguageStore } from "@/store/language-store";

interface SocialShareProps {
  className?: string;
}

function getCanonicalCurrentUrl(): string {
  const currentUrl = new URL(window.location.href);
  currentUrl.hash = "";
  currentUrl.search = "";

  const declaredCanonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  )?.href;
  if (!declaredCanonical) return currentUrl.href;

  const canonicalUrl = new URL(declaredCanonical, currentUrl);
  return canonicalUrl.pathname === currentUrl.pathname
    ? canonicalUrl.href
    : currentUrl.href;
}

export default function SocialShare({ className = "" }: SocialShareProps) {
  const t = useLanguageStore((state) => state.t);
  const message = t("share.message");
  const supportsNativeShare = typeof navigator.share === "function";

  const copyShareText = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({ title: t("share.copied") });
    } catch {
      toast({ title: t("share.failed"), variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const url = getCanonicalCurrentUrl();

    if (supportsNativeShare) {
      try {
        await navigator.share({ title: "HandFuture", text: message, url });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        await copyShareText(url);
      }
      return;
    }

    await copyShareText(`${message}\n\n${url}`);
  };

  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium">{t("share.title")}</span>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={handleShare}>
          {supportsNativeShare ? (
            <Share2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
          )}
          {supportsNativeShare ? t("share.share") : t("share.copy")}
        </Button>
      </CardContent>
    </Card>
  );
}
