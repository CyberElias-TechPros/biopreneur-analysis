/**
 * Shared sitemap helpers.
 *
 * `@astrojs/sitemap` discovers routes at build time; this module supplies the
 * per-route `lastmod`, `changefreq`, and `priority` values so crawlers see
 * accurate freshness signals for every URL instead of a flat sitemap.
 *
 * Article dates are read directly from `articles/*.md` frontmatter at build
 * time (no Astro content-collection dependency), keeping this usable from
 * `astro.config.mjs`.
 */
import fs from 'node:fs';
import path from 'node:path';

export interface RouteMeta {
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface ArticleDateInfo {
  published: string;
  modified: string;
}

const ARTICLE_DIR = path.resolve(process.cwd(), 'articles');

let cachedArticles: Map<string, ArticleDateInfo> | null = null;

/** Parse `slug`, `pubDate`, and `updatedDate` out of each article's frontmatter. */
export function getArticleDates(): Map<string, ArticleDateInfo> {
  if (cachedArticles) return cachedArticles;

  const map = new Map<string, ArticleDateInfo>();
  if (!fs.existsSync(ARTICLE_DIR)) {
    cachedArticles = map;
    return map;
  }

  for (const file of fs.readdirSync(ARTICLE_DIR)) {
    if (!file.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(ARTICLE_DIR, file), 'utf-8');
    const fmEnd = raw.indexOf('\n---', 4);
    const frontmatter = fmEnd === -1 ? raw : raw.slice(0, fmEnd);
    const slug = frontmatter.match(/^slug:\s*["']?([a-z0-9-]+)["']?\s*$/m)?.[1];
    const pubDate = frontmatter.match(/^pubDate:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1];
    const updated = frontmatter.match(/^updatedDate:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1];
    if (!slug || !pubDate) continue;
    map.set(slug, { published: pubDate, modified: updated || pubDate });
  }

  cachedArticles = map;
  return map;
}

function latestArticleDate(dates: Map<string, ArticleDateInfo>): string | undefined {
  let latest: string | undefined;
  for (const info of dates.values()) {
    if (!latest || info.modified > latest) latest = info.modified;
  }
  return latest;
}

/**
 * Priority/changefreq policy:
 *   1.0 home · 0.9 article pages & teachings library · 0.8 category hubs
 *   0.7 slate & glossary · 0.5 about/doctrinal/contact · 0.3 privacy/legal
 */
export function routeMetaFor(pathname: string): RouteMeta {
  const dates = getArticleDates();
  const latest = latestArticleDate(dates);
  const raw = pathname.replace(/^https?:\/\/[^/]+/, '');
  const url = raw.replace(/\/+$/, '') || '/';
  const segments = url.split('/').filter(Boolean);
  const slug = segments[0];

  // Article page (single segment that matches a known slug)
  if (segments.length === 1 && dates.has(slug)) {
    const info = dates.get(slug)!;
    return { lastmod: info.modified, changefreq: 'monthly', priority: 0.9 };
  }

  if (url === '/') {
    return { lastmod: latest, changefreq: 'daily', priority: 1.0 };
  }
  if (url === '/teachings') {
    return {
      lastmod: latest,
      changefreq: 'daily',
      priority: 0.9,
    };
  }
  if (segments[0] === 'category' && segments.length === 2) {
    return { lastmod: latest, changefreq: 'weekly', priority: 0.8 };
  }
  if (url === '/slate') {
    return { lastmod: latest, changefreq: 'weekly', priority: 0.7 };
  }
  if (url === '/glossary') {
    return { lastmod: latest, changefreq: 'monthly', priority: 0.7 };
  }
  if (url === '/rss.xml' || url === '/robots.txt') {
    return { lastmod: latest, changefreq: 'daily', priority: 0.3 };
  }
  if (url === '/about' || url === '/doctrinal-basis' || url === '/contact') {
    return { lastmod: latest, changefreq: 'yearly', priority: 0.5 };
  }
  if (url === '/privacy') {
    return { lastmod: latest, changefreq: 'yearly', priority: 0.3 };
  }
  return { lastmod: latest, changefreq: 'monthly', priority: 0.4 };
}

export function serializeSitemapEntry(item: { url: string }) {
  return { ...item, ...routeMetaFor(item.url) };
}
