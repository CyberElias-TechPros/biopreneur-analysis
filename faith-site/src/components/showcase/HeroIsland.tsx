/**
 * Hero atmosphere — React Bits Aurora (raw WebGL2) tuned to the site's
 * dawn-gold register. One lazy React island; the 365-article corpus never pays
 * for it. Decorative (aria-hidden) and self-pausing off-screen. Reduced-motion
 * users get the static CSS dawn gradient instead — this renders nothing.
 *
 * Theme-aware: midnight uses additive glow; the dawn/ivory register switches
 * Aurora to lightMode with softer, warmer stops so it reads as light on paper.
 */
import React, { useEffect, useState } from 'react';
import Aurora from '../reactbits/Aurora.jsx';
import { useTheme } from './useTheme';

export default function HeroIsland() {
  const [reduced, setReduced] = useState<boolean | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  if (reduced !== false) return null;

  const light = theme === 'light';

  return (
    <div className="hero-aurora" aria-hidden="true">
      <Aurora
        colorStops={light ? ['#B08D3E', '#8EB2D6', '#D4AF6A'] : ['#B08D3E', '#2E4A66', '#D4AF6A']}
        amplitude={0.9}
        blend={light ? 0.5 : 0.62}
        speed={0.55}
        height={0.5}
        glow={light ? 0.34 : 0.42}
        brightness={light ? 0.9 : 0.82}
        layers={2}
        opacity={light ? 0.4 : 0.5}
        lightMode={light}
        mouseInteraction
        intro
      />
    </div>
  );
}
