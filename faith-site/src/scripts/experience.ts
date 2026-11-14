/**
 * THE EXPERIENCE LAYER — Lenis × GSAP
 * ---------------------------------------------------------------------------
 * One controller orchestrates every scroll-driven effect on the marketing
 * surfaces (home, library, slate, listen, community…). It is deliberately NOT
 * loaded on article pages: long-form reading keeps native scroll so the
 * Listening Room, text-resize and find-in-page behave exactly as before.
 *
 * Laws (DESIGN_DIRECTION v2):
 *   · prefers-reduced-motion → no Lenis, no pins, no parallax; simple fades only.
 *   · Nothing autoplays audio. Motion is visual only.
 *   · Content is never hidden waiting for JS: every [data-rise] element is
 *     visible by default; GSAP only animates FROM a hidden state at runtime.
 *   · The page never traps the reader: pins release, anchors use Lenis.scrollTo.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ------------------------------------------------------------------ Lenis */
let lenis: Lenis | null = null;

if (!reduceMotion) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  // One rAF loop drives both Lenis and GSAP's ticker-synced ScrollTrigger.
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time: number) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/** Smooth-scroll to in-page anchors (month chips, "skip", footer links). */
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (event) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -96, duration: 1.4 });
    } else {
      (target as HTMLElement).scrollIntoView({ block: 'start' });
    }
    history.replaceState(null, '', id);
  });
});

/* ------------------------------------------------- cinematic hero timeline */
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) {
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (reduceMotion) {
    intro.from('[data-hero-fade]', { opacity: 0, duration: 0.4, stagger: 0.06 });
  } else {
    intro
      .from('[data-hero-line]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power2.inOut',
      })
      .from(
        '[data-hero-kicker]',
        { opacity: 0, y: 18, duration: 0.7 },
        '-=0.55'
      )
      .from(
        '[data-hero-title] .hero-title-line',
        {
          yPercent: 110,
          opacity: 0,
          rotateX: -35,
          transformOrigin: '50% 100%',
          duration: 1.05,
          stagger: 0.12,
          ease: 'power4.out',
        },
        '-=0.4'
      )
      .from('[data-hero-fade]', { opacity: 0, y: 26, duration: 0.8, stagger: 0.1 }, '-=0.6')
      .from(
        '[data-hero-orbit]',
        { opacity: 0, scale: 0.86, duration: 1.4, ease: 'power2.out' },
        '-=0.9'
      );

    // The hero recedes as the reader commits to the scroll.
    gsap.to('[data-hero-recede]', {
      yPercent: -12,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom 35%',
        scrub: 0.6,
      },
    });
    gsap.to('[data-hero-media]', {
      yPercent: 14,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}

/* ------------------------------------------------ generic rise-in reveals */
gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
  if (reduceMotion) {
    gsap.from(el, {
      opacity: 0,
      duration: 0.35,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
    return;
  }
  gsap.from(el, {
    opacity: 0,
    y: 44,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
  });
});

/* Staggered children: cards, rows, month tiles. */
gsap.utils.toArray<HTMLElement>('[data-rise-group]').forEach((group) => {
  const items = Array.from(group.children) as HTMLElement[];
  if (!items.length) return;
  gsap.from(items, {
    opacity: 0,
    y: reduceMotion ? 0 : 36,
    duration: reduceMotion ? 0.35 : 0.85,
    stagger: 0.07,
    ease: 'power3.out',
    scrollTrigger: { trigger: group, start: 'top 85%', once: true },
  });
});

/* Inner marketing pages still use the editorial [data-reveal] marker. On the
   experience layer we own those too: clear the CSS hide immediately, then let
   GSAP rise them in. (Article pages keep the IntersectionObserver path.) */
gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
  el.classList.add('is-visible');
  gsap.from(el, {
    opacity: 0,
    y: reduceMotion ? 0 : 32,
    duration: reduceMotion ? 0.35 : 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  });
});

/* --------------------------------------------------- gilded number counters */
gsap.utils.toArray<HTMLElement>('[data-count-to]').forEach((el) => {
  const target = Number(el.getAttribute('data-count-to') || '0');
  if (!target) return;
  const state = { value: 0 };
  gsap.to(state, {
    value: target,
    duration: reduceMotion ? 0.2 : 1.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => {
      el.textContent = String(Math.round(state.value));
    },
  });
});

