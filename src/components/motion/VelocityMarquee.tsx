import React, { Fragment, useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { MARQUEE_ITEMS } from '../../data/site';

const TONES = {
  ink: {
    band: 'bg-ink-deep border-t-2 border-t-brand border-b border-b-ink-line text-mute',
    accent: 'text-brand',
    bright: 'text-paper',
    sep: 'text-ink-line-2',
  },
  paper: {
    band: 'bg-paper border-t-2 border-t-brand border-b border-b-sand text-mute-2',
    accent: 'text-brand',
    bright: 'text-ink',
    sep: 'text-sand-2',
  },
} as const;

export type MarqueeTone = keyof typeof TONES;

interface VelocityMarqueeProps {
  /** Colour scheme of the band. */
  tone?: MarqueeTone;
  /** Percent of one copy travelled per second. 1.25 matches the prototype's 40s cycle. */
  baseVelocity?: number;
  className?: string;
}

/** One full pass of the item list. The band renders two, so the loop is seamless. */
function MarqueeRow({ tone, duplicate }: { tone: MarqueeTone; duplicate?: boolean }) {
  const t = TONES[tone];
  return (
    <div
      className="flex shrink-0 items-center gap-7 pr-7"
      aria-hidden={duplicate || undefined}
    >
      {MARQUEE_ITEMS.map((item, i) => (
        <Fragment key={item}>
          {/* ponytail: accent by index — decoration only, no data behind it */}
          <span className={i % 4 === 0 ? t.accent : i % 4 === 2 ? t.bright : undefined}>
            {item}
          </span>
          <span className={t.sep} aria-hidden="true">
            //
          </span>
        </Fragment>
      ))}
    </div>
  );
}

export const VelocityMarquee: React.FC<VelocityMarqueeProps> = ({
  tone = 'ink',
  baseVelocity = 1.25,
  className = '',
}) => {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const directionRef = useRef(1);

  const { scrollY } = useScroll();
  const smoothVelocity = useSpring(useVelocity(scrollY), { damping: 70, stiffness: 200 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 0.8], { clamp: false });

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    const v = velocityFactor.get();
    if (v < 0) directionRef.current = -1;
    else if (v > 0) directionRef.current = 1;

    // Base drift, nudged (not multiplied wildly) by how fast the page is moving.
    const drift = -directionRef.current * baseVelocity * (delta / 1000);
    const moveBy = drift + drift * Math.min(Math.max(v, -0.6), 0.6);

    let next = baseX.get() + moveBy;
    if (next <= -50) next += 50;
    else if (next > 0) next -= 50;
    baseX.set(next);
  });

  const x = useTransform(baseX, (v) => `${v}%`);
  const t = TONES[tone];

  return (
    <div className={`overflow-hidden py-3 ${t.band} ${className}`}>
      <motion.div
        // Reduced motion falls back to the plain CSS marquee, which index.css
        // then freezes entirely under prefers-reduced-motion.
        className={`flex w-max items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] leading-none ${
          reduced ? 'animate-marquee' : ''
        }`}
        style={reduced ? undefined : { x }}
      >
        <MarqueeRow tone={tone} />
        <MarqueeRow tone={tone} duplicate />
      </motion.div>
    </div>
  );
};
