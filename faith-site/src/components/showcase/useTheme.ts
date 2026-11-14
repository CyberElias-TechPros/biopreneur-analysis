import { useEffect, useState } from 'react';

export type SiteTheme = 'light' | 'dark';

/**
 * Reads the active register from <html data-theme> and stays in sync with the
 * header toggle. SSR + first client render both default to 'dark' (the site is
 * dark-first), so there is no hydration mismatch; the effect then corrects to
 * the reader's persisted choice and follows every subsequent toggle.
 *
 * Two signals are honoured: the `ijn:theme` CustomEvent dispatched by chrome.ts
 * and a MutationObserver on the data-theme attribute (belt-and-braces).
 */
export function useTheme(): SiteTheme {
  const [theme, setTheme] = useState<SiteTheme>('dark');

  useEffect(() => {
    const read = (): SiteTheme =>
      document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

    setTheme(read());

    const onEvent = (e: Event) => {
      const detail = (e as CustomEvent<{ theme?: SiteTheme }>).detail;
      setTheme(detail?.theme === 'light' ? 'light' : detail?.theme === 'dark' ? 'dark' : read());
    };

    const mo = new MutationObserver(() => setTheme(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('ijn:theme', onEvent);

    return () => {
      window.removeEventListener('ijn:theme', onEvent);
      mo.disconnect();
    };
  }, []);

  return theme;
}
