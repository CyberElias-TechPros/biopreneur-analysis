# Biopreneur Analysis & *In Jesus Name* Publishing Platform

This repository holds two connected bodies of work:
1. **Biopreneur.com.ng Reverse-Engineering & AdSense Audit** — quantitative and structural analysis of 1,143 URLs (1,137 posts + 6 pages) explaining why the site passes AdSense review and how its 7 content templates work.
2. ***In Jesus Name* (`faith-site/`)** — a standalone, AdSense-ready Christian revelation-teaching publication built with **Astro 6** in the **Reverent Editorial** design system (*Swiss Luxury Minimalism × Celestial Atmosphere*).

## Repository Map

| Path | What it is |
|---|---|
| `faith-site/` | **Astro 6 web application** for *In Jesus Name* (118 static pages, Dawn/Ivory + Midnight/Gold themes, self-hosted variable Fraunces + Inter fonts, zero-CLS AdSense slots, RSS, sitemap, JSON-LD) |
| `faith-site/articles/` | Published Markdown teaching articles (`001`–`181`, Months 1–6 complete, Month 7 next — all verified 20/20) |
| `faith-site/glossary.md` | Site Glossary v1 — 36 core doctrinal terms, scripture anchors, and boundaries (`/glossary/`) |
| `faith-site/ledger.md` | Used-title & publication ledger (30 excluded source titles + published article metrics) |
| `faith-site/WIREFRAMES.md` | Low-fi structural wireframes & 12-column Swiss grid / 680px reading-column layouts |
| `faith-site/scripts/audit_articles.py` | Automated 20-gate SEO, length, structure, voice, and originality verifier for source Markdown (`npm run audit`) |
| `faith-site/scripts/seo_audit.py` | Post-build SEO verifier — 29 checks (A–H) run against the rendered `dist/` output (`npm run seo`) |
| `FAITH_TEACHING_PROMPT.md` | *The Revelation Teacher's Desk* — master writing prompt governing *In Jesus Name* |
| `TOPICS_365.md` | 365 teaching topics across 12 monthly arcs |
| `DESIGN_SPEC.md` | *Reverent Editorial* v1.1 UI/UX, typography, color, motion, and performance spec |
| `TODO.md` | Master project roadmap & sprint tracker |
| `PATTERN_ANALYSIS.md` | Biopreneur pattern analysis: 7 templates, house voice, site architecture |
| `ADSENSE_REVIEW.md` | AdSense reviewer audit + 15-factor approval checklist |
| `SUPER_PROMPT.md` | General Biopreneur-class publisher master prompt |
| `site_stats.csv`, `all_urls.txt`, `*-sitemap.xml`, `analyze.ps1` | Retained quantitative datasets & PowerShell parser from the Biopreneur study |

## Running *In Jesus Name* Locally

```bash
cd faith-site
npm install
npm run audit   # Runs the 18-point compliance & SEO verifier across articles/*.md
npm run dev     # Starts dev server on 0.0.0.0:4321
npm run build   # Builds static production output into faith-site/dist/
npm run seo     # Runs the 29-check post-build SEO verifier against dist/
```

To preview the 3 reserved-height zero-CLS AdSense slots (`ca-pub-9124992249317290`) on any article before flipping `PUBLIC_ADSENSE_LIVE=true`, append `?ads=preview` to an article URL.
