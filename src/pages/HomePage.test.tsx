import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import SiteLayout from "@/components/layout/SiteLayout";
import type { HandLandmark } from "@/lib/hand-detector";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";
import HomePage from "./HomePage";

const landmarks: HandLandmark[] = Array.from({ length: 21 }, (_, index) => ({
  x: 0.2 + index * 0.01,
  y: 0.8 - index * 0.015,
  z: -index * 0.001,
}));

function renderHome() {
  return render(
    <MemoryRouter>
      <SiteLayout>
        <HomePage />
      </SiteLayout>
    </MemoryRouter>,
  );
}

describe("HomePage truthful reflection flow", () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.getState().setLanguage("en");
    usePalmStore.setState({
      image: null,
      detection: null,
      reflectionKey: null,
      isDetecting: false,
      error: null,
      disclaimerAccepted: false,
    });
  });

  it("renders only truthful hand-joint and reflection claims", () => {
    renderHome();

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /understand hand detection—and the limits of a claim/i,
    );
    expect(screen.getByRole("link", { name: /handfuture home/i })).toBeVisible();
    expect(document.body).toHaveTextContent(/non-scientific.*(?:cultural )?entertainment/i);
    expect(document.body.textContent).not.toMatch(
      /(?:predicts? your future|diagnoses? health|reveals? your personality|scientifically proven palm reading)/i,
    );
  });

  it("puts original learning content before the tool and links the featured guides", () => {
    renderHome();

    const hero = screen.getByRole("heading", {
      name: /understand hand detection—and the limits of a claim/i,
    }).closest("section");
    const continueReading = screen.getByRole("heading", {
      name: /continue reading/i,
    }).closest("section");
    const disclosure = screen.getByText(
      /please review and accept the disclaimer before starting an analysis/i,
    ).closest("section");
    const tool = screen.getByRole("region", { name: /choose a hand photo/i });
    const features = screen.getByRole("heading", {
      name: /in-browser detection/i,
    }).closest("section");
    const faq = screen.getByRole("heading", { name: /frequently asked questions/i }).closest("section");

    expect(hero?.compareDocumentPosition(continueReading as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(continueReading?.compareDocumentPosition(disclosure as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(disclosure?.compareDocumentPosition(tool)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(tool.compareDocumentPosition(features as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(features?.compareDocumentPosition(faq as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );

    const guideLinks = within(continueReading as HTMLElement)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(guideLinks).toEqual([
      "/en/guides",
      "/en/guides/hand-landmark-atlas",
      "/en/guides/creases-vs-landmarks",
      "/en/guides/barnum-effect-lab",
      "/en/guides/evaluating-palmistry-claims",
    ]);

    const footerLinks = within(screen.getByRole("contentinfo"))
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(footerLinks).toEqual([
      "/en/",
      "/en/guides",
      "/en/how-it-works",
      "/en/about",
      "/en/privacy",
      "/en/terms",
    ]);
  });

  it("renders the factual home copy in Traditional Chinese", () => {
    useLanguageStore.getState().setLanguage("zh-TW");
    renderHome();

    expect(
      screen.getByRole("heading", { name: "看懂手部偵測，也看懂說法的界線" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "瀏覽器內偵測" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "文化反思卡" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "照片不會上傳" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "繼續閱讀" })).toBeVisible();
  });

  it("localizes direct home-page accessible labels", () => {
    useLanguageStore.getState().setLanguage("ja");
    renderHome();

    expect(screen.getByRole("region", { name: "手の写真を選択" })).toBeVisible();
    expect(screen.getByRole("region", { name: "製品の特徴" })).toBeVisible();
    expect(screen.getByRole("link", { name: "HandFuture ホーム" })).toBeVisible();
  });

  it("does not open the disclaimer automatically", () => {
    renderHome();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view disclaimer/i }),
    ).toBeVisible();
  });

  it("requires a second explicit click after accepting the disclaimer", () => {
    usePalmStore.setState({
      image: "data:image/png;base64,hand",
      detection: { status: "success", landmarks, handedness: "Right" },
    });
    renderHome();

    fireEvent.click(
      screen.getByRole("button", { name: /choose reflection card/i }),
    );
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(usePalmStore.getState().reflectionKey).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: /i understand and agree/i }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(usePalmStore.getState().reflectionKey).toBeNull();

    act(() => {
      fireEvent.click(
        screen.getByRole("button", { name: /choose reflection card/i }),
      );
    });
    expect(usePalmStore.getState().reflectionKey).not.toBeNull();
  });
});
