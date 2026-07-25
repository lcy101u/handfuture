# HandFuture AdSense Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild HandFuture into an honest, crawlable, content-led palmistry culture experience that addresses every repository, layout, navigation, privacy, ownership, and content-quality issue found in the AdSense audit.

**Architecture:** Keep the React/Vite single-page application, but centralize its eight public routes and route metadata, configure Vercel to serve only those client routes, and use a real MediaPipe hand-landmark adapter behind a typed interface. A pure deterministic reflection engine converts detected geometry into clearly labeled entertainment prompts; bilingual editorial content and policy pages live separately from the detector and AdSense ownership code.

**Tech Stack:** React 18, TypeScript 5.7, Vite, React Router, Zustand, MediaPipe Hands, Tailwind CSS, Vitest 4, Testing Library, Vercel, Google AdSense.

## Global Constraints

- Preserve the existing uncommitted changes in `src/pages/HomePage.tsx`, `src/store/language-store.ts`, and generated `dist/`; specifically retain the user-initiated disclaimer flow while integrating it into the new experience.
- Do not stage unrelated working-tree changes. Use path-specific `git add` commands, inspect `git diff --cached` before every commit, and regenerate `dist/` only in the final task.
- The publisher identity is `HandFuture`; do not invent a team, expert credentials, datasets, users, reviews, ratings, response times, or measured accuracy.
- The canonical origin is exactly `https://www.handfortune.com`; the apex host must permanently redirect to `www`.
- The AdSense publisher ID is exactly `ca-pub-3713047615080346`; include the head script once and do not ship a manual ad unit during review.
- `public/ads.txt` must contain exactly `google.com, pub-3713047615080346, DIRECT, f08c47fec0942fa0` followed by one newline.
- Palm images stay in browser memory. Do not add an upload API, cloud image storage, server-side image logging, or analytics properties containing image data.
- MediaPipe Hands may claim only hand presence, handedness, and 21 landmarks. It must not claim palm-crease detection, personality measurement, medical inference, future prediction, or confidence in a palm reading.
- Reflection output must be deterministic for the same landmarks and visibly labeled as non-scientific entertainment.
- Public routes are exactly `/`, `/how-it-works`, `/guides/palmistry-basics`, `/guides/science-and-limitations`, `/guides/hand-photo-guide`, `/about`, `/privacy`, and `/terms`.
- Remove `/batch`, fabricated feedback, hidden analytics UI, onboarding claims, development/editor runtime code, fake social identifiers, and all unsupported metrics from public source and output.
- Keep Cloudflare DNS-only and Vercel as the serving CDN. Do not change Spaceship, Cloudflare, Vercel, Search Console, or AdSense account settings in repository implementation.
- Do not enforce a Content Security Policy in this release. Add only the conservative headers specified in Task 2.
- AdSense approval and revenue are not guaranteed by this work. The handoff must distinguish repository completion from account-side and DNS-side release actions.

## Authoritative Reference Baseline

- AdSense site-approval playlist supplied by the review email: `https://www.youtube.com/playlist?list=PLbAFD4oU9Ycr4j1pViNjkS82rhbF293H8`. Recheck its six themes in Task 10: ownership/basic setup, legitimate traffic, valuable original content, clear navigation, rejection causes, and complete ad code.
- AdSense site readiness: `https://support.google.com/adsense/answer/12176698`
- AdSense site ownership: `https://support.google.com/adsense/answer/12131223`
- AdSense crawler troubleshooting: `https://support.google.com/adsense/answer/2381908`
- ads.txt troubleshooting: `https://support.google.com/adsense/answer/7679060`
- Google-certified CMP requirement: `https://support.google.com/adsense/answer/13554116`
- AdSense policy overview: `https://support.google.com/adsense/answer/1261929`
- Google helpful-content guidance: `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- Google JavaScript SEO guidance: `https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics`
- Vercel project configuration: `https://vercel.com/docs/project-configuration/vercel-json`
- Vercel rewrites: `https://vercel.com/docs/routing/rewrites`
- Vercel Analytics privacy: `https://vercel.com/docs/analytics/privacy-policy`
- MediaPipe Hand Landmarker: `https://developers.google.com/mediapipe/solutions/vision/hand_landmarker`

## File and Responsibility Map

### Create

- `vitest.config.ts` — browser-like unit-test configuration and `@/` alias.
- `src/test/setup.ts` — Testing Library matchers and per-test DOM cleanup.
- `src/config/public-routes.ts` — single typed list of eight public paths.
- `src/config/site-metadata.ts` — canonical URLs, bilingual metadata, and JSON-LD builders.
- `src/config/public-routes.test.ts` — route and metadata uniqueness contract.
- `src/readiness/publisher-files.test.ts` — exact ads.txt, sitemap, robots, Vercel, and document-head checks.
- `src/readiness/truthfulness.test.ts` — production-source scan for known fabricated or development-only output.
- `src/lib/hand-detector.ts` — MediaPipe adapter and typed detection outcomes.
- `src/lib/hand-detector.test.ts` — success, no-hand, multiple-hand, initialization, send-error, and cleanup tests.
- `src/lib/reflection-engine.ts` — pure, deterministic reflection-card selection.
- `src/lib/reflection-engine.test.ts` — determinism, geometry validation, and prohibited-claim tests.
- `src/store/palm-store.test.ts` — detector-result mapping, reflection creation, reset, and persisted-state contract.
- `src/components/palm/ReflectionResult.tsx` — localized entertainment reflection UI.
- `src/components/palm/HandPreview.test.tsx` — real detector state-transition coverage.
- `src/components/palm/ReflectionResult.test.tsx` — visible disclaimer and safe-copy coverage.
- `src/components/layout/SiteHeader.tsx` — consistent public navigation, language, and theme controls.
- `src/components/layout/SiteFooter.tsx` — concise real links and publisher identity.
- `src/components/layout/SiteLayout.tsx` — common shell around public pages.
- `src/components/seo/RouteMeta.tsx` — updates title, metadata, canonical, language, and JSON-LD after navigation.
- `src/components/seo/RouteMeta.test.tsx` — metadata behavior in both languages.
- `src/components/routing/RouteErrorBoundary.tsx` — accessible recovery UI for lazy-chunk failures.
- `src/content/guides.ts` — sourced bilingual guide and how-it-works copy.
- `src/content/guides.test.ts` — content completeness, citations, update dates, and safe-claim checks.
- `src/pages/HowItWorksPage.tsx` — visible explanation of processing and limitations.
- `src/pages/GuidePage.tsx` — renders one typed guide with visible sources.
- `src/pages/PublicPages.test.tsx` — navigation, headings, sources, and valid link coverage.
- `src/content/policies.ts` — factual bilingual About, Privacy, and Terms copy.
- `src/content/policies.test.ts` — provider, storage, contact, and unsupported-promise checks.

### Modify

- `package.json`, `package-lock.json` — test scripts, supported dependency upgrades, and removal of unused packages.
- `index.html` — truthful home metadata, single AdSense ownership script, safe WebApplication JSON-LD, and no Devv script.
- `vercel.json` — apex redirect, exact valid-route rewrites, content types, and security headers.
- `public/ads.txt`, `public/robots.txt`, `public/sitemap.xml`, `public/og-image.jpg` — publisher and crawl assets.
- `src/App.tsx` — eight public routes, common layout, metadata, loading, and chunk-error UI.
- `src/pages/HomePage.tsx` — truthful product positioning, real detector flow, related content, and removal of unsupported UI.
- `src/pages/AboutPage.tsx`, `src/pages/PrivacyPolicyPage.tsx`, `src/pages/TermsPage.tsx` — factual page renderers backed by `src/content/policies.ts`.
- `src/pages/NotFoundPage.tsx` — common layout compatibility and one clear home link.
- `src/store/palm-store.ts` — image, detector result, reflection key, progress, error, and disclaimer state only.
- `src/store/language-store.ts` — preserve the user’s disclaimer behavior while replacing false claims and removing obsolete feature copy.
- `src/components/palm/HandPreview.tsx` — run MediaPipe against the selected image and render real outcomes.
- `src/components/palm/DisclaimerModal.tsx` — exact entertainment and privacy disclosure.
- `src/components/palm/ImageUploader.tsx` — maintain file-size/type checks and clear detector state for a new image.
- `src/components/social/SocialShare.tsx` — share the culture experience without ratings or accuracy.
- `src/index.css` — remove styles used only by deleted batch/feedback/onboarding UI.

### Delete

- `public/_headers` — Netlify-format file ignored by Vercel.
- `src/components/ads/GoogleAdBanner.tsx` — unverified manual ad slot and blank ad card.
- `src/components/analytics/AnalyticsDashboard.tsx`, `src/components/ui/chart.tsx` — hidden public analytics UI and Recharts dependency.
- `src/components/content/PublisherContent.tsx` — unsupported dataset and publishing-operation claims.
- `src/components/feedback/FeedbackModal.tsx`, `src/components/feedback/FeedbackSection.tsx`, `src/store/feedback-store.ts` — fabricated public social proof.
- `src/components/onboarding/OnboardingOverlay.tsx`, `src/components/onboarding/WelcomeModal.tsx`, `src/store/onboarding-store.ts` — tour built around unsupported features.
- `src/components/palm/BatchProcessor.tsx`, `src/pages/BatchPage.tsx`, `src/store/batch-store.ts` — random public batch analysis.
- `src/components/palm/PalmAnalysis.tsx` — random palm-line analysis superseded by `ReflectionResult`.
- `src/store/analytics-store.ts` — private local dashboard/session telemetry that is not needed for the public experience.

---

### Task 1: Lock the Public Route and Metadata Contract

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/config/public-routes.ts`
- Create: `src/config/site-metadata.ts`
- Create: `src/config/public-routes.test.ts`

**Interfaces:**
- Produces: `PUBLIC_PATHS`, `PublicPath`, `Locale`, `SITE_ORIGIN`, `SITE_NAME`, `PUBLISHER_ID`, `ADS_TXT_RECORD`, `getRouteMetadata(path, locale)`, and `buildStructuredData(path, locale)`.
- Consumes: no earlier implementation task.

- [ ] **Step 1: Record and protect the current dirty source changes**

Run:

```bash
git status --short
git diff -- src/pages/HomePage.tsx src/store/language-store.ts
git diff --stat -- dist
```

Expected: the disclaimer-trigger changes in `HomePage.tsx` and `language-store.ts` are visible; no cleanup, checkout, reset, stash, or generated-file rebuild is performed.

- [ ] **Step 2: Install the test harness and add scripts**

Run:

```bash
npm install --save-dev --save-exact vitest@4.1.10 @testing-library/react@16.3.2 @testing-library/jest-dom@7.0.0 jsdom@29.1.1
```

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "audit:adsense": "vitest run src/config src/readiness src/content src/lib src/components/seo src/components/palm"
  }
}
```

