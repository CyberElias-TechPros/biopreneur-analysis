# Search & AI Readiness Checklist

Status of every signal a search engine or answer engine can read from this site,
plus what is **not** possible to guarantee and why. Enforced by
`faith-site/scripts/seo_audit.py` — **34 automated checks, all passing**, run on
every build.

A note on honesty before the tables: no site "meets the full checklist of every
search engine in the world" in the sense of guaranteed ranking, because ranking
is a competition, not a compliance test. What *is* achievable — and what is now
enforced — is that **nothing on this site is invisible, ambiguous, or blocked**
to a crawler, and that every claim about the content is machine-verifiable.

---

## 1. Universal signals (every crawler reads these)

| # | Signal | Status | Where enforced |
|---|---|---|---|
| 1 | Unique `<title>` 10–60 chars | ✅ 389/389 | A1, A5 |
| 2 | Unique meta description 120–160 chars | ✅ 389/389 | A2, A3 |
| 3 | Absolute canonical on every indexable page | ✅ | A3, E2 |
| 4 | `robots` meta: index, follow, max-image-preview:large, max-snippet:-1 | ✅ | A4 |
| 5 | `robots.txt` allows crawl, points to sitemap | ✅ | E4 |
| 6 | XML sitemap with `lastmod`, `changefreq`, `priority` | ✅ 388 URLs | E1, E5, E6 |
| 7 | Sitemap index for engines that expect one | ✅ | `@astrojs/sitemap` |
| 8 | Sitemap covers every canonical; no orphans | ✅ | E2, E3 |
| 9 | Clean, descriptive URLs with trailing slash | ✅ | config |
| 10 | One `<h1>` per page, no heading-level skips | ✅ | D1 |
| 11 | Open Graph + Twitter card complete on every page | ✅ | B1, B2, B3 |
| 12 | OG image is a real 1200×630 PNG | ✅ | H2 |
| 13 | Every `<img>` has `alt` and explicit dimensions | ✅ 734 images | H1 |
| 14 | LCP image eager + `fetchpriority=high`; others lazy | ✅ | H3 |
| 15 | Mobile viewport + responsive layout at 320px | ✅ | A3 |
| 16 | HTTPS + HSTS preload + no mixed content | ✅ | `vercel.json` |
| 17 | Structured data parses, no errors | ✅ | C1 |
| 18 | `BlogPosting` with all 12 Article fields | ✅ 365/365 | C3 |
| 19 | `BreadcrumbList` on every non-home page | ✅ | C4 |
| 20 | `WebSite` + `SearchAction` (sitelinks searchbox) | ✅ | C2 |
| 21 | `Organization` with logo, founder, contact, policies | ✅ | C2 |
| 22 | RSS feed, well-formed, full content | ✅ 365 items | G1, G3 |
| 23 | `404` returns a real page, marked noindex | ✅ | E7 |
| 24 | No accidental `noindex` anywhere | ✅ | E8 |
| 25 | 0 broken internal links | ✅ 19,287 hrefs | F1 |
| 26 | Every article reachable from the library | ✅ | F2 |

## 2. International / regional signals

| # | Signal | Status | Note |
|---|---|---|---|
| 27 | `hreflang="en"` + `x-default` | ✅ | Every page |
| 28 | Regional alternates for target markets | ✅ | `en-NG, en-GH, en-KE, en-ZA, en-GB, en-US, en-CA, en-AU` — same URL, correct signal for one English edition |
| 29 | `og:locale` + `og:locale:alternate` | ✅ | `en_US`, plus `en_NG`, `en_GB` |
| 30 | `<html lang="en">` | ✅ | |
| 31 | No duplicate content across hosts | ✅ | `*.vercel.app` → 301 to `lij.name.ng` |

**Why one URL rather than `/fr/`, `/sw/`…:** translating 365 long articles with
machine translation and publishing them as indexed pages would create 4,745
low-quality duplicate pages — an explicit Google penalty risk and a disservice to
readers. Translation is offered *in the browser* on `/listen/` instead (see
`PRODUCT_AUDIT.md §2`). If native translations are ever commissioned, the
`hreflang` scaffold above is already in place to carry them.

