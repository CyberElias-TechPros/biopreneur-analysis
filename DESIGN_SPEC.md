# DESIGN SPEC — The Faith Teaching Site
*Direction name: **REVERENT EDITORIAL** — Swiss Luxury Minimalism × Celestial Atmosphere*
*Status: chosen · governs TODO items B1–B12 · v1.0*

---

## 0. THE DECISION (and why)

From the full design-style catalogue, the chosen combination is:

> **Swiss Luxury Minimalism** (family 1: precision, balance, structure, premium restraint)
> **+ Celestial / Ethereal atmosphere** (family 8: light, depth, wonder, the unseen made visible)
> **+ Editorial layout architecture** (magazine-quality presentation, typography-led)
> **+ a whisper of motion** (scroll-reveals only — never spectacle)

**Why this fits a revelation-teaching site:**
1. **Swiss minimalism serves the Word, not the designer.** The teaching is the hero; the layout disappears. Precision grids mirror the doctrinal precision of the content. Restraint communicates reverence.
2. **Celestial atmosphere is the one permitted emotional layer.** "The unseen realm is more real than the seen" — subtle dawn-light gradients, star-dust textures, and depth in dark mode make the *invisible* feel present without kitsch (no winged angels, no literal clouds, no gold glitter).
3. **Editorial architecture matches the reading product.** This is a reading site (1,000–4,000-word teaching articles). Magazine-grade typography, a single dominant reading column, and pull-line "Reaffirmations" treat each article like a published essay.
4. **Deliberately rejected styles** and why: Neo-Brutalism/Experimental (irreverent for the content), Dark Tech/Cyberpunk (wrong register), Maximalism (competes with scripture), Glassmorphism/Neumorphism (trend-driven, ages badly, hurts accessibility), Cinematic/WebGL immersive (kills performance budget and AdSense layout stability).

**The experience in one line:** a still, holy reading room that opens into sky.

---

## 1. VISUAL PHILOSOPHY

- **Reverence through restraint.** Whitespace is the primary material. Every element earns its place.
- **Light as meaning.** Light mode = "The entrance of the Word gives light." Dark mode = "The Light shines in darkness." The theme toggle is a teaching metaphor, not a setting.
- **Typographic hierarchy is architectural.** Meaning is carried by scale and weight, not decoration. Scripture is always visually distinct from commentary — set off, never drowned.
- **Zero ornament except one motif:** a single thin gold *light-line / horizon rule* (a hairline that glows faintly, like dawn at the edge of dark). Used as section dividers, underlines for Reaffirmation pull-lines, and the header's signature. Nothing else decorative.

---

## 2. ART DIRECTION

| Layer | Direction |
|---|---|
| Imagery | Photography and art direction only: dawn light through windows, open sky horizons, open Scripture pages, candle/lantern light, solitary figures in vast light. Desaturated, warm, painterly. **Never:** stock church-hands clichés, doves, cross-collages, glitter. |
| Texture | Ultra-subtle "star-dust"/paper grain at 2–4% opacity on hero and dark-mode backgrounds only. |
| Atmosphere | One radial "light source" per view (hero glow, scripture-block glow). Never more. |
| Hero treatment | Full-bleed dawn image with a single mission line set in display serif over it. |

---

## 3. LAYOUT ARCHITECTURE

- **12-column Swiss grid**, max-width 1,280px, generous 8px-based spacing scale.
- **Article page (the flagship):** single centered reading column, **680px wide**, comfortable ~2.8rem side gutters. H2 breaks may use asymmetric full-bleed or 12-col spanning for rhythm, but body text never exceeds 680px.
- **Home:** full-bleed dawn hero (70vh) → mission line → 4 category strips (editorial rows, not cards) → featured teachings (numbered list treatment, magazine-style) → author/doctrinal note. Asymmetry allowed in strips; hierarchy always legible.
- **Teachings index:** editorial list — day number + title + one-line central truth + category chip. No heavy card grids.
- **Header:** fixed, hairline-bordered, wordmark left, nav right. Shrinks on scroll.
- **Footer:** dark in both modes (the "midnight" register), horizon rule, copyright + policy links.

---

## 4. TYPOGRAPHY

| Role | Family | Notes |
|---|---|---|
| Display / H1 / Reaffirmation | **Fraunces** (variable, opsz) | Warm literary serif with authority. Fallback: Cormorant Garamond → Georgia. |
| Body / UI | **Inter** (variable) | Neutral, highly legible at long lengths. Fallback: system-ui. |
| Scripture blocks | Fraunces italic, 1.15× body size | Set inside the Theme-Scripture component — never floating. |
| Scripture quotation inside body | Fraunces italic + gold left hairline | Distinct at a glance from commentary. |

**Scale (fluid, clamp-based):** H1 clamp(2.4rem→4rem) · H2 2rem · H3 1.4rem · body 1.125rem/1.75 line-height · meta 0.85rem uppercase tracked +5%.
**Rhythm:** 1.75 line-height, 1.5em paragraph spacing, orphans/widows controlled, max 75ch measure.
**Caps law:** ALL-CAPS reserved for meta lines, category chips, and the Declaration heading — never for sentences.

---

## 5. COLOR & MATERIAL LANGUAGE

