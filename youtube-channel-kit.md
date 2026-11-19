# YouTube channel kit — Live In Jesus Name

For `youtube.com/@LiveInJesusName`. Character counts below are measured, not estimated,
and the current limits were checked against 2026 sources: channel description 1,000
characters, channel name 100, handle 30, video description 5,000, video title 100,
tags 500 combined, hashtags 15 per video.

One correction worth making before anything else: **the handle is 20 characters**
(`LiveInJesusName`), inside the 30-character cap. `lij.name.ng` does not fit a handle
but fits the description and banner fine.

---

## 1. Channel name

**Limit 100.** Keep it short — YouTube shows the name beside every comment and video.

```
Live In Jesus Name
```

Two notes:

- It matches the site wordmark, the web manifest, and the Galaxy Store title, so a reader
  who sees one finds the others. Consistency across storefront and channel is a real
  ranking and recognition signal.
- It does **not** contain "Bible" or "Christian". That is deliberate — YouTube's search
  already reads the description, video titles and tags, and stuffing the channel name
  makes it look less like a publication and more like a content farm. If you want one
  keyword visible at all times, put it in the handle instead.

Optional alternative if you want the category visible in every comment thread:

```
Live In Jesus Name — Bible Teaching
```

27 characters. I would not use it: it reads like a keyword, and your videos will carry
the category in their titles anyway.

---

## 2. Handle

Already created: `@LiveInJesusName`. Nothing to change. 20 chars, valid, matches the brand.

---

## 3. Channel description (About)

**Limit 1,000. This is 820.** The first ~150 characters are what appears in search
snippets and the About preview, so the opening line carries the weight.

```
Scripture-anchored teachings on who you are in Christ.

Live In Jesus Name is a free Christian teaching publication. Every teaching is anchored in a specific passage of Scripture and written to answer a real question: what the New Birth actually did, what the finished work of Christ secured, and how to live from that reality during an ordinary week.

371 teachings are published, arranged as a 365-day reading slate across twelve arcs: New Creation & Identity, The Holy Spirit, Faith, Authority of the Believer, The Word, Prayer & Fasting, Divine Health, Prosperity & Stewardship, Righteousness & Grace, Spiritual Warfare, Redemption & His Return, and Christian Living.

Read them all, or listen to any teaching read aloud, at lij.name.ng

New teachings regularly. Subscribe to understand the Word rather than skim it.
```

Counts: 820 / 1,000 total. First 150 characters end cleanly at
"…anchored in a specific passage of Scripture…" — it does not cut mid-word, which
matters because YouTube truncates rather than wraps in search.

