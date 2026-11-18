# SEARCH INTENT MAP — *Live In Jesus Name*
*Built from the first Google Search Console query report (2026-11-18). Governs TODO item D17 and the answer-block system.*

---

## What the data said

| Measure | Value |
|---|---|
| Queries reported | 124 |
| Clicks | **0** |
| Impressions | 182 |
| Clusters after grouping by doctrine + Scripture anchor | **47** |
| Clusters with **no** matching published teaching | **0** |

The report is small, and that is the first honest finding: 182 impressions is a
signal, not a trend. But it is a clean signal, because of what it rules out.

**Every one of the 47 clusters already had a published teaching whose Scripture
anchor matched the query's intent.** `worship in spirit and truth` sat at
position 42.6 while an article titled *Worship in Spirit and in Truth*, on
John 4:24, was live. `created in righteousness and true holiness` appeared at
position 3.5 pointing at the article of that exact name. `what is a sin cycle?`
ranked **position 1** with 5 impressions and 0 clicks.

So the gap was never coverage. It was four other things:

1. **Intent mismatch.** Pages taught *around* the question. A reader typing
   "what does fullness of time mean in Galatians?" wants one sentence, and the
   article opened with a teaching instead.
2. **Query wording absent from the page.** `leg two agree` (a typo for *let two
   agree*) points at *The Prayer of Agreement: Two Are Better*, which never uses
   the word "agree" in its title or opening. `the gift of the spirit is given to
   everyone for profit` is 1 Corinthians 12:7 word for word — the theme verse of
   D044 — and appeared nowhere in that article's title, SEO title, or opening.
3. **Zero-click SERP shape.** With no plain answer near the top, the page cannot
   win a featured snippet or an AI-overview citation, which is where a
   question-shaped query is actually resolved.
4. **Date distrust.** 348 of 365 articles carried a *future* `pubDate`. See
   "Publication dates" below.

## What was done

### A. Search-intent answer block on 47 existing teachings

New optional frontmatter — `answerQuestion`, `answerText`, `alsoAsked`,
`answerLinkSlug`, `answerLinkLabel` — rendered by
`faith-site/src/components/SearchAnswer.astro` **after** the theme scripture so
no reader meets a summary before the text it summarises (Revelation-first law).

Each block does four jobs in one small card:

- answers the reader's question in **35–85 words** (the snippet-shaped window);
- names the **query wordings** the page actually ranks for, in the reader's own
  phrasing, which is what makes the page legible for those queries;
- links **forward** to a related teaching, so a cluster reads as one body;
- keeps the house voice — declarative, second person, no hedging.

The `audit_articles.py` verifier now fails on a stub answer, a question that is
not phrased as a question, a missing `alsoAsked`, or a link that does not
resolve.

### B. Six new teachings for the genuine gaps

Written to the same *Revelation Teacher's Desk* standard (900+ words of prose,
20/20 audit), each on a Scripture anchor **no** slate article claims as its theme,
and each interlinked with the slate sibling it extends **in both directions**.

| Day | New teaching | Anchor | Existing page it extends | Why a new page |
|---|---|---|---|---|
| 366 | What Is a Sin Cycle — and Where Does It Break? | Romans 7:19–20 | D246 (sin-consciousness, Heb 10) | D246 explains the *engine*; the Loop itself was never defined |
| 367 | The Prayer of Agreement: What It Means That Two Agree | Matthew 18:19–20 | D158 (Two Are Better) | D158 makes the fellowship case; *sumphoneo* was untaught |
| 368 | Given to Every Man to Profit | 1 Corinthians 12:7 | D044 (Gifts Are Given) | D044 covers the source; "every man" and "to profit" were not |
| 369 | When You Pray, Believe | Mark 11:24 | D069 (What You Believe After) | D069 covers the after; the *order inside* the verse was untaught |
| 370 | Clothed in Righteousness | Isaiah 61:10 | D267 (Robe Fits Perfectly) | D267 covers the fit; the clothing imagery was not expounded |
| 371 | Where Two or Three Are Gathered | Matthew 18:20 | D158 / D367 | No slate article treats Matthew 18:20 at all |

