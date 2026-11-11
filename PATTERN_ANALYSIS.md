# Biopreneur (biopreneur.com.ng) — Complete Site Pattern Analysis
*Analysis date: Nov 11, 2026 · Source: full scrape of all 1,143 indexed URLs saved in `D:\biopreneur\scrape\`*

---

## 1. SITE INVENTORY (what was scraped and saved)

| Item | Count | Location |
|---|---|---|
| Blog posts | 1,138 | `scrape\<post-slug>.html` (raw HTML) |
| Static pages | 5 | `scrape\biopreneur.com.ng.html` (home), `blog.html`, `about-3.html`, `privacy.html`, `contact-3.html` |
| Quiz-funnel landing page | 1 | `mediterranean-diet-plan.html` (part of the 5 page-sitemap URLs) |
| Sitemaps | 4 | `sitemap_index.xml`, `post-sitemap.xml`, `page-sitemap.xml`, `category-sitemap.xml` |
| Category pages | 10 | biography, business, travel-n-jobs, office-design, food, general, home-decor, reviews, health, amazon-finds |
| Master URL list | 1,143 | `all_urls.txt` |
| Per-page metrics | 1,143 rows | `site_stats.csv` |

### Category distribution (posts)
Reviews **478** · Home Decor **301** · Biography **123** · Health **118** · Office Design **45** · General **30** · Business **25** · Travel & Jobs **13** · Food **2** · Amazon Finds **2**

### Publishing timeline (datePublished)
2024: 27 posts · 2025: 454 posts · 2026: 661 posts (through Nov 10, 2026).
Bursty cadence — peaks of 36 posts in a single day (2025‑09‑12), 31 (2025‑09‑27), 20 (2025‑08‑29). Roughly 3–5 posts/week in "steady" weeks.

### Technical stack (from raw HTML)
- **Theme:** Astra (Kadence WP) — `class="ast-related-posts"`, Astra comment markup
- **SEO plugin:** Rank Math (XML sitemaps, BlogPosting + BreadcrumbList + Person + WebSite + WebPage schema on every page)
- **Cache/CDN:** LiteSpeed (litespeed avatar paths), image format mix .webp/.avif/.jpg
- **Ads:** Google AdSense, publisher `ca-pub-9125084751180062`, valid `ads.txt` (`google.com, pub-9125084751180062, DIRECT, f08c47fec0942fa0`), `adsbygoogle` script on **100% of 1,143 pages**, ad units injected inline into content in numbered `code-block-1/2/3` positions (top-of-content, mid-content, bottom), plus repeated async loads
- **Meta descriptions:** present on 1,137/1,137 posts, average length 156 characters
- **robots.txt:** minimal and clean — only `/wp-admin/` disallowed, sitemap declared
- **Author:** every one of the 1,138 posts by a single author, "Amy Richards" (`/author/biopreneur/`, 114 archive pages). Author bio box + photo in sidebar of every post.

---

## 2. QUANTITATIVE CONTENT PROFILE (all 1,137 measured posts)

| Metric | Value |
|---|---|
| Average word count | **2,805** |
| Median band | 1,000–4,999 (886 posts) |
| Long posts (>3,000 words) | 512 (45%) |
| Very long posts (>4,000 words) | 251 |
| Longest post | 8,204 words |
| Short posts (<1,000 words) | 102 (9%) |
| Posts with tables | 625 (avg 1.6 tables/post) |
| H2 headings avg / post | 13.2 |
| H3 headings avg / post | 10 |
| Images avg / post | 4.6 (71 posts have 0 in-body images) |
| Lists avg / post | 4.6 |
| Internal links avg / post | 7.6 |
| External links avg / post | 2.6 |
| Affiliate links avg / post | 1.9 (2,158 `hop.clickbank.net` instances site-wide) |
| Pages with FAQ section | 579 |
| Pages with "See also" internal-link blocks | 881 |
| Pages with affiliate/commission language | 194 |
| Pages with medical disclaimer | 317 |
| Pages with actual user comments | **0** (comment form enabled everywhere, never used) |

### Word count by category
Reviews n=478, avg **3,924** (min 1,642, max 6,979) · Home Decor n=301, avg 1,755 · Biography n=123, avg 1,943 · Health n=118, avg 2,581 · Office Design n=45, avg 2,188 · General n=30, avg 2,636 · Business n=25, avg 1,267 · Travel & Jobs n=13, avg 1,862

**The core formula is visible in the numbers:** the money category (Reviews) runs ~4,000 words of depth; the volume categories (Home Decor, Biography) run 1,700–2,000 words of scannable list/narrative.

---

## 3. THE SEVEN CONTENT TEMPLATES (reverse-engineered)

The site is built from 7 repeatable templates. Every post on the site is an instance of one of these.

---

### TEMPLATE A — The Product Review (money template · ~478 posts · avg 3,924 words)
*Reference: Mitolyn, ProDentim, Yu Sleep, FemiCore, Phytomem One, Purisaki, Citrus Burn, Genius Wave, Alpilean, Lotto Champ…*

**Title formula:**
> `[Product] Reviews (Updated [Month] [Year]): My Honest Verdict — [Core Promise], Does It Work, [Side Effects / Ingredients], Complaints, and Whether It's Worth Buying`

