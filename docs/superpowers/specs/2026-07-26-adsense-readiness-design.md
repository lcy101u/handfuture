# HandFuture AdSense Readiness Design

**Date:** 2026-07-26

**Status:** Approved direction; awaiting written-spec review

## Objective

Make HandFuture an honest, complete, crawlable, content-led entertainment site that is suitable for a new Google AdSense review. The work will remove demonstrably misleading material, repair broken production routes and publisher files, and retain a useful browser-side hand experience without claiming scientific palm-line analysis.

AdSense approval is not a deliverable that code can guarantee. The deliverable is a site for which all known technical, content-quality, navigation, trust, privacy, and ad-implementation risks found in this audit have been addressed.

## Audit Evidence Driving the Design

- Production returns HTTP 404 for `/about`, `/privacy`, `/terms`, and `/batch`, even though those URLs are linked and listed in the sitemap.
- Both the apex and `www` hosts return full HTTP 200 pages, while metadata declares only `www` canonical.
- The committed `public/ads.txt` line has an invalid `/ads.txt` suffix; the currently deployed copy is correct and would regress on the next build.
- `public/og-image.jpg` is a 265-byte text placeholder served as `image/jpeg`.
- Production loads `static.devv.ai/devv-app.js`, a development/editor script unrelated to the public product.
- The hand detector, palm features, confidence values, breaks, islands, handedness, and interpretations are generated with `Math.random()` rather than image analysis.
- Sample reviews are presented as real and verified. Ratings, user totals, satisfaction, and recommendation rates have no supporting data.
- The site claims a 300,000-image dataset, expert collaborators, model reports, workshops, newsletters, and substantial editorial resources that do not exist in the repository and are not supported by the owner.
- The privacy and terms pages describe GA4, newsletters, cloud exports, retention periods, MFA controls, and support response times that do not match the implementation.
- Public email addresses have no working MX configuration. The footer links to a `dontsp.am` address.
- The initial HTML contains no publisher content or AdSense ownership code; all visible content depends on client-side rendering.
- The production dependency audit reports high-severity vulnerabilities, including React Router and PostCSS advisories.
- Cloudflare is authoritative DNS, but production responses come directly from Vercel without Cloudflare proxy headers. Vercel, not Cloudflare, currently provides the serving CDN.

## Product Positioning

The product will be presented as **HandFuture — a palmistry culture explorer with AI-assisted hand detection**.

The detector may determine whether a hand is present and locate standard hand landmarks. It must not claim to see life, heart, head, or fate lines because the selected hand-landmark model does not detect palm creases. It must not produce medical, psychological, financial, legal, compatibility, or future-outcome claims.

After a hand is detected, the site may present a deterministic cultural reflection card derived from normalized landmark geometry. The result must be labeled as a non-scientific entertainment prompt. It will not display accuracy, confidence, measured palm-line length, clarity, breaks, islands, or diagnostic evidence.

If detection fails, the site will explain the photographic issue and let the user retry. Failure must be based on detector output, not a random failure rate.

The existing local-only image workflow remains: the uploaded image is read and processed in the browser and is not sent to an application server. Only this behavior may be claimed.

## Information Architecture

The public navigation will contain only real destinations:

- `/` — tool introduction, upload experience, concise cultural overview, limitations, and links to guides.
- `/how-it-works` — exact explanation of hand detection, local image processing, reflection-card selection, and what the tool cannot infer.
- `/guides/palmistry-basics` — sourced overview of palmistry as a cultural tradition and common traditional line names.
- `/guides/science-and-limitations` — scientific limitations, cognitive-bias context, and safe entertainment use.
- `/guides/hand-photo-guide` — practical photography and privacy guidance for the on-device detector.
- `/about` — factual description of HandFuture as an independent web project; no invented team, dataset, advisors, or publishing operation.
- `/privacy` — actual data flows, local storage, Vercel Analytics, hosting logs, future Google advertising, consent choices, and provider links.
- `/terms` — entertainment scope, acceptable use, age guidance, intellectual property, service availability, and governing law without unsupported promises.

The public batch-analysis route will be removed from navigation and the sitemap. Its random analysis scores make it unsuitable for publication. Existing image-filter/export code may remain private and unused until it is separately redesigned and tested.

