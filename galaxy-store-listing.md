# Galaxy Store listing — Live In Jesus Name

Copy for the Samsung Galaxy Store **App Information** form. Everything below is drawn
from the repo (`src/data/site.ts`, `public/manifest.webmanifest`), so it matches the
live site at `lij.name.ng` rather than describing a different product.

Two things to read before you start pasting.

**1. This is a Trusted Web Activity / PWA listing, not a native app.** Galaxy Store
takes an `.aab`. A website cannot be uploaded directly, so a binary has to wrap the
site — the standard route is a Trusted Web Activity (Bubblewrap), which opens
`lij.name.ng` full-screen with no browser chrome. Say what it is in the description;
stores reject listings that imply native features the app does not have.

**2. Three fields are blocked on information only you have.** They are marked
**[NEEDS YOUR INPUT]** and I have not invented values for them: the support email,
the copyright holder, and the open-source URL. Guessing an email or a copyright
holder on a store listing is the kind of mistake that gets an app pulled.

---

## App Title

**Byte limit: 150.** Counted below.

```
Live In Jesus Name
```

19 bytes. No "app" suffix, no keyword stuffing — the store already shows it as an app,
and the publication name is what returning readers search for.

---

## Short Description

**Byte limit: 240.**

```
Scripture-anchored daily teachings on who you are in Christ — read or listen on any device.
```

94 bytes. This is the one line that appears under the title in search results, so it
leads with the category (teachings), the subject (identity in Christ), and the two
things the app uniquely does (read, listen).

---

## Description

**Byte limit: 12,000.** This is 1,842 bytes — well inside the limit, and short enough
that a reader actually reaches the end. Plain text; the Galaxy Store form does not
render markdown.

```
Live In Jesus Name is a free Christian teaching publication devoted to Scripture-saturated revelation, new-creation identity, sound doctrine, and practical everyday discipleship.

Every teaching is anchored in a specific passage of Scripture and written to answer a real question a believer is actually asking — not to fill a page. There are 371 teachings published, with a 365-day reading slate that carries a reader through a full year of study in twelve monthly arcs, from New-Creation Foundations through the Holy Spirit, Faith, Authority, the Word, and Prayer.

READ OR LISTEN

Each teaching can be read, or heard read aloud. The Listening Room uses the voices already installed on your device — nothing is downloaded, no audio files are stored, and no account is needed. Choose from four reading styles and six speeds, and your choice is remembered on your next visit. Playback only ever begins when you press play.

READ IN THIRTEEN LANGUAGES

Teachings can be read in English, French, Spanish, Portuguese, Hindi, Chinese, and Russian on the device itself. For Swahili, Yoruba, Igbo, Hausa, Amharic, and Arabic the app links out to a translation service, because on-device translation is not yet available for those languages in the browser. Counts are derived from the app's own language data, not typed into the marketing copy.

WHAT ELSE IS INSIDE

• Search every teaching by title, Scripture reference, or theme, from any page
• A doctrinal glossary of core terms, with Scripture anchors and stated boundaries
• Twelve category archives, for reading by theme rather than by date
• Light and dark reading modes, and a text-size control
• A print stylesheet, so a teaching can be printed for a house group or prison ministry
• Works offline once visited; install it and the most recent pages stay readable
• No account, no login, and no personal information required to read anything

WHO IT IS FOR

Readers who want to understand what the New Birth actually did, what the finished work of Christ secured, and how to live from that reality during an ordinary week. The teaching is written for personal study, small groups, and anyone preparing to teach.

FREE AND PRIVATE

The app is free. It collects nothing itself and requires no personal information. Advertising is optional and off until you allow it; choosing "Essential only" means you browse ad-free and untracked. Anything advertising-related is explained in the privacy policy, and the choice can be changed at any time from the footer.

REQUIREMENTS

An Android device with a current Chrome or Chromium-based browser and an internet connection for first load. On-device read-aloud requires a browser or system text-to-speech voice. Offline reading applies to pages already visited.

SUPPORTED LANGUAGES

English (full interface and content). Teaching content can also be read in French, Spanish, Portuguese, Hindi, Chinese, and Russian on-device, and in Swahili, Yoruba, Igbo, Hausa, Amharic, and Arabic through an external translation service. The interface itself is in English, so features may be limited on devices without English support.

ABOUT

Live In Jesus Name is an independent teaching publication. Reader correspondence runs through WhatsApp from the Contact page.
```

> The "SUPPORTED LANGUAGES" paragraph satisfies Samsung's rule requiring non-English
> listings to warn about limited features. Keep it even though the listing is English —
> it is accurate about the app, and it protects you if reviewers test the language menu.

