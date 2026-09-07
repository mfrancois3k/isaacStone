import React from 'react';
import { Logo } from './Logo';
import { Phone, MapPin, ShieldCheck, ArrowUp, RefreshCw, Instagram, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onReplayLoader: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onReplayLoader }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-[#475569] border-t-2 border-[#CBD5E1] pt-16 pb-12 relative font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E2E8F0]">
          
          {/* Col 1 & 2: Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" theme="light" />
            <p className="text-xs text-[#64748B] font-sans leading-relaxed max-w-sm">
              ISAAC STONE AND TILE LLC. 
              Engineering monumental spaces from natural quarried marble, durable granite, and precision porcelain slabs.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#0F172A]">
                <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Brentwood, NY &bull; Nassau County &bull; NYC</span>
              </div>
              <div className="flex items-center gap-2 text-[#0F172A]">
                <Phone className="w-3.5 h-3.5 text-[#DC2626]" />
                <a href="tel:6315305883" className="hover:text-[#DC2626] font-bold transition-colors">
                  (631) 530-5883 / (347) 622-8386
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#475569]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Formia Marble &amp; Stone Direct Partner</span>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] mb-4">
              [ SITE NAVIGATION ]
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#home" className="hover:text-[#0F172A] transition-colors">Overview Banner</a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-[#0F172A] transition-colors flex items-center gap-1">
                  <span>Before &amp; After Reels</span>
                  <span className="text-[10px] text-[#DC2626] font-bold">[NEW]</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#0F172A] transition-colors">Stonework Capabilities</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#0F172A] transition-colors">Delivered Properties</a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-[#0F172A] transition-colors">50% Deposit Calculator</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#0F172A] transition-colors">Formia Stone Alliance</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Instagram & Reels */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] mb-4">
              [ INSTAGRAM ARCHIVE ]
            </h4>
            <div className="space-y-3 text-xs">
              <a 
                href="https://www.instagram.com/jafettile____com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] hover:border-[#DC2626] transition-colors flex items-center justify-between text-[#0F172A] group block shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#DC2626]" />
                  <span className="font-bold">@jafettile____com</span>
                </div>
                <ExternalLink className="w-3 h-3 text-[#94A3B8] group-hover:text-[#0F172A]" />
              </a>

              <p className="text-[11px] text-[#64748B] font-sans">
                Follow our official reel feed for daily diamond-cut miter videos and substrate leveling logs.
              </p>
            </div>
          </div>

          {/* Col 5: Quick Utility */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] mb-4">
              [ ACTIONS ]
            </h4>
            <div className="space-y-3 text-xs">
              <button
                onClick={onReplayLoader}
                className="w-full py-2.5 px-3 bg-[#F8F9FA] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#0F172A] flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-bold shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>REPLAY PAGE LOADER</span>
              </button>

              <button
                onClick={scrollToTop}
                className="w-full py-2.5 px-3 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>BACK TO TOP</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Legal Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748B] gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span>&copy; {new Date().getFullYear()} ISAAC STONE AND TILE LLC. All Rights Reserved.</span>
            <span>&bull;</span>
            <span>Suffolk &amp; Nassau County, NY</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="text-[#64748B] hover:text-[#0F172A] underline cursor-pointer"
            >
              Contract Terms &amp; Conditions
            </button>
            <span>&bull;</span>
            <span className="text-[#DC2626] font-bold">L/720 TOLERANCE CERTIFIED</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
