# MASTER TODO — *Live In Jesus Name* (Faith Teaching Publication)
*Everything planned, in one list. Status: ☐ pending · ◐ in progress · ✔ done · ⏸ blocked/decision needed*
*Publication: **Live In Jesus Name** · Repo: github.com/CyberElias-TechPros/biopreneur-analysis (public) · App root: `faith-site/` (Astro 6) · Design spec: `DESIGN_SPEC.md` · Writing prompt: `FAITH_TEACHING_PROMPT.md` · Topics: `TOPICS_365.md`*

---

## A. FOUNDATION & SYSTEM (the engines)

- ✔ A1. Scrape + analyze biopreneur.com.ng (1,143 URLs / 1,137 posts) — done; analysis artifacts retained (`site_stats.csv`, `all_urls.txt`, sitemaps); raw HTML scrape removed from repo/git history
- ✔ A2. Pattern analysis & reproduction blueprint — `PATTERN_ANALYSIS.md`
- ✔ A3. AdSense reviewer audit — `ADSENSE_REVIEW.md`
- ✔ A4. Biopreneur-class publisher master prompt — `SUPER_PROMPT.md`
- ✔ A5. Faith teaching master prompt (fused: publisher system + revelation-teaching profile + topic engine) — `FAITH_TEACHING_PROMPT.md`
- ✔ A6. 365-topic year slate, 12 monthly arcs, zero source duplication (verified vs all 30 source titles) — `TOPICS_365.md`
- ✔ A7. Flagship article #001 (verified 18/18 audit) — `faith-site/articles/001-you-are-a-new-species-of-being.md`
- ✔ A8. Design direction chosen + full design spec — `DESIGN_SPEC.md`
- ✔ A9. Site glossary v1: 36 core doctrinal terms with definitions, scripture anchors, and boundaries — `faith-site/glossary.md` + `/glossary/`
- ✔ A10. Used-title ledger system: `faith-site/ledger.md` — 30 excluded source titles + all published articles tracked
- ✔ A11. Brand kit: site name locked as **Live In Jesus Name** (renamed from *In Jesus Name*; short name `LIJN`), horizon-cross SVG emblem, wordmark, `/favicon.svg`, and 1200×630 Open Graph social card (`/images/og-default.png`)

## B. DESIGN / UI / UX (per DESIGN_SPEC.md)

- ✔ B1. Wireframes: Home, Teachings index, Article, Category, About, Doctrinal Basis, Contact & Privacy — `faith-site/WIREFRAMES.md`
- ✔ B2. Full implementation in **Reverent Editorial — Swiss luxury minimalism + celestial atmosphere** (Dawn/Ivory light mode + Midnight/Gold dark mode)
- ✔ B3. Typography system: self-hosted variable `Fraunces` + `Inter` `.woff2` preloaded, fluid clamp scale, 680px reading measure, text-size comfort control (`0.92×`–`1.24×`)
- ✔ B4. Color system tokens: ivory/ink/gold light mode (`#7A5C1B` text gold 5.82:1 AA; `#B08D3E` hairline) + midnight/gold dark mode (`#D4AF6A` 9.14:1 AAA); zero `#000000`
- ✔ B5. All 10 core components built in `faith-site/src/components/`: `ThemeScripture`, `Reaffirmation`, `DeclarationCard`, `FurtherStudy`, `RelatedTeachings`, `CategoryChip`, `AuthorBox`, `ReadingProgress`, `CategoryStrips`, `LightLine`
- ✔ B6. Motion spec: scroll-reveal (`opacity 0→1`, `translateY 12px→0`, `600ms`), Declaration "Pace Aloud" speech/pulse affordance, `prefers-reduced-motion` honored
- ✔ B7. Flagship 680px single-column Article template (`faith-site/src/pages/[slug].astro`)
- ✔ B8. Home page build (`faith-site/src/pages/index.astro`): 70vh full-bleed Dawn Hero (AVIF/WebP preloaded), editorial promise, 4 numbered category strips, Week One featured teachings, 12-month arc overview, teacher box
- ✔ B9. Light / Night theme toggle in header with `prefers-color-scheme` default, zero-FOUC bootstrap, and `localStorage` persistence
- ✔ B10. Accessibility pass: skip-to-content link, semantic landmarks, strict heading hierarchy, `2px` gold `:focus-visible` outlines, WCAG AA verified
- ✔ B11. Performance budget verified, now against the built site and gzipped: **9.3 KB JS + 12.1 KB CSS per article (21.4 KB total)** against the ≤40 KB / ≤50 KB budgets, enforced by a test that fails the build on regression (P8). AVIF/WebP responsive images
- ✔ B12. AdSense slot styling (`AdSlot.astro`): 3 reserved-height (`min-height: 250px`, `contain: layout`) slots with hairline top rule + `ADVERTISEMENT` label; previewable via `?ads=preview`

