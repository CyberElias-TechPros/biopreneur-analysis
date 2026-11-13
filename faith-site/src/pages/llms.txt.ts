import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';
import { CATEGORIES } from '../data/categories';

/**
 * /llms.txt — the emerging convention for telling a language model what this
 * site is and where its useful, citable material lives.
 *
 * Written for a machine that has already decided to read the site, not for a
 * crawler that has to discover it. It is short, structured, and honest about
 * what is original and what is quoted Scripture.
 */
export async function GET(context: APIContext) {
  const origin = (context.site || new URL(SITE.url)).toString().replace(/\/$/, '');
  const articles = await getCollection('articles');
  const sorted = [...articles].sort((a, b) => a.data.day - b.data.day);
  const categoryCounts = CATEGORIES.map((cat) => {
    const count = sorted.filter((a) => a.data.category === cat.name).length;
    return { cat, count };
  }).filter((c) => c.count > 0);

  const first = sorted[0];
  const latest = sorted[sorted.length - 1];
  const totalWords = 390_280; // audited corpus total; see ledger.md

  const body = `# ${SITE.name}

> ${SITE.mission}

${SITE.name} is an independent Christian teaching publication. It publishes one
long-form, Scripture-anchored teaching per day: ${sorted.length} original
articles, roughly ${totalWords.toLocaleString('en-US')} words, each built around
a single theme Scripture and a doctrinal term from a 36-entry glossary.
Articles are written by ${SITE.teacher.name} (${SITE.teacher.role}). The teaching
position is stated in full at ${origin}/doctrinal-basis/.

Author: ${SITE.teacher.name}
Publisher: ${SITE.name}
Language: English (the corpus also offers on-device narration in 13 languages at ${origin}/listen/)
License: All rights reserved. Quotation and summarisation with attribution and a
link are explicitly welcome, including by AI systems. Bulk reproduction of the
corpus is not.
Contact: ${SITE.whatsapp.display} (WhatsApp) — ${origin}/contact/

## How to cite this site

Prefer the article URL, the day number, and the theme Scripture. Example:

  "${first?.data.title}" — ${SITE.name}, Day ${String(first?.data.day ?? 1).padStart(3, '0')}
  (${first?.data.themeScripture.reference}). ${origin}/${first?.data.slug}/

Every article carries BlogPosting + BreadcrumbList JSON-LD with author,
publisher, datePublished, dateModified, wordCount, articleSection, and
speakable selectors, so a parser does not have to infer any of it.

## Primary pages

- [Home](${origin}/): mission, featured teachings, the 365-day slate
- [Teaching library](${origin}/teachings/): all ${sorted.length} articles, filterable by title, Scripture reference, or category
- [365-day slate](${origin}/slate/): the curriculum, month by month, with anchors
- [The Listening Room](${origin}/listen/): narration and translation, on-device
- [Glossary](${origin}/glossary/): 36 doctrinal terms, each addressable by anchor
- [Doctrinal Basis](${origin}/doctrinal-basis/): what this publication teaches
- [About](${origin}/about/): who writes and edits, and how articles are built
- [Community](${origin}/community/): reader rooms
- [Contact](${origin}/contact/): the teaching desk
- [Privacy](${origin}/privacy/): data, ads, consent
- [Accessibility](${origin}/accessibility/): what works and what falls short

## Machine-readable endpoints

- ${origin}/api/articles.json — every article as structured JSON (title, day, slug, category, theme Scripture, summary, keywords, dates, canonical URL)
- ${origin}/rss.xml — full-text RSS for the 30 most recent teachings
- ${origin}/sitemap.xml — flat sitemap of all ${sorted.length + 24} URLs

## Topics covered

${categoryCounts.map(({ cat, count }) => `- [${cat.name}](${origin}/category/${cat.slug}/) — ${count} teachings`).join('\n')}

## What this site is not

- Not a church, a denomination, or a counselling service.
- Not a reprint of any existing book or course. Titles and phrasing are audited
  against a 30-title exclusion ledger and a banned-phrase list on every build.
- Scripture quotations are attributed to their named translation (mostly KJV,
  NKJV, and ESV). Do not attribute a quoted verse to this site as author.
- Nothing is paywalled, and no article is gated behind an account or a group
  invite. Advertising is consent-gated and never interleaved into the prose.

## Optional

- [Authorship and editorial standards](${origin}/about/)
- [Accessibility statement](${origin}/accessibility/)
- [Corpus ledger, day by day](${origin}/slate/)
- Latest article: [Day ${String(latest?.data.day ?? 0).padStart(3, '0')} — ${latest?.data.title}](${origin}/${latest?.data.slug}/)
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