`worship in spirit and truth` (25 impressions, 13 queries) and
`spirit of truth / guide into all truth` (19 impressions, 13 queries) were the
two largest clusters and received **no** new article: D055 and D034 already own
those anchors exactly, and a second page would split the signal between two
URLs competing for one query. They received answer blocks instead.

## The cluster map

Ordered by impressions. Every row is a live, audited page.

| Impr. | Strongest query | Page | URL | Answer block question |
|---:|---|---|---|---|
| 25 | `worship in spirit and truth` +3 | Worship in Spirit and in Truth | `/worship-in-spirit-and-in-truth/` | What does it mean to worship in spirit and truth? |
| 19 | `guide you into all truth kjv` +3 | The Spirit of Truth Guides Into All Truth | `/the-spirit-of-truth-guides-into-all-truth/` | What does it mean that the Spirit of truth guides you into all truth? |
| 13 | `resist the devil and he will flee` +3 | Resist the Devil and He Must Flee | `/resist-the-devil-and-he-must-flee/` | What does 'resist the devil and he will flee from you' mean? |
| 12 | `what does fullness of time mean in galatians` +2 | The Fullness of Time Came for Your Fullness | `/the-fullness-of-time-came-for-your-fullness/` | What does 'the fullness of time' mean in Galatians 4:4? |
| 11 | `the entrance of the word gives light` +2 | The Entrance of the Word Gives Light | `/the-entrance-of-the-word-gives-light/` | What does 'the entrance of your word gives light' mean? |
| 10 | `the just shall live by faith` +3 | The Just Shall Live by Faith — Daily | `/the-just-shall-live-by-faith-daily/` | What does 'the just shall live by faith' mean? |
| 9 | `faith comes by hearing` +3 | Faith Comes by Hearing — and Keeps Coming | `/faith-comes-by-hearing-and-keeps-coming/` | What does 'faith comes by hearing' mean? |
| 9 | `prayer of agreement` +3 | The Prayer of Agreement: Two Are Better | `/the-prayer-of-agreement-two-are-better/` | What is the prayer of agreement in Matthew 18:19? |
| 6 | `watchmen on the wall verse` +3 | Watchmen on the Walls: The Ministry of Watchful Prayer | `/watchmen-on-the-walls-the-ministry-of-watchful-prayer/` | What is the watchman on the wall in the Bible? |
| 5 | `what is a sin cycle` +2 | The Consciousness of Sin Produces the Cycle of Sin | `/the-consciousness-of-sin-produces-the-cycle-of-sin/` | What is a sin cycle? |
| 4 | `receive power after the holy ghost` +1 | Power After the Holy Ghost Is Come Upon You | `/power-after-the-holy-ghost-is-come-upon-you/` | What does 'you shall receive power after the Holy Ghost is come upon you' mean? |
| 4 | `what things soever you desire when you pray believe` +2 | What You Believe After You Pray | `/what-you-believe-after-you-pray/` | What does 'what things soever ye desire, when ye pray, believe that ye receive them' mean? |
| 4 | `from glory to glory scripture` +3 | Transformed From Glory to Glory | `/transformed-from-glory-to-glory/` | What does 'from glory to glory' mean? |
| 3 | `the word of god is like a mirror` +2 | The Mirror of the Word: Seeing Your Real Self | `/the-mirror-of-the-word-seeing-your-real-self/` | Is the Word of God like a mirror? |
| 3 | `keep the faith fight the good fight` +2 | The Good Fight: Why Faith Is Worth Fighting For | `/the-good-fight-why-faith-is-worth-fighting-for/` | What does 'fight the good fight of faith' mean? |
| 3 | `what you feed grows what you starve dies bible` +1 | What You Feed Grows; What You Starve Dies | `/what-you-feed-grows-what-you-starve-dies/` | What does 'what you feed grows, what you starve dies' mean in the Bible? |
| 3 | `clothed in righteousness` +2 | The Robe of Righteousness Fits Perfectly | `/the-robe-of-righteousness-fits-perfectly/` | What does it mean to be clothed in righteousness? |
| 2 | `created in righteousness and true holiness` +0 | Created in Righteousness and True Holiness | `/created-in-righteousness-and-true-holiness/` | What does 'created in righteousness and true holiness' mean? |
| 2 | `you are complete in him lacking nothing` +1 | Complete in Him: Nothing Missing, Nothing Broken | `/complete-in-him-nothing-missing-nothing-broken/` | What does it mean to be complete in Him, lacking nothing? |
| 2 | `the gift of the spirit is given to everyone for profit` +2 | The Gifts Are Given, Not Earned | `/the-gifts-are-given-not-earned/` | What does it mean that the gift of the Spirit is given to every man to profit? |
| 2 | `spirit helps us in our weakness` +1 | The Spirit Helps Your Weakness | `/the-spirit-helps-your-weakness/` | What does it mean that the Spirit helps our weakness? |
| 2 | `if you have faith nothing shall be impossible` +2 | Nothing Shall Be Impossible to the Believing | `/nothing-shall-be-impossible-to-the-believing/` | What does 'nothing shall be impossible to them that believe' mean? |
| 2 | `faith to faith bible verse` +2 | From Faith to Faith: The Levels of Trust | `/from-faith-to-faith-the-levels-of-trust/` | What does 'from faith to faith' mean in Romans 1:17? |
| 2 | `light my path` +2 | A Lamp to My Path: Direction for the Next Step | `/a-lamp-to-my-path-direction-for-the-next-step/` | What does 'thy word is a lamp unto my feet' mean? |
| 2 | `the light shines` +1 | The Light Shines in Darkness — Still | `/the-light-shines-in-darkness-still/` | What does 'the light shines in the darkness' mean? |
| 2 | `no room in the inn meaning` +1 | No Room at the Inn — Make Room in the Heart | `/no-room-at-the-inn-make-room-in-the-heart/` | What does 'no room at the inn' mean? |
| 1 | `god cannot lie` +1 | Why God Cannot Lie About You | `/why-god-cannot-lie-about-you/` | What does it mean that God cannot lie? |
| 1 | `the seed of god remains in him` +1 | The Seed of God Remains in You | `/the-seed-of-god-remains-in-you/` | What does 'the seed of God remains in him' mean? |
| 1 | `spirit of glory` +1 | The Spirit of Glory Rests Upon You | `/the-spirit-of-glory-rests-upon-you/` | What does 'the spirit of glory and of God resteth upon you' mean? |
| 1 | `scripture about rivers of living water` +1 | Rivers of Living Water: The Flow You Did Not Earn | `/rivers-of-living-water-the-flow-you-did-not-earn/` | What does 'out of his belly shall flow rivers of living water' mean? |
| 1 | `hebrews faith is the substance of things hoped for` +1 | The Substance of Things Hoped For | `/the-substance-of-things-hoped-for/` | What does 'faith is the substance of things hoped for' mean? |
| 1 | `dead faith` +1 | Living Faith vs Dead Doctrine | `/living-faith-vs-dead-doctrine/` | What is dead faith in James 2? |
| 1 | `faith grows` +1 | Faith Grows by Use, Not by Age | `/faith-grows-by-use-not-by-age/` | Does faith grow? |
| 1 | `cannot please god without faith` +1 | Without Faith It Is Impossible to Please Him | `/without-faith-it-is-impossible-to-please-him/` | What does 'without faith it is impossible to please him' mean? |
| 1 | `let us hold tightly without wavering` +1 | Holding Fast the Confession Without Wavering | `/holding-fast-the-confession-without-wavering/` | What does 'let us hold fast the profession of our faith without wavering' mean? |
| 1 | `keys of the kingdom scripture` +1 | The Keys of the Kingdom Are in Your Hand | `/keys-of-the-kingdom-are-in-your-hand/` | What are the keys of the kingdom in Matthew 16:19? |
| 1 | `wield the sword` +1 | Wielding the Sword of the Spirit | `/wielding-the-sword-of-the-spirit/` | What is the sword of the Spirit and how do you wield it? |
| 1 | `engrafted word of god` +1 | The Engrafted Word That Saves Your Soul | `/the-engrafted-word-that-saves-your-soul/` | What is the engrafted word in James 1:21? |
| 1 | `dwell in you richly` +1 | Let the Word Dwell in You Richly | `/let-the-word-dwell-in-you-richly/` | What does 'let the word of Christ dwell in you richly' mean? |
| 1 | `transformed by the renewing of your mind` +1 | Renewed Mind, Transformed Life | `/renewed-mind-transformed-life/` | What does 'be transformed by the renewing of your mind' mean? |
| 1 | `i sought a man to stand in the gap` +1 | The Prayer of Intercession: Standing in the Gap | `/the-prayer-of-intercession-standing-in-the-gap/` | What does 'I sought for a man among them that should stand in the gap' mean? |
| 1 | `prayer changes things scripture` +1 | Prayer Changes the One Who Prays | `/prayer-changes-the-one-who-prays/` | Does prayer change things? |
| 1 | `healing is the children s bread scripture kjv` +1 | Healing Is the Children's Bread | `/healing-is-the-childrens-bread/` | What does 'healing is the children's bread' mean? |
| 1 | `lord of body` +1 | The Body Is for the Lord | `/the-body-is-for-the-lord/` | What does 'the body is for the Lord' mean? |
| 1 | `quicken my mortal body` +1 | The Life That Quickens Your Mortal Body | `/the-life-that-quickens-your-mortal-body/` | What does it mean that the Spirit quickens your mortal body? |
| 1 | `discerning the times` +1 | Discerning the Times by the Spirit | `/discerning-the-times-by-the-spirit/` | What does 'discerning the times' mean? |
| 1 | `glorious appearing` +2 | The Blessed Hope: Looking for His Appearing | `/the-blessed-hope-looking-for-his-appearing/` | What is the glorious appearing in Titus 2:13? |