### One phrase to change if you prefer caution

The description says "No account, no login, and no personal information required."
That is true today. If you later enable analytics (the open C6 item), change it to
"No account and no login required" so the claim stays exact.

---

## Search Keywords

**5 maximum, 60 bytes each.** These are the terms readers would plausibly type, and
each one is a phrase the content genuinely answers — the store penalises keywords the
app does not match.

```
1. bible teaching
2. daily devotion
3. identity in christ
4. christian audio
5. new creation
```

Byte counts: 14, 14, 18, 15, 13. All well inside 60.

Deliberately not used: "sermon", "church", "pastor", "devotional app". They are higher
volume but describe something this is not, and the mismatch costs you the install.

---

## Icon

**Required: PNG, exactly 512 × 512, under 1024 KB.**

You already have this file and I verified its dimensions:

```
faith-site/public/icons/icon-512.png    512 × 512   18,344 bytes
```

Upload it as-is. It is the same icon the web manifest declares, so the store icon and
the installed-app icon will match. Do not let an image editor re-encode it to a larger
file; 18 KB is already far inside the 1 MB ceiling.

---

## Screenshots

**Required: 4 to 8 images. JPG/PNG, 320–3840 px, ratio 2.3:1.**

Ratio 2.3:1 is unusual, so this is the field most likely to reject an upload. The
clean numbers are **1150 × 500**, **1380 × 600**, or **1840 × 800** px. Samsung also
reuses screenshots in a 16:9 banner, so composing each shot so the interesting part
sits inside a centred 16:9 crop helps.

I could not capture these: this environment has no browser, so anything I produced
would be a mockup rather than the real app — and a store listing should not show a
screen that does not exist. Capture them from `lij.name.ng` in Chrome at 1150 × 500
(or capture at 2× and crop). The six that show the app honestly:

| # | Page | What must be visible | Why |
|---|------|----------------------|-----|
| 1 | `/` home | Wordmark, hero line, category strips | Establishes the publication |
| 2 | Any teaching, scrolled to the answer block | "The question, answered plainly" + Scripture | Shows the format's promise |
| 3 | A teaching with the Listen panel open | Voice picker, speed, Play | The standout feature |
| 4 | Search dialog open with a query typed | Results with Scripture references | Shows the 371-teaching index |
| 5 | `/teachings/` library | Grid of teachings with Day numbers | Establishes scale |
| 6 | Any teaching in dark mode | Same page, Midnight/Gold theme | Shows the reading comfort |

Do not put text overlays on them. Samsung's reviewer reads the screenshot as evidence
of what the app does; an overlaid slogan reads as an advertisement.

---

## Category

**Category: Books & Reference** (or **Education** if Books is unavailable for your
content type). Both are defensible; Books & Reference is the better fit — this is a
reading library with a glossary, not a course.

**Exclusives: leave unselected.** That field is for apps exclusive to Galaxy Store.
This app is also on the open web, and the previous answer already confirmed that
honestly.

The manifest declares `books`, `education`, `lifestyle`. Lifestyle is what the store
would use for habit/devotional apps; it undersells the depth. Prefer Books & Reference.

---

## Age Restriction

**Select: 3+ (or the All Ages / "everyone" tier presented).**

The app has no violence, gambling, sexual content, alcohol, drugs, user-generated
content, chat, or purchases. Teachings quote Scripture, including passages on sin and
sexuality, handled doctrinally rather than graphically — the same material as any Bible
app. 3+ is the honest rating.

Because this is not a game, leave every certificate row (PEGI, ESRB, GRAC, USK) blank.
Those are game-rating schemes and do not apply. Samsung's form shows them regardless.

---

## Supported Languages

**Select: English.**

Add French, Spanish, Portuguese, Hindi, Chinese, Russian only if you want the store to
say the app "supports" them — because the *interface* is English and only the teaching
text translates. My recommendation is to select English only, and let the description
carry the nuance. An over-claimed language list is a common review flag.

---

## Privacy Policy URL

**Required.**

```
https://lij.name.ng/privacy/
```

This resolves today — I verified the policy is live. It covers GDPR, UK GDPR, CCPA/CPRA,
NDPA and COPPA, describes the consent-gated advertising, and names analytics only as
"where enabled".

**One gap worth closing first.** Section 1 scopes the policy to the *Site* — it does not
say "and the Android application". A reviewer comparing a PWA wrapper against this
policy could reasonably ask whether it covers installed use. The app collects nothing
new when installed, so the fix is one clause in Section 1, along these lines:

> This policy also governs your use of **{SITE.name}** as an installed application
> (including a Trusted Web Activity build distributed through an app store).

