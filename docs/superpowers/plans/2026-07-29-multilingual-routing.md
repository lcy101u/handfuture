# HandFuture Multilingual Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add eight complete, indexable language versions of every public HandFuture page with user-controlled locale selection, browser-first detection, country fallback, and multilingual SEO.

**Architecture:** Keep the existing Vite SPA and its eight language-neutral content paths, add a locale domain module that parses and builds `/{locale}` routes, and make route locale the rendering source of truth. Static locale catalogs contain UI, editorial, legal, and metadata text; a minimal Vercel Function exposes only the request country code when browser preferences cannot match a supported locale.

**Tech Stack:** React 18, React Router, TypeScript, Zustand, Vite, Vitest, Testing Library, Vercel Functions/configuration.

## Global Constraints

- Supported locales are exactly `zh-TW`, `zh-CN`, `en`, `ja`, `ko`, `es`, `pt-BR`, and `fr`.
- Locale priority is explicit saved choice, URL locale, browser language, country fallback, then English; a locale explicitly present in a shared URL renders that URL without an automatic redirect.
- Cloudflare stays DNS-only.
- Do not store or emit a full IP address or country analytics event.
- Preserve `HandFuture`, `handfortune.com`, publisher ID `ca-pub-3713047615080346`, `ads.txt`, CMP integration, source URLs, dates, and disclaimer meaning.
- New production behavior follows strict red-green-refactor TDD.
- Do not deploy production from this plan; verify locally and on a later Vercel Preview deployment.

---

### Task 1: Locale domain and deterministic selection

**Files:**
- Create: `src/i18n/locales.ts`
- Create: `src/i18n/locales.test.ts`
- Modify: `src/config/public-routes.ts`

**Interfaces:**
- Produces: `Locale`, `SUPPORTED_LOCALES`, `normalizeLocale(value)`, `localeFromBrowserLanguages(values)`, `localeFromCountry(country)`, `parseLocalizedPath(pathname)`, and `buildLocalizedPath(locale, path)`.
- Consumes: `PublicPath` and `isPublicPath()` from `src/config/public-routes.ts`.

- [ ] **Step 1: Write failing locale and route tests**

```ts
expect(normalizeLocale("zh-Hant-HK")).toBe("zh-TW");
expect(normalizeLocale("zh-Hans-CN")).toBe("zh-CN");
expect(localeFromBrowserLanguages(["de-DE", "ja-JP"])).toBe("ja");
expect(localeFromCountry("TW")).toBe("zh-TW");
expect(localeFromCountry("MX")).toBe("es");
expect(localeFromCountry("DE")).toBe("en");
expect(parseLocalizedPath("/pt-BR/guides/hand-photo-guide")).toEqual({
  locale: "pt-BR",
  publicPath: "/guides/hand-photo-guide",
});
expect(parseLocalizedPath("/de/about")).toBeNull();
expect(buildLocalizedPath("fr", "/")).toBe("/fr/");
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/i18n/locales.test.ts`  
Expected: FAIL because `src/i18n/locales.ts` does not exist.

- [ ] **Step 3: Implement the locale domain**

Implement literal country groups, BCP-47 normalization using lowercase comparison, exact public-path validation, and slash-safe path building. Re-export `Locale` from `public-routes.ts` for existing imports during migration.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test -- src/i18n/locales.test.ts`  
Expected: all locale tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/locales.ts src/i18n/locales.test.ts src/config/public-routes.ts
git commit -m "feat: add multilingual locale domain"
```

### Task 2: Locale catalogs and persistent explicit preference

**Files:**
- Create: `src/i18n/catalogs.ts`
- Create: `src/i18n/catalogs.test.ts`
- Modify: `src/store/language-store.ts`
- Modify: `src/store/language-store.test.ts`

**Interfaces:**
- Consumes: `Locale` from Task 1.
- Produces: `LanguageCatalog`, `LANGUAGE_OPTIONS`, `catalogs`, `getTranslation(locale, key)`, store fields `currentLanguage`, `hasExplicitPreference`, and `setLanguage(locale, explicit?)`.

- [ ] **Step 1: Write failing catalog completeness tests**

```ts
for (const locale of SUPPORTED_LOCALES) {
  expect(Object.keys(catalogs[locale]).sort()).toEqual(Object.keys(catalogs.en).sort());
  expect(catalogs[locale]["hero.title"]).not.toBe(catalogs.en["hero.title"]);
}
expect(LANGUAGE_OPTIONS.map(({ code }) => code)).toEqual([
  "zh-TW", "zh-CN", "en", "ja", "ko", "es", "pt-BR", "fr",
]);
```

- [ ] **Step 2: Run catalog tests and verify RED**

