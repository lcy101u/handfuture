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
    useLanguageStore.setState({ currentLanguage: "zh" });
    document.head.innerHTML = `${originalHead}
      <meta name="description" content="duplicate description">
      <link rel="canonical" href="https://duplicate.example/">
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
      "https://www.handfortune.com/guides/science-and-limitations",
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://www.handfortune.com/guides/science-and-limitations",
    );
    expect(document.querySelectorAll("#route-structured-data")).toHaveLength(1);
    expect(
      JSON.parse(document.querySelector("#route-structured-data")?.textContent ?? "{}"),
    ).toMatchObject({
      "@type": "Article",
      dateModified: "2026-07-26",
      publisher: { name: "HandFuture" },
    });
  });

  it("replaces Chinese values with English without adding duplicate tags", async () => {
    renderMetadata("/guides/science-and-limitations");

    await waitFor(() => expect(document.documentElement.lang).toBe("zh-TW"));
    act(() => useLanguageStore.getState().setLanguage("en"));

    await waitFor(() => {
      expect(document.title).toBe("Palmistry, Science, and Limitations | HandFuture");
    });

    expect(document.documentElement.lang).toBe("en");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Understand the difference between hand-landmark detection and palm reading, how the Barnum effect shapes impressions, and why palmistry should not guide medical, financial, or life decisions.",
    );
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'link[rel="canonical"]',
      "#route-structured-data",
    ]) {
      expect(document.querySelectorAll(selector), selector).toHaveLength(1);
    }
  });

  it("noindexes unknown paths without home schema and restores valid state", async () => {
    renderMetadata("/missing");

    await waitFor(() => expect(document.title).toBe("找不到頁面｜HandFuture"));
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
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
});