The client-side not-found page will remain for in-app unknown paths. Vercel will serve the application shell for valid routes; automated checks will confirm that every sitemap URL returns HTTP 200. Unknown server URLs must not be listed or linked as content.

## Content Standard

Every guide will:

- Answer one clear user question and provide substantial value independent of the upload tool.
- Distinguish historical or traditional claims from scientific evidence.
- Cite accessible primary or authoritative references near the relevant claims.
- Use `HandFuture` as the publisher, with an accurate last-updated date.
- Avoid keyword stuffing, unverifiable superlatives, invented expertise, and claims written to impress AdSense or advertisers.
- Avoid promising health, wealth, relationship, career, or future outcomes.
- Link naturally to one or two related pages rather than repeating the same footer anchors under different labels.

The component titled “Why This Site Provides Real Publisher Content” will be deleted. Its replacement is the set of genuinely useful guide pages above.

## Trust and Social Proof

The sample-feedback system, “verified” badges, hard-coded review counts, 4.8 rating, 2,847-user claim, 98% satisfaction, 95% recommendation rate, and aggregate-rating structured data will be removed from public output.

No testimonials or aggregate ratings will return until they come from a persistent, moderated system with documented collection and verification rules. User-submitted feedback stored only in that visitor’s browser is not public social proof and must not be described as such.

Fake Facebook application IDs, unverified social account handles, and accuracy-focused sharing copy will be removed. Sharing, if retained, will describe the page as an entertainment culture experience and will not include a percentage score.

The broken footer contact link will be removed. `privacy@handfortune.com` may remain in the privacy policy only as a launch prerequisite: before production deployment, the owner must configure Cloudflare Email Routing so that this address has working MX records and forwards to an inbox they control. Unsupported seven-day response promises will be removed.

## AdSense and Consent Integration

- The publisher ID remains `ca-pub-3713047615080346` because it matches the deployed ads.txt record supplied by the owner’s project.
- `ads.txt` will contain exactly `google.com, pub-3713047615080346, DIRECT, f08c47fec0942fa0` followed by a newline.
- The standard asynchronous AdSense ownership/Auto ads script will be included once in the document head.
- The current manually injected banner and blank ad container will be removed for the review build. After approval, Auto ads can place ads only on content-bearing pages; a manual unit may be added later with a verified slot ID and placement review.
- The privacy policy will disclose Google advertising and link to Google’s privacy information.
- Before serving ads to visitors in the EEA, UK, or Switzerland, the owner must enable a Google-certified CMP through AdSense “Privacy & messaging.” This account-side configuration is a release prerequisite, not a custom consent banner implemented in this repository.
- The site will never ask visitors to click ads, label ads as navigation, or place ads next to upload/analyze controls where accidental clicks are likely.

## Routing, Metadata, and Crawlability

`www.handfortune.com` is the single canonical host. The apex host will permanently redirect to `www`. Vercel will serve valid client routes without 404 responses, and Cloudflare will remain DNS-only during this work so that the serving path is unambiguous and Vercel continues to provide the CDN.

Each public route will have a unique title, description, canonical URL, Open Graph URL, and social description. The home page will use `WebApplication` structured data without ratings. Guide pages will use accurate `Article` data containing only visible fields.

The placeholder OG file will be replaced by a real 1200×630 JPEG that accurately represents the site. The sitemap will contain only the eight public routes, use canonical `www` URLs, and carry accurate modification dates. Robots rules will allow Googlebot and `Mediapartners-Google` to crawl public pages, `ads.txt`, and assets without artificial crawl delay.

The initial document head will contain the ownership script and accurate global metadata. Because this remains a Vite SPA, route content will still render client-side in this phase; the HTTP 404 problem and metadata consistency will be fixed now. Static generation or SSR is a future optimization only if post-deployment crawler tests show that Google cannot render the content.

## Privacy and Security

The privacy page will describe only observed behavior:

- Images are loaded into browser memory through `FileReader` and canvas APIs.
- Palm images are not included in Vercel Analytics events.
- Language, theme, disclaimer state, and other preferences stored in local storage will be enumerated.
- Vercel hosts the site and Vercel Analytics collects aggregate web analytics according to Vercel’s service behavior.
- Google advertising scripts and storage become active according to AdSense and consent settings.
- Cloudflare is used for authoritative DNS; it will not be described as an active content proxy while it is DNS-only.

