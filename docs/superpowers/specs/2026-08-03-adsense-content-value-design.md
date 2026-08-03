# HandFuture AdSense Content Value Improvement Design

**Date:** 2026-08-03  
**Status:** Proposed for implementation  
**Public author:** Young LIN  
**Site:** https://www.handfortune.com/

## 1. Problem and evidence

AdSense rejected the site for “low value content.” The public site is technically healthy—localized routes, canonical and hreflang metadata, a working sitemap, real 404 responses, privacy and terms pages, and a valid `ads.txt`—but those items do not create enough visitor value by themselves.

The current editorial surface has only three substantial topical guides. The home page is primarily an uploader, the output is one of a small set of generic reflection prompts, and the About page does not yet identify a human author or show a repeatable editorial method. The 64 localized URLs are translations of eight templates, so the URL count overstates the amount of distinct subject matter.

This matches the AdSense approval material reviewed for this audit: a site should provide original, useful information, clear navigation, enough content to establish its subject, and meaningful input such as specialist knowledge, commentary, reviews, examples, or improvements. Automatically generated or lightly rewritten pages without added value are a risk. Approval can never be guaranteed, but this design directly addresses the stated failure instead of changing unrelated infrastructure.

## 2. Goals

1. Make the primary visitor experience an original, useful learning resource about hand landmarks, palmistry as culture, and critical evaluation of claims.
2. Add interactive educational utility that cannot be replaced by a generic article or a random “fortune” sentence.
3. Make authorship, editorial method, sources, limitations, and update dates visible.
4. Preserve the existing eight-language experience and locale routing without publishing placeholders or thin machine-generated filler.
5. Improve information architecture, internal links, structured data, crawl focus, accessibility, and mobile usability.
6. Keep all processing claims accurate: hand images remain in the browser, MediaPipe detects 21 hand landmarks, and the product does not detect palm creases or predict a future.

## 3. Non-goals

- Claiming medical, psychological, scientific, or palmistry credentials that Young LIN does not have.
- Presenting palmistry as a validated way to diagnose health, personality, compatibility, or future events.
- Manufacturing testimonials, user counts, awards, a team, or publishing history.
- Adding many short articles merely to increase page count.
- Guaranteeing AdSense approval or resubmitting immediately after deployment.
- Changing DNS, Cloudflare proxy mode, email routing, or the working `ads.txt` implementation.

## 4. Approaches considered

### A. Editorial expansion only

Add more long-form guides and sources. This is lower implementation risk, but it leaves the uploader and generic result as the most memorable site feature and provides limited original utility.

### B. Tool expansion only

Build a richer detector visualization and keep the current editorial footprint. This creates differentiation, but AdSense still needs enough explanatory content to understand the site’s subject and value.

### C. Hybrid learning hub and original utility — selected

Create a coherent learning hub, four focused resources, two interactive learning experiences, stronger authorship, and richer existing guides. The tool becomes a transparent educational demonstration rather than the whole proposition. This best addresses both originality and usefulness without pretending to possess credentials.

## 5. Public identity and editorial trust

The site will identify **Young LIN** as **“HandFuture independent developer and content editor”** (localized naturally in each language).

The About page will state:

- Young LIN researches public sources, designs the educational interactions, and maintains the site.
- Young LIN is not a doctor, therapist, scientist, or certified palmistry professional.
- Palmistry is discussed as cultural history and reflective entertainment, not factual prediction.
- Technical descriptions are based on the actual implementation and cited primary or authoritative sources where possible.
- Material changes are recorded in a short update history.

Every editorial guide will display the author, published or updated date, reading context, visible sources, and related reading. Article structured data will use `Person` author `Young LIN` and `Organization` publisher `HandFuture`.

## 6. Information architecture

### 6.1 Indexable route set per locale

The following routes are the intended content corpus in all eight locales:

