# Product Audit — What Was Missing, What Was Built, What Remains

An honest gap analysis of the publication as a *product*, not just as a set of
articles. Each row states the need from the reader's side, the state before this
pass, and the state now.

---

## 1. Reader stories and their status

| # | Reader story | Before | Now | Where |
|---|---|---|---|---|
| R1 | "I want to read today's teaching." | Done | Done | `/`, `/teachings/`, article template |
| R2 | "I can't read right now — read it to me." | Partial (declaration only) | **Done** — full article, 4 voices, 6 speeds, 13 languages | `ListenRoom.astro`, `listen-room.ts`, `/listen/` |
| R3 | "I don't read English well." | Unavailable | **Done with honest limits** — on-device translation where supported, link-out where not | `languages.ts`, `/listen/` |
| R4 | "I'm on a slow or intermittent connection." | Read-online only | **Done** — service worker caches visited pages, `/offline.html` explains the rest | `public/sw.js` |
| R5 | "I want to install this on my phone." | Not installable | **Done** — manifest, maskable icons, shortcuts | `manifest.webmanifest`, `public/icons/` |
| R6 | "Can I share this with my house group?" | Share URL only | **Done** — printable teaching, expanded print links | print stylesheet |
| R7 | "Can I search by Scripture or theme?" | Search existed | **Done** — shareable `?q=`/`?cat=` URLs, live count | `/teachings/` |
| R8 | "I want to talk to someone about this." | Email | **Done** — WhatsApp desk, compose-to-WhatsApp form | `/contact/` |
| R9 | "I want community." | None | **Done** — channel + group, linked site-wide | `/community/`, header, footer, article end |
| R10 | "I need to know my data is safe." | Policy existed | **Done** — consent gate, speech/translation/offline sections | `/privacy/`, `consent.ts` |

### Business / operator stories

| # | Need | Before | Now |
|---|---|---|---|
| B1 | Ad revenue without breaking EU consent law | AdSense loaded unconditionally | Consent-gated; declined readers see zero ads |
| B2 | Core Web Vitals headroom | Good | Kept — 3 KB gzipped for listening, no framework runtime |
| B3 | Every page discovered | Sitemap + robots | Kept — 389 pages, 30/30 SEO checks |
| B4 | Shippable from a clean clone | **Broken** — 142 article files untracked | **Fixed** — all 365 committed |

---

## 2. What "listen" actually is here — and why

Three routes exist for text-to-speech, and only one is right for a publication
that must stay free, private, and fast:

| Option | Cost | Privacy | Works offline | Verdict |
|---|---|---|---|---|
| Server TTS (ElevenLabs, Google, Azure) | Per character, monthly | Article text leaves the site | No | Rejected — recurring bill, ongoing privacy disclosure |
| Pre-generated audio files | Storage + CDN | None | Yes | Rejected — 365 × ~8 min of audio, and stale the moment an article is edited |
| **Platform speech (`speechSynthesis`)** | **Zero** | **Nothing leaves the device** | **Yes once cached** | **Chosen** |

The trade is voice quality: platform voices are good, not studio-grade. That is
the honest cost of free and private, and the `/listen/` page says so instead of
pretending otherwise.

Translation follows the same logic: the browser's on-device translator where it
exists, a clearly-labelled link-out where it does not, and never a silent upload
of a reader's page to a third-party endpoint.

---

## 3. Deliberately not built

| Item | Why not |
|---|---|
| Accounts / saved bookmarks | Requires a database, a privacy regime, and a login a reader does not need. Preferences in `localStorage` cover the real use case. |
| Comments | Moderation liability on a doctrinal site; the WhatsApp group is the moderated-enough equivalent with zero infrastructure. |
| Newsletter capture | The RSS feed + WhatsApp channel already serve returning readers, and the design spec forbids an email interrupt. |
| Server-side search index | 365 rows of `data-search` attributes filter instantly and cost nothing. Revisit at ~2,000 articles. |
| Push notifications | Explicitly against the reading ethos; the channel already notifies. |
| A third-party consent SDK | The consent surface is one vendor. A 200 KB CMP to gate one script is worse for every reader. |

---

## 4. Remaining risks and the next three moves

1. **Verify AdSense approval** — the site is technically compliant, but approval
   is a human review. The consent gate and the accessibility page are the two
   documents reviewers look for beyond the privacy policy.
2. **Native-reader review of Yorùbá, Igbo, Hausa, and Arabic** — these are offered
   with an honest "external / machine" label, but a native check of the phrasing in
   the language list would raise the quality of the offer.
3. **Real-device voice pass** — test the four presets on iOS Safari, Android
   Chrome, and desktop Firefox, and adjust the `prefer` lists in `SITE.listen` to
   whatever those engines actually name their voices.