## 3. AI / answer-engine readiness

| # | Signal | Status | Endpoint |
|---|---|---|---|
| 32 | `llms.txt` curated index | ✅ | `/llms.txt` (81 lines) |
| 33 | Full corpus in one plain-text file | ✅ | `/llms-full.txt` (2.7 MB) |
| 34 | Structured corpus JSON | ✅ | `/api/articles.json` (365 articles) |
| 35 | Explicit policy for 18 named AI crawlers | ✅ | `robots.txt` |
| 36 | `ai-content-policy` + `ai-training` meta | ✅ | every page |
| 37 | `Link: rel="llms"` HTTP header | ✅ | `vercel.json` |
| 38 | Unified `@graph` with resolvable `@id` per node | ✅ 6 nodes/page | H7 |
| 39 | `Person` node for the author, linked to publisher | ✅ | `@id` graph |
| 40 | `DefinedTermSet` node describing the subject matter | ✅ | `#subject` |
| 41 | `speakable` selectors on every article | ✅ | article schema |
| 42 | `AudioObject` + `ListenAction` for narration | ✅ | article + site schema |
| 43 | Citation fields (`citation-title`, `citation-author`) | ✅ | head |
| 44 | Stated licence and citation format | ✅ | `llms.txt`, `api/articles.json` |

**Why this matters more than keywords:** answer engines do not rank pages, they
resolve entities. A `@graph` that says *this article → written by this Person →
employed by this Organization → about these DefinedTerms* is directly
consumable. Prose alone forces a model to guess, and models do not cite what they
had to guess at.

## 4. Engine-specific coverage

| Engine | What it needs | Status |
|---|---|---|
| Google | Sitemap, canonical, structured data, Core Web Vitals, mobile-first | ✅ |
| Bing / DuckDuckGo | Sitemap, IndexNow-eligible URLs, clean canonicals | ✅ (IndexNow key can be added on request) |
| Yandex | Sitemap, `robots.txt`, regional signals | ✅ |
| Baidu | Sitemap, fast origin, `robots.txt` | ✅ (hosting region may affect crawl rate — outside code) |
| Naver | Sitemap + `robots.txt` | ✅ |
| Seznam | Sitemap | ✅ |
| Brave / Qwant / Mojeek | Own indexes; read robots + sitemap | ✅ |
| ChatGPT / Claude / Perplexity / Gemini / Copilot | `llms.txt`, explicit agent policy, structured data | ✅ |
| Social (X, Facebook, LinkedIn, WhatsApp, Telegram) | OG + Twitter cards, 1200×630 image | ✅ |

## 5. What is deliberately *not* claimed

- **Guaranteed ranking.** Impossible by construction; this checklist is about
  being fully legible, not about winning every query.
- **Native-language indexed editions.** Not built, for the duplicate-content
  reason above. The in-browser translation covers the reader need without the SEO
  penalty.
- **IndexNow / Bing instant indexing.** Requires a per-site key file. The code is
  ready (`vercel.json` redirects and canonical host are set); add the key file and
  it works. Not enabled because it needs a key only you can generate.
- **Review/rating rich results.** This site publishes teaching, not products, and
  inventing ratings would breach Google's structured-data policy.
- **AMP.** Deprecated by Google for most publishers; the static build is already
  faster than an AMP variant would be.

## 6. How to verify after deploy

```bash
npm run build          # 389 pages
npm run seo            # 34 checks, 0 warnings
npm run audit          # 365/365 articles
npm run typecheck      # 0 errors

curl -s https://lij.name.ng/robots.txt        | head -40
curl -s https://lij.name.ng/llms.txt          | head -20
curl -s https://lij.name.ng/api/articles.json | jq '.count'
curl -sI https://lij.name.ng/ | grep -i 'link:'
```

Then submit `https://lij.name.ng/sitemap.xml` in Google Search Console and Bing
Webmaster Tools, and validate any article URL in the
[Rich Results Test](https://search.google.com/test/rich-results).
