import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function GoogleAdBanner() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const scriptUrl = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3713047615080346";

    const pushAds = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense initialization failed", error);
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptUrl}"]`
    );

    if (existingScript) {
      if (existingScript.getAttribute("data-loaded") === "true") {
        pushAds();
      } else {
        const handleExistingLoad = () => {
          existingScript.setAttribute("data-loaded", "true");
          pushAds();
        };
        existingScript.addEventListener("load", handleExistingLoad);
        return () => {
          existingScript.removeEventListener("load", handleExistingLoad);
        };
      }
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.crossOrigin = "anonymous";
    const handleLoad = () => {
      script.setAttribute("data-loaded", "true");
      pushAds();
    };
    script.addEventListener("load", handleLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-border/40 bg-card/60 p-4 shadow-sm">
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3713047615080346"
        data-ad-slot="3791741352"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default GoogleAdBanner;
