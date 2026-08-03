import { Suspense } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SiteLayout from "@/components/layout/SiteLayout";
import RouteMeta from "@/components/seo/RouteMeta";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import LocaleRouter from "./LocaleRouter";
import { localizedPathForCurrentRoute } from "./locale-routing";

const localizedHeadings: Record<Locale, string> = {
  "zh-TW": "看懂手部偵測，也看懂說法的界線",
  "zh-CN": "看懂手部检测，也看懂说法的边界",
  en: "Understand hand detection—and the limits of a claim",
  ja: "手の検出と、主張の限界を理解する",
  ko: "손 감지와 주장의 한계를 함께 이해하세요",
  es: "Comprende la detección y los límites de una afirmación",
  "pt-BR": "Entenda a detecção e os limites de uma afirmação",
  fr: "Comprendre la détection et les limites d’une affirmation",
};

function renderAt(pathname: string) {
  window.history.replaceState({}, "", pathname);
  return render(
    <BrowserRouter>
      <SiteLayout>
        <RouteMeta />
        <Suspense fallback={<div role="status">Loading</div>}>
          <LocaleRouter />
        </Suspense>
      </SiteLayout>
    </BrowserRouter>,
  );
}

function robotsContent() {
  return document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content;
}

describe("LocaleRouter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    localStorage.clear();
    document.querySelector('meta[name="robots"]')?.remove();
    useLanguageStore.setState({
      currentLanguage: "en",
      preferredLanguage: null,
      hasExplicitPreference: false,
    });
    usePalmStore.setState({
      image: null,
      detection: null,
      reflectionKey: null,
      isDetecting: false,
      error: null,
      disclaimerAccepted: false,
    });
  });

  it.each(SUPPORTED_LOCALES)(
    "renders the localized home page and synchronizes document language for %s",
    async (locale) => {
      renderAt(`/${locale}/`);

      expect(
        await screen.findByRole("heading", {
          name: localizedHeadings[locale],
          level: 1,
        }),
      ).toBeVisible();
      expect(document.documentElement.lang).toBe(locale);
      expect(useLanguageStore.getState()).toMatchObject({
        currentLanguage: locale,
        preferredLanguage: null,
        hasExplicitPreference: false,
      });
      expect(robotsContent()).toBe("index, follow");
    },
  );

  it("marks a manual language choice explicit and stays on the same page", async () => {
    renderAt("/ja/");
    await screen.findByRole("heading", { name: localizedHeadings.ja });

    fireEvent.pointerDown(
      screen.getByRole("button", { name: /言語を切り替える|language/i }),
      { button: 0, ctrlKey: false },
    );
    fireEvent.click(
      await screen.findByRole("menuitem", { name: /Français/ }),
    );

    await waitFor(() => expect(window.location.pathname).toBe("/fr/"));
    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "fr",
      preferredLanguage: "fr",
      hasExplicitPreference: true,
    });
    expect(
      await screen.findByRole("heading", { name: localizedHeadings.fr }),
    ).toBeVisible();
  });

  it("updates persistent shell copy when the route locale changes", async () => {
    renderAt("/ja/");
    await screen.findByRole("heading", { name: localizedHeadings.ja });
    expect(
      screen.getByRole("link", { name: "メインコンテンツへ移動" }),
    ).toHaveAttribute("href", "#main-content");

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "言語を切り替える" }),
      { button: 0, ctrlKey: false },
    );
    fireEvent.click(
      await screen.findByRole("menuitem", { name: /Français/ }),
    );

    await waitFor(() => expect(window.location.pathname).toBe("/fr/"));
    expect(
      screen.getByRole("link", { name: "Aller au contenu" }),
    ).toHaveAttribute("href", "#main-content");
  });

  it("builds a same-page locale path without rendering untranslated content", () => {
    expect(localizedPathForCurrentRoute("/en/privacy", "fr")).toBe("/fr/privacy");
    expect(
      localizedPathForCurrentRoute("/fr/not-a-public-page", "ja"),
    ).toBe("/ja/not-a-public-page");
  });

  it("keeps all reachable public shell and home links under the active prefix", async () => {
    renderAt("/ja/");
    await screen.findByRole("heading", { name: localizedHeadings.ja });

    for (const landmark of [
      screen.getByRole("banner"),
      screen.getByRole("contentinfo"),
    ]) {
      const hrefs = within(landmark)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"));
      expect(hrefs.every((href) => href?.startsWith("/ja/"))).toBe(true);
    }

    const continueReading = screen
      .getByRole("heading", { name: "続きを読む" })
      .closest("section");
    expect(
      within(continueReading as HTMLElement)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual([
      "/ja/guides",
      "/ja/guides/hand-landmark-atlas",
      "/ja/guides/creases-vs-landmarks",
      "/ja/guides/barnum-effect-lab",
      "/ja/guides/evaluating-palmistry-claims",
    ]);
  });

  it("redirects a legacy public content path once to Traditional Chinese", async () => {
    renderAt("/about");

    await waitFor(() =>
      expect(window.location.pathname).toBe("/zh-TW/about"),
    );
  });

  it.each([
    ["/de/about", "en"],
    ["/fr/not-a-public-page", "fr"],
  ] as const)(
    "renders a noindex 404 without redirecting %s",
    async (pathname, expectedDocumentLocale) => {
      renderAt(pathname);

      expect(await screen.findByRole("heading", { name: "404" })).toBeVisible();
      expect(window.location.pathname).toBe(pathname);
      expect(document.documentElement.lang).toBe(expectedDocumentLocale);
      expect(robotsContent()).toBe("noindex, follow");
    },
  );

  it("uses an explicit saved choice before browser languages at the gateway", async () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      languages: ["ja-JP"],
    });
    useLanguageStore.setState({
      currentLanguage: "ja",
      preferredLanguage: "fr",
      hasExplicitPreference: true,
    });

    renderAt("/");

    await waitFor(() => expect(window.location.pathname).toBe("/fr/"));
  });

  it("uses the first supported browser language at the gateway", async () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      languages: ["de-DE", "ko-KR"],
    });

    renderAt("/");

    await waitFor(() => expect(window.location.pathname).toBe("/ko/"));
    expect(useLanguageStore.getState().hasExplicitPreference).toBe(false);
  });

  it("uses the country endpoint only after browser languages have no match", async () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      languages: ["de-DE"],
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ country: "BR" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    renderAt("/");

    await waitFor(() => expect(window.location.pathname).toBe("/pt-BR/"));
    expect(useLanguageStore.getState().hasExplicitPreference).toBe(false);
  });

  it("keeps a saved preference while a shared URL controls rendering and reuses it at root", async () => {
    useLanguageStore.setState({
      currentLanguage: "fr",
      preferredLanguage: "fr",
      hasExplicitPreference: true,
    });

    const sharedRoute = renderAt("/ja/");

    await screen.findByRole("heading", { name: localizedHeadings.ja });
    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "ja",
      preferredLanguage: "fr",
      hasExplicitPreference: true,
    });

    sharedRoute.unmount();
    renderAt("/");
    await waitFor(() => expect(window.location.pathname).toBe("/fr/"));
  });

  it("records an already-active locale as an explicit picker choice", async () => {
    renderAt("/fr/");
    await screen.findByRole("heading", { name: localizedHeadings.fr });

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Changer de langue" }),
      { button: 0, ctrlKey: false },
    );
    fireEvent.click(
      await screen.findByRole("menuitem", { name: /Français/ }),
    );

    expect(window.location.pathname).toBe("/fr/");
    expect(useLanguageStore.getState()).toMatchObject({
      currentLanguage: "fr",
      preferredLanguage: "fr",
      hasExplicitPreference: true,
    });
  });

  it("preserves an unknown suffix when switching a localized 404", async () => {
    renderAt("/fr/not-a-public-page");
    expect(await screen.findByRole("heading", { name: "404" })).toBeVisible();

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Changer de langue" }),
      { button: 0, ctrlKey: false },
    );
    fireEvent.click(
      await screen.findByRole("menuitem", { name: /日本語/ }),
    );

    await waitFor(() =>
      expect(window.location.pathname).toBe("/ja/not-a-public-page"),
    );
    expect(await screen.findByRole("heading", { name: "404" })).toBeVisible();
    expect(robotsContent()).toBe("noindex, follow");
  });
});