Create `vitest.config.ts`:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: { alias: { "@": path.resolve(projectRoot, "src") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());
```

- [ ] **Step 3: Write the failing route-contract test**

Create `src/config/public-routes.test.ts` with these assertions:

```ts
import { describe, expect, it } from "vitest";
import { PUBLIC_PATHS } from "./public-routes";
import { SITE_ORIGIN, buildStructuredData, getRouteMetadata } from "./site-metadata";

const expectedPaths = [
  "/",
  "/how-it-works",
  "/guides/palmistry-basics",
  "/guides/science-and-limitations",
  "/guides/hand-photo-guide",
  "/about",
  "/privacy",
  "/terms",
] as const;

describe("public route contract", () => {
  it("contains exactly the eight approved public paths", () => {
    expect(PUBLIC_PATHS).toEqual(expectedPaths);
    expect(new Set(PUBLIC_PATHS).size).toBe(PUBLIC_PATHS.length);
  });

  it.each(["zh", "en"] as const)("has unique complete %s metadata", (locale) => {
    const records = PUBLIC_PATHS.map((path) => getRouteMetadata(path, locale));
    expect(new Set(records.map(({ title }) => title)).size).toBe(records.length);
    for (const [index, record] of records.entries()) {
      const path = PUBLIC_PATHS[index];
      const suffix = path === "/" ? "/" : path;
      expect(record.description.length).toBeGreaterThan(70);
      expect(record.canonical).toBe(`${SITE_ORIGIN}${suffix}`);
      expect(record.ogUrl).toBe(record.canonical);
      expect(record.ogImage).toBe(`${SITE_ORIGIN}/og-image.jpg`);
    }
  });

  it("uses WebApplication only for home and Article only for guides", () => {
    expect(buildStructuredData("/", "zh")["@type"]).toBe("WebApplication");
    expect(buildStructuredData("/guides/palmistry-basics", "en")["@type"]).toBe("Article");
    expect(JSON.stringify(buildStructuredData("/", "zh"))).not.toContain("aggregateRating");
  });
});
```

- [ ] **Step 4: Run the test and confirm the missing contract**

Run:

```bash
npm test -- src/config/public-routes.test.ts
```

Expected: FAIL because `public-routes.ts` and `site-metadata.ts` do not exist.

- [ ] **Step 5: Implement the route types and constants**

Create `src/config/public-routes.ts`:

```ts
export const PUBLIC_PATHS = [
  "/",
  "/how-it-works",
  "/guides/palmistry-basics",
  "/guides/science-and-limitations",
  "/guides/hand-photo-guide",
  "/about",
  "/privacy",
  "/terms",
] as const;

export type PublicPath = (typeof PUBLIC_PATHS)[number];
export type GuidePath = Extract<PublicPath, `/guides/${string}`>;
export type Locale = "zh" | "en";

export function isPublicPath(value: string): value is PublicPath {
  return (PUBLIC_PATHS as readonly string[]).includes(value);
}
```

Create `src/config/site-metadata.ts` with these exported constants and types:

```ts
import type { Locale, PublicPath } from "./public-routes";

export const SITE_ORIGIN = "https://www.handfortune.com";
export const SITE_NAME = "HandFuture";
export const PUBLISHER_ID = "ca-pub-3713047615080346";
export const ADS_TXT_RECORD = "google.com, pub-3713047615080346, DIRECT, f08c47fec0942fa0";
export const LAST_UPDATED = "2026-07-26";

export interface RouteMetadata {
  title: string;
  description: string;
  canonical: string;
  ogUrl: string;
  ogImage: string;
  ogImageAlt: string;
}

type LocalizedMetadata = Record<Locale, Pick<RouteMetadata, "title" | "description" | "ogImageAlt">>;
```

Populate `Record<PublicPath, LocalizedMetadata>` with unique titles and descriptions that use these exact page positions:

```ts
const metadata = {
  "/": {
    zh: { title: "HandFuture｜手相文化探索與手部偵測體驗", description: "從文化角度認識手相傳統，使用瀏覽器內的手部偵測完成一張非科學、僅供娛樂與自我反思的提示卡；照片不會上傳到 HandFuture 伺服器。", ogImageAlt: "HandFuture 手相文化探索與手部偵測體驗" },
    en: { title: "HandFuture | Palmistry Culture and Hand Detection", description: "Explore palmistry as a cultural tradition and use in-browser hand detection to receive a non-scientific reflection prompt for entertainment; your photo is not uploaded to a HandFuture server.", ogImageAlt: "HandFuture palmistry culture and hand detection experience" },
  },
  "/how-it-works": {
    zh: { title: "運作方式｜HandFuture", description: "了解 HandFuture 如何在瀏覽器內尋找 21 個手部關節座標、如何選出娛樂性反思卡，以及這項工具不能辨識掌紋或預測人生的原因。", ogImageAlt: "HandFuture 的瀏覽器內手部偵測流程" },
    en: { title: "How HandFuture Works", description: "Learn how HandFuture finds 21 hand landmarks in your browser, selects an entertainment reflection card, and why the tool cannot read palm creases or predict life outcomes.", ogImageAlt: "HandFuture in-browser hand detection flow" },
  },
  "/guides/palmistry-basics": {
    zh: { title: "手相文化入門：傳統名稱與歷史脈絡｜HandFuture", description: "以文化史角度認識手相、生命線、智慧線與感情線等傳統名稱，並清楚區分歷史信仰、娛樂用途與現代科學證據。", ogImageAlt: "手相文化入門指南" },
    en: { title: "Palmistry Basics: Traditional Names and Context | HandFuture", description: "A cultural introduction to palmistry and traditional names such as the life, head, and heart lines, clearly separated from modern scientific evidence and safe entertainment use.", ogImageAlt: "Palmistry basics cultural guide" },
  },
  "/guides/science-and-limitations": {
    zh: { title: "手相、科學與限制：如何安全看待解讀｜HandFuture", description: "說明手部關節偵測與掌紋解讀的差異、巴納姆效應如何影響感受，以及為何手相內容不應取代醫療、財務或人生決策。", ogImageAlt: "手相科學限制與安全使用指南" },
    en: { title: "Palmistry, Science, and Limitations | HandFuture", description: "Understand the difference between hand-landmark detection and palm reading, how the Barnum effect shapes impressions, and why palmistry should not guide medical, financial, or life decisions.", ogImageAlt: "Palmistry science and limitations guide" },
  },
  "/guides/hand-photo-guide": {
    zh: { title: "手部照片指南：光線、角度與隱私｜HandFuture", description: "用均勻光線、單手、素色背景與完整入鏡提高瀏覽器手部偵測的成功率，並了解照片只在目前瀏覽器工作階段處理。", ogImageAlt: "手部照片拍攝與隱私指南" },
    en: { title: "Hand Photo Guide: Lighting, Framing, and Privacy | HandFuture", description: "Improve browser hand detection with even lighting, one fully visible hand, and a plain background, while understanding how the photo is processed during the current browser session.", ogImageAlt: "Hand photo and privacy guide" },
  },
  "/about": {
    zh: { title: "關於 HandFuture", description: "HandFuture 是一個獨立網頁專案，透過手部偵測與有來源的文章，協助讀者以透明、非科學且僅供娛樂的方式探索手相文化。", ogImageAlt: "關於 HandFuture 獨立網頁專案" },
    en: { title: "About HandFuture", description: "HandFuture is an independent web project combining hand detection with sourced articles so readers can explore palmistry culture transparently as non-scientific entertainment.", ogImageAlt: "About the independent HandFuture web project" },
  },
  "/privacy": {
    zh: { title: "隱私政策｜HandFuture", description: "查看 HandFuture 如何在瀏覽器內處理手部照片、使用本機儲存空間與 Vercel Analytics，以及 Google 廣告與同意選項如何運作。", ogImageAlt: "HandFuture 隱私政策" },
    en: { title: "Privacy Policy | HandFuture", description: "See how HandFuture processes hand photos in the browser, uses local storage and Vercel Analytics, and how Google advertising and consent choices operate.", ogImageAlt: "HandFuture privacy policy" },
  },
  "/terms": {
    zh: { title: "使用條款｜HandFuture", description: "閱讀 HandFuture 的娛樂用途、年齡建議、禁止行為、智慧財產、服務可用性與責任限制，並了解本工具不提供專業建議。", ogImageAlt: "HandFuture 使用條款" },
    en: { title: "Terms of Use | HandFuture", description: "Read HandFuture's entertainment scope, age guidance, prohibited conduct, intellectual property, service availability, and limits, including that the tool provides no professional advice.", ogImageAlt: "HandFuture terms of use" },
  },
} satisfies Record<PublicPath, LocalizedMetadata>;
```

Implement `getRouteMetadata` by joining `SITE_ORIGIN` with the path and implement `buildStructuredData` so `/` returns visible `WebApplication` fields, guide paths return visible `Article` fields with `dateModified: LAST_UPDATED` and `publisher.name: SITE_NAME`, and other pages return `WebPage`. Do not include `aggregateRating`, `review`, `author` credentials, or fields not visible on the page.

Use these exact implementations after the metadata object:

```ts
export function getRouteMetadata(path: PublicPath, locale: Locale): RouteMetadata {
  const localized = metadata[path][locale];
  const canonical = `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
  return {
    ...localized,
    canonical,
    ogUrl: canonical,
    ogImage: `${SITE_ORIGIN}/og-image.jpg`,
  };
}

export function buildStructuredData(path: PublicPath, locale: Locale): Record<string, unknown> {
  const meta = getRouteMetadata(path, locale);
  const base = {
    "@context": "https://schema.org",
    name: meta.title,
    description: meta.description,
    url: meta.canonical,
    inLanguage: locale === "zh" ? "zh-TW" : "en",
  };

  if (path === "/") {
    return {
      ...base,
      "@type": "WebApplication",
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Web Browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "TWD" },
    };
  }

  if (path.startsWith("/guides/")) {
    return {
      ...base,
      "@type": "Article",
      dateModified: LAST_UPDATED,
      publisher: { "@type": "Organization", name: SITE_NAME },
    };
  }

  return { ...base, "@type": "WebPage", publisher: { "@type": "Organization", name: SITE_NAME } };
}
```

- [ ] **Step 6: Run the focused and full baseline checks**

Run:

```bash
npm test -- src/config/public-routes.test.ts
npm run lint
npm run build
```

Expected: all three commands exit 0. The existing product behavior is otherwise unchanged.

- [ ] **Step 7: Commit only the route contract and test harness**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/config/public-routes.ts src/config/site-metadata.ts src/config/public-routes.test.ts
git diff --cached --check
git diff --cached --stat
git commit -m "test: define AdSense public route contract"
```

### Task 2: Repair Publisher Files, Vercel Routing, and AdSense Ownership

**Files:**
- Create: `src/readiness/publisher-files.test.ts`
- Modify: `public/ads.txt`
- Modify: `public/robots.txt`
- Modify: `public/sitemap.xml`
- Modify: `index.html`
- Modify: `vercel.json`
- Modify: `src/pages/HomePage.tsx`
- Delete: `public/_headers`
- Delete: `src/components/ads/GoogleAdBanner.tsx`

**Interfaces:**
- Consumes: `PUBLIC_PATHS`, `SITE_ORIGIN`, `PUBLISHER_ID`, and `ADS_TXT_RECORD` from Task 1.
- Produces: a repository contract for ownership files, exact client-route rewrites, canonical-host redirect, and review-build ad behavior.

- [ ] **Step 1: Write the failing publisher-file audit**

Create `src/readiness/publisher-files.test.ts` with Node environment and direct file reads:

```ts
// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ADS_TXT_RECORD, PUBLISHER_ID, SITE_ORIGIN } from "@/config/site-metadata";
import { PUBLIC_PATHS } from "@/config/public-routes";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

describe("publisher and crawl files", () => {
  it("has the exact AdSense record and final newline", () => {
    expect(read("public/ads.txt")).toBe(`${ADS_TXT_RECORD}\n`);
  });

  it("lists exactly the public canonical URLs", () => {
    const sitemap = read("public/sitemap.xml");
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toEqual(PUBLIC_PATHS.map((route) => `${SITE_ORIGIN}${route === "/" ? "/" : route}`));
    expect(sitemap).not.toContain("/batch");
  });

  it("allows search and ad crawlers and advertises the sitemap", () => {
    const robots = read("public/robots.txt");
    expect(robots).toContain("User-agent: *\nAllow: /");
    expect(robots).toContain("User-agent: Mediapartners-Google\nAllow: /");
    expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`);
    expect(robots).not.toMatch(/Crawl-delay/i);
  });

  it("has one ownership script and no manual ad, fake rating, or editor runtime", () => {
    const html = read("index.html");
    expect(html.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)).toHaveLength(1);
    expect(html).toContain(`client=${PUBLISHER_ID}`);
    expect(html).not.toMatch(/aggregateRating|YOUR_FACEBOOK_APP_ID|PalmReadingAI|static\.devv\.ai|90%/);
    expect(html).not.toContain("data-ad-slot");
  });

  it("redirects apex, rewrites each non-root public route, and applies safe headers", () => {
    const config = JSON.parse(read("vercel.json"));
    expect(config.redirects).toContainEqual({
      source: "/:path*",
      has: [{ type: "host", value: "handfortune.com" }],
      destination: "https://www.handfortune.com/:path*",
      permanent: true,
    });
    expect(config.rewrites).toEqual(PUBLIC_PATHS.filter((route) => route !== "/").map((source) => ({ source, destination: "/index.html" })));
    const allHeaders = config.headers.flatMap((entry: { headers: { key: string; value: string }[] }) => entry.headers);
    expect(allHeaders).toEqual(expect.arrayContaining([
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
    ]));
    expect(fs.existsSync(path.join(root, "public/_headers"))).toBe(false);
  });
});
```

- [ ] **Step 2: Run the audit and verify the current defects**

Run:

```bash
npm test -- src/readiness/publisher-files.test.ts
```

Expected: FAIL on the malformed local ads.txt suffix, `/batch` sitemap entry, missing AdSense script, fake structured rating, Devv runtime, missing route rewrites, and existing `_headers` file.

- [ ] **Step 3: Replace the public publisher and crawl files exactly**

Write `public/ads.txt` as:

```text
google.com, pub-3713047615080346, DIRECT, f08c47fec0942fa0
```

Write `public/robots.txt` as:

```text
User-agent: *
Allow: /

User-agent: Mediapartners-Google
Allow: /

Sitemap: https://www.handfortune.com/sitemap.xml
```

Write `public/sitemap.xml` with one `<url>` per Task 1 path, in the same order, using canonical `www` URLs, `<lastmod>2026-07-26</lastmod>`, and no fabricated priority or change frequency. Remove `public/_headers`.

- [ ] **Step 4: Configure Vercel for the canonical host and only valid client routes**

Replace `vercel.json` with:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "handfortune.com" }],
      "destination": "https://www.handfortune.com/:path*",
      "permanent": true
    }
  ],
  "rewrites": [
    { "source": "/how-it-works", "destination": "/index.html" },
    { "source": "/guides/palmistry-basics", "destination": "/index.html" },
    { "source": "/guides/science-and-limitations", "destination": "/index.html" },
    { "source": "/guides/hand-photo-guide", "destination": "/index.html" },
    { "source": "/about", "destination": "/index.html" },
    { "source": "/privacy", "destination": "/index.html" },
    { "source": "/terms", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=()" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
      ]
    },
    {
      "source": "/ads.txt",
      "headers": [
        { "key": "Content-Type", "value": "text/plain; charset=utf-8" },
        { "key": "Cache-Control", "value": "public, max-age=3600" }
      ]
    },
    {
      "source": "/robots.txt",
      "headers": [{ "key": "Content-Type", "value": "text/plain; charset=utf-8" }]
    },
    {
      "source": "/sitemap.xml",
      "headers": [{ "key": "Content-Type", "value": "application/xml; charset=utf-8" }]
    }
  ]
}
```

This intentionally does not use a global SPA catch-all: unknown server URLs stay real 404s instead of becoming soft-404 application shells.

- [ ] **Step 5: Make the document head truthful and add ownership once**

Replace the current title, descriptions, social fields, and JSON-LD in `index.html` with the Chinese home record from Task 1. Keep canonical `https://www.handfortune.com/`, `og:image` at `https://www.handfortune.com/og-image.jpg`, and `WebApplication` fields `name`, `description`, `url`, `applicationCategory: "EntertainmentApplication"`, `operatingSystem: "Web Browser"`, and a zero-price `Offer`. Give the initial JSON-LD element `id="route-structured-data"` so Task 6 updates it instead of creating a duplicate. Remove `keywords`, fake Facebook/Twitter identities, rating data, accuracy claims, and the Devv script.

