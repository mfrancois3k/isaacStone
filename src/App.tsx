import React, { useState, useEffect } from 'react';
import { LayoutGroup, AnimatePresence, motion } from 'motion/react';
import { PageLoader } from './components/PageLoader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BeforeAfterShowcase } from './components/BeforeAfterShowcase';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { EstimateCalculator } from './components/EstimateCalculator';
import { AboutCraftsmanship } from './components/AboutCraftsmanship';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';
import { ScrollProgressHUD } from './components/motion/ScrollProgressHUD';
import { ArchitecturalCursor } from './components/motion/ArchitecturalCursor';
import { VoiceChatBot } from './components/VoiceChatBot';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  const handleReplayLoader = () => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LayoutGroup id="wrongakram-stone-transition-group">
      <div className="min-h-screen bg-white text-[#0F172A] relative selection:bg-[#DC2626] selection:text-white antialiased font-mono">
        
        <AnimatePresence mode="wait">
          {/* Dynamic Image Page Loader */}
          {isLoading ? (
            <PageLoader key="pageloader" onComplete={() => setIsLoading(false)} />
          ) : (
            <motion.div
              key="main-site-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* Precision Architectural Crosshair Cursor (Desktop) */}
              <ArchitecturalCursor />

              {/* Pinned Top Scroll Progress Bar & Right Section Nav HUD */}
              <ScrollProgressHUD />

              {/* Sticky Top Navigation */}
              <Navbar 
                onReplayLoader={handleReplayLoader}
                onOpenPrivacy={() => setPrivacyModalOpen(true)}
              />

              {/* Main Content Flow */}
              <main>
                {/* Hero Section with Kinetic Banner & Docked Shared Transition Image */}
                <Hero onOpenCalculator={handleScrollToCalculator} />

                {/* Interactive Before & After Video Reel Transformation Showcase */}
                <BeforeAfterShowcase />

                {/* Services Section with Interactive Pillars & Standard Rate Card */}
                <Services />

                {/* Portfolio Grid with Verified Long Island & NY Properties */}
                <Portfolio />

                {/* Instant Estimate & 50% Deposit Text-to-Invoice System */}
                <EstimateCalculator />

                {/* About / Master Masonry Craftsmanship & Formia Stone Alliance */}
                <AboutCraftsmanship />

                {/* Direct Field Contact & Survey Dispatch */}
                <ContactSection />
              </main>

              {/* Footer with Copyright & Links */}
              <Footer 
                onOpenPrivacy={() => setPrivacyModalOpen(true)} 
                onReplayLoader={handleReplayLoader}
              />

              {/* AI Voice Consultant Bot Drawer & Trigger */}
              <VoiceChatBot />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legal / Terms of Work Modal */}
        <PrivacyModal 
          isOpen={privacyModalOpen} 
          onClose={() => setPrivacyModalOpen(false)} 
        />

      </div>
    </LayoutGroup>
  );
}
