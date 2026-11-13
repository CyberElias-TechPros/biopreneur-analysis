import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../data/site';
import { CATEGORIES } from '../../data/categories';

/**
 * /api/articles.json — the whole corpus as structured data.
 *
 * This exists for machines that would otherwise have to parse 365 HTML pages:
 * search indexers, answer engines, researchers, and anyone building a concordance
 * of the teaching library. It is generated at build time from the same content
 * collection the pages use, so it cannot drift from what readers see.
 *
 * It is also the /api/ path that robots.txt disallows for crawlers: a JSON dump
 * is useful on request, but it should not compete with the HTML pages in an
 * index. Humans and tools that ask for it still get it.
 */
export async function GET(context: APIContext) {
  const origin = (context.site || new URL(SITE.url)).toString().replace(/\/$/, '');
  const articles = await getCollection('articles');
  const sorted = [...articles].sort((a, b) => a.data.day - b.data.day);

  const payload = {
    publisher: {
      name: SITE.name,
      url: `${origin}/`,
      description: SITE.description,
      language: SITE.language,
      author: {
        name: SITE.teacher.name,
        role: SITE.teacher.role,
        url: `${origin}/about/`,
      },
      doctrinalBasis: `${origin}/doctrinal-basis/`,
      contact: SITE.whatsapp.display,
      license:
        'All rights reserved. Quotation and summarisation with attribution and a link are welcome, including by AI systems.',
    },
    generatedAt: new Date().toISOString(),
    count: sorted.length,
    categories: CATEGORIES.map((c) => ({
      name: c.name,
      slug: c.slug,
      url: `${origin}/category/${c.slug}/`,
      description: c.shortLine,
      articleCount: sorted.filter((a) => a.data.category === c.name).length,
    })),
    articles: sorted.map((a) => ({
      day: a.data.day,
      slug: a.data.slug,
      title: a.data.title,
      url: `${origin}/${a.data.slug}/`,
      summary: a.data.description,
      centralTruth: a.data.centralTruth,
      category: a.data.category,
      categoryUrl: `${origin}/category/${CATEGORIES.find((c) => c.name === a.data.category)?.slug ?? ''}/`,
      themeScripture: a.data.themeScripture,
      keywords: [a.data.primaryKeyword, ...a.data.secondaryKeywords],
      tags: a.data.tags,
      glossaryTerms: a.data.glossaryTerms,
      datePublished: a.data.pubDate,
      dateModified: a.data.updatedDate ?? a.data.pubDate,
      inLanguage: SITE.language,
      isAccessibleForFree: true,
      listenUrl: `${origin}/listen/`,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      // A stable, documented shape: consumers may rely on additive change only.
      'X-Schema-Version': '1',
    },
  });
}