Add exactly once inside `<head>`:

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3713047615080346"
  crossorigin="anonymous"
></script>
```

- [ ] **Step 6: Remove the manual ad component without disturbing the disclaimer change**

In `src/pages/HomePage.tsx`, remove only the `GoogleAdBanner` import and render. Delete `src/components/ads/GoogleAdBanner.tsx`. Confirm that `openDisclaimer` and `handleAnalyzeClick` remain in the diff.

- [ ] **Step 7: Run publisher tests, lint, and build**

Run:

```bash
npm test -- src/readiness/publisher-files.test.ts src/config/public-routes.test.ts
npm run lint
npm run build
git diff -- src/pages/HomePage.tsx | rg "openDisclaimer|handleAnalyzeClick|GoogleAdBanner"
```

Expected: tests, lint, and build exit 0; the final command shows disclaimer functions retained and the ad component removed.

- [ ] **Step 8: Commit the publisher infrastructure**

```bash
git add public/ads.txt public/robots.txt public/sitemap.xml public/_headers index.html vercel.json src/readiness/publisher-files.test.ts src/pages/HomePage.tsx src/components/ads/GoogleAdBanner.tsx
git diff --cached --check
git diff --cached --stat
git commit -m "fix: repair AdSense ownership and public routing"
```

### Task 3: Add a Real Typed MediaPipe Hand Detector

**Files:**
- Create: `src/lib/hand-detector.ts`
- Create: `src/lib/hand-detector.test.ts`

**Interfaces:**
- Produces:

```ts
export interface HandLandmark { x: number; y: number; z: number }
export type Handedness = "Left" | "Right";
export type HandDetectionResult =
  | { status: "success"; landmarks: HandLandmark[]; handedness: Handedness }
  | { status: "no-hand" }
  | { status: "multiple-hands"; count: number };
export interface HandDetector {
  detect(image: HTMLImageElement | HTMLCanvasElement): Promise<HandDetectionResult>;
  close(): Promise<void>;
}
export type HandsFactory = () => HandsLike;
export async function createHandDetector(factory?: HandsFactory): Promise<HandDetector>;
```

- Consumes: `@mediapipe/hands@0.4.1675469240` already present in the repository.

- [ ] **Step 1: Write fake MediaPipe tests before the adapter**

Create `src/lib/hand-detector.test.ts` with a `FakeHands` implementing `HandsLike`, saving the callback passed to `onResults`, and exposing `emit(results)`. Use this complete test structure:

```ts
import { describe, expect, it, vi } from "vitest";
import type { Results } from "@mediapipe/hands";
import { createHandDetector, type HandsLike, type HandLandmark } from "./hand-detector";

const landmarks = (count: number): HandLandmark[] =>
  Array.from({ length: count }, (_, index) => ({ x: index / 100, y: index / 200, z: -index / 1000 }));

class FakeHands implements HandsLike {
  listener: ((results: Results) => Promise<void> | void) | undefined;
  initialize = vi.fn(async () => undefined);
  send = vi.fn(async () => undefined);
  close = vi.fn(async () => undefined);
  setOptions = vi.fn();
  onResults(listener: (results: Results) => Promise<void> | void) { this.listener = listener; }
  emit(multiHandLandmarks: HandLandmark[][], labels: string[]) {
    this.listener?.({
      multiHandLandmarks,
      multiHandedness: labels.map((label) => ({ label })),
      multiHandWorldLandmarks: [],
      image: {} as Results["image"],
    } as Results);
  }
}