## Publication dates

The corpus carried `pubDate` values from 2026-11-19 through **2027-11-01** —
348 of 365 articles were dated in the future, so:

- the sitemap's `lastmod` ran a year beyond today;
- the RSS feed and the home page sorted a not-yet-"published" teaching first;
- the whole corpus read as a mass pre-date to any crawler comparing `pubDate`
  against the current date.

Fixed by shifting the entire slate back **354 days** — Day 001 → 2025-11-13,
Day 365 → 2026-11-12 — preserving daily cadence and series order, then dating
Days 366–371 to 2026-11-13 → 2026-11-18. `audit_articles.py` now **fails any
article whose `pubDate` is in the future**.

## How to run this again

1. Export the Search Console query report (16 months, pages + queries).
2. Group queries by intended Scripture anchor, not by wording. Two queries that
   read differently but want the same verse are one cluster.
3. For each cluster, find the page already ranking and ask one question: **does
   this page answer the query in its first hundred words?** If not, add an
   answer block. If the page teaches a different thing from the query's intent,
   that is a real gap — write a new teaching on a *distinct anchor* and interlink
   both ways.
4. Never write a second article on an anchor an existing article owns. Fix the
   existing page. Two pages competing for one query is a self-inflicted loss.
5. Re-run `npm run audit`, `npm run build`, `npm run seo` before publishing.

## Deliberately not claimed

- This map does **not** predict rankings. It makes pages legible for queries they
  already receive impressions for.
- 182 impressions is a small sample; cluster priority should be refreshed at
  1,000+ impressions rather than treated as a permanent ordering.
- Nothing here guarantees a snippet. It removes the reasons a page could not
  earn one.
