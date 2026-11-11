# MASTER TODO — Faith Teaching Site Project
*Everything planned, in one list. Status: ☐ pending · ◐ in progress · ✔ done · ⏸ blocked/decision needed*
*Project root: D:\biopreneur · Repo: github.com/CyberElias-TechPros/biopreneur-analysis (private) · Design spec: DESIGN_SPEC.md · Writing prompt: FAITH_TEACHING_PROMPT.md · Topics: TOPICS_365.md*

---

## A. FOUNDATION & SYSTEM (the engines)

- ✔ A1. Scrape + analyze biopreneur.com.ng (1,143 pages) — done; analysis artifacts retained (`site_stats.csv`, `all_urls.txt`, sitemaps); raw HTML scrape removed from repo/git history, kept only as local working copy
- ✔ A2. Pattern analysis & reproduction blueprint — `PATTERN_ANALYSIS.md`
- ✔ A3. AdSense reviewer audit — `ADSENSE_REVIEW.md`
- ✔ A4. Biopreneur-class publisher master prompt — `SUPER_PROMPT.md`
- ✔ A5. Faith teaching master prompt (fused: publisher system + revelation-teaching profile + topic engine) — `FAITH_TEACHING_PROMPT.md`
- ✔ A6. 365-topic year slate, 12 monthly arcs, zero source duplication — `TOPICS_365.md`
- ✔ A7. Test-drive article #001 (18/18 audit) — `faith-site/articles/001-you-are-a-new-species-of-being.md`
- ✔ A8. Design direction chosen + full design spec — `DESIGN_SPEC.md`
- ☐ A9. Site glossary v1: define the core terminology bank (30–40 terms, usage rules) — feeds Terminity Law
- ☐ A10. Used-title ledger system: `faith-site/ledger.md` — all published titles + source-exclusion list, updated on every publish
- ☐ A11. Brand kit: site name decision ⏸ (needs owner decision), logo, wordmark, favicon, social cards

## B. DESIGN / UI / UX (per DESIGN_SPEC.md)

- ☐ B1. Wireframes: Home, Teachings index, Article, Category, About, Doctrinal Basis, Contact (low-fi)
- ☐ B2. High-fi mockups in the chosen direction: **Reverent Editorial — Swiss luxury minimalism + celestial atmosphere** (light mode + midnight-gold dark mode)
- ☐ B3. Typography system implementation: Fraunces (or Cormorant Garamond) display + Inter body; scale, rhythm, scripture-block styling
- ☐ B4. Color system tokens: ivory/ink/gold light mode + midnight/gold dark mode; WCAG AA verified
- ☐ B5. Core components: Theme-Scripture block, Reaffirmation pull-line, Declaration card, Further-Study list, Related-Teaching cards, author box, category chips
- ☐ B6. Motion spec build: scripture reveal-on-scroll (opacity/translate 12px), declaration "speak-aloud" affordance, page transitions ≤300ms, prefers-reduced-motion honored
- ☐ B7. Article template HTML/CSS build (static first: Eleventy/Astro or plain) — the reading column is the flagship
- ☐ B8. Home page build: full-bleed dawn hero + mission line, 4 category strips, featured teachings, author card
- ☐ B9. Dark mode + light mode toggle with system default
- ☐ B10. Accessibility pass: keyboard nav, contrast audit, focus states, alt-text rules, reduced-motion
- ☐ B11. Performance budget: LCP <1.8s, CLS <0.05, <90KB CSS+JS unminified budget; image pipeline (webp/avif)
- ☐ B12. Design QA against AdSense: ad slot styling (Section 7 of spec), no layout-shift ad containers

## C. SITE BUILD & INFRASTRUCTURE