1. `/` — learning-first home page with the browser-only demo below the editorial introduction
2. `/guides` — learning hub
3. `/how-it-works` — processing, privacy, detector output, and limitations
4. `/guides/palmistry-basics` — expanded existing guide
5. `/guides/science-and-limitations` — expanded existing guide
6. `/guides/hand-photo-guide` — expanded existing guide
7. `/guides/hand-landmark-atlas` — new interactive 21-landmark atlas
8. `/guides/creases-vs-landmarks` — new anatomy and terminology comparison
9. `/guides/barnum-effect-lab` — new interactive critical-thinking exercise
10. `/guides/evaluating-palmistry-claims` — new evidence-checking guide
11. `/about` — author, editorial method, scope, and update history

This produces 88 content URLs across eight locales. `/privacy` and `/terms` remain public, localized, linked in the footer, and canonical, but are excluded from the XML sitemap because they support trust and compliance rather than the site’s editorial value proposition.

### 6.2 Navigation

The main navigation will stay concise: Home, Learn, How it works, About, language, and theme. Individual guides appear in the learning hub, related-reading modules, and breadcrumbs instead of crowding the header. Privacy and Terms remain footer links.

The home page will present:

1. A clear statement of the site’s educational purpose and limits.
2. Featured learning paths and original resources.
3. A short explanation of what MediaPipe landmarks can and cannot show.
4. The optional browser-only hand-photo demonstration.
5. Author and editorial-method context.

## 7. Original content and interactions

### 7.1 Interactive 21-landmark atlas

The atlas will use an original accessible SVG hand diagram and the exact MediaPipe landmark index map (wrist plus four joints/tip points for each finger). Selecting a landmark by diagram, keyboard, or list will reveal:

- index and standard landmark name;
- plain-language anatomical location;
- what the detector returns;
- what cannot be inferred from that point;
- its role in simple geometric observations such as relative finger position.

The diagram will not claim to be an anatomical diagnostic image. A synchronized textual list is required so the information is usable without color or pointer input.

### 7.2 Creases versus landmarks

This guide will visually and textually distinguish:

- skin creases visible in a photograph;
- anatomical regions and joints;
- MediaPipe’s 21 estimated landmark coordinates;
- traditional palmistry labels as cultural terminology.

It will include an original comparison table and diagram, concrete “detected / not detected” examples, and a warning against medical inference from images.

### 7.3 Barnum effect mini-lab

The lab will show two deliberately broad, non-sensitive personality-style statements in a randomized order and ask which feels more personal. After the choice—or an explicit “neither”—it will reveal that both were designed to be widely applicable, explain the Barnum/Forer effect, and provide questions a reader can use to test future claims.

No answer is uploaded, persisted, scored as a personality profile, or used to generate a prediction. The interaction must be usable by keyboard and screen reader and must offer a reset action.

### 7.4 Evaluating palmistry claims

This guide will teach a reusable evidence checklist: specificity, falsifiability, base rates, alternative explanations, source quality, replication, and the difference between reflection and prediction. Each item will have an original neutral example and a safer reframing. It will not ridicule cultural practices or imply that entertainment is scientific evidence.

### 7.5 Existing guide enrichment

The three existing guides will gain original examples, comparison tables or diagrams, clearer source notes, and links into the new learning paths. Expansion is based on subject gaps, not a fixed word-count target. Each page must answer a distinct reader question and avoid repeating long disclaimer or introductory blocks from other pages.

### 7.6 Home-page detector result

After successful local detection, the page will prioritize an educational result:

- confirm one or more hands detected;
- show the 21-point landmark overlay and legend;
- identify that the points are coordinate estimates rather than palm lines;
- link directly to the atlas and limitations guide.

The existing reflection prompt may remain as a clearly secondary entertainment card. It must not be labeled analysis, diagnosis, or prediction, and it must not be the only meaningful output.

Error states will explain unsupported files, unreadable images, no detected hand, model loading failure, and how to retry without losing the site navigation.

## 8. Multilingual content strategy

The supported locales remain `zh-TW`, `zh-CN`, `en`, `ja`, `ko`, `es`, `pt-BR`, and `fr`.

- Every indexable route must have complete, locale-specific copy before release; no English fallback may appear in a localized article body.
- Translations preserve facts, citations, author identity, limitations, and interaction behavior, while adapting headings and examples naturally.
- Repeated boilerplate is kept short. The substantive explanation on each route remains unique to that subject.
- Canonical URLs are self-referencing. Hreflang alternatives include all complete locales plus `x-default`.
- Locale-free URLs continue to redirect to the selected locale; they are not added as duplicate sitemap entries.
- Tests will compare normalized page-body fingerprints and required localized fields to catch accidental English fallback or cross-route duplication.

