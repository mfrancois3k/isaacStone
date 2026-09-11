import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { PageLoader } from './components/PageLoader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FirmBand } from './components/FirmBand';
import { Services } from './components/Services';
import { Work } from './components/Work';
import { Reviews } from './components/Reviews';
import { AboutCraftsmanship } from './components/AboutCraftsmanship';
import { BeforeAfterShowcase } from './components/BeforeAfterShowcase';
import { Process } from './components/Process';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';
import { VoiceChatBot } from './components/VoiceChatBot';
import { ScrollProgressHUD } from './components/motion/ScrollProgressHUD';
import { ArchitecturalCursor } from './components/motion/ArchitecturalCursor';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Hold the page still behind the intro, then hand scrolling back.
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  const replayLoader = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsLoading(true);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-paper text-ink antialiased">
      <a
        href="#contact"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to contact
      </a>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <PageLoader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ArchitecturalCursor />
            <ScrollProgressHUD />

            <Navbar onReplayLoader={replayLoader} />

            <main>
              <Hero onRequestEstimate={scrollToContact} />
              <FirmBand />
              <Services />
              <Work />
              <Reviews />
              <AboutCraftsmanship />
              <BeforeAfterShowcase />
              <Process />
              <ContactSection />
            </main>

            <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />

            <VoiceChatBot />
          </motion.div>
        )}
      </AnimatePresence>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
