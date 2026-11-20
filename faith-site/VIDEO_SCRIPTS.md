# Video scripts — Live In Jesus Name

All **371 teachings**, each as two files. This pack was generated from the published
articles, so every script says what its teaching says.

---

## What is in this folder

```
index.csv                     every teaching: title, theme, scene count, length
<slug>.md                     the voiceover script — read this one
<slug>.json                   the VidLyrics spec — feed this to VidLyrics
```

`index.csv` opens in Excel, Numbers or Google Sheets. Sort it by `approx_minutes` if you
want to start with the shortest videos.

---

## How to use one

1. Open `index.csv`, pick a teaching.
2. Open `<slug>.md` to read what the narrator will say, scene by scene.
3. Hand `<slug>.json` to VidLyrics — it is a `vidlyrics.spec` v1 object.

Every scene uses `"duration": "auto"`, so VidLyrics times each scene from the Piper
voiceover rather than from a fixed guess. The voice is `en_US-lessac-medium` at 152 wpm.

**You still need VidLyrics and a Piper voice installed.** These are scripts and specs,
not rendered video. Nothing here produces an `.mp4` on its own.

---

## Shape of each video

Median **12 scenes · 1.3 minutes · 5.5 seconds per scene.**

| Scene | Layout | Content |
|---|---|---|
| 1 | `title` | The teaching and its scripture reference |
| 2–3 | `quote` | The theme scripture, read exactly |
| 4 | `caption` | The question the reader typed into Google |
| 5–6 | `bullets` | The central truth, split at its own turn |
| 7–8 | `quote` | The plain answer (53 teachings have one) |
| 9 | `bullets` | Four cross-references |
| 10 | `caption` | The reaffirmation |
| 11–12 | `quote` | The teaching's own declaration, to say aloud |
| 13 | `caption` | Where to read the full article |

Scene counts vary because long scripture and long declarations are split across
consecutive scenes rather than rushed through one.

---

## Themes

Nine themes are mapped by category, so each month of the slate keeps its own look:

| Category | Theme |
|---|---|
| New Creation & Identity | `nocturne` |
| The Holy Spirit | `aurora` |
| Faith | `sunset-drive` |
| Authority of the Believer | `mono-brutal` |
| The Word | `paper-light` |
| Prayer & Fasting | `cinema-classic` |
| Divine Health | `aurora` |
| Prosperity & Stewardship | `neon-circuit` |
| Righteousness & Grace | `nocturne` |
| Spiritual Warfare | `neon-circuit` |
| Redemption & His Return | `cinema-classic` |
| Christian Living | `karaoke-stage` |

---

## Regenerating these files

If an article is edited, the scripts must be regenerated — they are derived, not
hand-written. From a clone of the repository:

```bash
cd faith-site
npm ci
npm run video:scripts        # rewrites this whole folder
npm run test:video           # validates all 371 specs
```

Single teaching:

```bash
npm run video:scripts -- --day 366
npm run video:scripts -- --slug what-is-a-sin-cycle-and-where-does-it-break
```

**Do not hand-edit the generated files.** The next run overwrites them. To change what a
video says, edit the article's frontmatter and regenerate.

---

## Publishing order

Do not publish all 371 at once. Roughly eight hours of narration, and YouTube rewards
consistency over volume.

Start with the seven teachings that already have proven search demand from the Search
Console report — beginning with *What Is a Sin Cycle — and Where Does It Break?*, which
ranked position 1. The full suggested order is in `youtube-channel-kit.md` in the
repository root.
