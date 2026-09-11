import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, type Variants } from 'motion/react';
import { PROCESS } from '../data/site';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * [ 04 // PROCESS ] — sticky editorial header on the left, four numbered steps
 * threaded onto a thin rule on the right. The rule fills red as the band
 * scrolls; the steps reveal in sequence.
 */
export function Process() {
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 85%', 'end 65%'],
  });

  const headline: Variants = {
    hidden: { y: reduced ? 0 : '110%' },
    visible: (i: number) => ({
      y: '0%',
      transition: { duration: 1.1, delay: i * 0.1, ease: EASE },
    }),
  };

  const stepList: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14 } },
  };

  const step: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 26 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
  };

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative bg-paper-2 text-ink border-t-2 border-brand"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-10 px-7 py-[clamp(100px,14vw,200px)] lg:grid-cols-2 lg:gap-[clamp(40px,5vw,90px)]">
        {/* Left — sticky header */}
        <div className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-[110px]">
          <span className="label flex items-center gap-2.5 text-brand">
            <span className="h-0.5 w-[26px] bg-brand" aria-hidden="true" />
            {PROCESS.label}
          </span>

          <h2
            id="process-heading"
            className="display m-0 text-[clamp(52px,7.4vw,112px)] leading-[0.88] tracking-[-0.045em]"
          >
            {['How a', 'job runs'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={i === 1 ? 'block italic' : 'block'}
                  variants={headline}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <p className="m-0 max-w-[34ch] font-sans text-[18px] leading-[1.55] text-mute-3">
            {PROCESS.subhead}
          </p>
        </div>

        {/* Right — the rule and the steps */}
        <div ref={listRef} className="relative min-w-0 pl-[34px]">
          <div className="absolute top-0 bottom-0 left-0 w-px bg-sand-2" aria-hidden="true">
            <motion.div
              className="h-full w-px origin-top bg-brand"
              style={{ scaleY: scrollYProgress }}
            />
          </div>

          <motion.ol
            className="m-0 flex list-none flex-col p-0"
            variants={stepList}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {PROCESS.steps.map((s, i) => (
              <motion.li
                key={s.number}
                variants={step}
                className={`relative grid grid-cols-[minmax(64px,140px)_minmax(0,1fr)] items-start gap-[18px] border-t border-sand-2 py-[34px] ${
                  i === PROCESS.steps.length - 1 ? 'border-b' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[39px] top-[38px] h-[9px] w-[9px] rounded-full bg-brand"
                />
                <span
                  aria-hidden="true"
                  className="display text-[clamp(48px,8vw,120px)] leading-[0.78] tracking-[-0.04em]"
                  style={
                    i === 0
                      ? { color: 'var(--color-brand)' }
                      : {
                          color: 'transparent',
                          WebkitTextStroke: '1px var(--color-ink)',
                        }
                  }
                >
                  {s.number}
                </span>
                <div className="flex flex-col gap-[9px] pt-2">
                  <h3 className="display m-0 text-[clamp(26px,3.2vw,32px)] leading-[1.02]">
                    <span className="sr-only">{`Step ${s.number}: `}</span>
                    {s.title}
                  </h3>
                  <p className="m-0 max-w-[46ch] font-sans text-[17px] leading-[1.55] text-mute-3">
                    {s.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
