import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

/**
 * /api/health — a deploy-verification endpoint.
 *
 * A static site usually passes "the build succeeded" and still ships broken:
 * wrong canonical host, a stale content count, a missing sitemap. This endpoint
 * answers the questions a deploy check actually needs, from data the build
 * already knows, so a CI or uptime monitor can assert on it:
 *
 *   status        — "ok" when the expected invariants hold, "degraded" otherwise
 *   articles      — count of published teachings
 *   categories    — count of category hubs
 *   origin        — the canonical origin this build was compiled for
 *   builtAt       — when this file was generated
 *   checks        — the specific invariants, each true/false
 *
 * It exposes no reader data and no secrets. robots.txt disallows /api/, so it
 * never competes with a real page in an index.
 */
export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const origin = (context.site || new URL('https://lij.name.ng')).toString().replace(/\/$/, '');

  const days = articles.map((a) => a.data.day).sort((a, b) => a - b);
  const slugs = new Set(articles.map((a) => a.data.slug));
  const categories = new Set(articles.map((a) => a.data.category));

  const checks = {
    // Every teaching has a unique, non-empty slug.
    uniqueSlugs: slugs.size === articles.length,
    // Every teaching claims a publication date, and none is blank.
    allDated: articles.every((a) => Boolean(a.data.pubDate)),
    // Day numbers are unique, so prev/next navigation cannot collide.
    uniqueDays: new Set(days).size === articles.length,
    // Canonical origin is an absolute https URL (catches a bad env var).
    canonicalOrigin: /^https:\/\/[a-z0-9.-]+$/i.test(origin),
    // The library is non-trivial — a guard against an empty collection build.
    hasContent: articles.length > 0,
    // Every teaching has an answer-capable description within SERP limits.
    descriptionsInRange: articles.every((a) => {
      const len = a.data.description.length;
      return len >= 140 && len <= 158;
    }),
  };

  const ok = Object.values(checks).every(Boolean);

  const payload = {
    status: ok ? 'ok' : 'degraded',
    name: 'Live In Jesus Name',
    origin,
    builtAt: new Date().toISOString(),
    articles: articles.length,
    categories: categories.size,
    dayRange: days.length ? { first: days[0], last: days[days.length - 1] } : null,
    checks,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: ok ? 200 : 503,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  });
}
