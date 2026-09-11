import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { LOADER, RENDERS } from '../data/site';
import { BrandLogo } from './BrandLogo';

interface PageLoaderProps {
  onComplete: () => void;
}

const DURATION_MS = 2600;
/** Reduced motion: hold the wordmark for a beat, then get out of the way. */
const REDUCED_MS = 700;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HEADLINE_WORDS = LOADER.headline.split(' ');

/** Scatter plates, positioned as percentages of the 16:9 stage (from the prototype). */
const PLATES = [
  { src: RENDERS.kitchen, left: '14%', top: '17%', width: '14%', height: '37%', delay: 0.1 },
  { src: RENDERS.bath, left: '72%', top: '14%', width: '14%', height: '38%', delay: 0.28 },
  { src: RENDERS.samples, left: '9%', top: '62%', width: '30.5%', height: '22%', delay: 0.45 },
  { src: RENDERS.patio, left: '59%', top: '67%', width: '20%', height: '20%', delay: 0.62 },
];

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true,
  );

  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  /** Idempotent — skip, Escape, the clock and the failsafe all land here. */
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onCompleteRef.current();
  }, []);

  useEffect(() => {
    const total = reduced ? REDUCED_MS : DURATION_MS;
    let raf = 0;

    // ponytail: rAF is throttled or dead in a background tab, so a timer backs it
    // up. Finishing early is always safer than trapping the visitor behind the intro.
    const failsafe = window.setTimeout(finish, total + 1500);

    const start = performance.now();
    const tick = (now: number) => {
      try {
        const next = Math.min(1, (now - start) / total);
        setProgress(next);
        if (next < 1) raf = requestAnimationFrame(tick);
        else finish();
      } catch {
        finish();
      }
    };

    try {
      raf = requestAnimationFrame(tick);
    } catch {
      finish();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [finish, reduced]);

  const percent = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-paper">
      {reduced ? (
        <BrandLogo variant="dark" size="md" />
      ) : (
        <div
          className="relative aspect-video bg-paper"
          style={{ width: 'min(92vw, calc((100vh - 48px) * 16 / 9))' }}
        >
          {PLATES.map((plate) => (
            <motion.div
              key={plate.src + plate.left}
              aria-hidden="true"
              className="absolute overflow-hidden bg-paper-3"
              style={{
                left: plate.left,
                top: plate.top,
                width: plate.width,
                height: plate.height,
              }}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: plate.delay }}
            >
              <img
                src={plate.src}
                alt=""
                width={640}
                height={640}
                className="h-full w-full object-cover"
              />
            </motion.div>
          ))}

          <motion.div
            aria-hidden="true"
            className="absolute z-[2] overflow-hidden bg-paper-3"
            style={{ left: '32%', top: '29%', width: '39%', height: '47%' }}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <img
              src={RENDERS.living}
              alt=""
              width={960}
              height={1100}
              className="h-full w-full object-cover"
            />
          </motion.div>

          <h2
            className="pointer-events-none absolute inset-x-0 z-[3] m-0 px-4 text-center font-display font-normal leading-none tracking-[-0.02em] text-ink"
            style={{ top: '14.5%', fontSize: 'clamp(20px, 4.2vw, 58px)' }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={word + i}
                className="inline-block"
                initial={{ opacity: 0, y: '60%' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.75 + i * 0.09 }}
              >
                {word}
                {i < HEADLINE_WORDS.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </h2>

          <motion.div
            className="pointer-events-none absolute bottom-[4%] left-[3%] flex items-center gap-[10px] font-mono tracking-[0.16em] text-mute-2"
            style={{ fontSize: 'clamp(9px, 0.8vw, 11px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <span className="h-[6px] w-[6px] rounded-full bg-brand" />
            {LOADER.meta}
          </motion.div>

          <motion.div
            className="pointer-events-none absolute bottom-[4%] right-[3%] flex items-baseline gap-[6px] font-display leading-none tracking-[-0.03em] text-ink tabular-nums"
            style={{ fontSize: 'clamp(22px, 2.6vw, 36px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {percent}
            <span
              className="font-mono tracking-[0.1em] text-brand"
              style={{ fontSize: 'clamp(9px, 0.8vw, 11px)' }}
            >
              %
            </span>
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-ink/10">
            <div className="h-full bg-brand" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={finish}
        className="absolute right-5 top-[18px] flex min-h-[40px] items-center gap-2 border border-ink/30 bg-transparent px-[14px] py-[9px] font-mono text-[10px] tracking-[0.14em] text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        SKIP [ESC] →
      </button>
    </div>
  );
}
