# Design Direction — Live In Jesus Name

A decision document, not a mood board. It names the direction this site already
runs on, then states exactly what is added, so every future screen has a rule to
obey instead of a vibe to imitate.

---

## 1. Where the site already sits

The site is built on **Swiss editorial** bones: a 12-column grid, one reading
column (680px), a two-family type system (Fraunces for display, Inter for body),
hairline gold rules, and a midnight footer that never changes register. That is
already the correct foundation for long-form Scripture teaching, and it is not
the thing to replace.

What a reader feels on arrival is the combination of four traditions:

| Layer | Tradition | What it gives |
|---|---|---|
| Structure | Swiss International Style | Order, measure, whitespace discipline |
| Voice | Editorial luxury (magazine) | Kickers, drop caps, pull quotes, a serious byline |
| Atmosphere | Devotional / liturgical minimalism | Dawn light, gold, silence, room to breathe |
| Interaction | Quiet premium | Motion only where it clarifies, never for decoration |

**The direction is: Editorial Devotional Minimalism.**

Not immersive 3D, not cinematic scrollytelling, not neo-brutalism, not
maximalism. Those are correct for agencies, launches, and portfolios. They are
wrong here for three concrete reasons:

1. **The product is a text.** A 950-word teaching read on a phone. Every pixel of
   chrome competes with the Scripture it frames.
2. **The reader is often tired, grieving, or searching.** The design must lower
   arousal, not raise it. Dawn palette, generous leading, no autoplay.
3. **AdSense + Core Web Vitals.** Heavy WebGL, autoplaying video, and
   scroll-hijacking cost LCP, INP, and revenue. The editorial route is both the
   most beautiful *and* the fastest option here.

---

## 2. What "award-winning" means in this category

Awards in editorial/devotional publishing come from three things, not from
effects:

1. **Typographic conviction** — one typeface used with total commitment, at
   sizes and rhythms most sites are afraid of. Fraunces at 3.2rem with tight
   leading is already that move.
2. **A signature motif** — the dawn arc over a horizon line. It is on the
   favicon, the hero, and — from this change — on the reader tools.
3. **Restraint that is visible** — the site never moves under your thumb without
   being asked. Nothing autoplays. Nothing follows you.

The addition below honours all three.

---

## 3. The one thing this site was missing

It was a beautiful place to *read* and had no way to *listen*. For a devotional
publication that is not a feature gap, it is an access gap: readers who commute,
who are visually impaired, who read English as a second language, or who simply
retain more by ear were locked out of 365 teachings.

So the new layer is not a redesign. It is a **reading instrument**:

> **The Listening Room.** A single, quiet control surface that turns any teaching
> into speech in the reader's own language, in a voice they chose, at a speed
> they set — and never plays unless asked.

### How it looks

- Sits directly under the article meta line, where the text-size control already
  lives. Same hairline language, same uppercase micro-labels.
- Collapsed state is one line: `▷ Listen · English · Dawn` plus a language chip.
- Expanded state opens a narrow panel — voice (4 named presets), speed
  (0.8×–1.4×), language (13), and a live "now reading: section" readout.
- While speaking: the current paragraph is marked with a gold hairline on the
  left edge. The page does not move. Nothing scrolls itself. The reader can
  follow with the eye or ignore the screen entirely.
- On phones the panel is a bottom sheet that clears the WhatsApp button.

### Why this is the right answer rather than a prettier one

- It uses the **platform** speech engine: zero bytes shipped, zero API keys,
  works offline once the page is cached, and cannot rate-limit.
- Translation is **on-device** via the browser's own translator when available,
  and degrades to a clear, honest offer to read the original instead of
  pretending.
- A **Listen** entry is added to the primary nav only where it does not breach
  the five-item rule: it is a control inside the article, a utility in the
  header, and a destination page (`/listen/`) for readers who want the whole
  library spoken.

---

## 4. Type, colour, motion — unchanged, now enforced

- **Type:** Fraunces Variable (display, optical sizing on) + Inter Variable
  (body). No third family. Scripture is Fraunces italic; UI is Inter.
- **Colour:** ivory `#FAF7F0`, ink `#1A1714`, gold `#B08D3E` decorative and
  `#7A5C1B` for text (AA on ivory), midnight `#0D1117` for the footer. No pure
  black anywhere, ever.
- **Motion:** 600ms ease-out reveals, once, never repeating. `prefers-reduced-motion`
  removes transforms and keeps opacity. Nothing autoplays — audio included.
- **Space:** one column, 680px measure, section rhythm on a 4px scale.

---

## 5. Non-negotiables this direction imposes

1. Reading always beats chrome: no sticky bars over prose, no interstitials.
2. One idea per screen; one column per page.
3. Every interactive addition must be keyboard-reachable, labelled, and silent
   by default.
4. Every new page must earn its place in the sitemap, the nav budget, and the
   SEO audit — or it does not ship.