Run: `npm test -- src/i18n/catalogs.test.ts`  
Expected: FAIL because multilingual catalogs do not exist.

- [ ] **Step 3: Add complete UI catalogs**

Move existing zh/en strings to catalogs, translate every UI key into the other six locales, and expose language self-names and short labels. `getTranslation` may fall back to English only for an impossible runtime key, while the completeness test prevents shipped omissions.

- [ ] **Step 4: Add failing persistence tests**

```ts
useLanguageStore.getState().setLanguage("ja", true);
expect(useLanguageStore.getState()).toMatchObject({
  currentLanguage: "ja",
  hasExplicitPreference: true,
});
expect(document.documentElement.lang).toBe("ja");
```

- [ ] **Step 5: Migrate the store and verify GREEN**

Keep the storage key `language-store`, migrate legacy `zh` to `zh-TW`, persist explicit choice separately, and make `t()` delegate to `getTranslation()`.

Run: `npm test -- src/i18n/catalogs.test.ts src/store/language-store.test.ts`  
Expected: all catalog and store tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/store/language-store.ts src/store/language-store.test.ts
git commit -m "feat: add eight locale UI catalogs"
```

### Task 3: Localized routing and language switching

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/NotFoundPage.tsx`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/components/layout/SiteLayout.tsx`
- Modify: `src/components/palm/DisclaimerModal.tsx`
- Modify: `src/components/palm/HandPreview.tsx`
- Modify: `src/components/palm/ImageUploader.tsx`
- Modify: `src/components/palm/ReflectionResult.tsx`
- Modify: `src/components/social/SocialShare.tsx`
- Modify: `src/components/ui/LanguageSwitcher.tsx`
- Modify: `src/i18n/catalogs.ts`
- Modify: `src/lib/reflection-engine.ts`
- Create: `src/components/routing/LocaleRouter.tsx`
- Create: `src/components/routing/LocaleRouter.test.tsx`
- Modify: `src/pages/HomePage.test.tsx`
- Modify: `src/components/palm/DisclaimerModal.test.tsx`
- Modify: `src/components/palm/HandPreview.test.tsx`
- Modify: `src/components/palm/ImageUploader.test.tsx`
- Modify: `src/components/palm/ReflectionResult.test.tsx`
- Modify: `src/components/social/SocialShare.test.tsx`
- Modify: `src/pages/PublicPages.test.tsx`

**Interfaces:**
- Consumes: path parsing/building from Task 1 and explicit preference store from Task 2.
- Produces: route locale synchronization and same-page language navigation.
- Produces: eight-locale copy for every tracked interactive component reachable from the localized home page; no component may index a two-key `zh`/`en` object with the eight-locale store value.

- [ ] **Step 1: Write failing routing behavior tests**

```tsx
renderAt("/ja/");
expect(document.documentElement.lang).toBe("ja");
expect(screen.getByRole("heading", { name: "1枚の手の写真から、文化を探る旅へ" })).toBeVisible();

await user.click(screen.getByRole("button", { name: /language/i }));
await user.click(screen.getByRole("menuitem", { name: /Français/ }));
expect(window.location.pathname).toBe("/fr/");
```

Also cover a pure same-page builder assertion from `/en/privacy` to `/fr/privacy`, legacy `/about` navigation to `/zh-TW/about`, unsupported `/de/about`, and a missing localized content path. Do not render non-English long-form content until Task 4 supplies it.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/components/routing/LocaleRouter.test.tsx src/pages/PublicPages.test.tsx`  
Expected: FAIL because localized routes are not registered.

- [ ] **Step 3: Implement localized routes**

Make localized path state authoritative, reuse existing page components, preserve the content path on switch, and prevent redirect loops. The `/` gateway chooses a locale only after checking explicit preference and browser languages; country fallback is wired in Task 6. Move every tracked home/interactive/layout/not-found/social component's direct bilingual copy into the complete catalog (or a complete typed eight-locale content record for reflection cards), including accessible labels and validation/errors, so all eight localized home routes render without English-only branches or undefined lookups.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test -- src/components/routing/LocaleRouter.test.tsx src/pages/PublicPages.test.tsx`  
Expected: all localized routing tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/pages/HomePage.tsx src/pages/NotFoundPage.tsx src/components/layout src/components/palm src/components/social src/components/ui/LanguageSwitcher.tsx src/components/routing src/i18n/catalogs.ts src/lib/reflection-engine.ts src/pages/HomePage.test.tsx src/pages/PublicPages.test.tsx
git commit -m "feat: route public pages by locale"
```

### Task 4: Translate editorial, policy, and metadata content

**Files:**
- Modify: `src/content/guides.ts`
- Modify: `src/content/policies.ts`
- Modify: `src/config/site-metadata.ts`
- Modify: `src/config/public-routes.ts`
- Modify: `src/components/routing/LocaleRouter.tsx`
- Modify: `src/components/routing/RouteErrorBoundary.tsx`
- Modify: `src/pages/GuidePage.tsx`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/pages/PrivacyPolicyPage.tsx`
- Modify: `src/pages/TermsPage.tsx`
- Modify: `src/i18n/catalogs.ts`
- Modify: `src/content/guides.test.ts`
- Modify: `src/content/policies.test.ts`
- Modify: `src/config/public-routes.test.ts`
- Modify: `src/pages/PublicPages.test.tsx`