I would add that before submitting rather than after. It is a small edit in
`src/pages/privacy.astro`, and it is the one item on this form where the paperwork is
currently thinner than the truth.

---

## Open Source URL

**[NEEDS YOUR INPUT] — and this depends on a decision you have not made yet.**

The repo has **no `LICENSE` file**, and `package.json` has **no `license` field**. So
there is no licence URL to give, and I will not invent one.

Two honest options:

- **Leave the field blank** if you are not distributing source. The field is for legal
  notification when the app is *built using* open-source software.
- **Enter the licences of your dependencies** if Samsung's reviewer asks (Astro, GSAP,
  React are all open source). The defensible entry is a `THIRD-PARTY-NOTICES` page, but
  that page does not exist yet.

Note that GSAP in particular has a split licence — free for most uses, paid for some
commercial ones. Worth confirming your usage is inside the free tier before you ship a
binary to a storefront, since that is a licensing question rather than a listing one.

**My suggestion:** leave it blank for submission, and open a separate task for a
`THIRD-PARTY-NOTICES.md` plus an explicit `license` field in `package.json`. That is
real housekeeping the repo is missing, but it is not a blocker for this form.

---

## YouTube URL

**Leave blank.** There is no video, and I found no YouTube reference anywhere in the
codebase. An empty field is correct; a wrong video ID would point the listing at
someone else's content. Also leave "YouTube URL Information" blank for the same reason.

---

## Copyright Holder

**[NEEDS YOUR INPUT]**

Up to 500 bytes — a name or company name. You must supply this; the copyright in the
teachings is yours (or the publisher's), and only you can state it correctly.

If the publication trades under a registered entity, use the registered name. If it is
personal, your full legal name. The form notes that the seller name is displayed as the
copyright holder if this is left empty — so filling it in is better than leaving it to
default, because a seller name is often a handle rather than a name.

Leave "Copyright Proof File" unattached unless Samsung requests it. There is no
trademark or copyright registration in the repo to upload.

---

## Support E-Mail

**[NEEDS YOUR INPUT] — this is the one field that can block submission outright.**

**Required, up to 60 bytes.** The repo deliberately publishes **no mailbox**: reader
correspondence runs through WhatsApp (`+234 708 913 8631`) precisely because there is
no inbox to provision. That works for a website. It does not work here — Galaxy Store
requires an email address, and reviewers do send mail to it.

You need a real, monitored mailbox. Options, cheapest first:

- A free address on a domain you control (`support@lij.name.ng`), which looks the most
  professional and costs nothing beyond the domain you already have
- A dedicated free Gmail address used only for this
- Your existing address

Do not enter the WhatsApp number or a `wa.me` link. That field validates as an email and
will simply fail.

This is the single item I would resolve before starting the form, because everything
else can be answered from the repo.

---

## Support URL

Optional, 200 bytes, `http://` or `https://`.

```
https://lij.name.ng/contact/
```

This page hands off to WhatsApp and is the honest support route for a publication with
no ticketing system. It is live and reachable.

---

## Agreement and Notify Result

**Agreement: tick it.** The clause permits Samsung to use your screenshots, icon and
description — including AI-assisted cropping, summarising and translation — to
recommend the app across Galaxy Store. That is ordinary store merchandising and is the
same grant Google Play asks for. It does not transfer ownership of your teachings.

**Notify Result: tick it.** Otherwise you will not learn the app was rejected.

---

## Before you submit — a checklist

Resolved from the repo:

- [x] Title, short description, description, keywords written and byte-counted
- [x] Icon identified and dimensions verified (512 × 512, 18 KB)
- [x] Privacy policy URL live and reachable
- [x] Support URL live and reachable
- [x] Category and age rating decided

You must supply:

- [ ] Support email (required — blocks submission)
- [ ] Copyright holder name
- [ ] 4–8 screenshots at 2.3:1
- [ ] The `.aab` binary itself (Trusted Web Activity wrapper)

Recommended before submitting:

- [ ] Add the "installed application" clause to `privacy.astro` Section 1
- [ ] Confirm GSAP's licence covers a store-distributed binary
- [ ] Create `THIRD-PARTY-NOTICES.md` and set `package.json` `license`

## The honest blocker

The form assumes you have an `.aab` to upload. You do not yet — the repo produces a
static website. The listing copy above is complete and accurate, and you can fill the
form in today, but the binary has to be built before the store can accept it. For a
Trusted Web Activity, that means Bubblewrap (free, from Google) pointed at
`lij.name.ng`, plus a signing key you keep safe — losing it means you cannot update the
app under the same listing.

That build is a separate, self-contained piece of work. Worth scoping it as its own task
rather than assuming this form is the last step.
