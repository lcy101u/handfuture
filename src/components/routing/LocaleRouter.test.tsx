import { Suspense } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SiteLayout from "@/components/layout/SiteLayout";
import RouteMeta from "@/components/seo/RouteMeta";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import LocaleRouter from "./LocaleRouter";
import { localizedPathForCurrentRoute } from "./locale-routing";

const localizedHeadings: Record<Locale, string> = {
  "zh-TW": "從一張手部照片，開始一段文化探索",
  "zh-CN": "从一张手部照片，开始一段文化探索",
  en: "Start a cultural exploration with one hand photo",
  ja: "1枚の手の写真から、文化を探る旅へ",
  ko: "손 사진 한 장으로 문화 탐구를 시작하세요",
  es: "Empieza una exploración cultural con una foto de una mano",
  "pt-BR": "Comece uma exploração cultural com uma foto de uma mão",
  fr: "Commencez une exploration culturelle avec une photo de main",
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
      "/ja/guides/palmistry-basics",
      "/ja/guides/science-and-limitations",
      "/ja/guides/hand-photo-guide",
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
