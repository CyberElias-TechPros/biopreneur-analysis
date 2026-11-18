/**
 * Site-wide search — the dialog behind the header search button.
 *
 * Design constraints, in order:
 *   1. Zero network until asked. Nothing is fetched at page load; the index is
 *      requested the first time a reader opens the dialog or types.
 *   2. Works without the dialog ever opening. It is an enhancement; `/teachings/`
 *      filters correctly with no JS and `?q=` still resolves.
 *   3. Keyboard-first. Cmd/Ctrl-K and `/` open it, Esc closes, arrows move,
 *      Enter opens, and focus returns to where it came from on close.
 *   4. Honest when it fails. A failed fetch says so and offers the list page.
 *
 * Ranking is deliberately simple and explainable: title matches outrank keyword
 * matches, exact phrase outranks scattered words, and days sort ascending so the
 * foundational teachings surface before the seasonal ones.
 */

interface SearchItem {
  s: string;
  t: string;
  r: string;
  c: string;
  d: string;
  k: string;
  y: number;
}

interface SearchPayload {
  version: number;
  count: number;
  items: SearchItem[];
}

const INDEX_URL = '/api/search-index.json';

let index: SearchItem[] | null = null;
let loading: Promise<SearchItem[]> | null = null;

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s'-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function loadIndex(): Promise<SearchItem[]> {
  if (index) return index;
  if (loading) return loading;
  loading = fetch(INDEX_URL, { credentials: 'omit' })
    .then((response) => {
      if (!response.ok) throw new Error(`index ${response.status}`);
      return response.json() as Promise<SearchPayload>;
    })
    .then((payload) => {
      index = Array.isArray(payload.items) ? payload.items : [];
      return index;
    })
    .finally(() => {
      loading = null;
    });
  return loading;
}

/** Score one item against a query. Returns 0 for no match. */
export function scoreItem(item: SearchItem, query: string): number {
  const q = normalise(query);
  if (!q) return 0;
  const title = normalise(item.t);
  const ref = normalise(item.r);
  const category = normalise(item.c);
  const body = normalise(`${item.d} ${item.k}`);

  let score = 0;
  if (title.includes(q)) score += 100; // phrase in the title
  if (ref.includes(q)) score += 80; // scripture reference
  const words = q.split(' ').filter(Boolean);
  let titleHits = 0;
  let bodyHits = 0;
  for (const word of words) {
    if (title.includes(word)) titleHits += 1;
    else if (category.includes(word)) bodyHits += 0.5;
    else if (body.includes(word)) bodyHits += 1;
  }
  // A word that appears nowhere means this is not the page being looked for.
  if (titleHits === 0 && bodyHits === 0) return 0;
  score += titleHits * 24 + bodyHits * 6;
  if (titleHits === words.length) score += 30; // every word in the title
  // Prefer the foundational teachings when scores tie.
  score += Math.max(0, 6 - item.y / 60);
  return score;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  text?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}

export function initSiteSearch(): void {
  const openers = Array.from(document.querySelectorAll<HTMLElement>('[data-search-open]'));
  const dialog = document.getElementById('site-search') as HTMLDialogElement | null;
  if (!dialog || !openers.length) return;

  const input = dialog.querySelector<HTMLInputElement>('#site-search-input');
  const results = dialog.querySelector<HTMLElement>('#site-search-results');
  const status = dialog.querySelector<HTMLElement>('#site-search-status');
  const closeBtn = dialog.querySelector<HTMLElement>('#site-search-close');
  if (!input || !results || !status) return;

  let lastFocus: HTMLElement | null = null;
  let activeIndex = -1;
  let current: SearchItem[] = [];

  const setStatus = (message: string): void => {
    status.textContent = message;
  };

  function render(items: SearchItem[], query: string): void {
    current = items;
    activeIndex = items.length ? 0 : -1;
    results!.replaceChildren();

    if (!query.trim()) {
      setStatus('Type to search 371 Scripture teachings by title, verse, or theme.');
      return;
    }
    if (!items.length) {
      setStatus(`No teaching matched “${query.trim()}”. Try a Scripture reference, or browse the full library.`);
      return;
    }
    setStatus(`${items.length} teaching${items.length === 1 ? '' : 's'} matched “${query.trim()}”.`);

    items.forEach((item, i) => {
      const li = el('li', { class: 'site-search__row', role: 'presentation' });
      const a = el('a', {
        class: 'site-search__link',
        href: `/${item.s}/`,
        id: `site-search-hit-${i}`,
        'data-index': String(i),
      });
      const title = el('span', { class: 'site-search__title' }, item.t);
      const meta = el(
        'span',
        { class: 'site-search__meta' },
        `${item.r} · ${item.c} · Day ${String(item.y).padStart(3, '0')}`
      );
      a.append(title, meta);
      li.append(a);
      results!.append(li);
    });
    paintActive();
  }

  function paintActive(): void {
    const links = Array.from(results!.querySelectorAll<HTMLAnchorElement>('.site-search__link'));
    links.forEach((link, i) => {
      const on = i === activeIndex;
      link.classList.toggle('is-active', on);
      if (on) {
        link.setAttribute('aria-current', 'true');
        // Guarded: not every engine ships scrollIntoView, and a missing method
        // must never take the whole result list down with it.
        try {
          link.scrollIntoView?.({ block: 'nearest' });
        } catch {
          /* keep painting results even if scrolling is unavailable */
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });
    input!.setAttribute('aria-activedescendant', links[activeIndex]?.id || '');
  }

  function search(query: string): void {
    if (!index) {
      setStatus('Loading the teaching index…');
      void loadIndex()
        .then(() => search(query))
        .catch(() => setStatus('The search index could not be loaded. Browse all teachings instead.'));
      return;
    }
    const scored = index
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score || a.item.y - b.item.y)
      .slice(0, 20)
      .map((row) => row.item);
    render(scored, query);
  }

  function open(): void {
    lastFocus = document.activeElement as HTMLElement | null;
    if (!dialog!.open) dialog!.showModal();
    document.documentElement.style.overflow = 'hidden';
    // Prefetch on the first gesture, so the first keystrokes are instant.
    if (!index) void loadIndex().catch(() => undefined);
    input!.focus();
    input!.select();
    if (!results!.childElementCount) render([], '');
  }

  function close(): void {
    if (dialog!.open) dialog!.close();
    document.documentElement.style.overflow = '';
    lastFocus?.focus();
  }

  openers.forEach((opener) => opener.addEventListener('click', open));
  closeBtn?.addEventListener('click', close);
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
  });
  // Click on the backdrop (outside the panel) closes.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  let debounce: number | null = null;
  input.addEventListener('input', () => {
    const value = input.value;
    if (debounce !== null) window.clearTimeout(debounce);
    debounce = window.setTimeout(() => search(value), 60);
  });

  input.addEventListener('keydown', (event) => {
    const links = Array.from(results!.querySelectorAll<HTMLAnchorElement>('.site-search__link'));
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!links.length) return;
      activeIndex = (activeIndex + 1) % links.length;
      paintActive();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!links.length) return;
      activeIndex = (activeIndex - 1 + links.length) % links.length;
      paintActive();
    } else if (event.key === 'Enter') {
      const target = links[activeIndex] || links[0];
      if (target) {
        event.preventDefault();
        target.click();
      }
    }
  });

  // Global shortcuts. `/` and Cmd/Ctrl-K are the two people already know.
  document.addEventListener('keydown', (event) => {
    const typing = (event.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable]');
    if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      open();
      return;
    }
    if (event.key === '/' && !typing) {
      event.preventDefault();
      open();
      return;
    }
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault();
      close();
    }
  });
}
