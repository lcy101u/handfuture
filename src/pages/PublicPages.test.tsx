import { act, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SiteLayout from "@/components/layout/SiteLayout";
import RouteErrorBoundary from "@/components/routing/RouteErrorBoundary";
import { GUIDE_CONTENT } from "@/content/guides";
import {
  ABOUT_CONTENT,
  PRIVACY_CONTENT,
  TERMS_CONTENT,
} from "@/content/policies";
import {
  PUBLIC_PATHS,
  type GuidePath,
  type PublicPath,
} from "@/config/public-routes";
import { useLanguageStore } from "@/store/language-store";
import AboutPage from "./AboutPage";
import GuidePage from "./GuidePage";
import HowItWorksPage from "./HowItWorksPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import TermsPage from "./TermsPage";

const guidePaths = PUBLIC_PATHS.filter(
  (path): path is GuidePath => path.startsWith("/guides/"),
);

function renderInLayout(page: React.ReactNode, entry: PublicPath = "/") {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <SiteLayout>{page}</SiteLayout>
    </MemoryRouter>,
  );
}

describe("public page shell", () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ currentLanguage: "en" });
  });

  it("links every approved route exactly once in the header and footer", () => {
    renderInLayout(<HowItWorksPage />, "/how-it-works");

    for (const landmark of [screen.getByRole("banner"), screen.getByRole("contentinfo")]) {
      const hrefs = within(landmark)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"));

      expect(hrefs).toEqual(PUBLIC_PATHS);
      expect(new Set(hrefs).size).toBe(PUBLIC_PATHS.length);
      expect(hrefs).not.toContain("/batch");
      expect(hrefs).not.toContain("#");
    }
  });

  it("keeps the footer concise and free of unverified claims or contact links", () => {
    renderInLayout(<HowItWorksPage />, "/how-it-works");
    const footer = screen.getByRole("contentinfo");

    expect(footer).toHaveTextContent("Independent cultural exploration web project");
    expect(footer.textContent).not.toMatch(/ratings?|users?|members?/i);
    expect(within(footer).queryByRole("link", { name: /@/ })).not.toBeInTheDocument();
    expect(
      within(footer)
        .getAllByRole("link")
        .some((link) => link.getAttribute("href")?.startsWith("mailto:")),
    ).toBe(false);
  });
});

describe("sourced public articles", () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ currentLanguage: "en" });
  });

  it.each(guidePaths)("renders one heading, publisher, date, and visible sources for %s", (path) => {
    renderInLayout(<GuidePage path={path} />, path);
    const article = screen.getByRole("article");
    const page = GUIDE_CONTENT[path].en;

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(within(article).getByRole("heading", { level: 1 })).toHaveTextContent(page.title);
    expect(within(article).getByText("HandFuture", { selector: "span" })).toBeVisible();
    expect(within(article).getByText("2026-07-26", { selector: "time" })).toHaveAttribute(
      "datetime",
      "2026-07-26",
    );
    for (const source of page.sources) {
      expect(within(article).getByRole("link", { name: source.label })).toHaveAttribute(
        "href",
        source.url,
      );
    }
  });

  it("explains 21 landmarks and that palm creases are not detected", () => {
    renderInLayout(<HowItWorksPage />, "/how-it-works");
    const article = screen.getByRole("article");

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(article).toHaveTextContent("21");
    expect(article).toHaveTextContent(/does not identify.*palm crease/i);
  });

  it("rerenders guide content in Chinese", () => {
    const path: GuidePath = "/guides/palmistry-basics";
    renderInLayout(<GuidePage path={path} />, path);

    act(() => useLanguageStore.getState().setLanguage("zh"));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      GUIDE_CONTENT[path].zh.title,
    );
    expect(screen.getByRole("heading", { name: "參考資料" })).toBeVisible();
  });

  it("keeps the default guide eyebrow for guides and how-it-works", () => {
    renderInLayout(<GuidePage path="/guides/palmistry-basics" />, "/guides/palmistry-basics");
    expect(screen.getByText("Culture and technology guide")).toBeVisible();

    renderInLayout(<HowItWorksPage />, "/how-it-works");
    expect(screen.getAllByText("Culture and technology guide").length).toBeGreaterThan(0);
  });

  it("renders external guide sources as new-tab anchors, not router links", () => {
    const path: GuidePath = "/guides/palmistry-basics";
    renderInLayout(<GuidePage path={path} />, path);
    const article = screen.getByRole("article");
    const page = GUIDE_CONTENT[path].en;

    for (const source of page.sources) {
      const link = within(article).getByRole("link", { name: source.label });
      expect(link).toHaveAttribute("href", source.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });
});