it("maps one 21-point hand to success", async () => {
  const fake = new FakeHands();
  const detector = await createHandDetector(() => fake);
  const pending = detector.detect(document.createElement("canvas"));
  fake.emit([landmarks(21)], ["Right"]);
  await expect(pending).resolves.toEqual({ status: "success", landmarks: landmarks(21), handedness: "Right" });
});

it("returns no-hand for zero detected hands", async () => {
  const fake = new FakeHands();
  const detector = await createHandDetector(() => fake);
  const pending = detector.detect(document.createElement("canvas"));
  fake.emit([], []);
  await expect(pending).resolves.toEqual({ status: "no-hand" });
});

it("returns the actual count for multiple hands", async () => {
  const fake = new FakeHands();
  const detector = await createHandDetector(() => fake);
  const pending = detector.detect(document.createElement("canvas"));
  fake.emit([landmarks(21), landmarks(21)], ["Left", "Right"]);
  await expect(pending).resolves.toEqual({ status: "multiple-hands", count: 2 });
});

it("rejects initialization errors", async () => {
  const fake = new FakeHands();
  fake.initialize.mockRejectedValueOnce(new Error("model unavailable"));
  await expect(createHandDetector(() => fake)).rejects.toThrow("model unavailable");
});

it("rejects send errors without fabricating a result", async () => {
  const fake = new FakeHands();
  fake.send.mockRejectedValueOnce(new Error("decode failed"));
  const detector = await createHandDetector(() => fake);
  await expect(detector.detect(document.createElement("canvas"))).rejects.toThrow("decode failed");
});

it("closes the MediaPipe instance", async () => {
  const fake = new FakeHands();
  const detector = await createHandDetector(() => fake);
  await detector.close();
  expect(fake.close).toHaveBeenCalledOnce();
});
```

The fixed `landmarks(count)` helper must remain deterministic; never use `Math.random()` in these tests.

- [ ] **Step 2: Run the detector test and confirm the missing module**

Run:

```bash
npm test -- src/lib/hand-detector.test.ts
```

Expected: FAIL because `src/lib/hand-detector.ts` does not exist.

- [ ] **Step 3: Implement the MediaPipe adapter**

Create `src/lib/hand-detector.ts`. Import `Hands` and its `Results`/`Options` types from `@mediapipe/hands`. Define the injectable surface:

```ts
export interface HandsLike {
  onResults(listener: (results: Results) => Promise<void> | void): void;
  setOptions(options: Options): void;
  initialize(): Promise<void>;
  send(input: { image: HTMLImageElement | HTMLCanvasElement }): Promise<void>;
  close(): Promise<void>;
}
```

The default factory must pin the model asset path and these options:

```ts
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
});
hands.setOptions({
  selfieMode: false,
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.65,
  minTrackingConfidence: 0.65,
});
```

`createHandDetector` must await `initialize()`, support one pending `detect()` request at a time, resolve `no-hand`/`multiple-hands`/`success` from `multiHandLandmarks`, normalize handedness to `Left` or `Right`, reject the pending promise when `send()` rejects, and call the underlying `close()`. It must not calculate palm lines, confidence scores, success percentages, or interpretations.

- [ ] **Step 4: Run focused tests and production checks**

Run:

```bash
npm test -- src/lib/hand-detector.test.ts
npm run lint
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit the isolated detector**

```bash
git add src/lib/hand-detector.ts src/lib/hand-detector.test.ts
git diff --cached --check
git commit -m "feat: add real MediaPipe hand detector"
```

### Task 4: Replace Random Palm Reading with Deterministic Reflections

**Files:**
- Create: `src/lib/reflection-engine.ts`
- Create: `src/lib/reflection-engine.test.ts`
- Create: `src/store/palm-store.test.ts`
- Create: `src/components/palm/ReflectionResult.tsx`
- Create: `src/components/palm/ReflectionResult.test.tsx`
- Create: `src/components/palm/HandPreview.test.tsx`
- Modify: `src/store/palm-store.ts`
- Modify: `src/components/palm/HandPreview.tsx`
- Modify: `src/components/palm/DisclaimerModal.tsx`
- Modify: `src/components/palm/ImageUploader.tsx`
- Modify: `src/pages/HomePage.tsx`
- Delete: `src/components/palm/PalmAnalysis.tsx`

**Interfaces:**
- Consumes: `HandLandmark`, `HandDetectionResult`, `HandDetector`, and `createHandDetector` from Task 3.
- Produces: `REFLECTION_KEYS`, `ReflectionKey`, `REFLECTION_CARDS`, `selectReflectionKey(landmarks)`, and the new `PalmState` actions `setImage`, `setDetection`, `createReflection`, `setError`, `reset`, and `acceptDisclaimer`.

- [ ] **Step 1: Write the failing pure reflection tests**

Create `src/lib/reflection-engine.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { REFLECTION_CARDS, selectReflectionKey } from "./reflection-engine";
import type { HandLandmark } from "./hand-detector";

const validLandmarks: HandLandmark[] = Array.from({ length: 21 }, (_, index) => ({
  x: 0.2 + index * 0.01,
  y: 0.8 - index * 0.015,
  z: -index * 0.001,
}));

describe("reflection engine", () => {
  it("returns the same card for the same geometry", () => {
    expect(selectReflectionKey(validLandmarks)).toBe(selectReflectionKey(structuredClone(validLandmarks)));
  });

  it("requires exactly 21 finite normalized landmarks", () => {
    expect(() => selectReflectionKey(validLandmarks.slice(0, 20))).toThrow("21 hand landmarks");
    expect(() => selectReflectionKey([{ x: Number.NaN, y: 0, z: 0 }, ...validLandmarks.slice(1)])).toThrow("finite");
  });

  it("contains bilingual non-predictive entertainment copy", () => {
    const copy = JSON.stringify(REFLECTION_CARDS);
    expect(copy).toMatch(/非科學|non-scientific/i);
    expect(copy).not.toMatch(/confidence|準確率|健康運勢|財運預測|diagnos|predicts your|guaranteed/i);
  });
});
```

- [ ] **Step 2: Run the reflection test and confirm the missing implementation**

Run:

```bash
npm test -- src/lib/reflection-engine.test.ts
```

Expected: FAIL because `reflection-engine.ts` does not exist.

- [ ] **Step 3: Implement the pure reflection engine**

Create four keys and bilingual cards:

```ts
export const REFLECTION_KEYS = ["balance", "curiosity", "connection", "rhythm"] as const;
export type ReflectionKey = (typeof REFLECTION_KEYS)[number];

export interface ReflectionCardCopy {
  title: string;
  prompt: string;
  context: string;
  disclaimer: string;
}

export const REFLECTION_CARDS: Record<ReflectionKey, Record<"zh" | "en", ReflectionCardCopy>> = {
  balance: {
    zh: { title: "平衡", prompt: "最近有哪些事情值得你重新分配時間與注意力？", context: "這張卡利用手部幾何產生固定選擇，適合作為停下來整理想法的起點。", disclaimer: "非科學推論，僅供文化娛樂與自我反思。" },
    en: { title: "Balance", prompt: "What deserves a different share of your time and attention right now?", context: "This card is selected deterministically from hand geometry and is simply a starting point for reflection.", disclaimer: "A non-scientific prompt for cultural entertainment and reflection only." },
  },
  curiosity: {
    zh: { title: "好奇", prompt: "哪一個你尚未深入了解的問題，值得用一個小實驗開始？", context: "手部座標只負責穩定選卡，不會測量你的性格或能力。", disclaimer: "非科學推論，僅供文化娛樂與自我反思。" },
    en: { title: "Curiosity", prompt: "Which unanswered question could you explore through one small experiment?", context: "Hand coordinates only make the selection stable; they do not measure personality or ability.", disclaimer: "A non-scientific prompt for cultural entertainment and reflection only." },
  },
  connection: {
    zh: { title: "連結", prompt: "這一週，你想更專心聆聽哪一段關係或對話？", context: "這是一般性的反思問題，不是對感情、相容性或未來的判斷。", disclaimer: "非科學推論，僅供文化娛樂與自我反思。" },
    en: { title: "Connection", prompt: "Which relationship or conversation would you like to listen to more carefully this week?", context: "This is a general reflection question, not a judgment about relationships, compatibility, or the future.", disclaimer: "A non-scientific prompt for cultural entertainment and reflection only." },
  },
  rhythm: {
    zh: { title: "節奏", prompt: "目前的生活節奏中，哪一個習慣可以變得更簡單？", context: "選卡結果不代表能量、健康或命運，只提供一個整理日常的角度。", disclaimer: "非科學推論，僅供文化娛樂與自我反思。" },
    en: { title: "Rhythm", prompt: "Which habit in your current routine could become simpler?", context: "The card does not represent energy, health, or destiny; it only offers a way to review everyday routines.", disclaimer: "A non-scientific prompt for cultural entertainment and reflection only." },
  },
};
```

Validate length and finite values, then compute a stable integer signature from normalized wrist-to-landmark distances and return `REFLECTION_KEYS[Math.abs(signature) % REFLECTION_KEYS.length]`. Do not use current time, random values, handedness, device identity, or image pixels.

- [ ] **Step 4: Write failing store and component-state tests**

Create `src/store/palm-store.test.ts` to prove a valid detection creates a key, no-hand and multiple-hand outcomes set their exact errors, and reset clears the image/detection/key/error while retaining `disclaimerAccepted`. Create `src/components/palm/HandPreview.test.tsx` using injected `detectorFactory` values for success, `no-hand`, `multiple-hands`, initialization rejection, and retry. Create `src/components/palm/ReflectionResult.test.tsx` to assert the selected localized prompt and its visible non-scientific disclaimer.

The state assertions must use this shape:

```ts
interface PalmState {
  image: string | null;
  detection: Extract<HandDetectionResult, { status: "success" }> | null;
  reflectionKey: ReflectionKey | null;
  isDetecting: boolean;
  error: "no-hand" | "multiple-hands" | "detector-unavailable" | null;
  disclaimerAccepted: boolean;
  setImage: (image: string) => void;
  setDetection: (result: HandDetectionResult) => void;
  createReflection: () => void;
  setDetecting: (value: boolean) => void;
  setError: (error: PalmState["error"]) => void;
  reset: () => void;
  acceptDisclaimer: () => void;
}
```

- [ ] **Step 5: Run the component tests and confirm old behavior fails them**

Run:

```bash
npm test -- src/lib/reflection-engine.test.ts src/store/palm-store.test.ts src/components/palm/HandPreview.test.tsx src/components/palm/ReflectionResult.test.tsx
```

