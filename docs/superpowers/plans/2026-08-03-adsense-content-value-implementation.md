# HandFuture AdSense Content Value Implementation Plan

> **Execution rule:** Complete each task test-first, keep commits small, and run the stated verification before moving on.

**Goal:** Replace the thin uploader-led experience with an eight-language learning hub, four distinct resources, transparent Young LIN authorship, and original educational interactions while preserving the verified deployment infrastructure.

**Architecture:** Extend the typed public-route/content/metadata pipeline rather than adding one-off pages. Static editorial data remains locale keyed and prerenderable. Interactive atlas, Barnum lab, and hand-landmark overlay are isolated React components embedded in content routes; factual article copy remains available in raw HTML.

**Stack:** React 18, TypeScript, React Router, Zustand, Tailwind, Vitest/Testing Library, Vite prerender scripts, Vercel.

---

## Task 1: Establish the content-focused route matrix

**Files:**
- Modify: `src/config/public-routes.ts`
- Modify: `src/config/public-routes.test.ts`
- Modify: `scripts/generate-sitemap.mjs`
- Modify: `scripts/prerender.mjs`
- Modify: `src/readiness/raw-localized-delivery.test.ts`
- Modify: `src/server/prerender-html.ts`

1. Add failing tests for `/guides`, four new guide routes, an 88-URL sitemap containing only content routes, and a 104-file raw prerender matrix that includes all 13 public pages per locale (11 content plus Privacy and Terms).
2. Add `INDEXABLE_CONTENT_PATHS`, extend `PUBLIC_PATHS`, and make sitemap generation consume only the former.
3. Replace hard-coded prerender counts with the typed route/locale matrix while retaining uniqueness and unsafe-output guards.
4. Run the route, sitemap, and raw-delivery tests.
5. Commit the passing route matrix.

## Task 2: Add Young LIN authorship and structured editorial trust

**Files:**
- Modify: `src/content/guides.ts`
- Modify: `src/content/locales/types.ts`
- Modify: `src/pages/GuidePage.tsx`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/config/site-metadata.ts`
- Modify: `src/components/seo/RouteMeta.tsx`
- Modify: corresponding tests under `src/content`, `src/pages`, and `src/components/seo`

1. Add failing tests requiring visible `Young LIN` attribution, localized role/disclosure, flexible ISO update dates, and `Person` author JSON-LD.
2. Extend the editorial model with author and optional reading-context fields without duplicating identity in every locale payload.
3. Render an author block in every guide and expand About with the factual role, credential limits, editorial method, and update history.
4. Generate `Article` author/publisher data and hub collection data without invented profiles.
5. Run focused content/page/SEO tests and commit.

## Task 3: Build the learning hub and concise navigation

**Files:**
- Create: `src/pages/GuideHubPage.tsx`
- Create: `src/pages/GuideHubPage.test.tsx`
- Modify: `src/components/routing/LocaleRouter.tsx`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/i18n/catalogs.ts`
- Modify: locale catalog files and related tests

1. Add failing route/navigation tests for Home, Learn, How it works, About, locale, theme, and footer-only legal links.
2. Implement the hub with distinct learning paths, guide descriptions, scope/limitations, and crawlable links.
3. Add complete navigation and hub labels in all eight locales.
4. Run route, catalog, page-shell, and accessibility-name tests and commit.

## Task 4: Implement the 21-landmark atlas

**Files:**
- Create: `src/content/landmarks.ts`
- Create: `src/components/education/LandmarkAtlas.tsx`
- Create: `src/components/education/LandmarkAtlas.test.tsx`
- Modify: `src/pages/GuidePage.tsx`
- Modify: locale content modules

1. Add failing tests for all indices 0–20, pointer and keyboard selection, synchronized selected state, accessible diagram/list labels, and reset-to-wrist behavior.
2. Implement the typed landmark map and original SVG diagram.
3. Add complete localized landmark location/limitation copy.
4. Embed the component only on `/guides/hand-landmark-atlas`; ensure its surrounding article remains substantial without interaction.
5. Run focused and public-page tests and commit.

## Task 5: Implement the Barnum effect mini-lab

**Files:**
- Create: `src/components/education/BarnumLab.tsx`
- Create: `src/components/education/BarnumLab.test.tsx`
- Modify: `src/pages/GuidePage.tsx`
- Modify: locale content/catalog modules