**Interfaces:**
- Consumes: the eight-locale `Locale` union.
- Produces: complete `Record<Locale, EditorialPage>` and `Record<Locale, RouteMetadata>` data for every public page.
- Produces: all 64 localized public routes as real indexable content pages; removes the temporary English-only long-form gate and the legacy two-language `Locale` compatibility alias.

- [ ] **Step 1: Expand content tests and verify RED**

```ts
for (const locale of SUPPORTED_LOCALES) {
  expect(HOW_IT_WORKS_CONTENT[locale].sections.length).toBeGreaterThanOrEqual(4);
  expect(PRIVACY_CONTENT[locale].sections.length).toBe(PRIVACY_CONTENT.en.sections.length);
  expect(TERMS_CONTENT[locale].sections.length).toBe(TERMS_CONTENT.en.sections.length);
  for (const path of PUBLIC_PATHS) {
    expect(getRouteMetadata(path, locale).title).not.toHaveLength(0);
  }
}
```

Run: `npm test -- src/content src/config/public-routes.test.ts`  
Expected: FAIL for the six missing locales.

- [ ] **Step 2: Add six complete translations**

Translate each heading, summary, paragraph, bullet, metadata title, description, and image alt. Preserve source link labels when they are proper publication/product names and preserve every source URL byte-for-byte.

Replace remaining `locale === "zh"` long-form branches with catalog-backed eight-locale labels (publisher, updated date, sources, related reading, page eyebrows, and route-error copy). Switch `src/config/public-routes.ts` to the canonical eight-locale type, remove the temporary long-form availability gate, and add rendered-route coverage proving representative guide, about, privacy, and terms pages are indexable and visibly translated outside English/Chinese.

- [ ] **Step 3: Audit high-risk meaning**

Add table-driven assertions that every locale retains explicit statements equivalent to: non-scientific entertainment, no medical/financial/life-decision use, photos are not uploaded to HandFuture, and MediaPipe detects joints rather than palm creases.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test -- src/content src/config/public-routes.test.ts`  
Expected: all content and metadata tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/content src/config src/components/routing src/pages/GuidePage.tsx src/pages/AboutPage.tsx src/pages/PrivacyPolicyPage.tsx src/pages/TermsPage.tsx src/pages/PublicPages.test.tsx src/i18n/catalogs.ts
git commit -m "feat: translate public content into eight locales"
```

### Task 5: Canonical, hreflang, structured data, and localized sitemap

**Files:**
- Modify: `src/components/seo/RouteMeta.tsx`
- Modify: `src/components/seo/RouteMeta.test.tsx`
- Modify: `src/config/site-metadata.ts`
- Create: `scripts/generate-sitemap.mjs`
- Modify: `package.json`
- Modify: `public/sitemap.xml`
- Modify: `src/readiness/publisher-files.test.ts`

**Interfaces:**
- Consumes: localized path builder and metadata from Tasks 1 and 4.
- Produces: locale-specific canonical and Open Graph URLs, eight reciprocal alternate links plus `x-default`, localized JSON-LD, and 64 sitemap URLs.

- [ ] **Step 1: Write failing SEO tests**

```ts
expect(canonical.href).toBe("https://www.handfortune.com/ja/about");
expect(document.querySelectorAll('link[rel="alternate"][hreflang]').length).toBe(9);
expect(document.querySelector('link[hreflang="fr"]')?.getAttribute("href"))
  .toBe("https://www.handfortune.com/fr/about");
expect(jsonLd.inLanguage).toBe("ja");
```

- [ ] **Step 2: Run SEO tests and verify RED**

Run: `npm test -- src/components/seo/RouteMeta.test.tsx src/readiness/publisher-files.test.ts`  
Expected: FAIL because canonical URLs are language-neutral and alternates are missing.

- [ ] **Step 3: Implement route metadata and sitemap generation**

Upsert alternates by `hreflang` rather than by `rel` alone, remove stale locale alternates on navigation, build fully-qualified URLs, and generate a deterministic XML sitemap from `SUPPORTED_LOCALES × PUBLIC_PATHS`.

