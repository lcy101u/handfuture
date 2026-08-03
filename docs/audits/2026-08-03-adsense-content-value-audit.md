# HandFuture AdSense content-value audit

**Audit date:** 2026-08-03  
**Public author:** Young LIN  
**Branch:** `codex/adsense-content-value`  
**Scope:** AdSense rejection reason “low value content”; public content, implementation truthfulness, crawlability, accessibility, and release readiness.

## Outcome

The release replaces the uploader-led experience with a learning-first site. It adds a seven-guide learning hub, four new source-backed resources, three original interactive learning tools, an educational detector overlay, visible Young LIN authorship, an editorial method and update history, breadcrumbs, and complete content in all eight supported locales.

This directly addresses the stated rejection reason, but it cannot guarantee approval. Google controls indexing and the final AdSense review.

## Content and product changes verified

- Home now leads with four original learning paths before the optional photo tool.
- `/guides` links seven distinct guides and explains the site’s evidence boundary.
- New resources cover the 21 MediaPipe landmarks, creases versus landmarks, the Barnum effect, and a repeatable claim-evaluation checklist.
- The atlas exposes all landmark indices 0–20 through synchronized pointer, keyboard, and list controls.
- The Barnum lab reveals its explanation only after a choice, supports “neither” and reset, and does not persist or transmit an answer.
- The comparison tool separates visible skin creases, anatomical joints, model coordinates, and cultural palmistry labels.
- A successful detector result shows the actual 21-point overlay and explains that the points are not palm creases and contain no health, personality, or future information.
- Guides visibly identify Young LIN as HandFuture’s independent developer and content editor. About states credential limits, the editorial method, and a dated change record.
- Every guide has a date, visible sources, related reading, and localized breadcrumbs. Article JSON-LD identifies Young LIN as `Person` author and HandFuture as publisher.
- `how-it-works` copy was corrected in all eight locales so it matches the newly implemented overlay instead of saying that only a text status is shown.

## Route and crawl audit

- 13 public route templates × 8 locales = 104 prerendered HTML documents.
- 11 editorial/content routes × 8 locales = 88 unique sitemap URLs.
- Privacy and Terms remain public, canonical, localized, and linked, but are excluded from the editorial sitemap.
- Canonical, hreflang, `x-default`, Open Graph locale, structured data, raw H1/body, author, and date checks pass.
- `/guides` uses `CollectionPage`; guide routes use `Article`; guide hierarchy is exposed through visible and structured breadcrumbs.
- Vercel exact prerender rewrites are generated from the same typed route matrix as the app and prerender scripts.
- `robots.txt`, `ads.txt`, real 404 behavior, and the existing AdSense verification tag were not replaced by content work.

## Automated verification

| Check | Result |
|---|---|
| Full Vitest suite | PASS — 28 files, 606 tests |
| AdSense-focused audit | PASS — 14 files, 366 tests |
| TypeScript production build | PASS |
| Vite production build | PASS — 104 localized HTML documents generated |
| ESLint | PASS with 0 errors; 6 pre-existing Fast Refresh warnings in shared UI components |
| Detector smoke | PASS — pinned MediaPipe `0.4.1675469240`, known fixture, one validated 21-landmark hand |
| Generated diff whitespace check | PASS |

The detector smoke was made deterministic by opening `/zh-TW/` before waiting for the Traditional Chinese success message. The former test opened the language gateway `/`, so an English browser locale could create a false timeout.

## Visual verification

Local production-preview screenshots and interaction checks were run with headless Chrome at desktop `1440×1000` and mobile `390×844` for:

- Traditional Chinese home;
- English learning hub;
- English 21-landmark atlas;
- Traditional Chinese Barnum lab.

Observed results: navigation remains within the viewport, one H1 is visible, learning cards precede the uploader, guide text is readable, breadcrumbs and author attribution are visible, atlas controls remain usable, the Barnum choices fit mobile width, and no horizontal overflow was observed. The in-app Browser connector was unavailable, so this used the project’s local Playwright/Chrome path instead.

## Dependency and tooling observations

- Browserslist reports that its local `caniuse-lite` data is 11 months old. This does not fail the build.
- `npm audit` reports three high-severity dependency advisories: two runtime entries from the current React Router advisory and one development dependency through `brace-expansion`. The audit proposes a forced React Router downgrade, so no unrelated breaking dependency change was made in this content release. This app is a client-side SPA and does not implement React Router RSC server actions, which reduces exposure to the cited RSC action issue, but the dependency should still be upgraded or pinned in a separate tested maintenance change.

## Remaining release checks

1. Deploy this isolated branch to Vercel preview and verify representative routes, headers, raw body content, `ads.txt`, `robots.txt`, redirects, and a true localized 404.
2. Promote the exact audited commit to production without changing Cloudflare DNS-only mode.
3. Recheck the production sitemap and representative locales.
4. Ask Search Console to recrawl the home page, learning hub, About, atlas, Barnum lab, and claim-evaluation guide.
5. Wait for Google to fetch the new corpus before requesting AdSense review again.

## Scope integrity

Implementation and deployment are performed from the registered isolated worktree. Unrelated untracked files in the user’s main worktree are not included.
