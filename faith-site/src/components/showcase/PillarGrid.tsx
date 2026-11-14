import React from 'react';
/**
 * The four doctrinal pillars as pointer-tracked spotlight cards
 * (React Bits SpotlightCard). Each card is a real anchor to its category hub,
 * so the grid is fully navigable without JS and by keyboard.
 *
 * Theme-aware: midnight cards use an additive gold spotlight; the dawn/ivory
 * register uses the light palette with a softer fill so it reads on paper.
 */
import SpotlightCard from '../reactbits/SpotlightCard';
import { useTheme } from './useTheme';

export interface Pillar {
  numeral: string;
  name: string;
  slug: string;
  shortLine: string;
  anchors: string;
  count: number;
}

interface Props {
  pillars: Pillar[];
}

export default function PillarGrid({ pillars }: Props) {
  const light = useTheme() === 'light';

  return (
    <div className="pillar-grid" data-rise-group>
      {pillars.map((p) => (
        <SpotlightCard
          key={p.slug}
          className="pillar-card"
          theme={light ? 'light' : 'dark'}
          spotlightColor={light ? '#B08D3E' : '#D4AF6A'}
          intensity={light ? 0.34 : 0.5}
          spotlightSize={0.55}
          softness={0.85}
          borderGlow={light ? 0.5 : 0.7}
          proximity={220}
          ambient
          grain={0.05}
          style={{ '--spotlight-card-surface': light ? '#ffffff' : '#0e131b' } as React.CSSProperties}
        >
          <a className="pillar-card__link" href={`/category/${p.slug}/`} data-cursor="Explore">
            <span className="pillar-card__top">
              <span className="pillar-card__num">{p.numeral}</span>
              <span className="pillar-card__count meta-caps">
                {p.count > 0 ? `${p.count} published` : '30+ scheduled'}
              </span>
            </span>
            <span className="pillar-card__name">{p.name}</span>
            <span className="pillar-card__line">{p.shortLine}</span>
            <span className="pillar-card__anchors">{p.anchors}</span>
            <span className="pillar-card__cta meta-caps" aria-hidden="true">
              Explore the pillar <span className="pillar-card__arrow">→</span>
            </span>
          </a>
        </SpotlightCard>
      ))}
    </div>
  );
}
