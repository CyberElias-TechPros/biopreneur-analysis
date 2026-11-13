/**
 * Consent gate for advertising.
 *
 * The site collects nothing itself. The only non-essential processing is Google
 * AdSense, so consent is scoped to exactly that:
 *
 *   'all'       → inject the AdSense loader, let Google serve Auto ads.
 *   'essential' → never load it; the reader browses ad-free and untracked.
 *
 * There is no dark pattern: both buttons are the same size, "Essential only" is
 * not hidden, and the choice can be changed from the footer at any time
 * (`window.ijnConsent.open()`), which the privacy policy tells readers.
 *
 * Deliberately absent: a third-party CMP SDK. AdSense accepts Google's own
 * consent message; this lightweight sheet covers the same ground for a static
 * site without shipping a 200 KB vendor bundle.
 */

export type ConsentValue = 'all' | 'essential';

declare global {
  interface Window {
    ijnConsent?: { open: () => void };
  }
}

const KEY = 'ijn-consent-v1';
const ADSENSE_PUBLISHER_META = 'meta[name="ijn-adsense-client"]';

function stored(): ConsentValue | null {
  try {
    const raw = localStorage.getItem(KEY);
    const value = raw ? (JSON.parse(raw) as { ads?: ConsentValue }) : null;
    return value?.ads === 'all' || value?.ads === 'essential' ? value.ads : null;
  } catch {
    return null;
  }
}

function save(value: ConsentValue): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ads: value, at: new Date().toISOString() }));
  } catch {
    /* private mode: the choice holds for this page view only */
  }
}

/** Load Google's ad script exactly once, and only after consent. */
export function loadAdSense(): void {
  if (document.querySelector('script[data-adsense-loader]')) return;
  const meta = document.querySelector<HTMLMetaElement>(ADSENSE_PUBLISHER_META);
  const client = meta?.content;
  if (!client) return;
  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.dataset.adsenseLoader = 'true';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  document.head.appendChild(script);
}

function buildSheet(): HTMLElement {
  const sheet = document.createElement('div');
  sheet.className = 'consent-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'false');
  sheet.setAttribute('aria-labelledby', 'consent-title');
  sheet.setAttribute('aria-describedby', 'consent-body');
  sheet.innerHTML = `
    <div class="consent-sheet__inner">
      <p class="meta-caps consent-sheet__eyebrow">Privacy</p>
      <h2 id="consent-title" class="consent-sheet__title">May we show ads?</h2>
      <p id="consent-body" class="consent-sheet__body">
        Everything you read here works without advertising. If you allow ads, Google may set cookies to
        choose and measure them, which is how the writing stays free. Choose either — the teachings do not
        change.
        <a href="/privacy/">Read the privacy policy</a>.
      </p>
      <div class="consent-sheet__actions">
        <button type="button" class="consent-btn" data-consent="essential">Essential only</button>
        <button type="button" class="consent-btn consent-btn--primary" data-consent="all">Allow ads</button>
      </div>
    </div>`;
  return sheet;
}

function mount(): void {
  if (stored()) {
    if (stored() === 'all') loadAdSense();
    return;
  }

  const sheet = buildSheet();
  document.body.appendChild(sheet);
  // Let the first paint land before the sheet animates in.
  requestAnimationFrame(() => sheet.classList.add('is-open'));

  const finish = (value: ConsentValue) => {
    save(value);
    if (value === 'all') loadAdSense();
    sheet.classList.remove('is-open');
    window.setTimeout(() => sheet.remove(), 220);
  };

  sheet.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((btn) => {
    btn.addEventListener('click', () => finish(btn.dataset.consent as ConsentValue));
  });

  // Escape = the privacy-preserving default.
  sheet.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') finish('essential');
  });
}

/** Footer control: lets a reader revisit the choice. */
export function openConsent(): void {
  const existing = document.querySelector('.consent-sheet');
  if (existing) return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  mount();
}

export function initConsent(): void {
  window.ijnConsent = { open: openConsent };
  mount();
}
