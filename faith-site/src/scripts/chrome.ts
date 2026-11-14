/**
 * Site chrome — theme, menu, reading-scale, declaration speech, consent.
 * Runs on EVERY page (articles included). Kept dependency-free and tiny so the
 * reading experience never waits on the experience layer.
 */
export function initChrome(): void {
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');

  function syncThemeUI() {
    const current = html.getAttribute('data-theme') || 'light';
    if (icon) icon.textContent = current === 'dark' ? '☾' : '☀';
    if (label) label.textContent = current === 'dark' ? 'Night' : 'Light';
  }
  syncThemeUI();

  toggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ijn-theme', next);
    } catch {
      /* private mode */
    }
    syncThemeUI();
    // Let the React islands (Aurora, SpotlightCard, ShinyText, StarBorder)
    // re-tune themselves to the active register.
    window.dispatchEvent(new CustomEvent('ijn:theme', { detail: { theme: next } }));
  });

  menuBtn?.addEventListener('click', () => {
    if (!nav) return;
    const open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ------------------------------------------------ page-transition curtain
     A fast gilded wipe over full page loads. Dependency-free so article pages
     get it too. The curtain is pointer-events:none and aria-hidden; a failsafe
     timer guarantees it can never strand the reader, and bfcache restores clean. */
  const curtain = document.querySelector<HTMLElement>('[data-page-curtain]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (curtain && !reduceMotion) {
    const hideCurtain = () =>
      curtain.classList.remove('is-active', 'is-covering', 'is-covered', 'is-revealing');

    // Arriving from a curtain-covered navigation: reveal the new page.
    try {
      if (sessionStorage.getItem('ijn-curtain') === '1') {
        sessionStorage.removeItem('ijn-curtain');
        curtain.classList.add('is-active', 'is-covered');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            curtain.classList.remove('is-covered');
            curtain.classList.add('is-revealing');
            window.setTimeout(hideCurtain, 680);
          });
        });
      }
    } catch {
      /* private mode — no cross-page wipe, links still work */
    }

    window.addEventListener('pageshow', (e) => {
      if ((e as PageTransitionEvent).persisted) hideCurtain();
    });

    let navigating = false;
    document.addEventListener('click', (e) => {
      if (navigating || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element | null;
      const a = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download') || a.hasAttribute('data-no-curtain')) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      // Same-page anchors belong to Lenis / native scrolling, not the curtain.
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;

      e.preventDefault();
      navigating = true;
      window.dispatchEvent(new CustomEvent('ijn:stop-speech', { detail: { source: 'navigation' } }));
      curtain.classList.add('is-active', 'is-covering');
      try {
        sessionStorage.setItem('ijn-curtain', '1');
      } catch {
        /* private mode */
      }
      window.setTimeout(() => {
        location.href = url.href;
      }, 470);
      // Failsafe: if navigation stalls, lift the curtain rather than trap anyone.
      window.setTimeout(() => {
        navigating = false;
        hideCurtain();
        try {
          sessionStorage.removeItem('ijn-curtain');
        } catch {
          /* private mode */
        }
      }, 5000);
    });
  }

  // Reading text-size buttons (0.92x - 1.24x)
  const sizeBtns = document.querySelectorAll<HTMLButtonElement>('[data-reading-scale]');
  const activeScale = html.style.getPropertyValue('--reading-scale') || '1';
  sizeBtns.forEach((btn) => {
    const s = btn.getAttribute('data-reading-scale');
    btn.setAttribute('aria-pressed', s === activeScale ? 'true' : 'false');
    btn.addEventListener('click', () => {
      if (!s) return;
      html.style.setProperty('--reading-scale', s);
      try {
        localStorage.setItem('ijn-scale', s);
      } catch {
        /* private mode */
      }
      sizeBtns.forEach((b) => {
        b.setAttribute('aria-pressed', b.getAttribute('data-reading-scale') === s ? 'true' : 'false');
      });
    });
  });

  // Declaration "Pace Aloud" affordance (progressive enhancement).
  // Coordinates with the Listening Room through `ijn:stop-speech` so the two
  // controls never talk over each other or leave a stale "Speaking..." state.
  const speakBtn = document.getElementById('speak-declaration-btn') as HTMLButtonElement | null;
  const speakCard = document.getElementById('declaration-card');
  const speakText = document.getElementById('declaration-text');
  const speakLabel = document.getElementById('speak-btn-text');
  let paceTimer: ReturnType<typeof setTimeout> | null = null;
  let declarationRun = 0;

  if (speakBtn && speakCard && speakText) {
    const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    const resetDeclaration = () => {
      declarationRun += 1;
      if (paceTimer) clearTimeout(paceTimer);
      paceTimer = null;
      speakBtn.setAttribute('aria-pressed', 'false');
      speakCard.classList.remove('is-speaking');
      if (speakLabel) speakLabel.textContent = 'Pace Aloud';
    };

    if (!canSpeak) {
      speakBtn.disabled = true;
      speakBtn.title = 'Speech synthesis is not available in this browser.';
      if (speakLabel) speakLabel.textContent = 'Speech unavailable';
    } else {
      speakBtn.addEventListener('click', () => {
        const active = speakBtn.getAttribute('aria-pressed') === 'true';
        if (active) {
          resetDeclaration();
          window.speechSynthesis.cancel();
          return;
        }

        // Stop the Listening Room first; it ignores events it sent itself.
        window.dispatchEvent(new CustomEvent('ijn:stop-speech', { detail: { source: 'declaration' } }));
        window.speechSynthesis.cancel();

        const raw = (speakText.textContent || '').replace(/[“”"]/g, '').trim();
        if (!raw) return;
        const run = ++declarationRun;
        speakBtn.setAttribute('aria-pressed', 'true');
        speakCard.classList.add('is-speaking');
        if (speakLabel) speakLabel.textContent = 'Speaking…';

        try {
          const u = new SpeechSynthesisUtterance(raw);
          u.rate = 0.92;
          u.lang = speakText.closest('[lang]')?.getAttribute('lang') || html.lang || 'en-US';
          u.onend = u.onerror = () => {
            if (run === declarationRun) resetDeclaration();
          };
          window.speechSynthesis.speak(u);
          // Safety net only: some engines drop onend when the tab is hidden.
          paceTimer = setTimeout(() => {
            if (run === declarationRun) resetDeclaration();
          }, Math.max(24000, raw.length * 120));
        } catch {
          resetDeclaration();
        }
      });

      window.addEventListener('ijn:stop-speech', (event) => {
        const detail = (event as CustomEvent<{ source?: string }>).detail;
        if (detail?.source !== 'declaration') {
          const wasActive = speakBtn.getAttribute('aria-pressed') === 'true';
          resetDeclaration();
          // Only cancel the shared engine when the declaration was actually
          // speaking; otherwise a Listening Room resume would be interrupted.
          if (wasActive) window.speechSynthesis.cancel();
        }
      });
      window.addEventListener('pagehide', () => {
        resetDeclaration();
        window.speechSynthesis.cancel();
      });
    }
  }

  // Article-page reveals: quiet IntersectionObserver fades (no GSAP on prose).
  if (!document.querySelector('[data-experience]')) {
    const reveals = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && reveals.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('is-visible'));
    }

    // Reading progress + header state for article pages (native scroll).
    const header = document.getElementById('site-header');
    const progress = document.getElementById('reading-progress-bar');
    const waFloat = document.querySelector('[data-wa-float]');
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-scrolled', y > 24);
      if (waFloat) waFloat.classList.toggle('is-scrolled', y > 420);
      if (progress) {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? Math.min(100, Math.max(0, (y / docH) * 100)) : 0;
        progress.style.width = pct.toFixed(1) + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}