describe("factual trust and policy pages", () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ currentLanguage: "en" });
  });

  it.each([
    ["/about", <AboutPage />, ABOUT_CONTENT.en],
    ["/privacy", <PrivacyPolicyPage />, PRIVACY_CONTENT.en],
    ["/terms", <TermsPage />, TERMS_CONTENT.en],
  ] as const)("renders %s as one dated article in the shared shell", (path, page, content) => {
    renderInLayout(page, path);
    const article = screen.getByRole("article");

    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(within(article).getByRole("heading", { level: 1 })).toHaveTextContent(content.title);
    expect(within(article).getByText("HandFuture", { selector: "span" })).toBeVisible();
    expect(within(article).getByText("2026-07-26", { selector: "time" })).toHaveAttribute(
      "datetime",
      "2026-07-26",
    );
    for (const section of content.sections) {
      expect(within(article).getByRole("heading", { name: section.heading })).toBeVisible();
    }
    for (const source of content.sources) {
      expect(within(article).getByRole("link", { name: source.label })).toHaveAttribute(
        "href",
        source.url,
      );
    }
  });

  it("shows the observed image, storage, hosting, advertising, and DNS flows", () => {
    renderInLayout(<PrivacyPolicyPage />, "/privacy");
    const article = screen.getByRole("article");

    expect(article).toHaveTextContent(/FileReader/);
    expect(article).toHaveTextContent(/HTMLImageElement/);
    expect(article).toHaveTextContent(/MediaPipe/);
    expect(article).not.toHaveTextContent(/canvas/i);
    expect(article).toHaveTextContent(/not sent to a HandFuture application server/i);
    expect(article).toHaveTextContent(/current page memory/i);
    expect(article).toHaveTextContent(/palm-reading-storage/);
    expect(article).toHaveTextContent(/language-store/);
    expect(article).toHaveTextContent(/palm-theme/);
    expect(article).not.toHaveTextContent(/image-filter-storage/);
    expect(article).toHaveTextContent(/Vercel Web Analytics/);
    expect(article).toHaveTextContent(/Google AdSense/);
    expect(article).toHaveTextContent(/Google-certified CMP/);
    expect(article).toHaveTextContent(/Cloudflare provides authoritative DNS only/i);
    expect(article).toHaveTextContent(
      "This address is monitored only after domain email routing is enabled.",
    );
  });

  it("discloses MediaPipe and Google Fonts asset requests without exposing the hand image", () => {
    renderInLayout(<PrivacyPolicyPage />, "/privacy");
    const article = screen.getByRole("article");

    expect(article).toHaveTextContent("cdn.jsdelivr.net");
    expect(article).toHaveTextContent("fonts.googleapis.com");
    expect(article).toHaveTextContent("fonts.gstatic.com");
    expect(article).toHaveTextContent(/IP address/i);
    expect(article).toHaveTextContent(/user agent/i);
    expect(article).toHaveTextContent(/do not include the selected hand image/i);
  });

  it("shows entertainment-only and acceptable-use boundaries", () => {
    renderInLayout(<TermsPage />, "/terms");
    const article = screen.getByRole("article");

    expect(article).toHaveTextContent(/Entertainment only/);
    expect(article).toHaveTextContent(/mental-health.*financial.*employment.*compatibility/i);
    expect(article).toHaveTextContent(/automated traffic/);
    expect(article).toHaveTextContent(/ad manipulation/);
    expect(article).toHaveTextContent(/does not claim ownership/);
    expect(article).toHaveTextContent(/no uptime guarantee/);
    expect(within(article).getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it.each([
    ["/about", <AboutPage />, "About this site"],
    ["/privacy", <PrivacyPolicyPage />, "Privacy and data handling"],
    ["/terms", <TermsPage />, "Terms and service scope"],
  ] as const)("gives %s its own eyebrow distinct from the guide eyebrow", (path, page, eyebrow) => {
    renderInLayout(page, path);

    expect(screen.getByText(eyebrow)).toBeVisible();
    expect(screen.queryByText("Culture and technology guide")).not.toBeInTheDocument();
  });

  it("does not render a Sources heading or list when a page has no sources", () => {
    renderInLayout(<AboutPage />, "/about");

    expect(ABOUT_CONTENT.en.sources).toHaveLength(0);
    expect(screen.queryByRole("heading", { name: "Sources" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "參考資料" })).not.toBeInTheDocument();
  });

  it("links Terms' Privacy Policy reference with an in-app router Link, not a new-tab anchor", () => {
    renderInLayout(<TermsPage />, "/terms");
    const article = screen.getByRole("article");
    const link = within(article).getByRole("link", { name: "Privacy Policy" });

    expect(link).toHaveAttribute("href", "/privacy");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("rerenders policy content in Chinese", () => {
    renderInLayout(<PrivacyPolicyPage />, "/privacy");

    act(() => useLanguageStore.getState().setLanguage("zh"));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("隱私政策");
    expect(screen.getByRole("heading", { name: "瀏覽器儲存" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Google 廣告" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "區域同意" })).toBeVisible();
  });

  it.each([
    ["/about", <AboutPage />],
    ["/privacy", <PrivacyPolicyPage />],
    ["/terms", <TermsPage />],
  ] as const)("removes unsupported providers, contacts, and promises from %s", (path, page) => {
    const { container } = renderInLayout(page, path);

    expect(container).not.toHaveTextContent(
      /GA4|Google Analytics 4|cloud export|90 days|MFA|multi-factor|seven business days|legal@handfortune\.com|dontsp\.am/i,
    );
  });
});

describe("RouteErrorBoundary", () => {
  it("shows localized recovery content and a reload button after a child error", () => {
    useLanguageStore.setState({ currentLanguage: "en" });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const preventWindowError = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener("error", preventWindowError);

    function BrokenPage(): never {
      throw new Error("chunk failed");
    }

    render(
      <MemoryRouter>
        <RouteErrorBoundary>
          <BrokenPage />
        </RouteErrorBoundary>
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/could not load/i);
    expect(screen.getByRole("button", { name: /reload/i })).toBeVisible();
    window.removeEventListener("error", preventWindowError);
    consoleError.mockRestore();
  });
});
