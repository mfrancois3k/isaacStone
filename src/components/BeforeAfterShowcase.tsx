import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Instagram, 
  Video, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { VIDEO_REELS, VideoReelSnapshot } from '../data/videoReels';

export const BeforeAfterShowcase: React.FC = () => {
  const [selectedReel, setSelectedReel] = useState<VideoReelSnapshot>(VIDEO_REELS[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activeMode, setActiveMode] = useState<'slider' | 'before' | 'after'>('slider');

  return (
    <section id="transformations" className="py-20 md:py-28 bg-[#F8F9FA] text-[#0F172A] border-b border-[#CBD5E1] relative font-mono">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-stone-grid opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Architectural Numbered Index with smooth motion reveal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#CBD5E1] pb-6 mb-12 gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs text-[#DC2626] font-bold tracking-widest uppercase mb-2 flex items-center gap-2"
            >
              <motion.span 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="w-8 h-[2px] bg-[#DC2626] origin-left"
              />
              <span>[ 02 // REEL TRANSFORMATION ARCHIVE ]</span>
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2 
                initial={{ y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tighter uppercase"
              >
                BEFORE &amp; AFTER <span className="text-[#DC2626]">SLAB REELS</span>
              </motion.h2>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <a
              href="https://www.instagram.com/jafettile____com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#0F172A] hover:text-white border-2 border-[#CBD5E1] text-xs font-bold text-[#0F172A] transition-all group shadow-xs"
            >
              <Instagram className="w-4 h-4 text-[#DC2626] group-hover:text-white" />
              <span>FOLLOW @jafettile____com</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-white" />
            </a>
            <div className="text-xs text-[#64748B]">
              Suffolk &bull; Nassau &bull; NYC Field Verified
            </div>
          </motion.div>
        </div>

        {/* Reel Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {VIDEO_REELS.map((reel, idx) => {
            const isSelected = selectedReel.id === reel.id;
            return (
              <motion.button
                key={reel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  setSelectedReel(reel);
                  setSliderPosition(50);
                  setActiveMode('slider');
                }}
                className={`text-left p-3.5 border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#DC2626] text-[#0F172A] shadow-md ring-1 ring-[#DC2626]'
                    : 'bg-white/80 border-[#CBD5E1] hover:border-[#0F172A] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className={`font-bold ${isSelected ? 'text-[#DC2626]' : 'text-[#64748B]'}`}>
                    {reel.reelNumber}
                  </span>
                  <span className="text-[9px] bg-[#F1F5F9] px-1 py-0.5 border border-[#E2E8F0] font-bold text-[#334155]">
                    {reel.views}
                  </span>
                </div>
                <div className="text-xs font-bold truncate text-[#0F172A]">
                  {reel.property.split(' ')[0]}...
                </div>
                <div className="text-[10px] text-[#64748B] truncate mt-0.5">
                  {reel.category}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* INTERACTIVE BEFORE/AFTER HERO STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Comparison Canvas (8 Cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8"
          >
            <div className="bg-white border-2 border-[#0F172A] relative overflow-hidden shadow-lg">
              
              {/* HUD Header Bar */}
              <div className="bg-[#0F172A] px-4 py-2.5 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
                  <span className="font-bold">{selectedReel.reelNumber}</span>
                  <span className="text-white/40">|</span>
                  <span className="text-white/80 truncate max-w-[200px] sm:max-w-none">
                    {selectedReel.property}
                  </span>
                </div>

                {/* View Mode Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveMode('before')}
                    className={`px-2.5 py-1 text-[10px] border transition-colors cursor-pointer ${
                      activeMode === 'before'
                        ? 'bg-amber-400 text-black font-bold border-amber-400'
                        : 'bg-white/10 text-white/80 border-white/20 hover:text-white'
                    }`}
                  >
                    BEFORE
                  </button>
                  <button
                    onClick={() => setActiveMode('slider')}
                    className={`px-2.5 py-1 text-[10px] border transition-colors cursor-pointer ${
                      activeMode === 'slider'
                        ? 'bg-[#DC2626] text-white font-bold border-[#DC2626]'
                        : 'bg-white/10 text-white/80 border-white/20 hover:text-white'
                    }`}
                  >
                    SPLIT
                  </button>
                  <button
                    onClick={() => setActiveMode('after')}
                    className={`px-2.5 py-1 text-[10px] border transition-colors cursor-pointer ${
                      activeMode === 'after'
                        ? 'bg-emerald-500 text-white font-bold border-emerald-500'
                        : 'bg-white/10 text-white/80 border-white/20 hover:text-white'
                    }`}
                  >
                    AFTER
                  </button>
                </div>
              </div>

              {/* Comparison Frame */}
              <div className="relative aspect-[16/10] select-none overflow-hidden group">
                {activeMode === 'before' ? (
                  <img
                    src={selectedReel.beforeUrl}
                    alt={selectedReel.beforeLabel}
                    className="w-full h-full object-cover"
                  />
                ) : activeMode === 'after' ? (
                  <img
                    src={selectedReel.afterUrl}
                    alt={selectedReel.afterLabel}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {/* AFTER image (Underneath / Right) */}
                    <img
                      src={selectedReel.afterUrl}
                      alt={selectedReel.afterLabel}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* BEFORE image (Clipped / Left) */}
                    <div 
                      className="absolute inset-0 overflow-hidden border-r-2 border-white pointer-events-none"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src={selectedReel.beforeUrl}
                        alt={selectedReel.beforeLabel}
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: '100%', height: '100%' }}
                      />
                      <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/90 border border-amber-500/50 text-amber-400 text-[10px] font-bold">
                        RAW DEMO / FRAMING
                      </div>
                    </div>

                    {/* AFTER Label Tag (Right) */}
                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/90 border border-[#DC2626] text-white text-[10px] font-bold pointer-events-none">
                      FINISHED ARCHITECTURAL SLAB
                    </div>

                    {/* Interactive Draggable Slider Handle */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
                      aria-label="Drag to compare before and after video frames"
                    />

                    {/* Visual Vertical Divider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] pointer-events-none z-20"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#0F172A] border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                        &harr;
                      </div>
                    </div>
                  </>
                )}

                {/* Video Watermark Stamp */}
                <div className="absolute bottom-3 left-3 bg-black/80 border border-white/15 px-2.5 py-1 text-[10px] text-white/90 pointer-events-none flex items-center gap-1.5">
                  <Video className="w-3 h-3 text-[#DC2626]" />
                  <span>INSTAGRAM: @jafettile____com</span>
                </div>
              </div>

              {/* Slider Control Footer */}
              <div className="p-3 bg-[#F8F9FA] border-t border-[#CBD5E1] flex items-center justify-between text-[11px] text-[#64748B]">
                <span>&larr; Drag slider to scrub between raw subfloor &amp; luxury stone &rarr;</span>
                <span className="text-[#0F172A] font-bold">{sliderPosition}% SPLIT</span>
              </div>
            </div>
          </motion.div>

          {/* Project Details Sidebar (4 Cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            
            {/* Primary Specification Card */}
            <div className="p-5 bg-white border-2 border-[#0F172A] shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-[#DC2626] font-bold mb-1">
                PROJECT RECORD &bull; {selectedReel.location}
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2 tracking-tight">
                {selectedReel.title}
              </h3>
              <p className="text-xs text-[#475569] font-sans leading-relaxed mb-4">
                {selectedReel.description}
              </p>

              <div className="space-y-2.5 pt-3 border-t border-[#E2E8F0] text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Property:</span>
                  <span className="text-[#0F172A] font-semibold text-right">{selectedReel.property}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Dimensions / Specs:</span>
                  <span className="text-[#0F172A] font-semibold text-right">{selectedReel.specs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Video Views:</span>
                  <span className="text-[#DC2626] font-bold">{selectedReel.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Deflection Rating:</span>
                  <span className="text-emerald-600 font-bold">L/720 (Zero Flex)</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <a
                  href="https://www.instagram.com/jafettile____com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs tracking-wider uppercase transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>WATCH FULL REEL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quality Standard Box */}
            <div className="p-4 bg-white border border-[#CBD5E1] text-xs shadow-xs">
              <div className="font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>THE ISAAC STONE &amp; TILE GUARANTEE</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#475569]">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <span>Substrate leveling down to &plusmn;0.2mm before any stone is set.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <span>Direct slab sourcing via Formia Marble &amp; Stone quarried blocks.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <span>100% waterproof Schluter-Kerdi / Ditra uncoupling membrane.</span>
                </li>
              </ul>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
