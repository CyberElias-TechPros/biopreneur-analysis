import React from 'react';
/**
 * Velocity-reactive kinetic marquee (React Bits ScrollVelocity). The words speed
 * up and skew with the reader's scroll velocity, then settle. Decorative and
 * aria-hidden; the same themes are stated in the page copy for everyone else.
 */
import ScrollVelocity from '../reactbits/ScrollVelocity';

const WORDS = [
  'Revelation',
  'Identity',
  'Grace',
  'The Word',
  'Faith',
  'Authority',
  'Healing',
  'Prayer',
];

export default function Marquee() {
  return (
    <div className="sc-marquee" aria-hidden="true">
      <ScrollVelocity
        texts={[WORDS.join('  ✦  ') + '  ✦  ']}
        velocity={70}
        damping={40}
        stiffness={320}
        numCopies={5}
        fadeEdges
        outlineAlternate
        skewWithVelocity={0.12}
        gap={24}
        className="sc-marquee__text"
        parallaxClassName="sc-marquee__parallax"
        scrollerClassName="sc-marquee__scroller"
      />
    </div>
  );
}
