import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../data/site';
import { renderMarkdown } from '../lib/markdown';

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles')).sort(
    (a, b) => b.data.day - a.data.day
  );

  return rss({
    title: `${SITE.name} — Teachings`,
    description: SITE.mission,
    site: context.site || SITE.url,
    items: await Promise.all(
      articles.map(async (entry, index) => {
        // Full prose only (the audit pack below the prose is not reader-facing).
        // The 30 most recent entries carry their complete teaching body; older
        // entries stay description-only so the feed stays fast for subscribers.
        const prose = (entry.body || '').split('<!-- END-PROSE -->')[0];
        const content = index < 30 ? await renderMarkdown(prose) : undefined;
        return {
          title: entry.data.title,
          pubDate: new Date(`${entry.data.pubDate}T00:00:00Z`),
          description: entry.data.description,
          categories: [entry.data.category, ...entry.data.tags],
          author: SITE.teacher.name,
          link: `/${entry.data.slug}/`,
          ...(content ? { content } : {}),
          customData: `<dc:creator>${SITE.teacher.name}</dc:creator>`,
        };
      })
    ),
    customData: `<language>en-us</language><copyright>© ${new Date().getUTCFullYear()} ${SITE.name}</copyright>`,
    xmlns: {
      content: 'http://purl.org/rss/1.0/modules/content/',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
  });
}
