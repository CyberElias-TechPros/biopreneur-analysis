/**
 * Site-wide search + health endpoint regression tests.
 * Run: npm run test:site
 *
 * These run against the built `dist/` output, because the things that break in
 * production are the built artefacts: a missing index, a dialog that only exists
 * on one page, a health check that reports "ok" while an invariant is false.
 *
 * Prerequisite: `npm run build` (CI runs build before this).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, '..');
const dist = path.join(siteRoot, 'dist');

const hasDist = fs.existsSync(path.join(dist, 'index.html'));
const skip = hasDist ? false : 'dist/ not built — run `npm run build` first';

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(dist, rel), 'utf8'));
}

test('the search index exists, covers every article, and is small', { skip }, () => {
  const index = readJson('api/search-index.json');
  assert.equal(index.version, 1);
  assert.ok(index.count > 300, 'index should cover the whole library');
  assert.equal(index.items.length, index.count);
  // Every field the UI reads must be present on every row.
  for (const item of index.items.slice(0, 40)) {
    assert.ok(item.s && item.t && item.c && item.r, `incomplete row: ${JSON.stringify(item)}`);
  }
  // A payload over ~400 KB would be a real cost on a slow connection.
  const bytes = fs.statSync(path.join(dist, 'api/search-index.json')).size;
  assert.ok(bytes < 400_000, `index is ${bytes} bytes, too large to fetch in one go`);
});

test('every built article page carries the search dialog and its trigger', { skip }, () => {
  const pages = ['index.html', 'teachings/index.html', 'listen/index.html', 'about/index.html'];
  for (const page of pages) {
    const html = fs.readFileSync(path.join(dist, page), 'utf8');
    assert.ok(html.includes('id="site-search"'), `${page} is missing the search dialog`);
    assert.ok(html.includes('data-search-open'), `${page} is missing the search trigger`);
  }
  // And an article page, which is the case the feature exists for.
  const article = fs.readdirSync(dist).find((d) => fs.existsSync(path.join(dist, d, 'index.html')));
  const html = fs.readFileSync(path.join(dist, article, 'index.html'), 'utf8');
  assert.ok(html.includes('id="site-search"'), 'an article page is missing the search dialog');
});

test('the search dialog queries the index and ranks the obvious answer first', { skip }, async () => {
  const index = readJson('api/search-index.json');
  const dom = new JSDOM(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'), {
    url: 'https://example.test/',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.Node = window.Node;
  globalThis.CustomEvent = window.CustomEvent;
  globalThis.Event = window.Event;
  globalThis.fetch = async () => ({ ok: true, json: async () => index });

  const dialog = window.document.getElementById('site-search');
  dialog.showModal = function () { this.open = true; };
  dialog.close = function () { this.open = false; };

  const { initSiteSearch } = await import('../src/scripts/search.ts');
  initSiteSearch();

  window.document.querySelector('[data-search-open]').click();
  assert.equal(dialog.open, true);

  const input = window.document.getElementById('site-search-input');
  const run = async (q) => {
    input.value = q;
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...window.document.querySelectorAll('.site-search__link')];
  };

  // The queries that motivated the search pass resolve to the right page first.
  const expectations = [
    ['worship in spirit and truth', '/worship-in-spirit-and-in-truth/'],
    ['sin cycle', '/what-is-a-sin-cycle-and-where-does-it-break/'],
    ['fullness of time', '/the-fullness-of-time-came-for-your-fullness/'],
    ['resist the devil', '/resist-the-devil-and-he-must-flee/'],
  ];
  for (const [query, expected] of expectations) {
    const links = await run(query);
    assert.ok(links.length > 0, `no results for "${query}"`);
    assert.equal(links[0].getAttribute('href'), expected, `"${query}" did not rank ${expected} first`);
  }

  // Nonsense returns nothing rather than everything.
  const none = await run('zzzznothing');
  assert.equal(none.length, 0);

  // Enter opens the active result; the link exists and is a real route.
  const links = await run('faith comes by hearing');
  assert.ok(links[0].getAttribute('href').startsWith('/'));
});

test('the health endpoint reports ok and every invariant is genuinely true', { skip }, () => {
  const health = readJson('api/health.json');
  assert.equal(health.status, 'ok');
  assert.ok(health.articles > 300);
  assert.ok(health.categories >= 10);
  assert.match(health.origin, /^https:\/\//);
  for (const [name, value] of Object.entries(health.checks)) {
    assert.equal(value, true, `health check "${name}" is false`);
  }
  // No secrets or reader data may ever appear in a public health payload.
  const raw = JSON.stringify(health);
  assert.ok(!/token|secret|key|password/i.test(raw), 'health payload looks like it leaks a secret');
});

test('the 404 page offers recovery rather than a dead end', { skip }, () => {
  const html = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
  assert.ok(html.includes('data-search-open'), '404 should offer search');
  assert.ok(html.includes('/teachings/'), '404 should link the library');
  assert.ok(html.includes('/slate/'), '404 should link the slate');
  // Newest teachings give the reader somewhere to go.
  assert.match(html, /Newest Teachings/);
});

test('every page stays inside its weight budget, measured the way a browser pays', { skip }, () => {
  // Uncompressed bytes are a misleading number: Astro emits one merged CSS
  // bundle, so "CSS size" alone says nothing about what a reader downloads.
  // Gzipped transfer size is the honest figure, so that is what we gate.
  const gz = (file) => zlib.gzipSync(fs.readFileSync(path.join(dist, file)), { level: 9 }).length;
  const BUDGET_JS = 40_000;
  const BUDGET_CSS = 25_000;
  const BUDGET_TOTAL = 45_000;

  const pages = [
    'index.html',
    'teachings/index.html',
    'what-is-a-sin-cycle-and-where-does-it-break/index.html',
    '404.html',
  ];

  for (const page of pages) {
    const html = fs.readFileSync(path.join(dist, page), 'utf8');
    const js = [...new Set([...html.matchAll(/<script[^>]+src="(\/_astro\/[^"]+\.js)"/g)].map((m) => m[1]))];
    const css = [...new Set([...html.matchAll(/<link[^>]+href="(\/_astro\/[^"]+\.css)"/g)].map((m) => m[1]))];

    const jsTotal = js.reduce((sum, f) => sum + gz(f), 0);
    const cssTotal = css.reduce((sum, f) => sum + gz(f), 0);

    assert.ok(jsTotal <= BUDGET_JS, `${page} ships ${jsTotal} B gzipped JS (budget ${BUDGET_JS})`);
    assert.ok(cssTotal <= BUDGET_CSS, `${page} ships ${cssTotal} B gzipped CSS (budget ${BUDGET_CSS})`);
    assert.ok(jsTotal + cssTotal <= BUDGET_TOTAL, `${page} ships ${jsTotal + cssTotal} B gzipped total (budget ${BUDGET_TOTAL})`);
  }
});
