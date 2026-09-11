import React from 'react';
import { BUSINESS, SERVICES, SERVICES_CTA_LABEL, type Service } from '../data/site';

/**
 * Alternating light/dark panel skins, matching the prototype's paper → ink →
 * paper-2 → ink-deep run.
 */
const SKINS = [
  {
    panel: 'bg-paper text-ink border-t border-t-sand',
    blueprint: '',
    numberStroke: '[-webkit-text-stroke:1px_var(--color-ink)]',
    blurb: 'text-mute-3',
    points: 'text-mute-2',
    frame: 'bg-paper-4',
    cta: 'border-mute-2 text-ink hover:bg-ink hover:text-paper hover:border-ink',
  },
  {
    panel: 'bg-ink text-paper',
    blueprint: 'bg-blueprint',
    numberStroke: '[-webkit-text-stroke:1px_var(--color-paper)]',
    blurb: 'text-sand-3',
    points: 'text-mute-light-2',
    frame: 'bg-ink-soft',
    cta: 'border-mute-2 text-paper hover:bg-paper hover:text-ink hover:border-paper',
  },
  {
    panel: 'bg-paper-2 text-ink',
    blueprint: '',
    numberStroke: '[-webkit-text-stroke:1px_var(--color-ink)]',
    blurb: 'text-mute-3',
    points: 'text-mute-2',
    frame: 'bg-paper-4',
    cta: 'border-mute-2 text-ink hover:bg-ink hover:text-paper hover:border-ink',
  },
  {
    panel: 'bg-ink-deep text-paper',
    blueprint: 'bg-blueprint',
    numberStroke: '[-webkit-text-stroke:1px_var(--color-paper)]',
    blurb: 'text-sand-3',
    points: 'text-mute-light-2',
    frame: 'bg-ink-soft',
    cta: 'border-mute-2 text-paper hover:bg-paper hover:text-ink hover:border-paper',
  },
] as const;

interface ServicePanelProps {
  service: Service;
  skin: (typeof SKINS)[number];
  isLast: boolean;
}

function ServicePanel({ service, skin, isLast }: ServicePanelProps) {
  return (
    // ponytail: consecutive `sticky top-0` siblings ARE the pinned sequence —
    // each panel holds while the next scrolls over it. No scroll listener, no
    // measurement, nothing to desync.
    <div
      className={`sticky top-0 grid min-h-screen grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(30px,5vw,80px)] px-[clamp(28px,5vw,80px)] pt-[clamp(100px,12vh,140px)] pb-[clamp(60px,8vh,100px)] ${skin.panel} ${skin.blueprint}`}
    >
      <div className="flex min-w-0 flex-col gap-[22px]">
        <span className="label flex items-center gap-2.5 text-brand">
          <span aria-hidden="true" className="h-0.5 w-[26px] bg-brand" />[ 01 // SERVICES ]
        </span>

        <span
          aria-hidden="true"
          className={`font-display text-[clamp(90px,14vw,200px)] leading-[0.8] tracking-[-0.05em] text-transparent ${skin.numberStroke}`}
        >
          {service.number}
        </span>

        <h2 className="font-display text-[clamp(44px,6vw,92px)] font-normal leading-[0.9] tracking-[-0.04em]">
          {service.title}
        </h2>

        <p
          className={`max-w-[44ch] font-sans text-[clamp(17px,1.4vw,20px)] leading-[1.55] ${skin.blurb}`}
        >
          {service.blurb}
        </p>

        <ul
          className={`label flex list-none flex-wrap gap-x-3.5 gap-y-1.5 p-0 ${skin.points}`}
        >
          {service.points.map((point, i) => (
            <li key={point} className="flex items-center gap-3.5">
              {i > 0 && (
                <span aria-hidden="true" className="opacity-60">
                  ·
                </span>
              )}
              {point}
            </li>
          ))}
        </ul>

        {isLast && (
          <a
            href={BUSINESS.phoneHref}
            className={`mt-2 flex min-h-12 items-center self-start border px-6 py-3.5 font-sans text-[15px] font-bold no-underline transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${skin.cta}`}
          >
            {SERVICES_CTA_LABEL}
          </a>
        )}
      </div>

      <div
        className={`relative aspect-[4/5] max-h-[70vh] w-full max-w-[520px] justify-self-end overflow-hidden ${skin.frame}`}
      >
        <img
          src={service.image}
          alt={service.imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export const Services: React.FC = () => (
  <section id="services" aria-label="Services" className="relative z-[3]">
    {SERVICES.map((service, i) => (
      <ServicePanel
        key={service.number}
        service={service}
        skin={SKINS[i % SKINS.length]}
        isLast={i === SERVICES.length - 1}
      />
    ))}
  </section>
);
