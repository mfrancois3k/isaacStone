import { motion, useReducedMotion } from 'motion/react';
import { BUSINESS, HERO, HERO_RENDER, RENDERS } from '../data/site';

interface HeroProps {
  /** Fired by the primary CTA. The CTA is a real anchor to #contact regardless. */
  onRequestEstimate?: () => void;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero({ onRequestEstimate }: HeroProps) {
  const reduced = useReducedMotion();

  /** Headline reveals line by line on mount; static when motion is reduced. */
  const reveal = reduced
    ? undefined
    : { initial: { y: '110%' }, animate: { y: '0%' } };

  return (
    <section id="hero" className="relative z-[1] grid min-h-screen md:grid-cols-2">
      {/* Left: ink panel */}
      <div className="bg-blueprint relative flex min-w-0 flex-col justify-end gap-7 overflow-hidden bg-ink px-7 pb-20 pt-[110px] text-paper sm:px-10 md:pb-12 lg:px-[72px] lg:pb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
          {HERO.eyebrow}
        </span>

        <h1 className="m-0 w-fit border border-brand/50 px-5 py-4 font-display font-normal leading-[0.86] tracking-[-0.05em] sm:px-7 sm:py-6">
          {HERO.headline.map((text, i) => (
            <span
              key={text}
              className="block overflow-hidden pb-[0.06em]"
              style={{ fontSize: 'clamp(56px, 9vw, 150px)' }}
            >
              <motion.span
                className="block"
                {...reveal}
                transition={{ duration: 1.2, ease: EASE, delay: i * 0.12 }}
              >
                {i === 0 ? text : <em className="italic text-brand-soft">{text}</em>}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="grid gap-7 xl:grid-cols-[minmax(30ch,1fr)_auto] xl:items-end">
          <p
            className="m-0 max-w-[38ch] text-sand-3"
            style={{ fontSize: 'clamp(17px, 1.4vw, 20px)', lineHeight: 1.55 }}
          >
            {HERO.body}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              onClick={() => onRequestEstimate?.()}
              className="flex min-h-[54px] items-center bg-brand px-7 py-4 font-sans text-base font-bold text-paper no-underline transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            >
              {HERO.primaryCta}
            </a>
            <a
              href={BUSINESS.phoneHref}
              className="flex min-h-[54px] items-center border border-mute-2 px-7 py-4 font-sans text-base font-bold text-paper no-underline transition-colors hover:border-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-line pt-[18px] font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
          {HERO.badges.map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
          <span className="ml-auto" aria-hidden="true">
            SCROLL ↓
          </span>
        </div>
      </div>

      {/* Right: the render, captioned as a render. */}
      <div className="relative min-h-[60vh] min-w-0 overflow-hidden bg-paper-4">
        <img
          src={RENDERS.hero}
          alt={HERO_RENDER.imageAlt}
          width={1600}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <span
          aria-hidden="true"
          className="absolute left-5 top-[110px] h-[22px] w-[22px] border-l-2 border-t-2 border-brand"
        />
        <span
          aria-hidden="true"
          className="absolute right-5 top-[110px] h-[22px] w-[22px] border-r-2 border-t-2 border-brand"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-5 right-5 h-[22px] w-[22px] border-b-2 border-r-2 border-brand"
        />

        <div className="absolute bottom-5 left-5 flex max-w-[calc(100%-40px)] flex-col gap-1 bg-ink-deep/90 px-[18px] py-3.5 text-paper backdrop-blur-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">
            {HERO_RENDER.eyebrow}
          </span>
          <span className="font-display text-2xl font-normal leading-[1.05]">
            {HERO_RENDER.title}
          </span>
          <span className="text-sm leading-[1.35] text-mute-light-2">
            {HERO_RENDER.noteLead}
            <a
              href="#work"
              className="text-paper underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {HERO_RENDER.noteLinkText}
            </a>
            {HERO_RENDER.noteTail}
          </span>
        </div>
      </div>
    </section>
  );
}
