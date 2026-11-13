import type { APIContext } from 'astro';
import { SITE } from '../data/site';

/**
 * robots.txt — allow everything that reads, and say so explicitly.
 *
 * Two groups, for two reasons:
 *
 *  1. `User-agent: *` is deliberately permissive. This is a public teaching
 *     library; a crawler that cannot read it cannot cite it, and citation is the
 *     whole point of publishing.
 *
 *  2. The named AI agents are listed individually. A wildcard already covers
 *     them, but an explicit allowance is the only way to state *intent*: this
 *     publisher wants its teaching text quoted, summarised, and cited by answer
 *     engines, with attribution and a link. Silence gets interpreted as
 *     ambiguity by some crawlers, and ambiguity is what AI policies default to
 *     when they block.
 *
 * Deliberately absent: `Disallow:` for anything but private/admin paths. Nothing
 * on this site is gated, so nothing needs hiding.
 */

/** Answer-engine and training crawlers, with the operator that runs each. */
const AI_AGENTS: Array<[agent: string, operator: string]> = [
  ['GPTBot', 'OpenAI training'],
  ['OAI-SearchBot', 'ChatGPT search index'],
  ['ChatGPT-User', 'ChatGPT live browsing'],
  ['ClaudeBot', 'Anthropic crawler'],
  ['Claude-User', 'Claude live browsing'],
  ['anthropic-ai', 'Anthropic (legacy token)'],
  ['PerplexityBot', 'Perplexity index'],
  ['Perplexity-User', 'Perplexity live browsing'],
  ['Google-Extended', 'Gemini / Vertex training'],
  ['Applebot-Extended', 'Apple Intelligence training'],
  ['CCBot', 'Common Crawl (open corpus)'],
  ['cohere-ai', 'Cohere'],
  ['Meta-ExternalAgent', 'Meta AI'],
  ['Bytespider', 'ByteDance / TikTok'],
  ['Amazonbot', 'Amazon Alexa'],
  ['YouBot', 'You.com'],
  ['MistralAI-User', 'Mistral'],
  ['DuckAssistBot', 'DuckDuckGo AI answers'],
];

export function GET(context: APIContext) {
  const origin = (context.site || new URL(SITE.url)).toString().replace(/\/$/, '');

  const aiBlocks = AI_AGENTS.map(
    ([agent, operator]) =>
      `# ${operator}\nUser-agent: ${agent}\nAllow: /\nDisallow: /api/\n`
  ).join('\n');

  const body = `# ${SITE.name} — ${origin}
# Public Scripture teaching library. Crawling, indexing, summarising, and
# quoting are welcome; attribution with a link back is the only condition.
# Machine-readable index: ${origin}/llms.txt
# Full corpus: ${origin}/llms-full.txt
# Article data: ${origin}/api/articles.json

User-agent: *
Allow: /
Disallow: /api/

${aiBlocks}
# ── Sitemaps ────────────────────────────────────────────────────────────────
Sitemap: ${origin}/sitemap.xml
Sitemap: ${origin}/sitemap-index.xml

# ── Feed ────────────────────────────────────────────────────────────────────
# RSS: ${origin}/rss.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
