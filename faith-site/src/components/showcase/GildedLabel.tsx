import React from 'react';
/**
 * A gilded micro-label with a slow light sweep (React Bits ShinyText).
 * The label text stays in the DOM for assistive tech; the sweep is decorative.
 * Theme-aware: ShinyText parses colors through a canvas, so it needs concrete
 * hex values rather than CSS custom properties.
 */
import ShinyText from '../reactbits/ShinyText';
import { useTheme } from './useTheme';

interface Props {
  text: string;
  className?: string;
}

export default function GildedLabel({ text, className = '' }: Props) {
  const light = useTheme() === 'light';

  return (
    <ShinyText
      text={text}
      color={light ? '#7A5C1B' : '#A8946A'}
      shineColor={light ? '#B08D3E' : '#F6E7BD'}
      speed={3.6}
      delay={1.4}
      shineWidth={36}
      className={className}
    />
  );
}
