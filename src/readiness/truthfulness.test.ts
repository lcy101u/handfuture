// @vitest-environment node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function collectProductionFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(root, absolutePath).split(path.sep).join("/");

    if (entry.isDirectory()) {
      return relativePath === "src/readiness"
        ? []
        : collectProductionFiles(absolutePath);
    }

    const isProductionSource = /\.(?:ts|tsx|html|css)$/.test(entry.name);
    const isTest = /\.test\.(?:ts|tsx)$/.test(entry.name);
    const isUnrelatedSkeleton = [
      "src/components/ui/sidebar.tsx",
      "src/components/ui/skeleton.tsx",
    ].includes(relativePath);

    return isProductionSource && !isTest && !isUnrelatedSkeleton
      ? [absolutePath]
      : [];
  });
}

const prohibitedPublicClaims = [
  /2847/i,
  /98%/i,
  /95%/i,
  /aggregateRating/i,
  /YOUR_FACEBOOK_APP_ID/i,
  /PalmReadingAI/i,
  /static\.devv\.ai/i,
  /dontsp\.am/i,
  /三十萬|300,000/i,
  /真實.*評價|verified review/i,
  /準確度高達|accuracy of over/i,
];

const removedPaths = [
  "src/components/analytics/AnalyticsDashboard.tsx",
  "src/components/ui/chart.tsx",
  "src/components/content/PublisherContent.tsx",
  "src/components/feedback/FeedbackModal.tsx",
  "src/components/feedback/FeedbackSection.tsx",
  "src/store/feedback-store.ts",
  "src/components/onboarding/OnboardingOverlay.tsx",
  "src/components/onboarding/WelcomeModal.tsx",
  "src/store/onboarding-store.ts",
  "src/components/palm/BatchProcessor.tsx",
  "src/pages/BatchPage.tsx",
  "src/store/batch-store.ts",
  "src/store/analytics-store.ts",
];

describe("public source truthfulness", () => {
  it("contains none of the prohibited public claims", () => {
    const productionSource = [
      ...collectProductionFiles(path.join(root, "src")),
      path.join(root, "index.html"),
    ]
      .map((file) => fs.readFileSync(file, "utf8"))
      .join("\n");

    for (const pattern of prohibitedPublicClaims) {
      expect(productionSource, pattern.toString()).not.toMatch(pattern);
    }
  });

  it("removes every obsolete fabricated feature file", () => {
    for (const removedPath of removedPaths) {
      expect(fs.existsSync(path.join(root, removedPath)), removedPath).toBe(false);
    }
  });

  it("keeps obsolete routes out of App and links every guide from Home", () => {
    const appSource = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
    const homeSource = fs.readFileSync(
      path.join(root, "src/pages/HomePage.tsx"),
      "utf8",
    );

    expect(appSource).not.toMatch(/\/batch|BatchPage|AnalyticsDashboard/i);
    for (const guidePath of [
      "/guides/palmistry-basics",
      "/guides/science-and-limitations",
      "/guides/hand-photo-guide",
    ]) {
      expect(homeSource, guidePath).toContain(guidePath);
    }
  });
});
