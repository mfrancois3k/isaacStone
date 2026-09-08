import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BEFORE_AFTER } from '../data/site';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Drag-to-compare between the two images in BEFORE_AFTER.
 *
 * ponytail: the control is a native <input type="range"> laid over the frame,
 * with its thumb hidden. That buys mouse drag, touch drag and full keyboard
 * (arrows / Home / End) plus the correct ARIA slider semantics for free — no
 * pointer-event handling of our own. The visible handle is a sibling div
 * positioned from the same state.
 */
export function BeforeAfterShowcase() {
  const [pct, setPct] = useState(50);
  const reduce = useReducedMotion();

  return (
    <section
      id="beforeafter"
      aria-labelledby="beforeafter-heading"
      className="relative bg-ink-deep bg-blueprint text-paper"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[34px] px-7 py-[clamp(80px,10vw,150px)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3.5">
            <span className="label flex items-center gap-2.5 text-brand">
              <span aria-hidden="true" className="h-0.5 w-[26px] bg-brand" />
              {BEFORE_AFTER.label}
            </span>
            <h2
              id="beforeafter-heading"
              className="display m-0 text-[clamp(44px,6.4vw,96px)] leading-[0.88] tracking-[-0.045em]"
            >
              {BEFORE_AFTER.headline}
            </h2>
          </div>
          <span aria-hidden="true" className="label text-mute">
            Drag the handle &#8596;
          </span>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative max-h-[78vh] w-full select-none overflow-hidden bg-ink-soft"
          style={{ aspectRatio: '16 / 9' }}
        >
          {/* AFTER — full frame, underneath */}
          <img
            src={BEFORE_AFTER.after}
            alt="After"
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* BEFORE — clipped from the left edge to the handle */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
          >
            <img
              src={BEFORE_AFTER.before}
              alt="Before"
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>

          <span className="label pointer-events-none absolute top-4 left-4 bg-ink-deep/85 px-2.5 py-1.5 text-paper">
            Before
          </span>
          <span className="label pointer-events-none absolute top-4 right-4 bg-brand px-2.5 py-1.5 text-white">
            After
          </span>

          {/* Visible divider + handle */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-0.5 -translate-x-px bg-paper"
            style={{ left: `${pct}%` }}
          >
            <span className="absolute top-1/2 left-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-paper bg-brand font-mono text-[13px] font-bold tracking-[-1px] text-white">
              &#8596;
            </span>
          </div>

          {/* The actual control */}
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            aria-label="Compare before and after — drag or use the arrow keys"
            aria-valuetext={`${pct}% before, ${100 - pct}% after`}
            className="absolute inset-0 z-10 h-full w-full cursor-ew-resize appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:h-[52px] [&::-moz-range-thumb]:w-[52px] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-[52px] [&::-webkit-slider-thumb]:w-[52px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
          />
        </motion.div>

        <p className="m-0 max-w-[60ch] font-mono text-[11px] leading-[1.7] tracking-[0.06em] text-mute">
          {BEFORE_AFTER.note}
        </p>
      </div>
    </section>
  );
}