**Exact section skeleton, in order:**
1. **Verdict-first lede** — "**Verdict upfront:** [Product] is worth trying IF you are [ideal buyer]… and you understand [the mechanism]. It is NOT worth buying if you [disqualifier]…" Two dense paragraphs that answer the buyer's question before anything else.
2. **Availability note + first affiliate CTA** — "👉 Visit the Official [Product] Website — Check Current Pricing and the [N]-Day Guarantee" (ClickBank hop link).
3. **Quick-Reference Summary Table** — 18–20 rows: Product, Category, Format, Key Ingredients, Manufacturing (FDA-registered/GMP), Certifications, Third-Party Testing, Price, Refund Policy, Where to Buy, Customer Support email, Trustpilot Status, Results Timeline, Overall Rating **X/10**, Best For, Not Recommended For.
4. **What Is [Product]?** — category positioning + what it is NOT (differentiation vs conventional products).
5. **Who [Product] Is Actually For** — H3 "The Problem It Addresses" (the biological/lifestyle problem), H3 "Ideal Buyer Profile" (bulleted "makes sense if you:"), then "Skip [Product] if you:" bullets (5 disqualifiers including pregnant/nursing, drug interactions, wrong expectations).
6. **How It Works: The Science Explained** — 2–4 numbered H3 mechanisms with real terminology (PGC‑1α, AMPK, ROS, mitochondrial biogenesis). Always ends with **"The honest caveat:"** — ingredient-level science ≠ product-level RCT proof.
7. **Ingredients: Full Breakdown** — H3 per ingredient (5–7), each with: origin/traditional background → mechanism → named human research → relevance to the product's claim. Ends with **"A Note on Dose Transparency"** naming the proprietary-blend limitation honestly.
8. **Pricing: The Complete [Year] Breakdown** — 3-row bundle table (1 / 3 / 6 bottles, per-bottle, total, shipping), best-value callout, plus a **strategy paragraph** (e.g., "start with the 3-bottle so the guarantee matches the trial window").
9. **What I Genuinely Like** — exactly 5 numbered H3 positives, each 2–4 sentences of reasoning (mechanism credibility, no stimulants, GMP manufacturing, ingredient synergy, public support contacts).
10. **What I Genuinely Do NOT Like: The Real Complaints** — 5 numbered H3 negatives. Signature move: **verbatim quoted Trustpilot complaints (5 reviewer quotes)** with attribution, then the pattern analysis ("the guarantee is calculated from order date, not delivery…"). Includes the **"day-60 calendar reminder" consumer-protection tactic**.
11. **Is [Product] a Scam?** — a deliberately nuanced verdict: "The product itself is not a scam… The refund process has serious documented problems… The marketing is significantly dishonest." Three-part honesty breakdown ending in a single-sentence verdict.
12. **[Product] vs. Competitors** — 2–3 markdown comparison tables (Feature | Product | Rival), each followed by a link to the rival's own Biopreneur review ("See also our detailed … review").
13. **The Refund Policy: What You MUST Know Before Ordering** — "This section can save you money." Official terms bullets → **the critical fine print, quoted** → what it means bullets → **Consumer Protection Steps** (day-60 reminder, keep all bottles, email AND phone, ship with tracking, chargeback fallback).
14. **Side Effects: What Real Users Report** — Common (first 1–2 weeks), Rare, **Drug interaction cautions** (blood thinners, diabetes meds, immunosuppressants), "Who should not use".
15. **How to Get the Best Results** — 7 numbered practices (consistency, take with food, sleep, resistance exercise, stress, calendar reminder, don't stack stimulants).
16. **Where to Buy** — official site only, anti-counterfeit warning (Amazon/eBay listings = counterfeit), shipping times, second affiliate CTA.
17. **FAQ** — 12–14 bold questions as Q&A pairs: "What is X and how does it work?", "Does it really work?", "Is it legit or a scam?", "Is it on Amazon?", "Is it FDA approved?" (correctly answered: *no supplement is FDA-approved*), "What's the refund policy?", "Can I get a refund if I bought through an affiliate link?" (yes).
18. **Final Verdict: Is [Product] Worth Buying in [Year]?** — "Yes — with two non-negotiable conditions:" bullets, recap of strengths, recap of criticisms tied back to the 7/10 rating, **Rating: X / 10**, third affiliate CTA.
19. **"You Might Also Find These Reviews Useful"** — 3 internal links with one-line descriptions.
20. **Medical Disclaimer** — italicized informational-only paragraph, "not intended to diagnose, treat, cure, or prevent any disease."

**Ratings actually used:** 7/10 is the house default for "legit but flawed" (the vast majority), occasionally lower for weak offers. Never 9–10/10 for ClickBank products — the skepticism *is* the brand.

**Voice within reviews:** first person singular ("What I genuinely like"), forensic tone, quote-based evidence, numbers everywhere ($39, 60-day, 3.5 billion CFU, 2 mL, 0.9 mg melatonin).

---

### TEMPLATE B — The Head-to-Head Comparison (~70+ posts · avg ~3,000 words)
*Reference: Moray Generator vs Energy Revolution System, Cold War vs Moray, All Day Slimming Tea vs Tea Burn, Cholibrium vs VenoPlus 8…*

**Title formula:** `[Product A] vs [Product B] ([Year]): [Dimension 1], [Dimension 2], [Dimension 3] and Which One Is Worth Buying`

**Skeleton:**
1. **"Quick verdict:" opener** — a 3–4 sentence answer stating what both products are, what each costs, and which one wins for which buyer. (This exact paragraph is also the SEO meta description and the archive-card excerpt.)
2. What each product actually is (with the "not a ready-made X, it's a digital guide/powder/capsule" reality check).
3. Cost comparison (per-day cost math is a signature — "$39 one-time vs $69/bottle…").
4. Refund terms comparison (60-day vs 90-day vs 365-day — refund terms are treated as a first-class buying factor site-wide).
5. Ingredient/feature overlap analysis ("what appears to be the same company").
6. **"Which one should you get?"** — buyer-scenario verdicts ("If you already drink tea daily… if you want a ready-made routine…").

---

### TEMPLATE C — The Biography (2026 long-form · ~123 posts · avg 1,943 words)
*Reference (best-in-class): Lionel Messi, Hirving Lozano, Adam Shulman, Kathy Ambush, Myles Brando, José Balmaceda…*

**Title formula:** `[Name]: Biography, Career, Family & Net Worth [Year]` or `[Name] — [Hook phrase]: [The Story]`

**Skeleton:**
1. **Cinematic lede** — 2–3 short paragraphs: who they are, one dramatic situational hook, one "where they are now in [year]" paragraph. Hard `---` divider.
2. **"[Name] — Personal Information at a Glance"** — 20-row table: full name, nickname, DOB, age as of 2026, birthplace, nationality, height, weight, zodiac, father, mother, siblings, spouse, children, club/team, position, net worth, social handles.
3. **"Who Is [Name], Really?"** — humble-origins narrative with H3 micro-chapters ("A Kid Who Was Just Different").
4. **Chronological chapters as H2s** with story-driven titles ("The Diagnosis That Almost Ended Everything", "Rejected Before He Was Rescued", "The Barcelona Years: Building a Legend", "The Heartbreaking Exit"). Each chapter mixes narrative paragraphs with a stats table and a bulleted records list.
5. **"The Rivalry / The Defining Conflict"** section (every good bio has one).
6. **Personal Life** — childhood-sweetheart narrative, wedding details, children with birth dates and current ages, lifestyle.
7. **Net Worth and Financial Profile** — table (net worth w/ source attribution "Forbes, 2026", salary, endorsements, foundation) + 2–3 explanatory paragraphs.
8. **Social Media and Public Presence** — platform table (Instagram/TikTok/Facebook, follower counts, "Active — official account").
9. **Records, Titles, and Career Highlights** — 8–10 bold-lead bullets with exact numbers.
10. **FAQ: Everything People Are Asking About [Name] in [Year]** — 10–12 Q&As (age, where they play, marriage, net worth, height, the signature controversy).
11. **Conclusion** — reflective, emotional, 4–5 paragraphs, no new facts. Ends on a resonant closing line ("…has already written more than enough of it to last forever").

**Style markers:** em-dashes everywhere; one-sentence dramatic paragraphs ("Penalties. Messi scored. Argentina won 4-2 on penalties."); present-tense anchors ("as of 2026"); respectful speculation labeling ("reportedly", "widely described as").

**Older-generation variant (2024, e.g., Davido/Wizkid/Khaid posts):** shorter (~1,500 words), Nigerian-English journalistic flavor ("The Omo Baba Olowo crooner", "released hits back to back"), sections named Biography / Timeless Music Career / Multiple Awards / Personal Life / Philanthropy / **Networth** (sic) / Routine / Attractions Outside Music / Top Songs numbered list. Same information slots, looser prose. The site's 2026 biographies are a strict upgrade of this skeleton.

---

### TEMPLATE D — The Home/Decor Listicle (volume template · ~301 posts + 45 office-design · avg 1,755 words)
*Reference: 6 Rustic Garden Shed Ideas, 10 Vent Hood Covers, 12 Home Inspo, 40+ "home office ideas" variants…*

**Title formula:** `[6–30] [Adjective] [Room/Object] [Idea|Elements|Tips] to [Verb] Your [Space|Home]`

**Skeleton:**
1. **Conversational thesis opener** — always opens with a rhetorical hook: "Let's be real for a second: …" / "Let's be honest: …" / "If you're looking for…". One paragraph stating the transformation promise ("these 6 ideas will make your backyard feel like a bespoke countryside retreat").
2. `---` divider, then **numbered H2 per idea** (6–14 ideas), each containing:
   - one tall Pinterest-optimized image (572×1024 vertical crop)
   - a 2–4 sentence pitch paragraph
   - **"Why You'll Love It:"** — exactly 3 bold-lead bullets (practical benefit / aesthetic benefit / durability-or-budget benefit)
   - **"How to Get the Look:"** — one instructional paragraph with real how-to detail (fastener types, "heat-treated (HT) pallets", "1×12 boards with 1×2 battens", "caulk every seam before painting")
3. **No conclusion and no FAQ** — the list simply ends. (Retention happens via Previous/Next post links + Related Posts grid.)

**Mid-era variant (office-design batch):** same skeleton minus the image-heavy treatment and with theme-only H2s ("Creative Use of Colorful Accents", "Functional Storage Solutions", "Incorporating Greenery for Fresh Vibes", "Personalized Touches for Motivation", "Balancing Work and Relaxation Spaces") — i.e., 10–14 themed idea blocks of 2 short paragraphs each.

**The title system is deliberately combinatorial:** the site generated hundreds of room×style×count permutations (cozy/minimalist/rustic/goth/dark academia/farmhouse × bedroom/living room/home office × 5–30 ideas). Titles end with participial hooks: "…That'll Actually Keep You Sane", "…You'll Love", "…That Feel Instantly Inviting".

---

### TEMPLATE E — The Health Education Post (~118 posts · avg 2,581 words)
*Reference: Natural Supplement for Sleep Aid, 5 Signs of Poor Kidney Health, Mediterranean-related content…*

**Skeleton:** Q&A opener ("**What is it?** A natural supplement for sleep aid is… **Is it worth buying?** For most adults… yes, but…") → mechanism science → ingredient-by-ingredient evidence with hedges ("may", "research associations") → who should/shouldn't → buying criteria → safety/red-flag section → FAQ. Always carries the medical disclaimer and "consult your doctor" hedge. Deliberately never promises cures.

---

### TEMPLATE F — The Visa/Jobs/Travel Guide (~13 posts · avg 1,862 words)
*Reference: Healthcare Jobs in New Zealand, $100k NY/Australia/Canada marriage-visa guides…*

**Skeleton:** Bold-keyword-heavy intro restating the search query → official pathway explained (AEWV, Green List, Tier 1/Tier 2) → eligible-occupations bullet list → numbered occupation sections → "how to search" with 10 alternative search phrases → numbered application process → PR pathway → qualifications checklist → salary/package comparison → **"Beware of Fake Visa Sponsorship Jobs"** scam-warning section → "Are they worth applying for?" → **Final Takeaway** with a numbered 3-question self-check. Cites official sources (Immigration New Zealand links).

---

### TEMPLATE G — The Business/Make-Money Guide (older era · ~25 posts · avg 1,267 words)
*Reference: 10 Innovative Ways to Start Blogging, best MBA programs, insurance, SMS marketing tools…*

**Skeleton:** "So, you're thinking about…" opener → **Key Takeaways** bullet box → 10 numbered H2 sections, each with H3 sub-points, bullet feature lists, a tool-comparison table, and a **blockquote pull-quote** → external links (Medium, wpbeginner, SocialBee) → bold affiliate blurb for a WordPress developer (bit.ly) → "Wrapping It Up" folksy conclusion → FAQ with 6 short Q&As. This is the loosest, most generic template on the site — and it's the era the site visibly outgrew.

---

### THE QUIZ FUNNEL PAGE (`/mediterranean-diet-plan/`)
A 65-word landing page: "Mediterranean Diet Plan Assessment… Tell us a little about yourself…" with a CTA linking to a ClickBank diet offer. This is the monetization funnel piece sitting outside the blog.

---

## 4. WRITING STYLE — THE HOUSE VOICE (analyzed from every template)

1. **Second person, verdict-first.** Every piece answers the reader's question in the first 3 sentences before any backstory. The homepage cards, meta descriptions, and comparison posts all begin with a condensed verdict ("Quick verdict:…").
2. **Conversational-but-credentialed.** Signature openers ("Let's be real for a second:", "So, you're thinking about…", "Few expected…") sit next to postgraduate-level vocabulary (mitochondrial biogenesis, PGC‑1α, transdermal delivery, electron transport chain). The persona — *biochemist explaining things to a neighbor* — is the voice.
3. **Short paragraphs, heavy scannability.** 1–3 sentence paragraphs; one-line dramatic paragraphs for narrative peaks; bold lead-ins on nearly every bullet; numbered H3s ("1. The Mitochondrial Mechanism…").
4. **Deliberate two-sidedness.** Every review names 5 real negatives, quotes actual angry customers verbatim, and criticizes the product's own marketing ("The marketing significantly overstates results"). This "honest skeptic" positioning is the site's core differentiation and trust engine.
5. **Hedged claims.** Health/biography claims are wrapped in "may", "reportedly", "research associations", "widely described as". Medical posts carry explicit disclaimers and "consult your doctor" repetition.
6. **Numbers as texture.** Prices to the dollar, days of guarantees, CFU counts, milligrams, follower counts, dates, salary ranges. Almost no paragraph of substance lacks a concrete figure.
7. **Formulaic titles engineered for CTR + SEO.** Patterns: "(Updated [Month] [Year])", "My Honest Verdict", "Legit or Scam", "Whether It's Worth Buying", "Everything You Need to Know", "[Name]'s [relative]: The Truth Behind the Search", "(2026)".
8. **"See also" internal-linking habit** — a mid-article `See also [related post]` block every 2–3 sections (881 pages), plus Related Posts grid + Previous/Next + sidebar Recent Posts. Average 7.6 internal links per post.
9. **Repetition with variation.** The same sentence constructions recur as templates ("This is why Mitolyn's benefits… appear in a specific sequence", "The honest caveat:", "Here is the specific fine print that has trapped multiple buyers"), giving every post the same rhythm.
10. **Punctuation signature:** em dashes for asides, colons before lists, parentheses for quick clarifications, bold for every keyword that a skimming reader might need.

---

## 5. PAGE STRUCTURE (the WordPress shell around every post)

Every single page, top to bottom:
1. Header: logo + 5-item nav (Home / Blog / About / Privacy Policy / Contact) — duplicated for mobile
2. Post meta line: date / "By Amy Richards" / category
3. H1 title → featured image → content (with inline ad units)
4. **Previous Post / Next Post** links
5. **Related Posts** grid (4 cards with thumbnails, category, author)
6. Comment form ("Leave a Comment — Cancel Reply")
7. Sidebar (posts only): author photo + "About the Author" paragraph + 5 "Recent Posts"
8. Footer CTA band: "Learn Something New — Read Our Inspiring Posts — Go to Posts"
9. Pinterest icon → Copyright © 2026 Biopreneur → Privacy Policy link
10. Rank Math schema: BlogPosting + Person + BreadcrumbList + WebSite on every page

Homepage structure: welcome mission statement + brand image → 4 category strips (Reviews, Biographies, Home Ideas, Travel), each with 3 cards and a "Read More [Category]" link → "Meet Amy!" bio card → posts CTA → footer.

---

## 6. REPRODUCTION BLUEPRINT (to rebuild this quality or better)

**Per-post production checklist:**
1. Pick template A–G by intent (A/B for money, C/D for volume/traffic, E for topical authority, F/G for keyword coverage).
2. Title must carry: keyword + year + proof-phrase ("Honest Verdict" / "Everything You Need to Know") + outcome promise.
3. Write meta description = the "Quick verdict" paragraph, trimmed to ~155 chars.
4. Build the summary table FIRST (18 rows for reviews) — it forces complete research before prose.
5. Minimum structure per review: 13 H2s, 10 H3s, 3 tables, 5 quotes/figures of evidence, 3 internal links, 1 comparison table, 12 FAQs, explicit 5 positives + 5 negatives, X/10 rating, disclaimer.
6. Listicles: 3-part idea blocks (pitch → Why You'll Love It ×3 bold bullets → How to Get the Look), vertical images, no FAQ.
7. Biographies: glance table → chronological chapters with named conflicts → net-worth table → social table → FAQ → emotional conclusion.
8. Interlink every new post to 3+ existing posts via "See also" blocks.
9. Publish day-of-year-date the content ("Updated May 2026") and refresh annually.

**Higher-quality upgrades over the original:**
- Add FAQPage schema to the FAQ sections (the original only emits BlogPosting).
- Fill the original's gaps: original photography for listicles, a real contact form, named author bio page with credentials, fewer near-duplicate listicle variants (the original has 100+ overlapping "home office ideas" posts), and cleaner sourcing of biographies.
- The original's single-author 1,138-post cadence (≈3/day peaks) is what makes the site look "actively maintained" to reviewers — replicate the *schedule*, not the bursts.

---

*All 1,143 pages are saved in `D:\biopreneur\scrape\` as raw HTML; per-page metrics in `site_stats.csv`; URL list in `all_urls.txt`.*
