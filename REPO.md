# Biopreneur.com.ng — Full Site Analysis, AdSense Audit & Faith-Site Publishing System

Complete reverse-engineering and audit of biopreneur.com.ng (1,143 pages scraped), plus a reusable publishing system for a standalone Christian teaching site.

## Contents

| Path | What it is |
|---|---|
| `SESSION_OUTPUT.txt` | Full session log + all deliverables in one file |
| `PATTERN_ANALYSIS.md` | Complete pattern analysis: 7 content templates, voice law, site architecture, reproduction blueprint |
| `ADSENSE_REVIEW.md` | AdSense reviewer audit — why the site is approved, every angle, 15-factor checklist |
| `SUPER_PROMPT.md` | The Biopreneur-class publisher master writing prompt (12 sections) |
| `FAITH_TEACHING_PROMPT.md` | The Revelation Teacher's Desk — faith teaching-article master prompt (fuses Biopreneur system + revelation-centred teaching profile) |
| `TOPICS_365.md` | 365 fresh teaching topics in 12 monthly arcs (zero duplication of source devotional) |
| `DESIGN_SPEC.md` | The chosen design direction (Reverent Editorial) + all UI/UX specs |
| `TODO.md` | Master todo list for the whole project |
| `faith-site/articles/` | Sample articles produced through the prompt (e.g., `001-you-are-a-new-species-of-being.md`) |
| `site_stats.csv` | Per-page metrics: words, headings, tables, links, images, meta length |
| `all_urls.txt` | Master URL list (post + page sitemaps) |
| `sitemap_*.xml` | Original XML sitemaps (post/page/category/index) |
| `analyze.ps1` | The PowerShell analysis script (rerunnable) |
| `rhapsody_extract.txt` | Text extraction of the November-2026 devotional PDF (topic-engine seed) |

*Note: the raw 1,143-page HTML scrape was removed from the repository (and its git history) after analysis was complete — the findings live in the analysis artifacts above. The scrape remains only as a local working copy, outside version control.*

## Key findings
- 1,138 posts, avg 2,805 words; reviews avg 3,924 words (n=478); 512 posts >3,000 words
- 7 repeatable content templates; single author; Rank Math SEO; Astra theme; AdSense pub `pub-9125084751180062` with valid ads.txt on 100% of pages
- AdSense-approved: depth × template discipline × trust furniture (author, privacy, contact, disclaimers) × technical hygiene

## Usage
Run any task command inside `SUPER_PROMPT.md` or `FAITH_TEACHING_PROMPT.md` (e.g., `WRITE TEACHING`, `CLUSTER PLAN`, `TOPIC ENGINE — [seed PDF]`).