Expected: FAIL because the current store and preview expose random landmarks/palm analysis and `ReflectionResult` is absent.

- [ ] **Step 6: Replace the store and wire real detection**

Rewrite `src/store/palm-store.ts` to the exact state shape above. Persist only `{ disclaimerAccepted }` under the existing `palm-reading-storage` key so the user’s accepted disclaimer behavior survives. `setImage` clears detection, reflection, error, and progress. `setDetection` stores success or maps no/multiple hands to the matching visible error. `createReflection` calls `selectReflectionKey(detection.landmarks)` synchronously; it does not delay or simulate work.

Update `HandPreview.tsx` to accept:

```ts
interface HandPreviewProps {
  detectorFactory?: () => Promise<HandDetector>;
}
```

On a new image, create an `HTMLImageElement`, wait for decode/load, initialize the detector, call `detect(image)`, update store state, and close the detector in cleanup. Render localized, actionable messages:

- `no-hand`: show one fully visible hand against a plain background and retry.
- `multiple-hands`: keep only one hand in frame and retry.
- `detector-unavailable`: model loading or decoding failed; keep the image and offer retry.

Keep the existing canvas/filter capability only if it passes the detector the post-filter canvas; otherwise send the decoded source image and leave filters as a separate visual aid. Remove all random timers, fake points, success rates, palm-line overlays, and generated handedness.

- [ ] **Step 7: Replace analysis UI while retaining explicit disclaimer consent**

Create `ReflectionResult.tsx` from `reflectionKey` and `currentLanguage`. Update `HomePage.tsx` to render it in place of `PalmAnalysis`, and change `handleAnalyzeClick` to:

```ts
const handleAnalyzeClick = () => {
  if (!disclaimerAccepted) {
    openDisclaimer("reflection_button");
    return;
  }
  usePalmStore.getState().createReflection();
};
```

Update `DisclaimerModal.tsx` so it explicitly says the model detects hand joints, not palm creases; the selected card is non-scientific entertainment; and professional or consequential decisions must not rely on it. Keep the user’s new manual-open flow: the modal does not appear automatically on page load.

Delete `PalmAnalysis.tsx`. Update `ImageUploader.tsx` so a new valid image calls `setImage`, and existing invalid-type/oversize/unreadable errors remain visible without starting detection.

- [ ] **Step 8: Prove the random analysis is gone and the app still builds**

Run:

```bash
npm test -- src/lib/hand-detector.test.ts src/lib/reflection-engine.test.ts src/store/palm-store.test.ts src/components/palm/HandPreview.test.tsx src/components/palm/ReflectionResult.test.tsx
rg -n "Math\.random|confidence|breaks|islands|lifeLine|heartLine|headLine|fateLine" src/store/palm-store.ts src/components/palm/HandPreview.tsx src/components/palm/ReflectionResult.tsx src/pages/HomePage.tsx
npm run lint
npm run build
```

Expected: tests, lint, and build exit 0; `rg` returns no matches and therefore exits 1.

- [ ] **Step 9: Commit the truthful hand experience**

```bash
git add src/lib/hand-detector.ts src/lib/hand-detector.test.ts src/lib/reflection-engine.ts src/lib/reflection-engine.test.ts src/store/palm-store.ts src/store/palm-store.test.ts src/components/palm/HandPreview.tsx src/components/palm/HandPreview.test.tsx src/components/palm/ReflectionResult.tsx src/components/palm/ReflectionResult.test.tsx src/components/palm/DisclaimerModal.tsx src/components/palm/ImageUploader.tsx src/components/palm/PalmAnalysis.tsx src/pages/HomePage.tsx
git diff --cached --check
git commit -m "feat: replace random palm reading with honest reflections"
```

### Task 5: Remove Fabricated Features and Rebuild the Home Page Around Real Value

**Files:**
- Create: `src/readiness/truthfulness.test.ts`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/store/language-store.ts`
- Modify: `src/components/social/SocialShare.tsx`
- Modify: `src/index.css`
- Modify: `src/App.tsx`
- Delete: `src/components/analytics/AnalyticsDashboard.tsx`
- Delete: `src/components/ui/chart.tsx`
- Delete: `src/components/content/PublisherContent.tsx`
- Delete: `src/components/feedback/FeedbackModal.tsx`
- Delete: `src/components/feedback/FeedbackSection.tsx`
- Delete: `src/store/feedback-store.ts`
- Delete: `src/components/onboarding/OnboardingOverlay.tsx`
- Delete: `src/components/onboarding/WelcomeModal.tsx`
- Delete: `src/store/onboarding-store.ts`
- Delete: `src/components/palm/BatchProcessor.tsx`
- Delete: `src/pages/BatchPage.tsx`
- Delete: `src/store/batch-store.ts`
- Delete: `src/store/analytics-store.ts`

**Interfaces:**
- Consumes: Task 1 route constants and Task 4’s `PalmState`, `HandPreview`, and `ReflectionResult`.
- Produces: a public home page containing only implemented product behavior and a source-level integrity audit.

- [ ] **Step 1: Write a failing source-integrity audit**

Create `src/readiness/truthfulness.test.ts` with Node environment. Recursively read production `.ts`, `.tsx`, and `.html` files under `src/` plus `index.html`; exclude `.test.*`, `src/readiness/`, and UI primitives whose random skeleton width is unrelated to analysis. Assert:

```ts
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

for (const pattern of prohibitedPublicClaims) {
  expect(productionSource, pattern.toString()).not.toMatch(pattern);
}

for (const removedPath of [
  "src/pages/BatchPage.tsx",
  "src/store/batch-store.ts",
  "src/store/feedback-store.ts",
  "src/store/onboarding-store.ts",
  "src/store/analytics-store.ts",
  "src/components/content/PublisherContent.tsx",
  "src/components/analytics/AnalyticsDashboard.tsx",
]) {
  expect(fs.existsSync(path.join(root, removedPath)), removedPath).toBe(false);
}
```

Add a separate assertion that `src/App.tsx` contains none of `/batch`, `BatchPage`, or a hidden analytics route, and that `HomePage.tsx` contains visible links to all three guide routes.

- [ ] **Step 2: Run the source audit and observe the unsupported material**

Run:

```bash
npm test -- src/readiness/truthfulness.test.ts
```

Expected: FAIL on existing fake metrics, publisher content, batch/feedback/onboarding files, the hidden analytics dashboard, and guide links not yet present.

- [ ] **Step 3: Remove the unsupported feature trees and App route**

Delete every file listed under this task’s Delete section. Remove the `/batch` lazy import and route from `src/App.tsx`. Remove their imports, store calls, event tracking, hidden five-click analytics behavior, and modal renders from `HomePage.tsx`.

Do not remove `@vercel/analytics/react` from `App.tsx`; that is the actual aggregate analytics provider disclosed in Task 7.

- [ ] **Step 4: Recompose the home page in this exact visible order**

Keep the current visual system, but reduce `HomePage.tsx` to these sections:

1. A header with `HandFuture`, the line “手相文化探索與手部偵測 / Palmistry culture and hand detection,” Home, About, Privacy, Terms, language, and theme controls.
2. A hero with the localized title “從一張手部照片，開始一段文化探索 / Start a cultural exploration with one hand photo,” one paragraph explaining local hand-joint detection and non-scientific entertainment, and no user count, rating, badge, or accuracy statement.
3. A visible disclosure alert with the existing user-controlled “查看免責說明 / View disclaimer” action; do not reopen it automatically.
4. The tool card in this state order: `ImageUploader`; `HandPreview` after a valid image; the reflection action after a successful detection; `ReflectionResult` after selection; retry/reset controls for failure and completion.
5. Three factual cards titled “瀏覽器內偵測 / In-browser detection,” “文化反思卡 / Cultural reflection card,” and “照片不會上傳 / Photo stays on your device.” The first card says the model locates hand joints, not palm creases.
6. A “繼續閱讀 / Continue reading” section linking to each guide route with a unique one-sentence summary.
7. A four-question FAQ covering what is detected, whether the result is scientific, whether the photo is uploaded, and whether the result should guide decisions.
8. A concise footer containing only HandFuture, the eight real routes grouped without duplicate keyword anchors, and the current year. Do not render an email address yet.

Remove the old fortune-topic cards, artificial loading delay, batch CTA, manual ad box, “real publisher content,” feedback UI, advertiser-fit language, service totals, keyword-stuffed footer, and unsupported contact link.

- [ ] **Step 5: Reduce translation state to copy that is still rendered**

In `src/store/language-store.ts`, retain the current public API (`currentLanguage`, `setLanguage`, `t`) and storage key. Preserve the user’s meanings for:

```ts
"disclaimer.prompt"
"button.viewDisclaimer"
```

Add the home labels described in Step 4. Remove translation groups for feedback, batch processing, onboarding, hidden analytics, ratings, service totals, accuracy, palm-line measurements, predictions, and fake testimonials. Change the app subtitle to the product position in Step 4. A missing translation key must fall back to the key itself rather than returning fabricated copy.

- [ ] **Step 6: Make sharing factual**

Simplify `SocialShare.tsx` to share the canonical current page URL and one of these messages:

```ts
const shareCopy = {
  zh: "我正在 HandFuture 探索手相文化與非科學的反思提示。",
  en: "I’m exploring palmistry culture and a non-scientific reflection prompt on HandFuture.",
};
```

Remove result percentages, topic predictions, fake social account tags, Facebook app IDs, and claims that the generated card is accurate. Keep native Web Share when available and copy-link as the fallback.

- [ ] **Step 7: Remove dead styling and prove the new home is clean**

Delete CSS sections used only by batch, feedback, onboarding, fake rating, and hidden analytics components. Then run:

```bash
npm test -- src/readiness/truthfulness.test.ts src/components/palm/HandPreview.test.tsx src/components/palm/ReflectionResult.test.tsx
npm run lint
npm run build
rg -n "2847|98%|95%|三十萬|dontsp\.am|/batch|accuracy|準確度" src index.html
```

Expected: tests, lint, and build exit 0; the final scan returns no matches and exits 1. Review `git diff -- src/pages/HomePage.tsx src/store/language-store.ts` and confirm the explicit disclaimer action remains.

- [ ] **Step 8: Commit the public truthfulness cleanup**

```bash
git add src/readiness/truthfulness.test.ts src/pages/HomePage.tsx src/store/language-store.ts src/components/social/SocialShare.tsx src/index.css src/App.tsx src/components/analytics/AnalyticsDashboard.tsx src/components/ui/chart.tsx src/components/content/PublisherContent.tsx src/components/feedback src/store/feedback-store.ts src/components/onboarding src/store/onboarding-store.ts src/components/palm/BatchProcessor.tsx src/pages/BatchPage.tsx src/store/batch-store.ts src/store/analytics-store.ts
git diff --cached --check
git diff --cached --stat
git commit -m "refactor: remove fabricated public features"
```

### Task 6: Publish Sourced Guides, Shared Navigation, and Route Metadata

**Files:**
- Create: `src/content/guides.ts`
- Create: `src/content/guides.test.ts`
- Create: `src/components/layout/SiteHeader.tsx`
- Create: `src/components/layout/SiteFooter.tsx`
- Create: `src/components/layout/SiteLayout.tsx`
- Create: `src/components/seo/RouteMeta.tsx`
- Create: `src/components/seo/RouteMeta.test.tsx`
- Create: `src/components/routing/RouteErrorBoundary.tsx`
- Create: `src/pages/HowItWorksPage.tsx`
- Create: `src/pages/GuidePage.tsx`
- Create: `src/pages/PublicPages.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/NotFoundPage.tsx`

**Interfaces:**
- Consumes: `PublicPath`, `GuidePath`, `Locale`, `PUBLIC_PATHS`, `getRouteMetadata`, and `buildStructuredData` from Task 1.
- Produces: `GUIDE_CONTENT`, `HOW_IT_WORKS_CONTENT`, `SiteLayout`, `RouteMeta`, and working renderers for all content routes.

- [ ] **Step 1: Define the content types and write failing editorial tests**

Create `src/content/guides.test.ts` against these types:

```ts
export interface SourceLink {
  label: string;
  url: string;
}