Unused production dependencies and the Devv runtime script will be removed. Direct and transitive dependencies will be upgraded to versions that clear all fixable production audit findings without using force upgrades blindly.

Vercel configuration will add conservative headers compatible with AdSense: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and frame protection. A restrictive Content Security Policy will not be enforced in this phase because an untested policy could block MediaPipe, Vercel Analytics, Google fonts, or AdSense. CSP can be introduced later in report-only mode.

## Component Boundaries

- `site-metadata` owns canonical route metadata and structured-data values.
- `content` owns bilingual guide and policy copy; content must not be mixed into ad components.
- `hand-detector` owns MediaPipe initialization, image detection, typed success/failure results, and cleanup.
- `reflection-engine` converts valid normalized landmarks to deterministic entertainment prompts and contains no DOM or network code.
- `adsense` is limited to the head script and publisher configuration; page components do not dynamically append the script.
- `routing` owns the public route list reused by the router, sitemap/readiness tests, and navigation.

These boundaries allow detector behavior, content integrity, publisher files, and routes to be tested independently.

## Error Handling

- Detector initialization errors produce a visible, localized retry message and do not fabricate a result.
- Unsupported files, oversize files, and unreadable images are rejected before detector work.
- No-hand and multiple-hand results give specific retake guidance.
- Ad script blocking or non-approval never leaves a bordered blank “sponsored” card.
- Route lazy-loading uses an accessible loading state; chunk-load failures provide a reload action.
- Invalid or unknown paths show the not-found view and a clear home link.

## Test and Audit Strategy

Implementation will follow red-green-refactor cycles with Vitest and Testing Library.

Automated coverage will include:

- Exact ads.txt record and newline.
- Public-route uniqueness and sitemap coverage.
- Vercel fallback/redirect/header configuration.
- No known placeholder, fake metric, fake review, `Math.random()` analysis, or Devv runtime strings in production source/output.
- Reflection output is deterministic for the same landmarks and contains no confidence/medical/future claims.
- Detector success, no-hand, and initialization-error UI states.
- Unique route metadata and valid canonical URLs.
- Privacy copy matches configured providers and local-storage keys.
- Navigation links resolve to real public routes.

Final verification will run the full test suite, TypeScript production build, ESLint, production dependency audit, generated-file checks, local HTTP route checks, and a link/sitemap/robots/ads.txt audit. After deployment, the owner or deployment operator must repeat HTTP checks against both hosts and verify Search Console rendering before requesting another AdSense review.

## Release Sequence

1. Add the readiness tests and central route/metadata configuration.
2. Repair publisher files, routing, canonical-host behavior, headers, and the document head.
3. Replace random detection and analysis with real hand detection plus deterministic entertainment reflections.
4. Remove fabricated social proof, unsupported claims, unused public features, and development scripts.
5. Publish the sourced guide, About, Privacy, and Terms content with consistent navigation.
6. Replace the OG placeholder and update sharing metadata.
7. Upgrade dependencies and remove unused packages.
8. Run all local verification and produce a remaining account/DNS/deployment checklist.

## Non-Goals

- Guaranteeing AdSense approval or revenue.
- Buying, generating, or simulating traffic.
- Building a scientific palm-line classifier.
- Publishing bulk AI-generated articles merely to increase page count.
- Re-enabling public ratings without a real backend and moderation process.
- Moving DNS, enabling Cloudflare proxying, deploying production, or changing the AdSense account without separate authorization.
- Adding manual ad placements before site approval.

## Success Criteria

- Every public claim is supported by actual implementation or cited cultural/scientific context.
- Every navigation and sitemap URL is reachable and content-bearing.
- No production UI presents random output as measured AI accuracy.
- No placeholder asset, invented testimonial, fake metric, or unsupported organization claim remains.
- Ownership code, ads.txt, robots, sitemap, canonical host, metadata, and privacy disclosures are internally consistent.
- All automated tests, lint, and production build pass.
- All fixable production dependency vulnerabilities are resolved or explicitly documented with their actual runtime exposure.
- The final handoff clearly separates repository-complete work from the owner’s required Cloudflare Email Routing, AdSense CMP, deployment, Search Console, and review-request actions.