/* --------------------------------------------- pinned horizontal arc rail */
const rail = document.querySelector<HTMLElement>('[data-arc-rail]');
const railTrack = document.querySelector<HTMLElement>('[data-arc-track]');
if (rail && railTrack && !reduceMotion && window.innerWidth > 900) {
  const distance = () => railTrack.scrollWidth - rail.clientWidth;
  gsap.to(railTrack, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: rail,
      start: 'top top+=96',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

/* ------------------------------------------------------- parallax accents */
if (!reduceMotion) {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Number(el.getAttribute('data-parallax') || '0.15');
    gsap.fromTo(
      el,
      { yPercent: speed * 100 },
      {
        yPercent: -speed * 100,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}

/* -------------------------------------------------- pointer aurora cursor */
const glow = document.querySelector<HTMLElement>('[data-cursor-glow]');
if (glow && finePointer && !reduceMotion) {
  const xTo = gsap.quickTo(glow, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(glow, 'y', { duration: 0.5, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    glow.style.opacity = '1';
  });
  document.documentElement.addEventListener('pointerleave', () => {
    glow.style.opacity = '0';
  });
}

/* ------------------------------------------- morphing cursor (ring + dot)
   Decorative accent that trails the pointer and expands over interactive
   elements, optionally showing a verb ("Read", "Listen", "Explore"). The native
   cursor is never hidden, so precision and accessibility are preserved. */
const ring = document.querySelector<HTMLElement>('[data-cursor-ring]');
const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
const ringLabel = document.querySelector<HTMLElement>('[data-cursor-label]');

if (ring && dot && finePointer && !reduceMotion) {
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });

  window.addEventListener('pointermove', (e) => {
    ringX(e.clientX);
    ringY(e.clientY);
    dotX(e.clientX);
    dotY(e.clientY);
    ring.classList.add('is-visible');
    dot.classList.add('is-visible');
  });
  document.documentElement.addEventListener('pointerleave', () => {
    ring.classList.remove('is-visible');
    dot.classList.remove('is-visible');
  });
  window.addEventListener('pointerdown', () => ring.classList.add('is-down'));
  window.addEventListener('pointerup', () => ring.classList.remove('is-down'));
  window.addEventListener('blur', () => {
    ring.classList.remove('is-visible');
    dot.classList.remove('is-visible');
  });

  // Morph over links/buttons; a data-cursor verb becomes the ring's label.
  const interactiveSelector = 'a[href], button, [role="button"], input, select, textarea, [data-cursor]';
  document.addEventListener('pointerover', (e) => {
    const target = e.target as Element | null;
    const hit = target?.closest?.(interactiveSelector) as HTMLElement | null;
    if (hit) {
      ring.classList.add('is-link');
      const verb = hit.getAttribute('data-cursor');
      if (verb && ringLabel) {
        ringLabel.textContent = verb;
        ring.classList.add('has-label');
      } else {
        ring.classList.remove('has-label');
      }
    } else {
      ring.classList.remove('is-link', 'has-label');
    }
  });
}

/* ------------------------------------------------------ magnetic elements */
if (finePointer && !reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
    const strength = Number(el.getAttribute('data-magnet') || '0.35');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ---------------------------------------------- header & progress on scroll */
const header = document.getElementById('site-header');
const progress = document.getElementById('reading-progress-bar');
const waFloat = document.querySelector('[data-wa-float]');

function onScrollFrame() {
  const y = window.scrollY || window.pageYOffset;
  if (header) header.classList.toggle('is-scrolled', y > 24);
  if (waFloat) waFloat.classList.toggle('is-scrolled', y > 420);
  if (progress) {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? Math.min(100, Math.max(0, (y / docH) * 100)) : 0;
    progress.style.width = pct.toFixed(1) + '%';
  }
}
if (lenis) lenis.on('scroll', onScrollFrame);
else window.addEventListener('scroll', onScrollFrame, { passive: true });
onScrollFrame();

/* Refresh triggers once fonts settle so pin distances are exact. */
if (document.fonts?.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
window.addEventListener('load', () => ScrollTrigger.refresh());