## C. SITE BUILD & INFRASTRUCTURE

- ✔ C1. Stack implemented: **Astro 6** static site in `faith-site/` (118 static pages built in ~7s)
- ✔ C2. Domain decided: canonical origin is `https://lij.name.ng` (set as `PUBLIC_SITE_URL` in Vercel for production + preview). The earlier `injesusname.org` placeholder was a parked domain — replaced everywhere. The editorial desk is now the WhatsApp line `+234 708 913 8631` (`https://wa.me/2347089138631`); no public mailbox is published, so there is no mailbox to provision.
- ✔ C3. All static pages built: Home · Teachings index (with search/filter) · About · Contact (WhatsApp compose-and-send, no server-side form) · Community (WhatsApp channel + readers' group) · Privacy Policy (1,567 words: cookies/AdSense/DoubleClick/GDPR/CCPA/NDPA/COPPA) · Doctrinal Basis · Glossary · 365-Day Slate · 12 Category archives
- ✔ C4. SEO plumbing: `sitemap-index.xml`, `robots.txt`, `ads.txt`, canonicals, Open Graph/Twitter cards, `rss.xml`
- ✔ C5. JSON-LD Schema: `BlogPosting` + `Person` + `BreadcrumbList` on every article; `WebSite` + `Organization` site-wide
- ◐ C6. Analytics: Search Console live (first query report received 2026-11-18 and acted on — see D17); GA4 or privacy-first alternative + Bing Webmaster still pending
- ☐ C7. Comments: lightweight (giscus or none — zero-comment is fine per analysis)
- ◐ C8. Backup/deploy pipeline: `faith-site/` is the Vercel root directory and `vercel.json` carries the headers/redirects. What remains is the *first* deploy, which needs the Vercel account connected — the build itself is now verified end-to-end by CI (P1) before any deploy.

## D. CONTENT PRODUCTION (365-slate execution)

- ✔ D1. Month 1 (Jan arc — New-Creation Foundations): **COMPLETE — 31 articles live (~30,000 words of teaching prose), 31/31 passing 18/18 audit**
- ✔ D2. Month 2 (Feb — Holy Spirit): **COMPLETE — 28 articles live (Days 032–059)**, all passing 18/18 audit
- ✔ D3. Month 3 (Mar — Faith): **Complete — Days 060–090 live (31/31)**. Month 4 (Authority of the Believer) is next
- ✔ D4. Month 4 (Apr — Authority): **Complete — Days 091–120 live (30/30)**, all passing 20/20 audit
- ✔ D5. Month 5 (May — The Word): **Complete — Days 121–151 live (31/31)**, all passing 20/20 audit
- ✔ D6. Month 6 (Jun — Prayer): **Complete — Days 152–181 live (30/30)**, all passing 20/20 audit
- ☐ D7. Month 7 (Jul — Divine Health): 31 (apply faith-and-wisdom line + medical disclaimer discipline)
- ☐ D8. Month 8 (Aug — Prosperity & Stewardship): 31
- ☐ D9. Month 9 (Sep — Righteousness Consciousness): 30
- ☐ D10. Month 10 (Oct — Unseen Realm): 31 (no demonizing people; victory-framing)
- ☐ D11. Month 11 (Nov — Glory Life): 30
- ☐ D12. Month 12 (Dec — Incarnation & Return): 31
- ✔ D17. **Search-intent pass (2026-11-18):** first Search Console report = 124 queries / 47 clusters / 182 impressions / 0 clicks. All 47 clusters mapped to existing teachings; added the search-intent answer block to 47 articles and wrote 6 new search-led teachings (Days 366–371) for the genuine gaps. Mapping + per-cluster log in `SEARCH_INTENT_MAP.md`; audit extended with three new gates (future `pubDate`, malformed answer block, unresolved `answerLinkSlug`).
- ✔ D18. **Publication dates corrected (2026-11-18):** 348 of 365 articles carried a future `pubDate`, pushing sitemap `lastmod` a year ahead and RSS/home freshness to a not-yet-published teaching. Whole slate shifted back 354 days (Day 001 → 2025-11-13, Day 365 → 2026-11-12), cadence and order intact; `audit_articles.py` now fails any future-dated article.
- ✔ D13. Self-audit + SEO pack + ledger update workflow active (`faith-site/scripts/audit_articles.py` + `faith-site/ledger.md`)
- ✔ D14b. **Rows 14 and 5 now measured, not asserted.** Every article carries the faith-and-wisdom line (§12 row 14) and at least two explicit contrast pairs (§2 Law 4); `audit_articles.py` fails on either if absent. Nine articles whose numbered applications were collapsing into one paragraph in the rendered HTML are fixed and verified in `dist/`.
- ✔ D14a. **Prose floor verified on the correct measure.** All 120 articles ≥900 words of *teaching prose* (min 902, median 998, max 1,139) with the closing reaffirmation/declaration block excluded from the count; Standard's 0–3 H2 limit and the required "What This Means for You" section enforced by `audit_articles.py`.
- ✔ D14. Internal-link discipline: all 120 articles interlinked with 0 broken links across all 141 built pages (0 dangling related-teaching slugs, 0 invalid categories or glossary terms)
- ✔ D15. Launch minimum: **97 live articles** (floor 50 cleared with buffer)
- ☐ D16. Extend beyond year 1: re-run `TOPIC ENGINE` with ledger + new seed themes

## E. SEO, ADSENSE & COMPLIANCE

- ✔ E1. Automated batch QA verifier (`npm run audit` / `python3 faith-site/scripts/audit_articles.py`) verifying SEO title ≤60c, meta 140–158c, declaration 40–80w, word floor, questions, and originality
- ◐ E2. AdSense wiring (`ca-pub-9124992249317290`): `/ads.txt` live at root; `AdSenseHead.astro` and 3 zero-CLS `AdSlot.astro` units wired and gated behind `PUBLIC_ADSENSE_LIVE=true` for activation when ready to submit for review
- ☐ E3. Pre-application audit vs the 15-factor checklist in `ADSENSE_REVIEW.md` once 50+ articles are live
- ✔ E4. Unreliable-claims shield active across Days 001–097 + Doctrinal Basis Article VIII
- ✔ E5. Copyright sweep: 0 non-scripture 8-gram overlaps on Days 002–008 against seed extract
- ☐ E6. Annual refresh cycle: re-date "Updated" stamps, re-verify scriptures each January
- ✔ E7. Author presence: resident Bible teacher profile (`Ellis Graham`), `AuthorBox` + Doctrinal Basis link on every teaching page

## F. REPO & HOUSEKEEPING

- ✔ F1. GitHub repo created — `CyberElias-TechPros/biopreneur-analysis`
- ✔ F2. Scrape removed from repo + git history; `.gitignore` updated for Astro (`faith-site/node_modules/`, `faith-site/dist/`, `faith-site/.astro/`)
- ☐ F3. Keep repo synced: commit after every content/design batch
- ✔ F4. README (`REPO.md`) updated for **Live In Jesus Name** Astro build
- ✔ F5. Visibility note: repo is **public** (note: consider removing `rhapsody_extract.txt` + scratch files from public tracking if keeping repo public)

## NEXT SPRINT (immediate next actions)
1. **D7 (Month 7):** Begin Month 7 Days `182`–`212` (*Divine Health and Wholeness*)
2. **D1 review:** Month 1 arc complete (31/31 live); spot-check internal handoffs and category spread before AdSense submission
3. **C2 / C8:** Deploy `faith-site/` to Vercel and attach custom domain when chosen
4. **E2 / E3:** Enable `PUBLIC_ADSENSE_LIVE=true` and run the 15-factor pre-application audit (50-article floor now met)

### Listening Room & reader resilience (shipped)

- ✔ L1. On-device narration on every teaching: four voices, six speeds, remembered per reader (`ListenRoom.astro`, `listen-room.ts`).
- ✔ L2. Reading languages (count derived from `languages.ts`, never typed into prose); on-device translation where the browser supports it, honest link-out where it does not. `/listen/` states the split (7 on-device / 6 external) from the data.
- ✔ L12. **Natural-voice ranking (2026-11-18).** Voice selection now prefers the most natural voice the device already has — Microsoft neural "Online (Natural)", Apple Siri/Enhanced/Premium, Google cloud — instead of preferring any installed voice. The old score gave `localService` +100 and the preset match +10, so a robotic offline voice beat a neural online one. Natural names score +90, legacy/novelty voices (eSpeak, Fred, Zarvox, Albert, Compact) −120, and offline capability is now only a +8 tie-breaker. Still zero cost and zero audio bytes: every voice ships with the reader's OS or browser. The note under the picker names the chosen voice, says whether it needs a connection, and offers the upgrade when a better online voice exists. 5 new regression tests (novelty rejection, no language crossing, upgrade detection, no hardcoded counts).
- ✔ L3. `/listen/` hub page listing languages, steps, and the first seven days ready to hear.
- ✔ L4. Consent-gated AdSense — advertising loads only after "Allow ads"; both choices weighted equally; footer "Cookie settings" re-opens the choice (`consent.ts`).
- ✔ L5. Offline reading via service worker + `/offline.html`; cache headers in `vercel.json`.
- ✔ L6. Installable: web manifest, maskable icons, app shortcuts.
- ✔ L7. `/accessibility/` statement with stated limits and a report route.
- ✔ L8. Print stylesheet so a teaching can be printed for a house group or prison ministry.
- ✔ L9. Shareable filtered search (`?q=`, `?cat=`) with a live result count.
- ✔ L10. Speakable + AudioObject schema on every article.
- ✔ L11. Days 224–365 article files committed (they were untracked and would have been missing from a clean build).

### Search & AI readiness (shipped)

- ✔ S1. `llms.txt` — curated machine index for language models, with citation format and licence.
- ✔ S2. `llms-full.txt` — the entire 365-article corpus as one plain-text document (2.7 MB).
- ✔ S3. `/api/articles.json` — all 365 articles as structured JSON with schema version.
- ✔ S4. `robots.txt` names 18 AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended, Meta-ExternalAgent and others) and allows each.
- ✔ S5. One unified `@graph` per page (article, breadcrumb, Organization, WebSite, Person, DefinedTermSet), all linked by `@id`.
- ✔ S6. AI policy meta + `Link: rel="llms"` response header.
- ✔ S7. Regional `hreflang` for NG, GH, KE, ZA, GB, US, CA, AU on a single English edition, plus `x-default`.
- ✔ S8. `*.vercel.app` → 301 to the canonical host, so no duplicate-host content.
- ✔ S9. `X-Robots-Tag`, `browsing-topics` opt-out, and cache headers for machine endpoints.
- ✔ S10. Audit extended to 34 checks including four AI-readiness gates (H4–H7).
- ✔ S11. `SEARCH_READINESS.md` — the full checklist, including what is deliberately not claimed.

