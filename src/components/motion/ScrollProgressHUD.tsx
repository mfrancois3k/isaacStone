import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

/** Sections the HUD tracks, in document order. Ids must match the rendered sections. */
const SECTIONS = [
  { id: 'hero', index: '00', title: 'Overview' },
  { id: 'services', index: '01', title: 'Services' },
  { id: 'work', index: '02', title: 'Work' },
  { id: 'reviews', index: '03', title: 'Reviews' },
  { id: 'process', index: '04', title: 'Process' },
  { id: 'contact', index: '05', title: 'Contact' },
];

/**
 * Thin scroll-progress rule pinned to the top of the page, plus a right-hand
 * section index on large screens. Decorative — every destination it offers is
 * also reachable from the navbar, so it is hidden from assistive tech.
 */
export const ScrollProgressHUD: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    // Track the section whose top has most recently passed the reading line.
    const readingLine = () => window.innerHeight * 0.35;

    const handleScroll = () => {
      const line = window.scrollY + readingLine();
      let current = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= line) current = section.id;
      }
      setActiveId(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div aria-hidden="true">
      {/* Progress rule */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-brand"
      />

      {/* Section index */}
      <nav className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex">
        {SECTIONS.map((section) => {
          const isActive = section.id === activeId;
          return (
            <button
              key={section.id}
              type="button"
              tabIndex={-1}
              onClick={() => jumpTo(section.id)}
              className="pointer-events-auto group flex items-center gap-3"
            >
              <span
                className={`label transition-colors duration-300 ${
                  isActive
                    ? 'text-brand'
                    : 'text-mute-light-2 opacity-0 group-hover:opacity-100'
                }`}
              >
                {section.index} {section.title}
              </span>
              <span
                className={`block h-px transition-all duration-300 ${
                  isActive ? 'w-8 bg-brand' : 'w-4 bg-mute-light-2 group-hover:w-6'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
};
