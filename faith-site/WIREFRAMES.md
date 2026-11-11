# WIREFRAMES & PAGE ARCHITECTURE — *In Jesus Name*
*Governs TODO item B1 · Implements `DESIGN_SPEC.md` ("Reverent Editorial") v1.0*

## Grid & Structural Invariants

- **Outer container:** 12-column Swiss grid, `max-width: 1280px`, `8px` spacing scale, responsive horizontal gutters (`clamp(1.25rem, 4vw, 3rem)`).
- **Reading column (Flagship):** Single centered `680px` column (`max-width: 68ch–72ch`), **zero sidebars**, generous vertical breathing room.
- **Header (`<header role="banner">`):** Fixed `64px` height (`56px` on scroll), hairline bottom border (`1px solid var(--border-gold)`), wordmark + horizon-cross emblem left, **5 nav items** (`Home · Teachings · About · Doctrinal Basis · Contact`) + `Light / Night` sun-moon toggle right; accessible mobile drawer `< 900px`.
- **Footer (`<footer role="contentinfo">`):** Always rendered in the **Midnight register** (`#0D1117 → #101823`) across both themes, crowned by the glowing gold horizon light-line, housing mission statement, full policy & reference links (`Privacy Policy · Doctrinal Basis · Glossary · Year Slate · RSS`), and copyright.
- **Atmosphere rule:** At most **one** radial `--dawn` light-source glow per viewport; subtle 3% star-dust grain on Hero and Dark Mode only.

---

## 1. HOME (`/`)

```text
+----------------------------------------------------------------------------+
| [Emblem] IN JESUS NAME          Home  Teachings  About  Doctrine  Contact ☀|
+----------------------------------------------------------------------------+
|  FULL-BLEED DAWN HERO (min 70vh · AVIF/WebP preloaded · 1 radial glow)     |
|                                                                            |
|  KICKER: REVELATION · IDENTITY · WALK IN CHRIST                            |
|  H1 (Fraunces): "The entrance of His Word gives light."                    |
|  Subline: Scripture-anchored teachings unveiling who you are in Christ,    |
|           what His finished work secured, and how to live it on Monday.    |
|  [ Read Day 001 -> ]    [ Browse All Teachings ]                           |
+----------------------------------------------------------------------------+
|  =============[ GOLD HORIZON LIGHT-LINE ]=============                     |
|                                                                            |
|  SECTION 01 · EDITORIAL PROMISE (12-col asymmetric: 4-col label / 8-col)   |
|  "Not information transfer — spiritual understanding."                     |
+----------------------------------------------------------------------------+
|  SECTION 02 · FOUR DOCTRINAL STRIPS (numbered editorial rows, hover reveal)|
|  01  New Creation & Identity         -> [description reveal + count]       |
|  ------------------------------------------------------------------------  |
|  02  Righteousness & Grace           -> [description reveal + count]       |
|  ------------------------------------------------------------------------  |
|  03  The Person & Ministry of Spirit -> [description reveal + count]       |
|  ------------------------------------------------------------------------  |
|  04  The Word, Faith & Authority     -> [description reveal + count]       |
|                                               [ View all 12 categories -> ]|
+----------------------------------------------------------------------------+
|  SECTION 03 · FEATURED TEACHINGS — WEEK ONE (Magazine numbered list)       |
|  DAY 001 | You Are a New Species of Being          | 2 Cor 5:17 | [Chip]   |
|          | Central truth one-line summary...                    | 6 min    |
|  DAY 002 | The Birth That Changed Your Nature      | John 3:6   | [Chip]   |
|  ... Days 003–008 ...                                                      |
+----------------------------------------------------------------------------+
|  SECTION 04 · THE 365-DAY CURRICULUM (12 Monthly Arcs compact ledger)      |
|  Jan: New-Creation Foundations · Feb: Holy Spirit · ... · Dec: Redemption  |
+----------------------------------------------------------------------------+
|  SECTION 05 · RESIDENT TEACHER & DOCTRINAL BASIS NOTE (2-col Swiss split)  |
|  [1px gold-ring portrait + 3-sentence bio]  |  [Faith & Wisdom covenant]   |
+============================================================================+
|  MIDNIGHT FOOTER: Wordmark · Mission · Nav · Privacy · Glossary · RSS      |
+----------------------------------------------------------------------------+
```

---

## 2. ARTICLE — FLAGSHIP READING ROOM (`/[slug]/`)

