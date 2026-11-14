# Biopreneur Analysis & *Live In Jesus Name* Publishing Platform

This repository holds two connected bodies of work:
1. **Biopreneur.com.ng Reverse-Engineering & AdSense Audit** — quantitative and structural analysis of 1,143 URLs (1,137 posts + 6 pages) explaining why the site passes AdSense review and how its 7 content templates work.
2. ***Live In Jesus Name* (`faith-site/`)** — a standalone, AdSense-ready Christian revelation-teaching publication built with **Astro 6**. Redesigned (v2) to a cinematic showpiece standard — **Cinematic Immersive Luxury × Editorial × Futuristic Spatial** — powered by **GSAP + Lenis + React Bits** (see `DESIGN_DIRECTION.md`). Article pages keep the calm **Reverent Editorial** reading register; the home and marketing surfaces are the motion showroom.

## Repository Map

| Path | What it is |
|---|---|
| `faith-site/` | **Astro 6 web application** for *Live In Jesus Name* (389 static pages, dark-first Midnight/Gold + Dawn/Ivory themes, self-hosted variable Fraunces + Inter fonts, zero-CLS AdSense slots, RSS, sitemap, JSON-LD). v2 motion showroom: GSAP ScrollTrigger + Lenis smooth scroll + lazy React Bits islands (Aurora, SplitText, ScrollVelocity, SpotlightCard, Magnet, CountUp, StarBorder, ShinyText) |
| `faith-site/src/scripts/experience.ts` | GSAP × Lenis controller for the showroom (hero timeline, reveals, pinned 12-month rail, parallax, cursor glow, magnets) — loaded only on `experience` pages |
| `faith-site/src/components/reactbits/` | Vendored React Bits components (MIT + Commons Clause) + provenance README |
| `faith-site/src/styles/showcase.css` | The v2 cinematic design layer over the Reverent Editorial base |
| `faith-site/articles/` | Published Markdown teaching articles (`001`–`365`, full 12-month curriculum — all verified 20/20) |
| `faith-site/src/scripts/listen-room.ts` | Listening Room controller — Web Speech narration, voice/speed presets, on-device translation, playback state machine (`npm run test:listening`) |
| `faith-site/scripts/test-listening.mjs` | Listening Room regression suite — 10 tests over the real controller with a mocked speech engine |
| `faith-site/glossary.md` | Site Glossary v1 — 36 core doctrinal terms, scripture anchors, and boundaries (`/glossary/`) |
| `faith-site/ledger.md` | Used-title & publication ledger (30 excluded source titles + published article metrics) |
| `faith-site/WIREFRAMES.md` | Low-fi structural wireframes & 12-column Swiss grid / 680px reading-column layouts |
| `faith-site/scripts/audit_articles.py` | Automated 20-gate SEO, length, structure, voice, and originality verifier for source Markdown (`npm run audit`) |
| `faith-site/scripts/seo_audit.py` | Post-build SEO verifier — 34 checks (A–H) run against the rendered `dist/` output (`npm run seo`) |
| `FAITH_TEACHING_PROMPT.md` | *The Revelation Teacher's Desk* — master writing prompt governing *Live In Jesus Name* |
| `TOPICS_365.md` | 365 teaching topics across 12 monthly arcs |
| `DESIGN_SPEC.md` | *Reverent Editorial* v1.1 UI/UX, typography, color, motion, and performance spec |
| `TODO.md` | Master project roadmap & sprint tracker |
| `PATTERN_ANALYSIS.md` | Biopreneur pattern analysis: 7 templates, house voice, site architecture |
| `ADSENSE_REVIEW.md` | AdSense reviewer audit + 15-factor approval checklist |
| `SUPER_PROMPT.md` | General Biopreneur-class publisher master prompt |
| `site_stats.csv`, `all_urls.txt`, `*-sitemap.xml`, `analyze.ps1` | Retained quantitative datasets & PowerShell parser from the Biopreneur study |

## Running *Live In Jesus Name* Locally

```bash
cd faith-site
npm install
npm run audit            # Runs the 20-gate compliance & SEO verifier across articles/*.md
npm run dev              # Starts dev server on 0.0.0.0:4321
npm run build            # Builds static production output into faith-site/dist/
npm run seo              # Runs the 34-check post-build SEO verifier against dist/
npm run typecheck        # Astro/TypeScript diagnostics
npm run test:listening   # Listening Room regression suite (mocked Web Speech engine)
```

To preview the 3 reserved-height zero-CLS AdSense slots (`ca-pub-9124992249317290`) on any article before flipping `PUBLIC_ADSENSE_LIVE=true`, append `?ads=preview` to an article URL.
