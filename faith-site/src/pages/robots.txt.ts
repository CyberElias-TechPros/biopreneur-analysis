import type { APIContext } from 'astro';
import { SITE } from '../data/site';

export function GET(context: APIContext) {
  const origin = (context.site || new URL(SITE.url))
    .toString()
    .replace(/\/$/, '');
  const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
Sitemap: ${origin}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