## 9. SEO, metadata, and crawl focus

- Add route metadata for the hub and four new guides in every locale.
- Use `Article` structured data for guides and `CollectionPage` or equivalent page metadata for the learning hub.
- Include Young LIN as the guide author and HandFuture as publisher without inventing social profiles or credentials.
- Add breadcrumbs and related-reading links to build a crawlable hierarchy.
- Generate raw prerendered HTML for all intended localized content routes so titles, headings, descriptions, author, dates, and core article copy exist before JavaScript runs.
- Update the sitemap to the 88 content URLs and exclude localized Privacy and Terms URLs.
- Keep `robots.txt`, `ads.txt`, apex-to-www behavior, HTTPS, and true localized 404 behavior unchanged unless verification finds a defect.
- The global AdSense site-verification script may remain. Ad units will not be inserted into 404 pages, legal pages, upload/error-only states, or pages lacking substantial editorial content.

## 10. Sources and factual integrity

The implementation will prefer primary and authoritative sources for technical, anatomical, psychological, and policy facts. Likely source categories include MediaPipe documentation or model materials, reputable anatomy references, peer-reviewed or university-hosted psychology references, and Google publisher documentation.

Source links will be visible at the end of each relevant guide. Copy will summarize rather than reproduce source text. Claims that cannot be supported or verified will be removed or explicitly framed as cultural belief. The implementation audit will confirm that displayed behavior matches the code and network flow.

## 11. Accessibility and responsive behavior

- One visible H1 per page and a logical heading hierarchy.
- Keyboard-operable atlas, lab, language control, theme control, uploader, and reset actions.
- Visible focus, sufficient contrast, descriptive labels, and non-color-only selection states.
- SVG content includes a text alternative; decorative marks are hidden from assistive technology.
- Article tables remain readable on small screens through responsive layout or labeled stacked presentation.
- Core content and navigation remain available if the detector model fails or JavaScript interaction is unavailable.

## 12. Verification and acceptance criteria

Implementation is acceptable only when all of the following are true:

1. The four new resources and `/guides` render complete native content in all eight locales.
2. Existing guides, home, how-it-works, and About show substantive improvements and no unverifiable claims.
3. Every guide visibly attributes Young LIN, shows an updated date, sources where factual claims require them, and related reading.
4. The atlas and Barnum lab pass keyboard, reset, and accessible-name tests.
5. The detector result exposes a real 21-point educational overlay and never describes palm creases as detected.
6. Route, catalog, metadata, JSON-LD, canonical, hreflang, sitemap, prerender, 404, publisher-file, and truthfulness tests pass.
7. The full automated suite, lint with no new warnings, production build, and raw HTML checks pass. The existing intermittent whole-suite home lazy-load test must either be stabilized or explicitly documented; it cannot be hidden.
8. A local browser audit checks desktop and mobile layout, navigation, theme, all interaction states, and console/network errors.
9. A deployment audit verifies representative URLs in every locale, all sitemap entries, `ads.txt`, `robots.txt`, apex redirect, localized 404 responses, and core content visible in fetched HTML.
10. No unrelated untracked files from the main worktree are included in the branch or deployment.

## 13. Release and AdSense resubmission

After implementation and review:

1. Deploy the isolated branch to a Vercel preview and audit it.
2. Promote the verified commit to production without changing Cloudflare DNS-only mode.
3. Verify the production sitemap and representative localized pages.
4. Resubmit the sitemap and request indexing for the home page, learning hub, About page, and strongest new guides in Search Console.
5. Allow Google to fetch and begin indexing the new corpus before requesting another AdSense review.
6. In AdSense, use the existing “check for updates” action for `ads.txt` if it still shows stale status; do not rewrite a publicly correct file merely to trigger a crawl.

The final decision remains Google’s. This release is designed to provide evidence of original authorship, substantial subject coverage, useful interaction, trustworthy sourcing, and clear navigation—the areas most directly connected to the rejection reason.
