import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { FIRM } from '../data/site';
import { VelocityMarquee } from './motion/VelocityMarquee';

/**
 * "25" + "+ years"  -> "25+ years"
 * "5.0" + "on Angi" -> "5.0 on Angi"
 * ponytail: a word-suffix gets a space, a punctuation-suffix does not.
 */
function joinSuffix(num: string, suffix: string): string {
  return /^[a-z0-9]/i.test(suffix) ? `${num} ${suffix}` : `${num}${suffix}`;
}

interface CountUpValueProps {
  value: number;
  decimals: number;
  suffix: string;
}

function CountUpValue({ value, decimals, suffix }: CountUpValueProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setShown,
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  const final = joinSuffix(value.toFixed(decimals), suffix);

  return (
    <span ref={ref} className="font-display text-[30px] font-normal text-ink">
      {/* The animating figure is decorative; the settled value is always in the DOM. */}
      <span aria-hidden="true">{joinSuffix(shown.toFixed(decimals), suffix)}</span>
      <span className="sr-only">{final}</span>
    </span>
  );
}

export function FirmBand() {
  return (
    // Lifted paper slab that rides over the hero, as in the prototype.
    <div className="relative z-[2] bg-paper shadow-[0_-40px_80px_rgba(0,0,0,0.35)]">
      <VelocityMarquee tone="ink" />

      <section className="mx-auto flex max-w-[1400px] flex-col gap-14 px-7 py-[clamp(100px,14vw,200px)]">
        <span className="label flex items-center gap-2.5 text-brand">
          <span aria-hidden="true" className="h-0.5 w-[26px] bg-brand" />
          {FIRM.label}
        </span>

        <h2 className="font-display max-w-[26ch] text-[clamp(40px,5.8vw,86px)] font-normal leading-[1.02] tracking-[-0.035em] text-ink">
          {FIRM.statement}
        </h2>

        <motion.dl
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))]"
        >
          {FIRM.stats.map((stat) => (
            <div
              key={stat.key}
              className="flex flex-col gap-1.5 border-t border-ink pt-[22px] pr-6 last:pr-0"
            >
              <dt className="label text-mute-2">{stat.key}</dt>
              <dd className="m-0">
                {'value' in stat ? (
                  <CountUpValue
                    value={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                  />
                ) : (
                  <span className="font-display text-[30px] font-normal text-ink">{stat.text}</span>
                )}
              </dd>
            </div>
          ))}
        </motion.dl>
      </section>
    </div>
  );
}
