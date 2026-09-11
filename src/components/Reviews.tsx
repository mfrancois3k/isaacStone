import { motion } from 'motion/react';
import {
  BUSINESS,
  FEATURED_REVIEW,
  REVIEWS,
  REVIEWS_DISCLOSURE,
  REVIEWS_SECTION,
} from '../data/site';

const REVEAL = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
};

export function Reviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative z-10 bg-paper"
    >
      {/* The section's visible "heading" is a customer quote, which is not a
          heading. Give the landmark a real name for screen readers. */}
      <h2 id="reviews-heading" className="sr-only">
        Reviews
      </h2>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-10 px-7 py-[clamp(100px,14vw,180px)]">
        <span className="label flex items-center gap-2.5 text-[10px] text-brand">
          <span aria-hidden="true" className="h-0.5 w-[26px] bg-brand" />
          {REVIEWS_SECTION.label}
        </span>

        <blockquote className="display m-0 max-w-[20ch] text-center text-[clamp(40px,6.6vw,100px)] leading-[0.98] tracking-[-0.04em]">
          &ldquo;{FEATURED_REVIEW.quote}&rdquo;
        </blockquote>
        <span className="label text-[11px] text-mute-2">
          {FEATURED_REVIEW.author} &middot; {FEATURED_REVIEW.meta}
        </span>

        <motion.div
          {...REVEAL}
          className="mt-5 grid w-full gap-[clamp(28px,4vw,56px)] border-t border-ink pt-[34px]"
        >
          <div className="grid gap-x-[34px] gap-y-9 text-left sm:grid-cols-3">
            {REVIEWS.map((review) => (
              <div
                key={review.author + review.meta}
                className="flex flex-col gap-3 sm:border-l sm:border-sand sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
              >
                <p className="m-0 text-[19px] leading-[1.5] text-ink-line-2">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <span className="label text-[10px] text-mute-2">
                  {review.author} &middot; {review.meta}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legally load-bearing — rendered verbatim. */}
        <p className="m-0 max-w-[68ch] text-center text-[14px] leading-[1.5] text-mute-2">
          {REVIEWS_DISCLOSURE.before}
          <a
            href={BUSINESS.angiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline underline-offset-2 hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {REVIEWS_DISCLOSURE.linkText}
          </a>
          {REVIEWS_DISCLOSURE.after}
        </p>
      </div>
    </section>
  );
}
