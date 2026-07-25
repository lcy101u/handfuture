import { act, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SiteLayout from "@/components/layout/SiteLayout";
import RouteErrorBoundary from "@/components/routing/RouteErrorBoundary";
import { GUIDE_CONTENT } from "@/content/guides";
import {
  PUBLIC_PATHS,
  type GuidePath,
  type PublicPath,
} from "@/config/public-routes";
import { useLanguageStore } from "@/store/language-store";
import GuidePage from "./GuidePage";
import HowItWorksPage from "./HowItWorksPage";

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
