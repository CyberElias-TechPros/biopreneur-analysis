import React from 'react';
/**
 * Animated curriculum counters (React Bits CountUp, Motion-powered).
 * The true value is always present for assistive tech via a visually-hidden
 * sibling; the rolling number is aria-hidden decoration.
 */
import CountUp from '../reactbits/CountUp';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { value: 365, label: 'Teachings' },
  { value: 12, label: 'Monthly arcs' },
  { value: 13, label: 'Languages' },
  { value: 4, label: 'Reading voices' },
];

export default function StatsRow() {
  return (
    <div className="hero-stats" data-hero-fade>
      {STATS.map((s) => (
        <div className="hero-stat" key={s.label}>
          <span className="hero-stat__num">
            <span aria-hidden="true">
              <CountUp
                to={s.value}
                from={0}
                duration={2.2}
                delay={0.4}
                easing="expo"
                trigger="load"
                separator=","
                suffix={s.suffix ?? ''}
              />
            </span>
            <span className="visually-hidden">
              {s.value}
              {s.suffix ?? ''}
            </span>
          </span>
          <span className="hero-stat__label meta-caps">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