export interface ContentSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface EditorialPage {
  title: string;
  summary: string;
  updatedAt: "2026-07-26";
  sections: ContentSection[];
  sources: SourceLink[];
}

export const GUIDE_CONTENT: Record<GuidePath, Record<Locale, EditorialPage>>;
export const HOW_IT_WORKS_CONTENT: Record<Locale, EditorialPage>;
```

Test each localized guide for at least four sections, non-empty summary, exact update date, at least two source links on the palmistry/science guides, at least one authoritative source on the photo guide, HTTPS source URLs, visible `HandFuture` publisher rendering, and absence of these claim categories:

```ts
const unsafeClaims = /科學證明手相|掌紋能預測|性格準確|健康診斷|財富預測|scientifically proven palm|predicts your future|diagnoses|guaranteed accuracy/i;
```

Also assert the combined paragraph text is at least 700 Unicode characters per locale. This is an internal completeness guard, not a claimed AdSense word-count rule.

- [ ] **Step 2: Run the guide tests and confirm content is missing**

Run:

```bash
npm test -- src/content/guides.test.ts
```

Expected: FAIL because `src/content/guides.ts` does not exist.

- [ ] **Step 3: Author the how-it-works page with visible implementation facts**

Create `HOW_IT_WORKS_CONTENT` in Chinese and English with these four sections and facts:

1. “選擇照片 / Choose a photo”: JPEG, PNG, or WebP; one hand; image loaded with FileReader; no HandFuture upload endpoint.
2. “尋找手部關節 / Locate hand joints”: MediaPipe finds up to 21 standard landmarks and handedness; it does not identify life, head, heart, or fate creases.
3. “選擇反思卡 / Select a reflection card”: fixed geometry signature chooses one of four general prompts; identical normalized coordinates return the same key; no personality, compatibility, health, career, wealth, or future inference.
4. “清除與限制 / Clear and understand limits”: reset clears image/result from app state; closing or refreshing clears image memory; disclaimer acceptance alone persists locally; detection can fail due to framing, light, unsupported decoding, or model loading.

Use these authoritative implementation sources:

```ts
[
  { label: "MediaPipe Hand Landmarker", url: "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker" },
  { label: "MDN FileReader", url: "https://developer.mozilla.org/docs/Web/API/FileReader" },
]
```

- [ ] **Step 4: Author the three guides with explicit tradition/evidence boundaries**

Create bilingual content with the following section contracts:

`/guides/palmistry-basics`

- Definition: palmistry is a divinatory tradition, not an evidence-based measurement system.
- Historical context: practices and terminology vary by period and community; do not present one chart as universal.
- Traditional names: describe life, head, heart, and fate line only as traditional labels; explicitly state that a “life line” does not determine lifespan.
- Reading responsibly: treat interpretations as folklore, conversation, or reflection and never as grounds for consequential decisions.
- Sources: the 1911 Encyclopaedia Britannica Palmistry entry at `https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Palmistry` and Merriam-Webster’s palmistry definition at `https://www.merriam-webster.com/dictionary/palmistry`.

`/guides/science-and-limitations`

- Detection is not interpretation: MediaPipe returns hand joints and handedness, not crease semantics.
- Evidence boundary: no scientific basis is asserted for predicting personality, health, relationships, money, career, or future events from palms.
- Barnum effect: general descriptions may feel personal because people recognize broadly applicable statements; present this as one reason to interpret entertainment readings cautiously.
- Safe use: do not use results for medical, mental-health, legal, financial, employment, or relationship decisions.
- Sources: APA Dictionary of Psychology’s Barnum effect at `https://dictionary.apa.org/barnum-effect` and MediaPipe Hand Landmarker at `https://developers.google.com/mediapipe/solutions/vision/hand_landmarker`.

`/guides/hand-photo-guide`

- Light: use even front light; avoid glare, deep shadow, and backlighting.
- Frame: show one open hand from wrist through fingertips, use a plain contrasting background, and avoid overlapping hands or jewelry covering joints.
- File and privacy: use JPEG/PNG/WebP within the uploader’s implemented size limit; processing happens in the current browser session; avoid including faces, documents, or identifying surroundings.
- Troubleshooting: retry after changing light/framing; multiple-hand and no-hand states are detector outputs; model/network blocking may prevent initialization.
- Sources: MediaPipe Hand Landmarker at `https://developers.google.com/mediapipe/solutions/vision/hand_landmarker` and MDN FileReader at `https://developer.mozilla.org/docs/Web/API/FileReader`.

Each source link must appear below the relevant visible article under “參考資料 / Sources”; do not hide citations only in JSON-LD.

- [ ] **Step 5: Write failing navigation and metadata component tests**

Create `RouteMeta.test.tsx` with a `MemoryRouter` and `useLanguageStore` reset. Verify navigation to `/guides/science-and-limitations` updates `<html lang>`, title, description, canonical, `og:url`, and a single `<script id="route-structured-data">` with `Article`. Change language and verify the English metadata replaces the Chinese values without creating duplicate tags.

Create `PublicPages.test.tsx` to render `SiteLayout` and each new page. Assert:

- the header links include all eight public routes and none points to `/batch` or `#`;
- the current page has one `<h1>`;
- each guide visibly renders its update date and all source links;
- the footer contains no `mailto:`, rating, user count, or repeated keyword links;
- `HowItWorksPage` visibly says “21” and that palm creases are not detected;
- `RouteErrorBoundary` shows a reload button when a child throws.

- [ ] **Step 6: Run the UI tests and confirm the layout/routes are absent**

Run:

```bash
npm test -- src/content/guides.test.ts src/components/seo/RouteMeta.test.tsx src/pages/PublicPages.test.tsx
```

Expected: FAIL because the shared layout, metadata controller, and content pages do not exist.

- [ ] **Step 7: Implement shared layout and metadata control**

`SiteHeader.tsx` must use `Link`/`NavLink` for Home, How it works, Guides, About, Privacy, and Terms, with a small guides submenu or three directly visible guide links. It must retain `LanguageSwitcher` and `ThemeToggle`, use a real home link for the logo, and have an accessible navigation label.

`SiteFooter.tsx` must render HandFuture, “獨立文化探索網頁專案 / Independent cultural exploration web project,” and each approved path once. It must not include contact information until email routing is verified.

`RouteMeta.tsx` must first branch on `isPublicPath(location.pathname)`. For an unknown path, remove `#route-structured-data`, set a localized “Page not found | HandFuture” title, and upsert `<meta name="robots" content="noindex, follow">`; on a valid route, remove that noindex override and then perform these updates:

```ts
if (!isPublicPath(location.pathname)) {
  document.title = currentLanguage === "zh" ? "找不到頁面｜HandFuture" : "Page not found | HandFuture";
  upsertMeta("name", "robots", "noindex, follow");
  document.querySelector("#route-structured-data")?.remove();
  return;
}
const path = location.pathname;
const meta = getRouteMetadata(path, currentLanguage);
upsertMeta("name", "robots", "index, follow");
document.documentElement.lang = currentLanguage === "zh" ? "zh-TW" : "en";
document.title = meta.title;
upsertMeta("name", "description", meta.description);
upsertMeta("property", "og:title", meta.title);
upsertMeta("property", "og:description", meta.description);
upsertMeta("property", "og:url", meta.ogUrl);
upsertMeta("name", "twitter:title", meta.title);
upsertMeta("name", "twitter:description", meta.description);
upsertLink("canonical", meta.canonical);
upsertJsonLd("route-structured-data", buildStructuredData(path, currentLanguage));
```

The helpers must update existing tags and create a missing tag once. Valid navigation restores `index, follow` after a not-found page.

`RouteErrorBoundary.tsx` must be a React error boundary that renders one localized explanation and a button calling `window.location.reload()`; it must not display an empty page after a chunk failure.

- [ ] **Step 8: Implement page renderers and route all eight destinations**

`GuidePage` accepts `{ path: GuidePath }`, reads the current locale, renders publisher `HandFuture`, `<time dateTime="2026-07-26">`, sections, related links, and visible sources. `HowItWorksPage` uses the same article layout without Article structured data.

Update `src/App.tsx` to lazy-load and route:

```tsx
<Route path="/" element={<HomePage />} />
<Route path="/how-it-works" element={<HowItWorksPage />} />
<Route path="/guides/palmistry-basics" element={<GuidePage path="/guides/palmistry-basics" />} />
<Route path="/guides/science-and-limitations" element={<GuidePage path="/guides/science-and-limitations" />} />
<Route path="/guides/hand-photo-guide" element={<GuidePage path="/guides/hand-photo-guide" />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/privacy" element={<PrivacyPolicyPage />} />
<Route path="/terms" element={<TermsPage />} />
<Route path="*" element={<NotFoundPage />} />
```