- ☐ C1. Stack decision ⏸: static generator (Astro recommended — performance + AdSense-safe) vs WordPress (Astra familiarity). Default: Astro.
- ☐ C2. Domain decision ⏸ (needs owner input) + HTTPS, hosting (Cloudflare Pages/Vercel)
- ☐ C3. Build all static pages: Home · Teachings index · About · Contact (working form) · Privacy Policy ≥1,500 words (cookies/advertising/GDPR/CCPA/remarketing/children sections) · Doctrinal Basis · 12 category archives with descriptions
- ☐ C4. SEO plumbing: sitemap, robots.txt, canonical, Open Graph/Twitter cards, RSS/JSON feed
- ☐ C5. Schema: Article/BlogPosting + Person + BreadcrumbList + WebSite site-wide; FAQPage where used
- ☐ C6. Analytics: GA4 or privacy-first alternative; Search Console + Bing webmaster
- ☐ C7. Comments: lightweight (giscus or none — zero-comment is fine per analysis)
- ☐ C8. Backup/deploy pipeline: GitHub → auto-deploy; weekly tag

## D. CONTENT PRODUCTION (365-slate execution)

- ☐ D1. Month 1 (Jan arc — New-Creation Foundations): write days 1–31 (article 001 done → days 002–031 pending)
- ☐ D2. Month 2 (Feb — Holy Spirit): 28 articles
- ☐ D3. Month 3 (Mar — Faith): 31
- ☐ D4. Month 4 (Apr — Authority): 30
- ☐ D5. Month 5 (May — The Word): 31
- ☐ D6. Month 6 (Jun — Prayer): 30
- ☐ D7. Month 7 (Jul — Divine Health): 31 (apply faith-and-wisdom line + medical disclaimer discipline)
- ☐ D8. Month 8 (Aug — Prosperity & Stewardship): 31
- ☐ D9. Month 9 (Sep — Righteousness Consciousness): 30
- ☐ D10. Month 10 (Oct — Unseen Realm): 31 (no demonizing people; victory-framing)
- ☐ D11. Month 11 (Nov — Glory Life): 30
- ☐ D12. Month 12 (Dec — Incarnation & Return): 31
- ☐ D13. Every article: 18/18 self-audit table + SEO pack + ledger update before publish
- ☐ D14. Internal-link discipline: every article linked by 1 sibling + 2 cluster siblings within 7 days
- ☐ D15. Launch minimum: 50+ articles live before AdSense application (per 15-factor checklist)
- ☐ D16. Extend beyond year 1: re-run `TOPIC ENGINE` with ledger + new seed PDFs

## E. SEO, ADSENSE & COMPLIANCE

- ☐ E1. Verify every article ships meta description 140–158 chars + ≤60-char SEO title (batch QA script)
- ☐ E2. AdSense wiring with owner pub-ID **`ca-pub-9124992249317290`** (canonical snippet in `faith-site/adsense.html`): head script on all pages, ads.txt at root, 3 content-embedded slots only — deployed after account approval
- ☐ E3. Pre-application audit vs the 15-factor checklist in ADSENSE_REVIEW.md (author/privacy/contact/nav/depth)
- ☐ E4. Unreliable-claims sweep: no outcome guarantees anywhere; faith-and-wisdom lines present where practical life touched
- ☐ E5. Copyright sweep: zero source-devotional phrasing (spot-check 10% of corpus each month)
- ☐ E6. Annual refresh cycle: re-date "Updated" stamps, re-verify scriptures each January
- ☐ E7. Author presence: teacher bio page, photo, doctrinal-statement link on every page

## F. REPO & HOUSEKEEPING

- ✔ F1. GitHub repo created + full push — CyberElias-TechPros/biopreneur-analysis
- ✔ F2. Scrape removed from repo + git history (filter-repo, force-pushed) — copyright risk eliminated; `.gitignore` keeps it local-only. Remaining scratch files (curl_config.txt, curl_test.txt, allofit.txt) still to tidy.
- ☐ F3. Keep repo synced: commit after every content/design batch
- ☐ F4. README update as project evolves
- ☐ F5. ✔ Visibility decision: repo is **public** (scrape purged from repo + history first, so no third-party content is exposed)

## CURRENT SPRINT (next actions, in order)
1. B1 wireframes → B3/B4 tokens → B7 article template build (design comes first; content shell next)
2. A9 glossary + A10 ledger (both feed every article)
3. D1: write slate days 002–008 (week one of Month 1)
4. C3 static pages after template build
