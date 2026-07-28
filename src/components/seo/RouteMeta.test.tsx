import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "@/store/language-store";
import AboutPage from "@/pages/AboutPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import RouteMeta from "./RouteMeta";

const originalHead = document.head.innerHTML;
const originalLang = document.documentElement.lang;

function MetadataNavigation() {
  return (
    <>
      <RouteMeta />
      <Link to="/guides/science-and-limitations">Science guide</Link>
      <Link to="/fr/privacy">French privacy</Link>
      <Link to="/missing">Missing</Link>
      <Link to="/">Home</Link>
    </>
  );
}

function renderMetadata(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <MetadataNavigation />
    </MemoryRouter>,
  );
}

describe("RouteMeta", () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ currentLanguage: "zh-TW" });
    document.head.innerHTML = `${originalHead}
      <meta name="description" content="duplicate description">
      <meta property="og:locale:alternate" content="en_US">
      <meta property="og:locale:alternate" content="en_US">
      <meta property="og:locale:alternate" content="de_DE">
      <link rel="canonical" href="https://duplicate.example/">
      <link rel="alternate" hreflang="fr" href="https://duplicate.example/fr">
      <link rel="alternate" hreflang="fr" href="https://duplicate.example/fr-again">
      <link rel="alternate" hreflang="de" href="https://duplicate.example/de">
    `;
    document.documentElement.lang = "en";
  });

  afterEach(() => {
    document.head.innerHTML = originalHead;
    document.documentElement.lang = originalLang;
  });

  it("replaces route metadata and keeps one structured-data script", async () => {
    renderMetadata();
    fireEvent.click(screen.getByRole("link", { name: "Science guide" }));

    await waitFor(() => {
      expect(document.title).toBe("手相、科學與限制：如何安全看待解讀｜HandFuture");
    });

    expect(document.documentElement.lang).toBe("zh-TW");
    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "說明手部關節偵測與掌紋解讀的差異、巴納姆效應如何影響感受，以及為何手相內容不應取代醫療、財務或人生決策。",
    );
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.handfortune.com/zh-TW/guides/science-and-limitations",
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://www.handfortune.com/zh-TW/guides/science-and-limitations",
    );
    expect(document.querySelectorAll("#route-structured-data")).toHaveLength(1);
    expect(
      JSON.parse(document.querySelector("#route-structured-data")?.textContent ?? "{}"),
    ).toMatchObject({
      "@type": "Article",
      dateModified: "2026-07-26",
      inLanguage: "zh-TW",
      publisher: { name: "HandFuture" },
      url: "https://www.handfortune.com/zh-TW/guides/science-and-limitations",
    });
  });

  it("replaces Chinese values with English without adding duplicate tags", async () => {
    renderMetadata("/guides/science-and-limitations");

    await waitFor(() => expect(document.documentElement.lang).toBe("zh-TW"));
    expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "zh_TW",
    );
    expect(
      Array.from(
        document.querySelectorAll<HTMLMetaElement>(
          'meta[property="og:locale:alternate"]',
        ),
        (meta) => meta.content,
      ),
    ).toEqual(["zh_CN", "en_US", "ja_JP", "ko_KR", "es_ES", "pt_BR", "fr_FR"]);
    act(() => useLanguageStore.getState().setLanguage("en"));

    await waitFor(() => {
      expect(document.title).toBe("Palmistry, Science, and Limitations | HandFuture");
    });

    expect(document.documentElement.lang).toBe("en");
    expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "en_US",
    );
    expect(
      Array.from(
        document.querySelectorAll<HTMLMetaElement>(
          'meta[property="og:locale:alternate"]',
        ),
        (meta) => meta.content,
      ),
    ).toEqual(["zh_TW", "zh_CN", "ja_JP", "ko_KR", "es_ES", "pt_BR", "fr_FR"]);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.handfortune.com/en/guides/science-and-limitations",
    );
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Understand the difference between hand-landmark detection and palm reading, how the Barnum effect shapes impressions, and why palmistry should not guide medical, financial, or life decisions.",
    );
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[property="og:locale"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'link[rel="canonical"]',
      "#route-structured-data",
    ]) {
      expect(document.querySelectorAll(selector), selector).toHaveLength(1);
    }
    expect(document.querySelectorAll('meta[property="og:locale:alternate"]')).toHaveLength(7);
  });

  it("publishes reciprocal locale alternates plus the matching x-default gateway", async () => {
    renderMetadata("/ja/about");

    await waitFor(() => expect(document.documentElement.lang).toBe("ja"));

    const alternates = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]'),
      (link) => [link.hreflang, link.href],
    );
    expect(alternates).toEqual([
      ["zh-TW", "https://www.handfortune.com/zh-TW/about"],
      ["zh-CN", "https://www.handfortune.com/zh-CN/about"],
      ["en", "https://www.handfortune.com/en/about"],
      ["ja", "https://www.handfortune.com/ja/about"],
      ["ko", "https://www.handfortune.com/ko/about"],
      ["es", "https://www.handfortune.com/es/about"],
      ["pt-BR", "https://www.handfortune.com/pt-BR/about"],
      ["fr", "https://www.handfortune.com/fr/about"],
      ["x-default", "https://www.handfortune.com/about"],
    ]);
    expect(new Set(alternates.map(([hreflang]) => hreflang)).size).toBe(9);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.handfortune.com/ja/about",
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://www.handfortune.com/ja/about",
    );
    expect(
      JSON.parse(document.querySelector("#route-structured-data")?.textContent ?? "{}"),
    ).toMatchObject({
      inLanguage: "ja",
      url: "https://www.handfortune.com/ja/about",
    });
  });

  it("replaces alternate destinations on navigation without leaving stale identities", async () => {
    renderMetadata("/ja/about");

    await waitFor(() =>
      expect(document.querySelector('link[hreflang="fr"]')).toHaveAttribute(
        "href",
        "https://www.handfortune.com/fr/about",
      ),
    );
    fireEvent.click(screen.getByRole("link", { name: "French privacy" }));

    await waitFor(() =>
      expect(document.querySelector('link[hreflang="fr"]')).toHaveAttribute(
        "href",
        "https://www.handfortune.com/fr/privacy",
      ),
    );
    const alternates = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]'),
    );
    expect(alternates).toHaveLength(9);
    expect(alternates.filter((link) => link.hreflang === "fr")).toHaveLength(1);
    expect(alternates.some((link) => link.href.endsWith("/about"))).toBe(false);
    expect(document.querySelector('link[hreflang="x-default"]')).toHaveAttribute(
      "href",
      "https://www.handfortune.com/privacy",
    );
  });

  it("uses the unprefixed root only as the localized home x-default", async () => {
    renderMetadata("/pt-BR/");

    await waitFor(() => expect(document.documentElement.lang).toBe("pt-BR"));
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.handfortune.com/pt-BR/",
    );
    expect(document.querySelector('link[hreflang="x-default"]')).toHaveAttribute(
      "href",
      "https://www.handfortune.com/",
    );
  });

  it.each([
    {
      path: "/zh-CN/privacy",
      primary: "zh_CN",
      alternates: ["zh_TW", "en_US", "ja_JP", "ko_KR", "es_ES", "pt_BR", "fr_FR"],
    },
    {
      path: "/ja/privacy",
      primary: "ja_JP",
      alternates: ["zh_TW", "zh_CN", "en_US", "ko_KR", "es_ES", "pt_BR", "fr_FR"],
    },
    {
      path: "/pt-BR/privacy",
      primary: "pt_BR",
      alternates: ["zh_TW", "zh_CN", "en_US", "ja_JP", "ko_KR", "es_ES", "fr_FR"],
    },
  ])("publishes valid Open Graph locale arrays for $path", async ({ path, primary, alternates }) => {
    renderMetadata(path);

    await waitFor(() =>
      expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        primary,
      ),
    );
    expect(
      Array.from(
        document.querySelectorAll<HTMLMetaElement>(
          'meta[property="og:locale:alternate"]',
        ),
        (meta) => meta.content,
      ),
    ).toEqual(alternates);
  });

  it("noindexes unknown paths without home schema and restores valid state", async () => {
    renderMetadata("/missing");

    await waitFor(() => expect(document.title).toBe("找不到頁面｜HandFuture"));
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    expect(document.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
    expect(
      document.querySelectorAll('link[rel="alternate"][hreflang]'),
    ).toHaveLength(0);
    expect(document.querySelector("#route-structured-data")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Home" }));

    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "index, follow",
      );
    });
    expect(document.querySelector("#route-structured-data")).toBeInTheDocument();
    expect(
      JSON.parse(document.querySelector("#route-structured-data")?.textContent ?? "{}")[
        "@type"
      ],
    ).toBe("WebApplication");
  });

  it("normalizes the document language on a direct English unknown route", async () => {
    useLanguageStore.setState({ currentLanguage: "en" });
    document.documentElement.lang = "zh-TW";

    renderMetadata("/missing");

    await waitFor(() => expect(document.title).toBe("Page not found | HandFuture"));
    expect(document.documentElement.lang).toBe("en");
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    expect(document.querySelector("#route-structured-data")).not.toBeInTheDocument();
  });

  it("normalizes the document language after switching locale on an unknown route", async () => {
    useLanguageStore.setState({ currentLanguage: "en" });
    document.documentElement.lang = "en";
    renderMetadata("/missing");

    await waitFor(() => expect(document.title).toBe("Page not found | HandFuture"));
    act(() => useLanguageStore.getState().setLanguage("zh-TW"));

    await waitFor(() => expect(document.title).toBe("找不到頁面｜HandFuture"));
    expect(document.documentElement.lang).toBe("zh-TW");
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    expect(document.querySelector("#route-structured-data")).not.toBeInTheDocument();
  });

  it.each([
    {
      path: "/ja/missing",
      title: "ページが見つかりません｜HandFuture",
      lang: "ja",
    },
    {
      path: "/fr/missing",
      title: "Page introuvable | HandFuture",
      lang: "fr",
    },
  ] as const)(
    "uses the localized 404 document title for $path",
    async ({ path, title, lang }) => {
      useLanguageStore.setState({ currentLanguage: "en" });

      renderMetadata(path);

      await waitFor(() => expect(document.title).toBe(title));
      expect(document.documentElement.lang).toBe(lang);
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, follow",
      );
      expect(document.querySelector("#route-structured-data")).not.toBeInTheDocument();
    },
  );

  it.each([
    {
      path: "/about",
      Page: AboutPage,
      title: "關於 HandFuture",
      description:
        "HandFuture 是一個獨立網頁專案，透過手部偵測與有來源的文章，協助讀者以透明、非科學且僅供娛樂的方式探索手相文化。",
    },
    {
      path: "/privacy",
      Page: PrivacyPolicyPage,
      title: "隱私政策｜HandFuture",
      description:
        "查看 HandFuture 如何在瀏覽器內處理手部照片、使用本機儲存空間與 Vercel Analytics，以及 Google 廣告與同意選項如何運作。",
    },
    {
      path: "/terms",
      Page: TermsPage,
      title: "使用條款｜HandFuture",
      description:
        "閱讀 HandFuture 的娛樂用途、年齡建議、禁止行為、智慧財產、服務可用性與責任限制，並了解本工具不提供專業建議。",
    },
  ] as const)("keeps centralized metadata authoritative on $path", async ({ path, Page, title, description }) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <RouteMeta />
        <Page />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.title).toBe(title));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      description,
    );
  });

  it("selects route-locale metadata for an exact localized public path", async () => {
    useLanguageStore.setState({ currentLanguage: "en" });

    renderMetadata("/fr/privacy");

    await waitFor(() =>
      expect(document.title).toBe("Politique de confidentialité | HandFuture"),
    );
    expect(document.documentElement.lang).toBe("fr");
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow",
    );
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Découvrez comment HandFuture traite les photos dans le navigateur, utilise le stockage local et Vercel Analytics, et comment fonctionnent la publicité Google et les choix de consentement.",
    );
    expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "fr_FR",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.handfortune.com/fr/privacy",
    );
    expect(
      JSON.parse(document.querySelector("#route-structured-data")?.textContent ?? "{}"),
    ).toMatchObject({
      "@type": "WebPage",
      inLanguage: "fr",
      url: "https://www.handfortune.com/fr/privacy",
    });
  });
});