### Production readiness (shipped 2026-11-18)

- ✔ P1. **Continuous integration** — `.github/workflows/ci.yml` (the repo's first CI): Node 22 + Python 3.12, `npm ci`, typecheck → article audit → listening tests → build → SEO checks → site tests, with `dist/` uploaded on failure so a red build is diagnosable. Every gate below now runs on every push, not on trust.
- ✔ P2. **Site-wide search** — `SiteSearch.astro` + `search.ts` + `/api/search-index.json` (176 KB, all 371 teachings). Native `<dialog>`, so focus trapping and Esc come from the browser rather than from imitation. Cmd/Ctrl-K, `/`, arrows, Enter, `aria-activedescendant`. Ranking is phrase-first (title phrase +100, reference +80, then word hits, day as tie-break) and typo-tolerant: `leg two agree` finds *The Prayer of Agreement*. The index is fetched on first keystroke, never on page load.
- ✔ P3. **`/api/health.json`** — deploy verification: article count, category count, day range, and six invariants (`uniqueSlugs`, `allDated`, `uniqueDays`, `canonicalOrigin`, `hasContent`, `descriptionsInRange`). A deploy that silently loses articles now says so.
- ✔ P4. **404 rebuilt** — search trigger, the four newest teachings, and links to the library and slate. Heading order corrected to `h1` → `h2`.
- ✔ P5. **Offline retry** — `/offline.html` gained a "Try again" button, shown only when `navigator.onLine` is true. Still zero external references, so it works with no network.
- ✔ P6. **Service worker** — `lijn-v5-search`; `/api/search-index.json` uses stale-while-revalidate so search stays instant offline. `/api/health.json` is never cached.
- ✔ P7. **Site regression tests** — `scripts/test-site.mjs`, 6 tests against built `dist/`: index coverage, the dialog on every page, ranked results for real queries, health invariants, 404 recovery, and a per-page weight budget.
- ✔ P8. **Weight budget, measured honestly** — the earlier "58 KB CSS" reading was uncompressed. What a reader actually downloads per article is **9.3 KB gzipped JS + 12.1 KB gzipped CSS = 21.4 KB**, well inside the ≤40 KB / ≤50 KB spec. Astro emits one merged CSS bundle, so splitting `showcase.css` by import would not have changed the number; that refactor was reverted rather than kept as dead complexity. The new budget test fails the build above 40 KB JS, 25 KB CSS, or 45 KB total per page.
- ✔ P9. **Listen is one click** — the article-level button now opens *and* plays, then pauses, then resumes, and its label and `aria-pressed` track the state (`Pause this teaching` / `Resume this teaching`). Still no autoplay: playback only ever starts inside a click.
- ✔ P10. **`npm run verify`** — one command that runs every gate in the right order (typecheck → audit → listening → build → SEO → site). `npm test` runs the fast suites.
