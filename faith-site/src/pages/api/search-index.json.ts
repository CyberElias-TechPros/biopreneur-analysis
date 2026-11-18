import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

/**
 * /api/search-index.json — a compact, build-time index for the site-wide search.
 *
 * Why a generated index instead of scanning the DOM: the teachngs list page
 * renders all 371 rows, so filtering there is just `display: none`. That page is
 * the only place search worked. A reader three paragraphs into an article had no
 * way to look anything up. This endpoint gives the header search a small payload
 * it can fetch once, on first use, and query in memory.
 *
 * Fields are deliberately short — `s`lug, `t`itle, `r`eference, `c`ategory,
 * `d`escription, `k`eywords — because this file is fetched over connections that
 * are sometimes slow, and every byte here is a byte a reader waits for.
 *
 * The index is generated from the same content collection the pages use, so it
 * cannot drift from what is published. It is disallowed to crawlers in
 * robots.txt: it is a client-side convenience, not a page to be indexed.
 */
export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const sorted = [...articles].sort((a, b) => a.data.day - b.data.day);

  const items = sorted.map((entry) => {
    const d = entry.data;
    return {
      s: d.slug,
      t: d.title,
      r: `${d.themeScripture.reference}`,
      c: d.category,
      d: d.description,
      k: [d.primaryKeyword, ...d.secondaryKeywords.slice(0, 3), ...d.tags].join(', '),
      y: d.day,
    };
  });

  const body = JSON.stringify({
    version: 1,
    generatedAt: new Date().toISOString(),
    count: items.length,
    items,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
