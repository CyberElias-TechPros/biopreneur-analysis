# Design Direction v2 — Live In Jesus Name

**Status: superseding v1 ("Editorial Devotional Minimalism").**
v1 optimised a quiet reading room. The brief for v2 is a *showpiece*: a
top-class, state-of-the-art site that demonstrates craft — built on **GSAP**,
**Lenis**, and **React Bits**, in a cinematic / bespoke / futuristic / spatial /
editorial / premium register. This document is the rulebook every screen obeys.

---

## 1. The creative direction

> **Cinematic Immersive Luxury × Editorial × Futuristic Spatial.**
> A midnight environment lit by dawn-gold. The home page is a *showroom* you
> travel through; the teachings remain a *reading room* you settle into.

We deliberately combine several families from the style catalogue rather than
pick one adjective:

| Layer | Choice | What it gives |
|---|---|---|
| Visual philosophy | Premium minimalism, restraint that is visible | Nothing decorative without a job |
| Art direction | Cinematic + celestial | One light source (dawn-gold) in the dark |
| Layout | Swiss 12-col + asymmetric bento + pinned horizontal rail | Order with drama |
| Typography | Fraunces Variable (display) + Inter Variable (body) | Editorial conviction, kinetic headlines |
| Colour & material | Midnight `#06080d`, ivory `#f3efe6`, gold `#d4af6a`, glass + grain | Luxury, depth, atmosphere |
| Motion | GSAP ScrollTrigger + Lenis smooth scroll | Scrollytelling, parallax, reveals |
| Interactive | React Bits islands (aurora, spotlight, magnet, star-border, count-up, split-text, velocity marquee, shiny text) | Tactile, memorable micro-worlds |
| Storytelling | Hero → manifesto → pillars → year-rail → index → listen → community | A narrative, not a widget pile |
| UX | Reading always beats chrome on article pages | The corpus stays usable |
| Performance & a11y | Static HTML first, lazy islands, reduced-motion law | Fast, inclusive, indexable |

The signature motif survives from v1: **the dawn arc over a horizon line with a
cross** — now blown up as a celestial orbit instrument in the hero, and kept on
the favicon and brand mark.

---

## 2. Architecture of the experience

The site is still **Astro 6, fully static** (389 pages, 365 teachings). Motion is
a progressive enhancement layered on readable HTML:

- **`src/scripts/experience.ts`** — the GSAP × Lenis controller. Loaded only on
  pages that pass `experience={true}` to `BaseLayout` (home + the marketing
  surfaces: teachings, slate, listen, community, about, category hubs). It owns
  smooth scroll, the hero timeline, rise-in reveals, the pinned 12-month rail,
  parallax, the cursor glow, and magnetic accents.
- **`src/scripts/chrome.ts`** — dependency-free chrome on *every* page: theme,
  mobile menu, reading-scale, declaration speech, consent, and the quiet
  IntersectionObserver reveals + reading progress used by **article pages**.
- **React Bits islands** (`src/components/reactbits/`, vendored with license)
  hydrate lazily (`client:load` / `client:visible`) only where used. The
  365 article pages ship **no React and no GSAP** — they stay light.

### The two registers

1. **The Showroom** (`.showcase`, home + marketing surfaces): a design
   environment, like a film. Re-maps the editorial tokens so shared components
   inherit the set. It has **two lighting states** driven by the same header
   toggle as the rest of the site:
   - **Midnight** (default): `#06080d` environment, additive gold aurora.
   - **Dawn / Ivory** (`html[data-theme='light']`): `#faf7f0` environment, the
     aurora switches to `lightMode`, spotlight cards use the light palette, and
     every translucent surface follows via `--sc-*-rgb` channel tokens. The
     React islands re-tune live through the `ijn:theme` event + `useTheme` hook.
