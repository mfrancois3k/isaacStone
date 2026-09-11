import { useCallback, useEffect, useRef, useState } from 'react';
import { BUSINESS, WORK, WORK_SECTION } from '../data/site';

/**
 * Aspect ratios of the six photographs, in WORK order. Presentation only —
 * mirrors the approved prototype so the strip keeps its portrait / landscape
 * rhythm instead of flattening every photo to one shape.
 */
const RATIOS = ['3 / 2', '4 / 5', '4 / 3', '4 / 5', '3 / 2', '4 / 5'];

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const pad2 = (n: number) => String(n).padStart(2, '0');

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const figsRef = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);

  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const narrow = useMediaQuery('(max-width: 767px)');
  // ponytail: the strip is a real overflow-x scroller in every mode. "Pinned"
  // only adds vertical scroll as an *extra* driver of scrollLeft, so wheel,
  // trackpad, touch drag, keyboard and the native scrollbar keep working.
  const pinned = !reduced && !narrow;

  /** Single source of truth for the counter and the progress rule. */
  const syncReadouts = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? clamp01(el.scrollLeft / max) : 0;
    if (barRef.current) barRef.current.style.width = (p * 100).toFixed(2) + '%';

    const center = el.clientWidth / 2;
    let next = 0;
    figsRef.current.forEach((fig, i) => {
      if (fig && fig.offsetLeft - el.scrollLeft < center) next = i;
    });
    setIndex(Math.min(next, WORK.length - 1));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncReadouts();
    el.addEventListener('scroll', syncReadouts, { passive: true });
    window.addEventListener('resize', syncReadouts);
    return () => {
      el.removeEventListener('scroll', syncReadouts);
      window.removeEventListener('resize', syncReadouts);
    };
  }, [syncReadouts]);

  // Vertical scroll drives the strip only when pinned. Under reduced motion —
  // or on a narrow screen — this effect never runs, so nothing is hijacked.
  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const el = trackRef.current;
      if (!section || !el) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const p = clamp01(-rect.top / Math.max(1, rect.height - vh));
      el.scrollLeft = p * (el.scrollWidth - el.clientWidth);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned]);

  return (
    <>
      <section
        id="work"
        ref={sectionRef}
        className={'relative z-10 bg-ink-deep text-paper ' + (pinned ? 'h-[380vh]' : '')}
      >
        <div
          className={
            'bg-blueprint relative flex flex-col overflow-hidden pt-[clamp(90px,12vh,120px)] ' +
            (pinned ? 'sticky top-0 h-screen' : 'pb-10')
          }
        >
          {/* Section marker + counter */}
          <div className="flex flex-none flex-wrap items-end justify-between gap-4 px-7">
            <div className="flex flex-col gap-3.5">
              <span className="label flex items-center gap-2.5 text-[10px] text-brand">
                <span aria-hidden="true" className="h-0.5 w-[26px] bg-brand" />
                {WORK_SECTION.label}
              </span>
              <h2 className="display m-0 text-[clamp(44px,6.4vw,96px)] leading-[0.88] tracking-[-0.045em]">
                {WORK_SECTION.heading}
              </h2>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span
                aria-live="polite"
                className="font-display text-[clamp(28px,3vw,44px)] leading-none"
              >
                {pad2(index + 1)}{' '}
                <span className="text-mute-2">/ {pad2(WORK.length)}</span>
              </span>
              <span className="label text-[10px] text-mute">{WORK_SECTION.scrollHint}</span>
            </div>
          </div>

          {/* The strip — a native horizontal scroller in every mode. */}
          <div
            ref={trackRef}
            tabIndex={0}
            role="region"
            aria-label={WORK_SECTION.heading}
            className={
              'my-[clamp(20px,4vh,48px)] flex min-h-0 flex-1 items-start gap-[clamp(20px,3vw,48px)] ' +
              'overflow-x-auto overscroll-x-contain px-7 pb-[clamp(56px,9vh,80px)] ' +
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ' +
              (pinned ? '' : 'snap-x snap-mandatory')
            }
          >
            {WORK.map((item, i) => (
              <figure
                key={item.image}
                ref={(el) => {
                  figsRef.current[i] = el;
                }}
                className="m-0 flex w-max max-w-[80vw] flex-none snap-start flex-col gap-3.5"
              >
                <div
                  className="relative h-[clamp(180px,calc(100vh-360px),520px)] min-w-[240px] overflow-hidden bg-ink-soft"
                  style={{ aspectRatio: RATIOS[i] ?? '3 / 2' }}
                >
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="flex w-0 min-w-full items-baseline justify-between gap-3 border-t border-ink-line pt-3">
                  <span className="min-w-0 truncate text-[15px] leading-[1.35] text-sand-3">
                    <span className="label mr-2.5 text-[10px] text-brand">{item.number}</span>
                    {item.caption}
                  </span>
                  <span className="label whitespace-nowrap text-[10px] text-mute">
                    {item.category}
                  </span>
                </figcaption>
              </figure>
            ))}

            {/* Closing card */}
            <div className="flex w-[min(40vw,420px)] min-w-[260px] flex-none snap-start flex-col gap-[18px] self-center">
              <span className="font-display text-[clamp(30px,3.4vw,48px)] leading-none">
                {WORK_SECTION.outro}
              </span>
              <a
                href={BUSINESS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="label self-start border-b border-brand pb-1 text-[11px] text-paper no-underline transition-colors hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {BUSINESS.instagramHandle} &rarr;
              </a>
            </div>
          </div>

          {/* Progress rule */}
          <div
            aria-hidden="true"
            className={
              'h-px bg-ink-line ' +
              (pinned ? 'absolute right-7 bottom-[clamp(24px,4vh,40px)] left-7' : 'mx-7')
            }
          >
            <div ref={barRef} className="h-px w-0 bg-brand" />
          </div>
        </div>
      </section>

      <WorkMarquee />
    </>
  );
}

/** "Tile — Granite — Marble — Brentwood", repeating. */
function WorkMarquee() {
  return (
    <div className="relative z-10 overflow-hidden border-t-2 border-b border-t-brand border-b-sand bg-paper py-[clamp(28px,4vw,56px)]">
      <div className="animate-marquee font-display text-[clamp(64px,11vw,170px)] leading-[0.9] whitespace-nowrap tracking-[-0.04em]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex items-baseline gap-[0.35em] pr-[0.35em]"
          >
            {WORK_SECTION.marquee.map((word, i) => (
              <span key={word} className="flex items-baseline gap-[0.35em]">
                <span
                  className={
                    i % 2 === 1
                      ? '[-webkit-text-stroke:1px_var(--color-ink)] text-transparent ' +
                        (i === 3 ? 'italic' : '')
                      : ''
                  }
                >
                  {word}
                </span>
                <span aria-hidden="true" className="text-brand">
                  &mdash;
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