```text
+----------------------------------------------------------------------------+
| [Header]                                                                   |
|===================[ 2px GOLD READING PROGRESS BAR ]========================|
+----------------------------------------------------------------------------+
|                    <article> — 680px CENTERED COLUMN                       |
|                                                                            |
|   Breadcrumb: Home / Teachings / New Creation & Identity                   |
|   META: DAY 001 · NOV 2026 · BY ELIAS OKAFOR · [CATEGORY CHIP]  [A- A A+]  |
|                                                                            |
|   H1 (Fraunces clamp 2.4–4rem):                                            |
|   You Are a New Species of Being                                           |
|                                                                            |
|   +--------------------------------------------------------------------+   |
|   | | THEME-SCRIPTURE BLOCK (--surface, 2px gold left rule, radial glow)|  |
|   | | "Therefore if any man be in Christ, he is a new creature..."     |   |
|   | | — 2 CORINTHIANS 5:17 · KJV                                       |   |
|   +--------------------------------------------------------------------+   |
|                                                                            |
|   [ AD SLOT #1 — reserved min-h 250px, contain:layout, "ADVERTISEMENT" ]   |
|   (Rendered only when live/preview enabled; NEVER between H1 and Theme)    |
|                                                                            |
|   Opening paragraphs (Central truth unveiled <= paragraph 3)               |
|   H2: The Word Behind the Words                                            |
|   Development + Contrast pairs + Bridge illustration                       |
|   H2: The Word Says the Same Thing From Three Directions                   |
|   Cross-reference build (3+ passages across distinct books)                |
|                                                                            |
|   [ AD SLOT #2 — Mid-article break before "What This Means for You" ]      |
|                                                                            |
|   H2: What This Means for You                                              |
|   H2: Putting It to Work This Week (3–5 weekday translations)              |
|                                                                            |
|   -----------------[ GOLD HORIZON LIGHT-LINE ]-----------------            |
|     REAFFIRMATION PULL-LINE (Centered Fraunces display quote)              |
|   -----------------[ GOLD HORIZON LIGHT-LINE ]-----------------            |
|                                                                            |
|   +--------------------------------------------------------------------+   |
|   | SPEAK THIS ALOUD                          [~25s · Speak Aloud btn] |   |
|   | "I am a new creation in Christ Jesus..." (40–80w Declaration)      |   |
|   +--------------------------------------------------------------------+   |
|   (Rule: ZERO ads adjacent above or below Declaration Card)                |
|                                                                            |
|   FURTHER STUDY (2-column compact scripture reference grid)                |
|                                                                            |
|   [ AD SLOT #3 — After Further Study / Before Related Teachings ]          |
|                                                                            |
|   RELATED TEACHINGS (3 quiet horizontal rows: Title + Handoff + [Chip])    |
|   PREVIOUS DAY  <---                                    --->  NEXT DAY     |
|   AUTHOR BOX: [Gold-ring portrait] 3-sentence bio + Doctrinal Basis link   |
+============================================================================+
|  MIDNIGHT FOOTER                                                           |
+----------------------------------------------------------------------------+
```

---

## 3. TEACHINGS INDEX (`/teachings/`)

```text
+----------------------------------------------------------------------------+
| [Header]                                                                   |
+----------------------------------------------------------------------------+
|  PAGE HEADER (12-col): Kicker + H1 "The Teaching Library" + Search/Filter  |
|  Category Filter Bar: [All (8)] [New Creation] [Righteousness] [More...]   |
+----------------------------------------------------------------------------+
|  EDITORIAL LIST (No card boxes — clean horizontal hairlines)               |
|  001  You Are a New Species of Being                    [Category Chip]    |
|       One-line central truth + Anchor verse + Read time                    |
|  ------------------------------------------------------------------------  |
|  002  The Birth That Changed Your Nature                [Category Chip]    |
|  ...                                                                       |
+----------------------------------------------------------------------------+
|  12-CATEGORY DIRECTORY + LINK TO FULL 365-TOPIC YEAR SLATE (`/slate/`)     |
+============================================================================+
|  MIDNIGHT FOOTER                                                           |
+----------------------------------------------------------------------------+
```

---

## 4. CATEGORY ARCHIVE (`/category/[slug]/`)

```text
+----------------------------------------------------------------------------+
| [Header]                                                                   |
+----------------------------------------------------------------------------+
|  Breadcrumb: Home / Categories / [Category Name]                           |
|  H1: [Category Name]                                                       |
|  3-sentence doctrinal description + Anchor Scripture cluster               |
+----------------------------------------------------------------------------+
|  PUBLISHED TEACHINGS IN THIS CATEGORY (Editorial rows)                     |
+----------------------------------------------------------------------------+
|  SCHEDULED ON THE YEAR SLATE (Upcoming curriculum topics in this arc)      |
+============================================================================+
|  MIDNIGHT FOOTER                                                           |
+----------------------------------------------------------------------------+
```

---

## 5. ABOUT (`/about/`)

```text
+----------------------------------------------------------------------------+
|  Hero Split: H1 "Why In Jesus Name Exists" + Open-Scripture editorial photo|
|  1. Our Mission (Information -> Understanding -> Consciousness -> Living)  |
|  2. Who Writes & Teaches Here (Resident Bible Teacher profile & method)    |
|  3. How Every Teaching Is Built (8-step Scripture Chain + Originality Law) |
|  4. Doctrinal Honesty & Faith-with-Wisdom Commitment                       |
+----------------------------------------------------------------------------+
```

---

## 6. DOCTRINAL BASIS (`/doctrinal-basis/`)

```text
+----------------------------------------------------------------------------+
|  680px Editorial Document + Table of Contents jump links                   |
|  Articles I–X: Scripture · Triune God · Person & Work of Christ ·          |
|  New Birth · Justification & Righteousness · Holy Spirit · Authority ·     |
|  Faith & Responsible Wisdom · The Church · The Blessed Hope                |
|  + Editorial Covenant on Debated Passages & Medical/Practical Responsibility|
+----------------------------------------------------------------------------+
```

---

## 7. CONTACT (`/contact/`) & PRIVACY POLICY (`/privacy/`)

```text
+----------------------------------------------------------------------------+
|  CONTACT: 12-col split — Left (4 col): Direct email, editorial standards,  |
|  response window, prayer/question note. Right (8 col): Accessible form     |
|  (Name, Email, Topic selector, Message, Consent note, Submit + Mailto).    |
|                                                                            |
|  PRIVACY POLICY: 680px dated legal-editorial document (>=1,500 words):     |
|  Data collected, localStorage reading prefs, Cookies & Google AdSense      |
|  DoubleClick DART opt-out, Remarketing, GDPR/UK GDPR, CCPA/CPRA, NDPA,     |
|  Children's Privacy, Retention, Contact.                                   |
+----------------------------------------------------------------------------+
```
