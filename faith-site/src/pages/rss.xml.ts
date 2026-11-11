import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../data/site';

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles')).sort(
    (a, b) => b.data.day - a.data.day
  );

  return rss({
    title: `${SITE.name} — Teachings`,
    description: SITE.mission,
    site: context.site || SITE.url,
    items: articles.map((entry) => ({
      title: entry.data.title,
      pubDate: new Date(`${entry.data.pubDate}T00:00:00Z`),
      description: entry.data.description,
      categories: [entry.data.category, ...entry.data.tags],
      link: `/${entry.data.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
