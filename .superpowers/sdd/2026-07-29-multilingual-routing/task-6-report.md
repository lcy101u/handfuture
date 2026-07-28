# Task 6 report: browser-first country fallback and privacy disclosure

Date: 2026-07-29

## Outcome

Task 6 adds a privacy-minimized country fallback after saved and browser language selection, a platform-type-free Vercel locale endpoint, equivalent disclosure in all eight supported locales, and finite Vercel rewrites for every canonical localized public route.

The resolver precedence is:

1. saved explicit locale preference;
2. first supported browser language;
3. country code returned by `/api/locale`;
4. English.

Only the unprefixed `/` gateway runs the resolver. Canonical locale-prefixed URLs render their URL locale directly. Country lookup is skipped when a saved preference or supported browser language exists.

## Implementation

### Locale detection

- Added `resolveInitialLocale` in `src/i18n/locale-detection.ts`.
- Added a 400 ms country-resolution timeout. Rejection, timeout, null, or a value other than exactly two ASCII letters falls back to English.
- Added `fetchCountryCode`, which requests only same-origin `/api/locale` with `cache: "no-store"` and validates the response as exactly `{ country: uppercase-two-letter-code | null }`. HTTP failures, invalid JSON, extra fields, and malformed values return null.
- Updated `LocaleRouter` so only the root gateway resolves asynchronously. Existing saved preferences and supported browser languages avoid the country request entirely.

### Country endpoint

- Added `api/locale.ts` with local structural request/response interfaces and no Vercel-only dependency or type import.
- The handler reads only `x-vercel-ip-country`.
- It accepts exactly two ASCII letters, normalizes them to uppercase, and otherwise returns null.
- Its response is exactly `{ country: string | null }` with `Cache-Control: private, no-store`.
- The handler does not read or return full IP, city, or other location fields and adds no persistence or analytics.

### Privacy disclosure

- Added a dedicated locale-suggestion section to each of the eight privacy policies: Traditional Chinese, Simplified Chinese, English, Japanese, Korean, Spanish, Brazilian Portuguese, and French.
- Each disclosure covers saved language preference, browser languages, the Vercel IP-derived two-letter country code fallback, and the fact that HandFuture does not store a full IP address or create a location profile.
- All existing policy sections remain in their original order around the inserted section, and all three existing source URLs remain unchanged.
- The existing Cloudflare disclosure remains DNS-only; no Worker, proxy, or Cloudflare deployment change was made.

### Deployment rewrites

- Preserved the seven exact legacy public-route rewrites.
- Added exact rewrites for all 64 combinations of eight locales and eight canonical public paths.
- No catch-all, wildcard, or parameterized SPA rewrite was added.
- `/api/locale`, `ads.txt`, `robots.txt`, `sitemap.xml`, assets, unsupported locale paths, and unknown paths are not rewritten to `index.html`, preserving real direct-request 404 behavior.

## Strict TDD evidence

Every production behavior was preceded by a failing test:

1. Resolver RED: `npm test -- src/i18n/locale-detection.test.ts` failed because `./locale-detection` did not exist.
   - GREEN: 6/6 resolver tests passed.
2. Endpoint RED: `npm test -- api/locale.test.ts` failed because `./locale` did not exist.
   - GREEN: 9/9 endpoint tests passed. The test was then moved outside `api/` to avoid deployment as a function.
3. Client parser RED: five tests failed with `fetchCountryCode is not a function`.
   - GREEN: 11/11 locale-detection and endpoint-client tests passed.
4. Router RED: the unsupported-browser integration expected `/pt-BR/` but received `/en/`.
   - GREEN: resolver, endpoint, and router suites passed 40/40.
5. Policy RED: eight locale cases failed because the locale-suggestion section was absent.
   - GREEN: the policy suites passed 105/105.
6. Rewrite RED: the Vercel configuration contained 7 rewrites instead of the required finite 71.
   - GREEN: the isolated supported/excluded rewrite contract passed.

## Fresh verification

- `npm test -- src/i18n/locale-detection.test.ts src/i18n/api-locale.test.ts src/components/routing/LocaleRouter.test.tsx src/content/policies.test.ts`
  - 5 files passed, 145 tests passed.
- `npm test -- src/readiness/publisher-files.test.ts -t "rewrites every supported SPA route"`
  - 1 rewrite-contract test passed; unrelated tests were skipped by the name filter.
- Targeted TypeScript check for the endpoint and locale domain/detection files passed.
- Targeted ESLint across every Task 6 TypeScript/TSX file passed.
- Router suite after code-review cleanup: 20/20 passed.
- `git diff --check` passed.

## Review and workspace concerns

An independent code review found no critical or important issues. Its one minor test-isolation finding was fixed by restoring stubbed globals after every `LocaleRouter` test.

Full-repository `npx tsc -b` and unfiltered `npm test` are not clean in the shared dirty workspace for reasons outside Task 6:

- preserved untracked source files reference missing `recharts`, `@radix-ui/react-slider`, and `@radix-ui/react-tabs` packages and contain unrelated locale/type errors;
- Vitest recursively discovers the preserved `.worktrees/adsense-readiness` worktree, whose second React installation causes duplicate-React hook failures;
- preserved untracked publisher/build artifacts trigger existing readiness assertions.

Those files and the unrelated `package.json` / `package-lock.json` edits were not modified, deleted, staged, or committed by Task 6.