1. Add failing tests for two statements plus “neither,” reveal-only-after-choice, explanation, no persistence/network side effect, keyboard operation, and reset.
2. Implement randomized display order without presenting a personality score.
3. Supply localized statements, debrief, and evidence-check prompts for all locales.
4. Embed only on `/guides/barnum-effect-lab`, run tests, and commit.

## Task 6: Add four complete resources and enrich the existing corpus

**Files:**
- Modify: `src/content/guides.ts`
- Modify: `src/content/locales/zh-CN.ts`
- Modify: `src/content/locales/ja.ts`
- Modify: `src/content/locales/ko.ts`
- Modify: `src/content/locales/es.ts`
- Modify: `src/content/locales/pt-BR.ts`
- Modify: `src/content/locales/fr.ts`
- Modify: `src/content/guides.test.ts`

1. Add failing structural tests requiring complete titles, summaries, multiple subject-specific sections, visible sources, unique normalized body fingerprints, and no English body fallback in non-English locales.
2. Write `zh-TW` and English source content for the atlas, creases comparison, Barnum lab, and claim-evaluation guide; add original examples/tables represented as structured sections.
3. Write complete localized versions for the other six locales, preserving claims, boundaries, sources, and author identity.
4. Add subject-specific enrichment and internal links to the three existing guides.
5. Verify primary/authoritative source URLs and claims, run content tests, and commit.

## Task 7: Make the detector result educational

**Files:**
- Create: `src/components/palm/LandmarkOverlay.tsx`
- Create: `src/components/palm/LandmarkOverlay.test.tsx`
- Modify: `src/components/palm/HandPreview.tsx`
- Modify: `src/components/palm/HandPreview.test.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/i18n/catalogs.ts` and locale catalogs

1. Add failing tests that verify 21 plotted points and connections, responsive SVG/viewBox behavior, localized legend, atlas/limitations links, and explicit “not palm creases” copy.
2. Implement an image-and-SVG overlay using normalized detector coordinates, preserving image aspect ratio and pointer independence.
3. Place the uploader below the learning introduction; make the reflection card visibly secondary entertainment.
4. Add localized success, limitation, and educational-result copy and run palm/home tests.
5. Commit.

## Task 8: Complete metadata, raw HTML, and anti-duplication checks

**Files:**
- Modify: `src/config/site-metadata.ts`
- Modify: `src/server/prerender-html.ts`
- Modify: `src/config/site-metadata.test.ts`
- Modify: `src/readiness/raw-localized-delivery.test.ts`
- Modify: `public/sitemap.xml` through the generator

1. Add failing tests for every new localized title/description, self-canonical, all hreflang alternatives, hub structured data, Young LIN article authorship, breadcrumbs, and raw author/body content.
2. Extend the metadata and prerender models for the new route types.
3. Generate the sitemap and assert exactly 88 unique content URLs, with no Privacy or Terms entries.
4. Run metadata, raw delivery, truthfulness, and publisher-file tests and commit.

## Task 9: Stabilize, audit, build, and visually verify

**Files:**
- Modify only files required by verified failures
- Create: `docs/audits/2026-08-03-adsense-content-value-audit.md`

1. Reproduce and stabilize the existing intermittent whole-suite homepage lazy-load test without weakening assertions.
2. Run `npm test`, `npm run lint`, `npm run build`, `npm run audit:adsense`, and `npm run test:detector-smoke` where the environment supports the model smoke test.
3. Audit generated HTML count, sitemap URLs, author/metadata/body visibility, duplicate fingerprints, and absence of unrelated main-worktree files.
4. Use the in-app browser for desktop/mobile visual and interaction QA if available; otherwise record the browser limitation and use the local preview plus automated DOM/raw-HTML evidence.
5. Record exact results, remaining risks, and no-approval-guarantee in the audit document; commit.

## Task 10: Preview deployment and production handoff

1. Deploy the isolated branch to a Vercel preview using the existing linked project.
2. Verify representative pages from all eight locales, the four interactions/states, localized 404, redirects, `ads.txt`, `robots.txt`, response headers, and raw HTML.
3. Promote only the audited commit to production, preserving Cloudflare DNS-only.
4. Re-run the public verification matrix and report the exact production URL and commit.
5. Search Console recrawl and AdSense resubmission remain post-deploy operations after Google has fetched the new corpus.
