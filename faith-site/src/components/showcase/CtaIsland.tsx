import React from 'react';
/**
 * The primary call-to-action: a magnetic pull (React Bits Magnet) around an
 * animated star-trail border (React Bits StarBorder). It is a real <a>, so it
 * works with JS off, by keyboard, and to crawlers.
 *
 * Theme-aware: gilded in midnight; a deeper bronze-gold in the dawn register so
 * the button keeps AA contrast against ivory.
 */
import Magnet from '../reactbits/Magnet';
import StarBorder from '../reactbits/StarBorder';
import { useTheme } from './useTheme';

interface Props {
  href: string;
  label: string;
  /** Optional verb shown inside the morphing cursor ring on hover. */
  cursorVerb?: string;
}

export default function CtaIsland({ href, label, cursorVerb }: Props) {
  const light = useTheme() === 'light';

  return (
    <Magnet padding={44} magnetStrength={0.32} tilt={4} scale={1.02}>
      <StarBorder
        as="a"
        href={href}
        className="sc-cta"
        data-cursor={cursorVerb}
        color={light ? '#F6E7BD' : '#F8ECC4'}
        trailColor={light ? '#7A5C1B' : '#B08D3E'}
        backgroundColor={light ? '#B08D3E' : '#D4AF6A'}
        textColor="#0D1117"
        borderColor={light ? 'rgba(122,92,27,0.55)' : 'rgba(212,175,106,0.55)'}
        duration={4}
        thickness={1.5}
        radius={2}
        trailLength={0.32}
        stars={2}
        glow={0.5}
        hover="brighten"
        clickPulse
      >
        {label}
      </StarBorder>
    </Magnet>
  );
}
