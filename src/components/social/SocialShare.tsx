import { Link as LinkIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useLanguageStore } from "@/store/language-store";

interface SocialShareProps {
  className?: string;
}

const shareCopy = {
  zh: "我正在 HandFuture 探索手相文化與非科學的反思提示。",
  en: "I’m exploring palmistry culture and a non-scientific reflection prompt on HandFuture.",
} as const;

const interfaceCopy = {
  zh: {
    title: "分享這個頁面",
    share: "分享這個頁面",
    copy: "複製分享連結",
    copied: "分享連結已複製",
    failed: "無法複製連結，請從瀏覽器網址列手動複製。",
  },
  en: {
    title: "Share this page",
    share: "Share this page",
    copy: "Copy share link",
    copied: "Share link copied",
    failed: "The link could not be copied. Copy it from the address bar instead.",
  },
} as const;

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
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const text = interfaceCopy[currentLanguage];
  const message = shareCopy[currentLanguage];
  const supportsNativeShare = typeof navigator.share === "function";

  const handleShare = async () => {
    const url = getCanonicalCurrentUrl();

    if (supportsNativeShare) {
      try {
        await navigator.share({ title: "HandFuture", text: message, url });
      } catch {
        // Cancelling the operating-system share sheet needs no error message.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${message}\n\n${url}`);
      toast({ title: text.copied });
    } catch {
      toast({ title: text.failed, variant: "destructive" });
    }
  };

  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium">{text.title}</span>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={handleShare}>
          {supportsNativeShare ? (
            <Share2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
          )}
          {supportsNativeShare ? text.share : text.copy}
        </Button>
      </CardContent>
    </Card>
  );
}
