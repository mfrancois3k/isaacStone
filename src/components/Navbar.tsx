import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Menu, X, ArrowRight, RefreshCw, Instagram, Mic } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onReplayLoader: () => void;
  onOpenPrivacy: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReplayLoader, onOpenVoiceAssistant }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Before / After', href: '#transformations' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Book a Call', href: '#book-consultation' },
    { name: 'Craftsmanship', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-mono ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            : 'bg-white/85 backdrop-blur-sm py-4 border-b border-[#E2E8F0]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Redesigned Logo Mark (Light canvas) */}
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="focus:outline-none">
            <Logo size="md" theme="light" />
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs font-bold uppercase tracking-wider text-[#475569] hover:text-[#0F172A] hover:text-[#DC2626] transition-colors py-1 relative group"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#DC2626] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* AI Voice Assistant Trigger */}
            <button
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-xs font-mono text-[#DC2626] transition-colors cursor-pointer group"
              title="Open Voice Consultant"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse text-[#DC2626]" />
              <span className="font-bold text-[11px]">[ AI VOICE AGENT ]</span>
            </button>

            {/* Replay Loader button */}
            <button
              onClick={onReplayLoader}
              title="Replay Dynamic Page Loader"
              className="px-2.5 py-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#CBD5E1] transition-colors flex items-center gap-1.5 text-[11px] font-mono cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#DC2626]" />
              <span className="hidden xl:inline">[ REPLAY ]</span>
            </button>

            {/* Direct Phone Call */}
            <a
              href="tel:6315305883"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#0F172A] text-xs font-mono text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#DC2626]" />
              <span className="font-bold">(631) 530-5883</span>
            </a>

            {/* Primary Action Button */}
            <a
              href="#book-consultation"
              onClick={(e) => handleNavClick(e, '#book-consultation')}
              className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-black uppercase tracking-wider transition-all duration-150 border-2 border-[#DC2626] flex items-center gap-1.5 shadow-sm"
            >
              <span>BOOK A CALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenVoiceAssistant}
              className="p-2 text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA]"
              title="Voice Assistant"
            >
              <Mic className="w-4 h-4 animate-pulse" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8F9FA] focus:outline-none"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Navigation Tray */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 sm:hidden"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white border-l-2 border-[#0F172A] z-50 p-6 flex flex-col justify-between font-mono shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-6">
                  <Logo size="sm" theme="light" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#0F172A] hover:bg-[#F1F5F9] border border-[#CBD5E1]"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col space-y-2">
                  {navLinks.map((link, idx) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-sm font-bold uppercase tracking-wider text-[#0F172A] hover:text-[#DC2626] py-2 border-b border-[#F1F5F9] flex items-center justify-between"
                    >
                      <span>{link.name}</span>
                      <span className="text-[10px] text-[#94A3B8]">0{idx + 1}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile Tray Footer */}
              <div className="space-y-3 pt-6 border-t border-[#E2E8F0]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenVoiceAssistant?.();
                  }}
                  className="w-full py-2.5 px-4 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4 text-[#DC2626] animate-pulse" />
                  <span>LAUNCH AI VOICE AGENT</span>
                </button>

                <a
                  href="https://www.instagram.com/jafettile____com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#F8F9FA] border border-[#E2E8F0] text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Instagram className="w-4 h-4 text-[#DC2626]" />
                  <span>@jafettile____com</span>
                </a>

                <a
                  href="tel:6315305883"
                  className="w-full py-2.5 px-4 bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#DC2626]" />
                  <span>(631) 530-5883</span>
                </a>

                <a
                  href="#book-consultation"
                  onClick={(e) => handleNavClick(e, '#book-consultation')}
                  className="w-full py-3 bg-[#DC2626] text-white text-xs font-black uppercase tracking-wider text-center block"
                >
                  BOOK A CALL &amp; GET ESTIMATE &rarr;
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