- [ ] **Step 4: Generate sitemap and verify GREEN**

Run: `npm run generate:sitemap && npm test -- src/components/seo/RouteMeta.test.tsx src/readiness/publisher-files.test.ts`  
Expected: sitemap generation succeeds and all SEO readiness tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/seo src/config/site-metadata.ts scripts/generate-sitemap.mjs package.json public/sitemap.xml src/readiness/publisher-files.test.ts
git commit -m "feat: add multilingual SEO signals"
```

### Task 6: Browser-first country fallback and privacy disclosure

**Files:**
- Create: `api/locale.ts`
- Create: `src/i18n/locale-detection.ts`
- Create: `src/i18n/locale-detection.test.ts`
- Modify: `src/components/routing/LocaleRouter.tsx`
- Modify: `src/content/policies.ts`
- Modify: `vercel.json`

**Interfaces:**
- Consumes: selection helpers from Task 1.
- Produces: `resolveInitialLocale({ explicitLocale, browserLanguages, fetchCountry })` and `{ country: string | null }` from same-origin `/api/locale`.

- [ ] **Step 1: Write failing precedence tests**

```ts
await expect(resolveInitialLocale({
  explicitLocale: "fr",
  browserLanguages: ["ja-JP"],
  fetchCountry: async () => "KR",
})).resolves.toBe("fr");

await expect(resolveInitialLocale({
  explicitLocale: null,
  browserLanguages: ["ja-JP"],
  fetchCountry: async () => "KR",
})).resolves.toBe("ja");

await expect(resolveInitialLocale({
  explicitLocale: null,
  browserLanguages: ["de-DE"],
  fetchCountry: async () => "BR",
})).resolves.toBe("pt-BR");
```

- [ ] **Step 2: Run detection tests and verify RED**

Run: `npm test -- src/i18n/locale-detection.test.ts`  
Expected: FAIL because the resolver does not exist.

- [ ] **Step 3: Implement minimal country endpoint and resolver**

Read `x-vercel-ip-country`, validate it as two ASCII letters, set `Cache-Control: private, no-store`, and return only the country code. If the endpoint fails or times out, return English without blocking the page indefinitely.

- [ ] **Step 4: Update privacy translations**

Add an equivalent disclosure in all eight locales describing browser language, saved preference, and Vercel-derived country code for locale suggestion; state that HandFuture does not save the full IP or create a location profile.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `npm test -- src/i18n/locale-detection.test.ts src/content/policies.test.ts`  
Expected: all detection and policy tests pass.

- [ ] **Step 6: Commit**

```bash
git add api/locale.ts src/i18n src/components/routing/LocaleRouter.tsx src/content/policies.ts vercel.json
git commit -m "feat: add privacy-safe locale suggestion"
```

### Task 7: Full regression and AdSense audit

**Files:**
- Modify only files implicated by failures.
- Regenerate: `dist/**` only after source verification passes.

**Interfaces:**
- Consumes: completed multilingual feature.
- Produces: fresh verification evidence and a deployable preview artifact.

- [ ] **Step 1: Run focused mutation checks**

Temporarily verify that wrong locale normalization, a missing translation key, and a missing alternate link each fail their intended test; restore correct code after each check.

- [ ] **Step 2: Run the complete automated suite**

```bash
npm test
npm run audit:adsense
npm run lint
npm run build
```

Expected: zero test, audit, lint-error, TypeScript, or build failures. Existing lint warnings must be reported, not hidden.

- [ ] **Step 3: Inspect generated publisher artifacts**

```bash
test "$(find dist -maxdepth 1 -name 'ads.txt' -type f | wc -l | tr -d ' ')" = "1"
rg -n "ca-pub-3713047615080346|google.com, pub-3713047615080346" dist/index.html dist/ads.txt
rg -n "<loc>https://www.handfortune.com/(zh-TW|zh-CN|en|ja|ko|es|pt-BR|fr)/" dist/sitemap.xml
```

Expected: publisher ID is unchanged, `ads.txt` has the approved record, and all locale groups exist in the built sitemap.

- [ ] **Step 4: Perform local browser smoke tests**

Verify `/`, one page in every locale, same-page switching, persisted preference, an unsupported locale, a missing localized route, and the forced CMP query string. Record any CMP absence as external Google state rather than fabricating a site pass.

- [ ] **Step 5: Commit generated output if the repository tracks it**

```bash
git add dist
git commit -m "build: generate multilingual distribution"
```

- [ ] **Step 6: Review final diff against the design**

Confirm all eight locales, 64 canonical pages, nine alternate links per page, country fallback precedence, privacy disclosure, old-route compatibility, AdSense identifiers, and no production deployment.