2. **The Reading Room** (articles, legal, glossary): dark-first by default with a
   one-tap switch to the dawn/ivory register. Native scroll, 680px measure, drop
   cap, calm reveals. The Listening Room, text-resize and AdSense are unchanged.

The footer is a deliberate **midnight sign-off in both registers** — the one
surface that never changes, like the colophon at the end of a book.

### Page-transition curtain

A dependency-free gilded wipe (`chrome.ts`, so article pages get it too) covers
the gap between full page loads. Clicking an internal link raises a midnight (or
ivory) panel bearing the dawn-arc mark; the next page lifts it on arrival. It is
`aria-hidden` and `pointer-events:none`, skips modifiers / new tabs / downloads /
anchors / external links, respects reduced-motion, restores clean from bfcache,
and has a 5-second failsafe so it can **never strand the reader**.

### Morphing cursor

On experience pages with a fine pointer, a gold ring + dot trail the pointer
(GSAP `quickTo`). The ring expands over links and buttons and can carry a verb
(`data-cursor="Read|Listen|Explore|Browse|Join|Open|View"`). The **native cursor
is never hidden** — this is a decorative accent, not a replacement, so precision
and accessibility are preserved. Disabled for coarse pointers and reduced motion.

---

## 3. Motion law (non-negotiable)

1. **`prefers-reduced-motion` is honoured everywhere.** No Lenis, no pins, no
   parallax, no aurora, no cursor glow; simple opacity fades only.
2. **Nothing autoplays audio.** The waveform is a scroll-reveal, not a playing
   equaliser. Speech is always user-initiated.
3. **Content is never hidden waiting for JS.** Every reveal animates *from* a
   hidden state at runtime; with JS off the page is fully readable. React Bits
   `SplitText`'s `visibility:hidden` is overridden so a headline can never strand.
4. **The reader is never trapped.** Pins release; in-page anchors use
   `lenis.scrollTo`; article pages keep native scroll and find-in-page.
5. **One rAF loop.** Lenis rides GSAP's ticker; ScrollTrigger updates on Lenis
   scroll. No competing animation clocks.
6. **Transitions never trap.** The curtain is pointer-events:none with a failsafe
   lift; the morphing cursor never hides the native pointer. Both are pure
   enhancement and vanish under reduced motion.

---

## 4. Type, colour, space

- **Type:** Fraunces Variable (display, optical sizing to 144) + Inter Variable
  (body). No third family. Headlines are kinetic; Scripture is Fraunces italic.
- **Colour:** midnight `#06080d` / `#0a0e15`, ivory `#f3efe6`, gold `#d4af6a`
  (decorative `#b08d3e`), sky `#2e4a66` as a cool counter-light. No pure black.
- **Material:** glass header, 1px gold hairlines, film grain, radial dawn glows,
  pointer-tracked spotlights.
- **Space:** Swiss 12-column grid; one 680px reading column on articles; section
  rhythm on a 4px scale; generous `clamp()` vertical padding.

---

## 5. What "award-winning" means here

Not effects for their own sake — **typographic conviction, a signature motif,
and restraint that is visible**, executed with a modern motion stack. The
showroom earns attention; the reading room earns trust. Both are measured
against the same bar: every page passes the 34-check SEO audit, type-checks
clean, and degrades to fast, accessible, indexable HTML.

---

## 6. Stack reference

- **GSAP 3** + ScrollTrigger + SplitText + `@gsap/react` — timelines, pins,
  parallax, kinetic type.
- **Lenis** — inertial smooth scroll, synced to the GSAP ticker.
- **React Bits** (vendored, MIT + Commons Clause) — Aurora (WebGL2), SplitText,
  ScrollVelocity, SpotlightCard, Magnet, CountUp, StarBorder, ShinyText.
- **Motion** — powers the CountUp and ScrollVelocity islands.
- **Astro 6 + @astrojs/react 5** — static corpus with lazy React islands.

See `faith-site/src/components/reactbits/README.md` for component provenance.