### Light mode — "Dawn / Ivory"
| Token | Value | Use |
|---|---|---|
| `--bg` | #FAF7F0 (ivory) | page |
| `--surface` | #FFFFFF | cards, scripture block |
| `--ink` | #1A1714 (warm near-black) | body text |
| `--ink-soft` | #5C5450 | meta, secondary |
| `--gold` | #B08D3E | light-line motif, links, chips |
| `--dawn` | #F3E4C3 → transparent | radial light-source glow |
| `--accent-sky` | #2E4A66 | deep dusk-blue accents (tags, hover) |

### Dark mode — "Midnight / Gold"
| Token | Value | Use |
|---|---|---|
| `--bg` | #0D1117→#101823 subtle vertical drift | page (celestial depth) |
| `--surface` | #161C26 | scripture block, cards |
| `--ink` | #EDE8DF | body text |
| `--ink-soft` | #9AA3AE | meta |
| `--gold` | #D4AF6A | motif, links — brighter for AA |
| `--dawn` | rgba(212,175,106,0.10) | glow |

**Rules:** WCAG AA minimum (body ≥4.5:1, verified for both modes); gold is always a **hairline or text accent, never a fill**; one glow per view; no pure black (#000) anywhere.

---

## 6. COMPONENT LIBRARY (build order B5)

1. **Theme-Scripture block** — full-width surface panel, thin gold left rule, Fraunces italic, translation label in caps meta. The article's anchor; the first ad slot may follow it.
2. **Reaffirmation pull-line** — display serif, centered, flanked by the horizon light-line. The article's quotable moment.
3. **Declaration card** — surface panel, gold border, "SPEAK THIS ALOUD" caps label, optional speak-aloud icon; reading-time estimate badge.
4. **Further-Study list** — two-column compact list, book-chapter refs in gold.
5. **Related-Teaching cards** — quiet horizontal rows: title + one-line handoff + category chip.
6. **Category chip** — small caps, gold hairline border, transparent fill.
7. **Author box** — photo (1px gold ring), 3-sentence bio, doctrinal-statement link.
8. **Progress bar** — 2px gold line under header showing article read progress.
9. **Category strips (home)** — editorial numbered rows with hover reveal of the strip's description.
10. **Light-line divider** — the single decorative motif.

---

## 7. MOTION & INTERACTION (restrained)

- **Scroll-reveal:** opacity 0→1 + translateY 12px→0, 600ms ease-out, once per element. Applied to: theme block, H2 sections, Reaffirmation, Declaration card.
- **Page transitions:** none beyond instant — reading site, ≤300ms any change.
- **Hover:** link underline grows from left; chips fill at 8% gold; card rows lift 2px.
- **Declaration "speak-aloud":** subtle pulse on the icon while "reading aloud" affordance is active; no audio required (progressive enhancement only).
- **`prefers-reduced-motion`:** all reveals collapse to opacity-only 150ms; progress bar unanimated.
- **Forbidden:** parallax, WebGL, cursor trails, autoplay anything.

---

## 8. AD SENSE SLOT STYLING (B12)

- 3 content-embedded slots (after theme block · mid-article · before Related Teaching).
- Containers are **reserved-height** (min-height locked, `contain: layout`) → zero CLS.
- Slot chrome: hairline top rule + tiny caps label "ADVERTISEMENT" — matching the editorial system, invisible to policy reviewers as "deceptive".
- Ads never adjacent to the Declaration card, never inside the scripture block, never between heading and first paragraph.

---

## 9. UX PRINCIPLES

1. **One reader, one column, one truth per screen.** No sidebars on article pages.
2. **The next step is always visible:** Previous/Next day links pinned at article end; cluster siblings in Related Teaching.
3. **Reading comfort defaults:** text-resize control (0.9×–1.3×), remembered between visits; dark mode follows system, toggle overridable.
4. **Mode toggle** is a small sun/moon in the header — labeled "Light / Night" (the metaphor is the product).
5. **Navigation never exceeds 5 items:** Home · Teachings · About · Doctrinal Basis · Contact.
6. **Zero interruption reading:** no popups, no newsletter interrupt; the email capture (if any) is a quiet footer band.

---

## 10. PERFORMANCE & ACCESSIBILITY BUDGET

- LCP <1.8s · CLS <0.05 · INP <200ms · total JS ≤40KB · CSS ≤50KB unminified.
- Fonts: self-hosted variable woff2, `font-display: swap`, preload the two families only.
- Images: AVIF/WebP pipeline, responsive srcset, hero LCP image preloaded, `width/height` everywhere.
- Keyboard: full nav, visible focus (2px gold outline), skip-to-content link.
- Screen readers: landmarks (header/main/footer/article), heading order strict, scripture block labeled as blockquote with citation.
- Contrast: AA verified in both modes including gold-on-ivory link states.

---

## 11. DELIVERABLE CHECKLIST (maps to TODO B-items)

- B1 wireframes (lo-fi, 7 pages) ← this spec
- B2 hi-fi mockups (Home + Article in both modes)
- B3 typography implementation (Fraunces + Inter tokens)
- B4 color tokens (Section 5, both modes, AA-verified)
- B5 component library (Section 6, 10 components)
- B6 motion spec build (Section 7)
- B7 article template build — **first build target; the reading column is the flagship**
- B8 home page build
- B9 mode toggle
- B10 accessibility pass
- B11 performance budget enforcement
- B12 ad-slot styling QA

*Stack note: Astro recommended (static, zero-JS-by-default, perfect for this budget) — pending owner decision in TODO C1.*
