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
- ✔ B11. Performance budget verified: `16.5 KB` total CSS (`≤50 KB` budget), `6.6 KB` inline JS + `0 KB` external JS (`≤40 KB` budget), AVIF/WebP responsive images
- ✔ B12. AdSense slot styling (`AdSlot.astro`): 3 reserved-height (`min-height: 250px`, `contain: layout`) slots with hairline top rule + `ADVERTISEMENT` label; previewable via `?ads=preview`

## C. SITE BUILD & INFRASTRUCTURE

- ✔ C1. Stack implemented: **Astro 6** static site in `faith-site/` (118 static pages built in ~7s)
- ✔ C2. Domain decided: canonical origin is `https://lij.name.ng` (set as `PUBLIC_SITE_URL` in Vercel for production + preview). The earlier `injesusname.org` placeholder was a parked domain — replaced everywhere. The editorial desk is now the WhatsApp line `+234 708 913 8631` (`https://wa.me/2347089138631`); no public mailbox is published, so there is no mailbox to provision.
- ✔ C3. All static pages built: Home · Teachings index (with search/filter) · About · Contact (WhatsApp compose-and-send, no server-side form) · Community (WhatsApp channel + readers' group) · Privacy Policy (1,567 words: cookies/AdSense/DoubleClick/GDPR/CCPA/NDPA/COPPA) · Doctrinal Basis · Glossary · 365-Day Slate · 12 Category archives
- ✔ C4. SEO plumbing: `sitemap-index.xml`, `robots.txt`, `ads.txt`, canonicals, Open Graph/Twitter cards, `rss.xml`
- ✔ C5. JSON-LD Schema: `BlogPosting` + `Person` + `BreadcrumbList` on every article; `WebSite` + `Organization` site-wide
- ☐ C6. Analytics: GA4 or privacy-first alternative; Search Console + Bing Webmaster once custom domain is live
- ☐ C7. Comments: lightweight (giscus or none — zero-comment is fine per analysis)
- ☐ C8. Backup/deploy pipeline: connect `faith-site/` root directory to Vercel for automatic deploys

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
- ✔ L2. Thirteen reading languages; on-device translation where the browser supports it, honest link-out where it does not (`languages.ts`, `/listen/`).
- ✔ L3. `/listen/` hub page listing languages, steps, and the first seven days ready to hear.
- ✔ L4. Consent-gated AdSense — advertising loads only after "Allow ads"; both choices weighted equally; footer "Cookie settings" re-opens the choice (`consent.ts`).
- ✔ L5. Offline reading via service worker + `/offline.html`; cache headers in `vercel.json`.
- ✔ L6. Installable: web manifest, maskable icons, app shortcuts.
- ✔ L7. `/accessibility/` statement with stated limits and a report route.
- ✔ L8. Print stylesheet so a teaching can be printed for a house group or prison ministry.
- ✔ L9. Shareable filtered search (`?q=`, `?cat=`) with a live result count.
- ✔ L10. Speakable + AudioObject schema on every article.
- ✔ L11. Days 224–365 article files committed (they were untracked and would have been missing from a clean build).
