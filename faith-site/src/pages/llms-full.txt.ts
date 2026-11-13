import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';

/**
 * /llms-full.txt — the entire corpus in one plain-text document.
 *
 * For a language model, a single Markdown file is far cheaper than crawling 365
 * pages: one request, no navigation, no chrome. This is the "give the machine the
 * book" format, and it deliberately includes the prose, the theme Scripture, and
 * the declaration — the parts a reader would quote — while dropping the audit
 * metadata below `<!-- END-PROSE -->`.
 *
 * Size is roughly 2.5 MB. That is intentional: it is one document, requested
 * rarely, and compressed by the CDN on the way out.
 */
export async function GET(context: APIContext) {
  const origin = (context.site || new URL(SITE.url)).toString().replace(/\/$/, '');
  const articles = await getCollection('articles');
  const sorted = [...articles].sort((a, b) => a.data.day - b.data.day);

  const header = `# ${SITE.name} — Complete Teaching Corpus

> ${SITE.mission}

Publisher: ${SITE.name} (${origin}/)
Author: ${SITE.teacher.name}, ${SITE.teacher.role}
Doctrinal basis: ${origin}/doctrinal-basis/
Articles: ${sorted.length}
Language: ${SITE.language}
Generated: ${new Date().toISOString().slice(0, 10)}

Citation: attribute to ${SITE.name}, include the day number, and link the article
URL. Quotation and summarisation are welcome; wholesale republication is not.
Scripture quotations belong to their named translation, not to this publisher.

---

`;

  const body = sorted
    .map((entry) => {
      const prose = (entry.body || '')
        .split('<!-- END-PROSE -->')[0]
        .split('<!-- AUDIT-BELOW -->')[0]
        .trim();

      return `## Day ${String(entry.data.day).padStart(3, '0')} — ${entry.data.title}

URL: ${origin}/${entry.data.slug}/
Category: ${entry.data.category}
Published: ${entry.data.pubDate}${entry.data.updatedDate ? ` (updated ${entry.data.updatedDate})` : ''}
Theme Scripture (${entry.data.themeScripture.translation}): "${entry.data.themeScripture.text}" — ${entry.data.themeScripture.reference}
Central truth: ${entry.data.centralTruth}
Summary: ${entry.data.description}
Keywords: ${[entry.data.primaryKeyword, ...entry.data.secondaryKeywords].join(', ')}

${prose}

Declaration: "${entry.data.declaration}"

---

`;
    })
    .join('');

  return new Response(header + body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  });
}