Place `RouteMeta` and `Routes` inside `SiteLayout` and `RouteErrorBoundary`. Use `<div role="status" aria-live="polite">` as the Suspense fallback. Remove the duplicate header/footer from `HomePage`; make `NotFoundPage` use the shell and one link to `/`.

- [ ] **Step 9: Run content, UI, route, lint, and build checks**

Run:

```bash
npm test -- src/content/guides.test.ts src/components/seo/RouteMeta.test.tsx src/pages/PublicPages.test.tsx src/config/public-routes.test.ts src/readiness/publisher-files.test.ts
npm run lint
npm run build
```

Expected: all commands exit 0 and all eight route chunks appear in the Vite build manifest/output.

- [ ] **Step 10: Commit the content-led information architecture**

```bash
git add src/content/guides.ts src/content/guides.test.ts src/components/layout src/components/seo src/components/routing src/pages/HowItWorksPage.tsx src/pages/GuidePage.tsx src/pages/PublicPages.test.tsx src/App.tsx src/pages/HomePage.tsx src/pages/NotFoundPage.tsx
git diff --cached --check
git commit -m "feat: publish sourced guides and shared navigation"
```

### Task 7: Replace About, Privacy, and Terms with Factual Policies

**Files:**
- Create: `src/content/policies.ts`
- Create: `src/content/policies.test.ts`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/pages/PrivacyPolicyPage.tsx`
- Modify: `src/pages/TermsPage.tsx`
- Modify: `src/pages/PublicPages.test.tsx`

**Interfaces:**
- Consumes: `Locale`, `EditorialPage`, `SiteLayout`, and the current local-storage store keys.
- Produces: `ABOUT_CONTENT`, `PRIVACY_CONTENT`, and `TERMS_CONTENT`, each as `Record<Locale, EditorialPage>`.

- [ ] **Step 1: Inventory the real providers and persisted keys**

Run:

```bash
rg -n "name: ['\"]|localStorage|sessionStorage|FileReader|canvas|@vercel/analytics|pagead2|cloudflare" src index.html package.json vercel.json
```

Expected facts to encode in the next test:

- `palm-reading-storage`: disclaimer acceptance only after Task 4.
- the language store’s existing persist key: language preference.
- the theme store’s existing persist key: theme preference.
- the image-filter store’s existing persist key: filter settings, if Task 4 still renders filters.
- hand photo and decoded canvas: memory only, not persisted by HandFuture.
- Vercel: hosting and aggregate Web Analytics.
- Google: AdSense ownership/advertising code and consent-dependent storage.
- Cloudflare: authoritative DNS only, not the active content proxy.

- [ ] **Step 2: Write failing factual-policy tests**

Create `src/content/policies.test.ts` to assert both locales contain visible sections and the exact provider/storage facts above. Assert Privacy links to:

```ts
const requiredPrivacyLinks = [
  "https://vercel.com/docs/analytics/privacy-policy",
  "https://policies.google.com/privacy",
  "https://support.google.com/adsense/answer/13554116",
];
```

Assert About does not contain team size, experts, advisors, datasets, workshops, model reports, newsletters, founding history, awards, or user totals. Assert Privacy/Terms do not contain GA4, cloud image exports, 90-day image logs, MFA claims, response-time promises, `legal@handfortune.com`, or `dontsp.am`. Allow `privacy@handfortune.com` only once in Privacy and label it as usable only when email routing is operational.

- [ ] **Step 3: Run policy tests and confirm current pages overclaim**

Run:

```bash
npm test -- src/content/policies.test.ts
```

Expected: FAIL because policy content is absent and current pages claim unsupported providers, organizational practices, contacts, and response times.

- [ ] **Step 4: Author factual About content**

Create bilingual `ABOUT_CONTENT` with these visible sections:

1. “這個專案 / This project”: HandFuture is an independent web project for exploring palmistry culture.
2. “我們提供什麼 / What it provides”: sourced introductory guides plus an in-browser hand-joint detector that selects a general reflection card.
3. “我們不主張什麼 / What it does not claim”: no scientific palm reading, personality assessment, diagnosis, prediction, expert consultation, or proprietary palm dataset.
4. “編輯原則 / Editorial principles”: distinguish tradition from evidence, cite sources, disclose limitations, correct material errors, and display the actual update date.

Do not use first-person plural in a way that implies employees or departments. Use `HandFuture` as publisher and `2026-07-26` as the update date.

- [ ] **Step 5: Author Privacy content from observed flows**

Create bilingual `PRIVACY_CONTENT` with these sections:

1. Scope and effective/update date `2026-07-26`.
2. Hand images: selected locally with FileReader and decoded/canvas APIs; not sent to a HandFuture application server; held in current page memory; removed by reset, refresh, tab close, or browser memory management.
3. Browser storage: enumerate each key found in Step 1 and its exact purpose; explain how the visitor clears site data.
4. Vercel: hosting, delivery logs handled by the hosting provider, and aggregate Vercel Web Analytics; HandFuture events do not include the palm image.
5. Google advertising: the AdSense script may request network resources and use storage according to consent and Google policy; ad blocking or non-approval does not affect access to content.
6. Regional consent: a Google-certified CMP will be enabled in AdSense Privacy & messaging before serving personalized/non-personalized ads where Google requires it; link the CMP requirement.
7. Cloudflare: authoritative DNS only in the current configuration.
8. Choices and rights: browser storage controls, consent controls when presented, and provider-policy links.
9. Contact: `privacy@handfortune.com`, accompanied by “This address is monitored only after domain email routing is enabled / 此信箱僅在網域郵件轉寄啟用後使用.” Do not promise a response window.

- [ ] **Step 6: Author Terms content without unsupported promises**

Create bilingual `TERMS_CONTENT` with these sections:

1. Acceptance and service description.
2. Entertainment-only scope: no medical, mental-health, legal, financial, employment, relationship, compatibility, or future advice.
3. Age guidance: users under the age of majority should use the site with a parent or guardian; do not claim a legally universal age threshold.
4. Acceptable use: no abuse, interference, automated traffic, scraping that overloads the service, ad manipulation, or infringement.
5. User images: visitors must have the right to use the image and should avoid third-party identifying content; HandFuture does not claim ownership of locally selected photos.
6. Intellectual property: site code, branding, and editorial content remain protected subject to third-party/open-source licenses and cited-source rights.
7. Availability and changes: service may change or be unavailable; no uptime or response guarantee.
8. Disclaimer and reasonable limitation of liability; no jurisdiction-specific claims beyond “applicable law.”
9. Contact points back to the Privacy page rather than an unverified legal mailbox.

- [ ] **Step 7: Render the three policy pages through one consistent article pattern**

Modify each page to select its content by `currentLanguage`, render one `<h1>`, summary, publisher, update `<time>`, all sections, and real links. Remove page-specific duplicate navigation and footers because `SiteLayout` owns them. Add assertions to `PublicPages.test.tsx` for visible provider names, local image behavior, entertainment scope, and the absence of unsupported emails/promises.

- [ ] **Step 8: Run all content checks and build**

Run:

```bash
npm test -- src/content/policies.test.ts src/content/guides.test.ts src/pages/PublicPages.test.tsx src/components/seo/RouteMeta.test.tsx
npm run lint
npm run build
rg -n "GA4|Google Analytics 4|90 days|90 天|MFA|seven business days|7 個工作天|legal@handfortune|team of|專家團隊|顧問" src/pages src/content
```

Expected: tests, lint, and build exit 0; the scan returns no matches and exits 1.

- [ ] **Step 9: Commit factual trust pages**

```bash
git add src/content/policies.ts src/content/policies.test.ts src/pages/AboutPage.tsx src/pages/PrivacyPolicyPage.tsx src/pages/TermsPage.tsx src/pages/PublicPages.test.tsx
git diff --cached --check
git commit -m "content: publish factual trust and policy pages"
```

### Task 8: Replace the Invalid Social Image and Verify Sharing Metadata

**Files:**
- Modify: `public/og-image.jpg`
- Modify: `src/readiness/publisher-files.test.ts`
- Modify: `src/config/site-metadata.ts`

**Interfaces:**
- Consumes: `SITE_NAME`, `SITE_ORIGIN`, and route metadata from Task 1.
- Produces: a valid 1200×630 JPEG and a static audit that rejects text masquerading as an image.

- [ ] **Step 1: Add a failing JPEG-integrity test**

Extend `publisher-files.test.ts`:

```ts
it("ships a real nontrivial JPEG social image", () => {
  const bytes = fs.readFileSync(path.join(root, "public/og-image.jpg"));
  expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
  expect(bytes.byteLength).toBeGreaterThan(20_000);
  expect(read("src/config/site-metadata.ts")).toContain(`${SITE_ORIGIN}/og-image.jpg`);
});
```

- [ ] **Step 2: Run the test and verify the current file is plain text**

Run:

```bash
npm test -- src/readiness/publisher-files.test.ts
file public/og-image.jpg
wc -c public/og-image.jpg
```

Expected: the test fails; `file` reports text rather than JPEG and the size is only a few hundred bytes.

- [ ] **Step 3: Use the image generation workflow to create the actual asset**

Before generating, read the available `imagegen` skill fully and announce that it is being used because this task requires a new raster asset. Generate a clean editorial social card with:

```text
Create a 1200×630 landscape social preview for HandFuture, an independent palmistry culture explorer. Warm ivory background, restrained gold and deep teal accents, a simple open-hand outline with 21 subtle joint dots, small cultural editorial motifs, generous whitespace, and the exact readable title “HandFuture”. Add the short subtitle “Palmistry culture, clearly explained”. No fortune-telling promises, mystical prediction symbols, ratings, user counts, Google/AdSense branding, fake interface screenshots, or tiny body text.
```

Save the generated asset as `public/og-image.jpg`. If the generation result is PNG, convert only the format and dimensions with macOS `sips`:

```bash
sips -s format jpeg -z 630 1200 generated-source.png --out public/og-image.jpg
```

Do not use a script to draw a substitute image.

- [ ] **Step 4: Verify dimensions, bytes, metadata, and visual accuracy**

Run:

```bash
file public/og-image.jpg
sips -g pixelWidth -g pixelHeight public/og-image.jpg
wc -c public/og-image.jpg
npm test -- src/readiness/publisher-files.test.ts src/config/public-routes.test.ts
```

Expected: JPEG image data, width 1200, height 630, size above 20,000 bytes, and both tests pass. Visually inspect the local file and confirm the exact title is legible and no prohibited claims appear.

- [ ] **Step 5: Commit the real social asset**

```bash
git add public/og-image.jpg src/readiness/publisher-files.test.ts src/config/site-metadata.ts
git diff --cached --check
git commit -m "feat: add truthful social preview asset"
```

### Task 9: Remove Unused Packages and Resolve Production Audit Findings

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: all implementation tasks so dependency usage can be checked against final source.
- Produces: a minimal runtime dependency graph compatible with Node 22.17.0 and the final build.

- [ ] **Step 1: Capture the dependency and vulnerability baseline**

Run:

```bash
node --version
npm --version
npm ls @devvai/devv-code-backend recharts @mediapipe/camera_utils @mediapipe/drawing_utils @mediapipe/hands react-router-dom vite postcss
npm audit --omit=dev
npm audit
```

Expected baseline: Node `v22.17.0`; unused Devv/Recharts/MediaPipe helper packages are present; the production audit reports the previously observed React Router, PostCSS, Vite/Rollup, lodash/Recharts, and related advisories.

- [ ] **Step 2: Prove the removal candidates have no final imports**

Run:

```bash
rg -n "@devvai/devv-code-backend|from ['\"]recharts|@mediapipe/camera_utils|@mediapipe/drawing_utils" src index.html
```

Expected: no matches and exit 1. `@mediapipe/hands` remains imported by `src/lib/hand-detector.ts`.

- [ ] **Step 3: Remove unused runtime packages and upgrade affected direct packages**

Run:

```bash
npm uninstall @devvai/devv-code-backend recharts @mediapipe/camera_utils @mediapipe/drawing_utils
npm install --save-exact react-router-dom@7.18.1 @vercel/analytics@2.0.1
npm install --save-dev --save-exact vite@8.1.5 @vitejs/plugin-react@6.0.4 postcss@8.5.23
```

Keep React 18, TypeScript 5.7, Tailwind 3, and `@mediapipe/hands@0.4.1675469240` in this release. Do not perform a Tailwind 4, React 19, or TypeScript 7 migration as part of AdSense readiness.

- [ ] **Step 4: Apply only non-force transitive security fixes**

Run:

```bash
npm audit fix
git diff -- package.json package-lock.json
```

Expected: npm updates compatible transitive versions without `--force`, and the diff contains no unrelated package removals. If npm still reports a production advisory, use `npm explain <package-name>` for each reported package, upgrade the owning direct dependency to its latest compatible version, rerun tests, and record the exact remaining package/advisory/runtime path in the final audit instead of adding an untested override.

- [ ] **Step 5: Run the full compatibility gate**

Run:

```bash
npm test
npm run lint
npm run build
npm audit --omit=dev
npm audit
```

Expected: tests, lint, and build exit 0. `npm audit --omit=dev` reports zero fixable production vulnerabilities. Any dev-only finding must be traced with `npm explain`, confirmed absent from the browser runtime bundle, and reported with its advisory rather than hidden.

- [ ] **Step 6: Commit the audited dependency graph**

```bash
git add package.json package-lock.json
git diff --cached --check
git diff --cached --stat
git commit -m "chore: resolve production dependency audit findings"
```

### Task 10: Regenerate Distribution Files and Perform the Final AdSense Audit

**Files:**
- Modify: generated `dist/**`
- Modify: no source file unless a verification command exposes a reproducible defect; fix that defect in its owning task area with a failing test first.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: verified build output plus an explicit owner/deployment checklist.

- [ ] **Step 1: Run the complete repository gate from a clean dependency install**

Run:

```bash
npm ci
npm test
npm run audit:adsense
npm run lint
npm run build
npm audit --omit=dev
```

Expected: every command exits 0 and `dist/` is regenerated from the final source, including the user’s disclaimer-flow change.

- [ ] **Step 2: Audit the generated output for prohibited claims and publisher assets**

Run:

```bash
rg -n "2847|98%|95%|aggregateRating|YOUR_FACEBOOK_APP_ID|PalmReadingAI|static\.devv\.ai|dontsp\.am|三十萬|300,000|準確度高達|/batch" dist
rg -n "ca-pub-3713047615080346|HandFuture|非科學|non-scientific" dist
cmp public/ads.txt dist/ads.txt
cmp public/robots.txt dist/robots.txt
cmp public/sitemap.xml dist/sitemap.xml
file dist/og-image.jpg
sips -g pixelWidth -g pixelHeight dist/og-image.jpg
```

Expected: the prohibited scan returns no matches and exits 1; the positive scan finds publisher ID, HandFuture, and entertainment disclosure; all three `cmp` commands exit 0; the image is a 1200×630 JPEG.

- [ ] **Step 3: Start a local production preview and check every public route**

Run in a PTY:

```bash
npm run preview -- --host 127.0.0.1
```

From a second command session, run:

```bash
for route in / /how-it-works /guides/palmistry-basics /guides/science-and-limitations /guides/hand-photo-guide /about /privacy /terms; do
  curl --fail --silent --show-error --output /dev/null --write-out "%{http_code} ${route}\n" "http://127.0.0.1:4173${route}"
done
curl --fail --silent http://127.0.0.1:4173/ads.txt
curl --fail --silent http://127.0.0.1:4173/robots.txt
curl --fail --silent http://127.0.0.1:4173/sitemap.xml
```

Expected: every public route reports 200 and each publisher file prints the reviewed content. Stop the preview with Ctrl-C.

- [ ] **Step 4: Perform visual and interaction QA at desktop and mobile widths**

Use the available browser-control skill because this step requires browser navigation and interaction. Read its `SKILL.md` fully and announce why it is being used. Inspect `http://127.0.0.1:4173/` at 1440×900 and 390×844, then verify:

- navigation reaches all eight pages and has no missing links;
- each page has one clear heading, readable content, and no overlapping controls;
- upload errors are visible for unsupported/oversize files;
- one-hand, no-hand, multiple-hand, model-error, retry, disclaimer, reflection, reset, language, theme, and share/copy-link states are usable by keyboard;
- there is no blank bordered ad card, fake review, rating, service total, or hidden dashboard;
- policy/source links are distinguishable and open the correct destinations;
- the generated social image matches the HandFuture positioning.

Capture screenshots of home, one guide, Privacy, and the reflection result for the audit handoff. If the in-app browser is unavailable, record that limitation and perform the same checks with a locally available Chromium/Playwright runner; do not claim visual QA from curl alone.

- [ ] **Step 5: Review the exact source and generated diff before staging**

Run:

```bash
git status --short
git diff --check
git diff -- src/pages/HomePage.tsx src/store/language-store.ts
git diff --stat -- dist
git log --oneline --decorate -12
```

Expected: no unrelated files are present; HomePage and language changes show the preserved explicit disclaimer behavior plus the approved redesign; `dist` consists only of new build artifacts and deleted superseded hashes.

- [ ] **Step 6: Commit generated artifacts separately**

```bash
git add dist
git diff --cached --check
git diff --cached --stat
git commit -m "build: regenerate AdSense-ready distribution"
```

- [ ] **Step 7: Run the verification-before-completion gate after the final commit**

Read and use `superpowers:verification-before-completion`. Then run fresh:

```bash
git status --short
npm test
npm run audit:adsense
npm run lint
npm run build
npm audit --omit=dev
git status --short
```

Expected: all commands exit 0. The final build may rewrite tracked `dist` only if the build is nondeterministic; if it does, inspect why and commit the exact deterministic correction before claiming completion. User-owned unrelated changes, if any remain, must be named rather than described as a clean tree.

- [ ] **Step 8: Produce the repository-versus-owner release checklist**

The final audit report must include exact command results, remaining audit findings, and this separation:

**Repository complete**

- eight public routes, metadata, sitemap, robots, ads.txt, AdSense script, canonical redirect config, real OG image, truthful detector/reflection, content, policies, tests, lint, build, and dependency audit;
- no approval guarantee and no manual ad unit.

**Owner/deployment actions before requesting review**

1. In Cloudflare Email Routing, create and test forwarding for `privacy@handfortune.com`; confirm `dig MX handfortune.com` returns active MX records and send a real delivery test. If email is not enabled, remove the address from Privacy before deployment.
2. In AdSense → Privacy & messaging, enable a Google-certified CMP for EEA, UK, and Switzerland before ads are served there.
3. Deploy the reviewed commit to Vercel; do not enable Cloudflare proxying during this release.
4. Verify `https://handfortune.com/<path>` permanently redirects to the same `https://www.handfortune.com/<path>` for root and one nested page.
5. Verify all eight live canonical URLs return HTTP 200; verify an unknown URL returns a real 404; verify live ads.txt is the exact one-line record.
6. In Search Console URL Inspection, test the live home page, one guide, About, Privacy, and Terms and inspect the rendered HTML/screenshots.
7. Let Google recrawl the corrected site, then request AdSense review once. Do not buy traffic, click ads, ask visitors to click ads, or submit repeated review requests while the previous one is pending.

The report must state that a future AdSense rejection should be diagnosed from the exact category shown in AdSense’s Sites page rather than inferred from the generic email.

## Self-Review Coverage Matrix

| Approved requirement | Implemented and verified in |
| --- | --- |
| Preserve user disclaimer changes and dirty build output | Global constraints; Tasks 1, 2, 4, 5, and 10 |
| Exact AdSense ID, ads.txt, ownership script, no manual slot | Task 2; Task 10 generated/live checks |
| Canonical `www`, apex redirect, eight valid 200 routes, no `/batch` | Tasks 1, 2, 5, 6, and 10 |
| Real hand detection and no palm-crease claim | Tasks 3, 4, and 6 |
| Deterministic non-scientific reflection and explicit errors | Task 4 |
| Remove fake ratings, reviews, metrics, organization claims, and Devv | Tasks 2, 5, 7, and 10 |
| Substantive sourced cultural/science/photo content | Task 6 |
| Factual About, Privacy, Terms, providers, and storage | Task 7 |
| Unique metadata, visible JSON-LD fields, and real social JPEG | Tasks 1, 6, and 8 |
| Safe Vercel headers without enforced CSP | Task 2 |
| Production dependency audit and unused package removal | Task 9 |
| Full tests, lint, build, generated-output scan, HTTP and visual audit | Task 10 |
| Email routing, CMP, deployment, Search Console, and re-review ownership | Task 10 owner/deployment checklist |

Self-review result: every design requirement maps to at least one implementation task and one verification step; no uncovered specification item remains.
