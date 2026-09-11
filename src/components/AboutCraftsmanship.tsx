import { motion, useReducedMotion } from 'motion/react';
import { BUSINESS, ON_SITE_PHOTO, OWNER } from '../data/site';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The owner / crew section. The person who answers the phone is the person who
 * sets the tile — that is the whole argument, so the quote is the owner
 * speaking, in his own words, in the first person.
 */
export function AboutCraftsmanship() {
  const reduce = useReducedMotion();
  const rise = reduce
    ? {}
    : { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 } };

  return (
    <section
      id="owner"
      aria-labelledby="owner-heading"
      className="relative bg-paper-2 text-ink border-t border-sand"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-[clamp(34px,5vw,80px)] px-7 py-[clamp(80px,10vw,150px)] lg:grid-cols-2">
        {/* Image plate */}
        <motion.figure
          {...rise}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative m-0 w-full max-w-[480px] overflow-hidden bg-ink"
          style={{ aspectRatio: '4 / 5' }}
        >
          <img
            src={OWNER.image}
            alt={OWNER.imageAlt}
            width={960}
            height={1200}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-ink-deep/90 to-transparent px-[18px] pt-[18px] pb-4 text-paper">
            <span className="label text-[10px] text-brand">{ON_SITE_PHOTO.label}</span>
            <span className="font-display text-[22px] leading-[1.05]">
              {ON_SITE_PHOTO.title}
            </span>
            <span className="text-[13px] leading-[1.35] text-mute-light-2">
              {ON_SITE_PHOTO.caption}
            </span>
          </figcaption>

          {/* Registration marks — the print-plate detail carried across the site */}
          <span className="pointer-events-none absolute top-3.5 left-3.5 h-5 w-5 border-t-2 border-l-2 border-brand" />
          <span className="pointer-events-none absolute top-3.5 right-3.5 h-5 w-5 border-t-2 border-r-2 border-brand" />
        </motion.figure>

        {/* Copy column */}
        <motion.div
          {...rise}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="flex min-w-0 flex-col gap-[22px]"
        >
          <span className="label flex items-center gap-2.5 text-brand">
            <span aria-hidden="true" className="h-0.5 w-[26px] bg-brand" />
            {OWNER.label}
          </span>

          <h2
            id="owner-heading"
            className="display m-0 text-[clamp(40px,5.4vw,80px)] leading-[0.92] tracking-[-0.04em]"
          >
            You call. The <em className="text-brand">installer</em> answers.
          </h2>

          <blockquote className="m-0 max-w-[44ch] border-l-2 border-brand pl-5">
            <p className="m-0 text-[clamp(17px,1.3vw,20px)] leading-[1.55] text-ink-line-2">
              &ldquo;{OWNER.quote}&rdquo;
            </p>
            <cite className="label mt-4 block not-italic text-mute-2">
              {BUSINESS.ownerName} &middot; {BUSINESS.ownerRole}
            </cite>
          </blockquote>

          <ul className="label m-0 flex list-none flex-wrap items-center gap-x-[22px] gap-y-2 border-t border-sand p-0 pt-4 text-mute-2">
            {OWNER.credentials.map((credential, i) => (
              <li key={credential} className="flex items-center gap-x-[22px]">
                {i > 0 && <span aria-hidden="true">&middot;</span>}
                <span>{credential}</span>
              </li>
            ))}
          </ul>

          <a
            href={BUSINESS.ownerPhoneHref}
            className="flex min-h-[52px] items-center self-start bg-ink px-[26px] py-4 font-sans text-base font-bold text-paper no-underline transition-colors hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {BUSINESS.ownerName} direct &middot; {BUSINESS.ownerPhone}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
