import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { ArrowUp, Compass } from 'lucide-react';

export const ScrollProgressHUD: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('01 // OVERVIEW');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setPercent(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Check current section
      const sections = [
        { id: 'home', label: '01 // OVERVIEW' },
        { id: 'transformations', label: '02 // REELS' },
        { id: 'services', label: '03 // CAPABILITIES' },
        { id: 'portfolio', label: '04 // PROPERTIES' },
        { id: 'book-consultation', label: '05 // BOOK A CALL' },
        { id: 'about', label: '06 // CRAFTSMANSHIP' },
        { id: 'contact', label: '07 // FIELD CONTACT' },
      ];

      const scrollPos = window.scrollY + 250;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].label);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sectionsNav = [
    { id: 'home', label: '01', title: 'Overview' },
    { id: 'transformations', label: '02', title: 'Reels' },
    { id: 'services', label: '03', title: 'Pillars' },
    { id: 'portfolio', label: '04', title: 'Works' },
    { id: 'book-consultation', label: '05', title: 'Book Call' },
    { id: 'about', label: '06', title: 'Stone' },
    { id: 'contact', label: '07', title: 'Dispatch' },
  ];

  const handleJump = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Pinned Top Hairline Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#E2E8F0] z-50 pointer-events-none">
        <motion.div
          style={{ scaleX }}
          className="h-full bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#DC2626] origin-left shadow-[0_0_8px_rgba(220,38,38,0.5)]"
        />
      </div>

      {/* Desktop Floating Architectural Chapter HUD (Right Edge) */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2 font-mono pointer-events-none">
        <div className="p-2 bg-white/95 border-2 border-[#CBD5E1] backdrop-blur-md shadow-lg flex flex-col gap-1.5 pointer-events-auto">
          <div className="text-[9px] text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] pb-1 px-1 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1 text-[#DC2626] font-bold">
              <Compass className="w-3 h-3" />
              <span>NAV_HUD</span>
            </span>
            <span className="text-[#0F172A] font-bold">{String(percent).padStart(3, '0')}%</span>
          </div>

          <div className="flex flex-col gap-1 py-1">
            {sectionsNav.map((sec) => {
              const isActive = activeSection.startsWith(sec.label);
              return (
                <button
                  key={sec.id}
                  onClick={() => handleJump(sec.id)}
                  title={sec.title}
                  className={`px-2 py-1 text-left text-[10px] font-mono transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                    isActive
                      ? 'bg-[#DC2626] text-white font-bold shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <span className="font-bold">{sec.label}</span>
                  <span className={`text-[9px] uppercase transition-opacity ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {sec.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[#E2E8F0] pt-1 px-1 text-[9px] text-[#64748B] flex items-center justify-between">
            <span>AXIS: Y</span>
            <span className="text-emerald-600 font-bold">&plusmn;0.2mm</span>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button (Placed cleanly so it does not collide with Voice Bot) */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-6 z-40 font-mono"
          >
            <button
              onClick={scrollToTop}
              className="px-3.5 py-2 bg-white hover:bg-[#0F172A] hover:text-white text-[#0F172A] border-2 border-[#CBD5E1] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#DC2626] group-hover:text-white transition-colors" />
              <span className="hidden sm:inline">TOP</span>
              <span className="text-[10px] bg-[#F1F5F9] px-1 py-0.5 border border-[#CBD5E1] text-[#64748B] group-hover:bg-[#1E293B] group-hover:text-white">
                {String(percent).padStart(2, '0')}%
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