Why it is written this way: the twelve arcs are listed because each is a phrase people
actually search ("authority of the believer", "prayer and fasting", "righteousness and
grace"), and naming them gives the channel genuine topical surface across all twelve
without pretending it is about something else.

---

## 4. Channel links

YouTube allows several links; the first shows beside the About section.

| Order | Label | URL |
|---|---|---|
| 1 | Read every teaching | `https://lij.name.ng/teachings/` |
| 2 | Listen to a teaching | `https://lij.name.ng/listen/` |
| 3 | The 365-day slate | `https://lij.name.ng/slate/` |
| 4 | Contact | `https://lij.name.ng/contact/` |

All four are live routes on the deployed site. Put **Listen** first if you plan to make
audio the channel's main draw.

---

## 5. Channel branding assets — generated

All three are built from the site's own brand tokens and the `favicon.svg` emblem, so
they match the publication exactly. Regenerate any time with `npm run art`.

| File | Size | Use |
|---|---|---|
| `public/images/youtube-banner.png` | 2560 × 1440, 129 KB | Banner (Midnight/dark) |
| `public/images/youtube-banner-light.png` | 2560 × 1440, 69 KB | Banner (Dawn/ivory) |
| `public/images/youtube-avatar.png` | 800 × 800, 86 KB | Profile picture (dark) |
| `public/images/youtube-avatar-light.png` | 800 × 800, 76 KB | Profile picture (light) |
| `public/images/youtube-watermark.png` | 150 × 150, 1 KB | Branding watermark, transparent |

The banner carries the wordmark in **Fraunces** at 120px, the tagline *The entrance of
His Word gives light.*, and `lij.name.ng`. The emblem is redrawn from the real
`favicon.svg` geometry, so the horizon-cross mark is identical to the site's.

**Safe-area headroom, measured:** the bright content spans `x 562–1936, y 514–898`
inside the safe band of `x 507–2053, y 509–931`. That leaves 55px left, 117px right,
5px top and 33px bottom of margin — tight at the top by design, since the lockup is
vertically centred on the band.

`scripts/test-art.mjs` enforces this: it reads the PNG pixels and fails the build if any
bright content escapes the safe band, if the avatar's emblem would be clipped by the
circular crop, or if the watermark is not transparent. `npm run test:art`.

**Theme choice:** pick the variant that matches how your channel will mostly be seen.
The dark banner is the stronger default — it makes the gold read as gold rather than
ochre, and it matches the site's `theme-color` for dark mode. The light variant is there
because the site ships both and you may prefer it for a brighter feel.

---

## 6. Channel keywords and settings

This is in YouTube Studio → Settings → Channel → Basic info.

**Channel keywords** (comma-separated, no more than ~500 characters combined — note
this is a *separate* budget from per-video tags):

```
bible teaching, scripture teaching, identity in christ, new creation, righteousness by faith, authority of the believer, prayer and fasting, holy spirit, christian living, daily bible study, word of God, discipleship
```

**Other settings to set once:**

- **Country of residence**: Nigeria (affects monetisation and some recommendations)
- **Channel URL**: claim `youtube.com/@LiveInJesusName` as the custom URL
- **Made for kids**: **No.** Not because the content is unsuitable — it is entirely
  suitable — but because "made for kids" disables comments, notifications and
  personalised ads. This is a general-audience publication in the same sense a Bible app
  is, and the honest answer to "is it directed at children?" is no.
- **Default upload visibility**: Private, then publish deliberately. Never default to
  public with this much teaching content.
- **Comments**: leave on. A teaching channel that answers questions benefits from them,
  and you can hold for review if needed.

---

## 7. SEO that actually moves the needle

Per-video tags are worth very little in 2026 — YouTube's own guidance is that tags play a
minimal role, and the 500-character budget is shared. The ranking surface comes from
three things instead: **the first 157 characters of the description, the title, and the
spoken words in the video** (YouTube transcribes audio). So:

**For every video:**

1. **Title** — put the question in it. `What Does "New Creation" Actually Mean? (2 Corinthians 5:17)`. Under 70 characters so search does not cut it.
2. **Description, first 150 characters** — one plain answer sentence, then the site link. This is the field most creators waste.
3. **Description, body** — 150–300 words of the teaching's actual substance, with the Scripture reference written out. Then the links, then 3–5 hashtags.
4. **Hashtags** — 3–5, always including `#Shorts` only if it is a Short. More than 15 and YouTube ignores all of them.
5. **Spoken opening line** — say the question out loud in the first ten seconds. It is transcribed and indexed.

**A description template that follows this:**

```
<One-sentence plain answer to the question in the title.>

<Scripture reference written out, e.g. 2 Corinthians 5:17>

<150–300 words of the teaching's substance.>

Read the full teaching: https://lij.name.ng/<slug>/
Listen to it read aloud: https://lij.name.ng/listen/
All 371 teachings: https://lij.name.ng/teachings/

#BibleTeaching #NewCreation #Scripture
```

---

## 8. What to upload first

Do not upload 371 videos. The order matters more than the volume.

**Start with the seven teachings that already proved they have search demand.** Your
Search Console report showed *what is a sin cycle?* ranking **position 1**, and it is
already written as Day 366 — the article *What Is a Sin Cycle — and Where Does It Break?*
That is the strongest first video you have, because demand is measured rather than
guessed.

Sequence I would use:

1. **What Is a Sin Cycle — and Where Does It Break?** (Romans 7:19–20) — proved position 1
2. **The Prayer of Agreement: Two Are Better** (Matthew 18:19–20) — the `leg two agree` cluster
3. **Given to Every Man to Profit** (1 Corinthians 12:7) — high-intent, exact-phrase query
4. **When You Pray, Believe** (Mark 11:24)
5. **Clothed in Righteousness** (Isaiah 61:10)
6. **Where Two or Three Are Gathered** (Matthew 18:20)
7. **The Consciousness of Sin Produces the Cycle of Sin** — the companion to #1

Then let the data choose the rest. Every video description should link to the matching
article and to `/listen/`, because those are the two pages that convert a viewer into a
reader.

**One strategic note.** The 47 clusters in `SEARCH_INTENT_MAP.md` are a ready-made video
backlog — each one is a real query with zero clicks. That document is more useful to you
than any keyword tool, because it is your own traffic rather than an estimate.

---

## 9. Two honest cautions

**The channel is competing with your own site.** A YouTube video of a teaching can
outrank the article for the same query, which moves readers from a page you control onto
a platform you do not. The counter is to make the video a genuine excerpt and send
viewers to the article for the full text — which the template above does.

**No subscriber requirement exists for a new channel**, but the Community tab unlocks at
500 subscribers, and links in Shorts descriptions are limited. For the first few months
the only reliable discovery routes are search and the site itself. Consider adding a
YouTube link to the site's `/community/` page so the existing readers can find it —
that is a small code change, and this branch is active from `cfcaaf9`, so I can make it
if you want.

---

## Quick reference

| Field | Value |
|---|---|
| Channel name | Live In Jesus Name |
| Handle | @LiveInJesusName |
| Description | 820 / 1,000 chars — see section 3 |
| Profile picture | 800 × 800 (has 512 × 512, uploads fine) |
| Banner | 2560 × 1440, safe area 1546 × 423 |
| Watermark | 150 × 150 |
| Made for kids | No |
| First link | `https://lij.name.ng/teachings/` |
| First video | What Is a Sin Cycle — and Where Does It Break? |
