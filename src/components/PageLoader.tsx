import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { ArrowRight, Ruler, Eye, Video, Instagram } from 'lucide-react';
import { VIDEO_REELS, HERO_SLAB } from '../data/videoReels';

interface PageLoaderProps {
  onComplete: () => void;
  isReplay?: boolean;
}

// Staggered variants strictly following wrongakram/pageloader
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 160, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 1.2,
    },
  },
  exit: {
    opacity: 0,
    y: -160,
    scale: 0.9,
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 0.6,
    },
  },
};

const itemMainVariants = {
  hidden: { opacity: 0, y: 180, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 1.2,
    },
  },
};

const telemetrySteps = [
  'TILES TAILORED TO YOUR HOME — BESPOKE ARCHITECTURAL STONEWORK',
  'LOADING 4K VIDEO TRANSFORMATION REELS (@jafettile____com)...',
  'CALIBRATING DIAMOND CUT DEFLECTION (L/720 ±0.2mm)...',
  'CURATING QUARRIED ITALIAN MARBLE & PORCELAIN SLABS...',
  'TILES TAILORED TO YOUR HOME — ISAAC STONE AND TILE LLC VERIFIED',
];

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [showBefore, setShowBefore] = useState(false);

  // Auto toggle between Before and After every 2.2 seconds to show real video reel transformations
  useEffect(() => {
    const flipTimer = setInterval(() => {
      setShowBefore((prev) => !prev);
    }, 2200);
    return () => clearInterval(flipTimer);
  }, []);

  // Telemetry ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const inc = prev < 30 ? 6 : prev < 70 ? 4 : prev < 90 ? 3 : 6;
        return Math.min(100, prev + inc);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const idx = Math.min(
      telemetrySteps.length - 1,
      Math.floor((progress / 100) * telemetrySteps.length)
    );
    setStepIndex(idx);

    if (progress === 100) {
      // Trigger seamless handoff to Hero banner
      const timer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setProgress(100);
    setTimeout(() => {
      onComplete();
    }, 50);
  };

  const reel1 = VIDEO_REELS[1]; // Brentwood Master Bath
  const reel2Hero = HERO_SLAB;   // Roslyn Harbor Monolithic Waterfall Island
  const reel3 = VIDEO_REELS[2]; // Garden City Fireplace
  const reel4 = VIDEO_REELS[3]; // Manhasset Chevron Foyer
  const reel5 = VIDEO_REELS[4]; // Southampton Terrace

  return (
    <motion.div
      key="wrongakram-pageloader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.65, ease: [0.6, 0.01, -0.05, 0.95] }
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#0A0B0D] text-[#E4E6EB] select-none flex flex-col justify-between font-mono"
    >
      {/* Brutalist Raw Grid Overlay & Laser Accent */}
      <div className="absolute inset-0 bg-stone-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent" />

      {/* Top Brutalist Header Bar */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <Logo size="sm" showSubtitle={false} />
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/15 text-[11px] uppercase tracking-wider text-[#A0A6B2]">
            <Instagram className="w-3.5 h-3.5 text-[#D32F2F]" />
            <span>@jafettile____com &bull; INSTAGRAM VIDEO REEL ARCHIVE</span>
          </div>
        </div>

        {/* Dynamic Before / After Toggle & Skip Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBefore(!showBefore)}
            className="px-3 py-1.5 bg-[#17181A] hover:bg-[#202226] border border-white/20 text-[11px] text-white flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#D32F2F]" />
            <span>MODE:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${showBefore ? 'bg-amber-500 text-black' : 'bg-[#D32F2F] text-white'}`}>
              {showBefore ? 'BEFORE (DEMO)' : 'AFTER (STONE)'}
            </span>
          </button>

          <button
            onClick={handleSkip}
            className="text-[11px] uppercase tracking-widest text-[#A0A6B2] hover:text-white px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Skip [ESC]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WRONGAKRAM DYNAMIC 5-IMAGE / VIDEO REELS STAGE */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 my-auto flex items-center justify-center min-h-[460px]"
      >
        {/* REEL 1: Bottom-Left (Brentwood Master Bath) */}
        <motion.div
          variants={itemVariants}
          className="absolute left-2 sm:left-6 md:left-8 bottom-4 sm:bottom-10 w-44 sm:w-60 md:w-72 bg-[#121316] border-2 border-white/20 shadow-2xl z-10 hidden sm:block overflow-hidden"
        >
          <div className="relative aspect-[4/3] overflow-hidden group">
            <img
              src={showBefore ? reel1.beforeUrl : reel1.afterUrl}
              alt={reel1.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            
            {/* Reel HUD Stamp */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono">
              <span className={`px-1.5 py-0.5 font-bold ${showBefore ? 'bg-amber-500 text-black' : 'bg-[#D32F2F] text-white'}`}>
                {showBefore ? 'DEMO STUDS' : 'BOOKMATCH'}
              </span>
              <span className="text-white/80 bg-black/60 px-1 py-0.5 border border-white/10">
                {reel1.views}
              </span>
            </div>

            <div className="absolute bottom-2 left-2.5 right-2.5 text-left">
              <div className="text-[9px] uppercase tracking-wider text-[#D32F2F] font-bold">
                {reel1.property}
              </div>
              <div className="text-xs font-bold text-white truncate font-mono">
                {reel1.title}
              </div>
            </div>
          </div>
        </motion.div>

        {/* REEL 5: Top-Left (Southampton Oceanfront Terrace) */}
        <motion.div
          variants={itemVariants}
          className="absolute left-4 sm:left-10 top-2 sm:top-6 w-36 sm:w-52 md:w-64 bg-[#121316] border-2 border-white/20 shadow-2xl z-10 hidden md:block overflow-hidden"
        >
          <div className="relative aspect-[16/10] overflow-hidden group">
            <img
              src={showBefore ? reel5.beforeUrl : reel5.afterUrl}
              alt={reel5.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px]">
              <span className={`px-1.5 py-0.5 font-bold ${showBefore ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'}`}>
                {showBefore ? 'RAW TRENCH' : 'GRANITE PATIO'}
              </span>
            </div>

            <div className="absolute bottom-2 left-2.5 right-2.5 text-left">
              <div className="text-[9px] uppercase tracking-wider text-[#D32F2F] font-bold">
                {reel5.property}
              </div>
              <div className="text-[11px] font-bold text-white truncate font-mono">
                {reel5.specs}
              </div>
            </div>
          </div>
        </motion.div>

        {/* HERO CENTERPIECE SLAB (layoutId="main-image-1" from wrongakram/pageloader) */}
        <motion.div
          variants={itemMainVariants}
          className="relative z-20 w-full max-w-[340px] sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto flex flex-col items-center"
        >
          {/* Prominent Architectural Tagline as requested */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-2 sm:mb-3 px-3.5 py-1 bg-black/90 border-2 border-[#D32F2F] text-white text-[11px] sm:text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(211,47,47,0.4)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-ping" />
            <span className="text-[#D32F2F] font-mono">[</span>
            <span>TILES TAILORED TO YOUR HOME</span>
            <span className="text-[#D32F2F] font-mono">]</span>
          </motion.div>

          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] border-2 border-white/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-[#121316] overflow-hidden">
            {/* The shared animated motion element */}
            <motion.img
              layoutId="main-image-1"
              transition={{ ease: [0.6, 0.01, -0.05, 0.9], duration: 1.6 }}
              src={showBefore ? reel2Hero.beforeUrl : reel2Hero.afterUrl}
              alt={reel2Hero.title}
              className="w-full h-full object-cover"
            />

            {/* Brutalist Architectural Crosshairs */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D32F2F]" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D32F2F]" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D32F2F]" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D32F2F]" />

            {/* Brutalist Video Reel Indicator Bar */}
            <div className="absolute top-3 left-10 right-10 flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-2 px-2 py-0.5 bg-black/80 border border-white/20 text-white">
                <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-ping" />
                <span>REC [●] 4K 60FPS</span>
                <span className="text-white/60">| {reel2Hero.duration}</span>
              </div>

              <div className="px-2 py-0.5 bg-[#D32F2F] text-white font-bold tracking-wider uppercase">
                {showBefore ? 'BEFORE: RAW SUBFLOOR' : 'AFTER: MONOLITHIC SLAB'}
              </div>
            </div>

            {/* Reel Specifications Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 flex items-end justify-between text-left">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#D32F2F] font-bold">
                  {reel2Hero.property}
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                  {reel2Hero.title}
                </div>
                <div className="text-[11px] text-[#A0A6B2] font-mono mt-0.5">
                  {reel2Hero.specs} &bull; Verified by Formia Stone
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-bold text-emerald-400 font-mono">
                  142K INSTAGRAM VIEWS
                </div>
                <div className="text-[10px] text-[#8B949E]">
                  @jafettile____com
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* REEL 3: Top-Right (Garden City 18ft Fireplace) */}
        <motion.div
          variants={itemVariants}
          className="absolute right-2 sm:right-6 md:right-8 top-4 sm:top-8 w-40 sm:w-56 md:w-68 bg-[#121316] border-2 border-white/20 shadow-2xl z-10 hidden sm:block overflow-hidden"
        >
          <div className="relative aspect-[4/3] overflow-hidden group">
            <img
              src={showBefore ? reel3.beforeUrl : reel3.afterUrl}
              alt={reel3.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px]">
              <span className={`px-1.5 py-0.5 font-bold ${showBefore ? 'bg-amber-500 text-black' : 'bg-[#D32F2F] text-white'}`}>
                {showBefore ? 'DATED BRICK' : '18FT SLAB'}
              </span>
            </div>

            <div className="absolute bottom-2 left-2.5 right-2.5 text-left">
              <div className="text-[9px] uppercase tracking-wider text-[#D32F2F] font-bold">
                {reel3.property}
              </div>
              <div className="text-xs font-bold text-white truncate font-mono">
                {reel3.title}
              </div>
            </div>
          </div>
        </motion.div>

        {/* REEL 4: Bottom-Right (Manhasset Chevron Foyer) */}
        <motion.div
          variants={itemVariants}
          className="absolute right-4 sm:right-10 bottom-2 sm:bottom-6 w-40 sm:w-60 md:w-72 bg-[#121316] border-2 border-white/20 shadow-2xl z-10 hidden md:block overflow-hidden"
        >
          <div className="relative aspect-[16/10] overflow-hidden group">
            <img
              src={showBefore ? reel4.beforeUrl : reel4.afterUrl}
              alt={reel4.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px]">
              <span className={`px-1.5 py-0.5 font-bold ${showBefore ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'}`}>
                {showBefore ? 'UNEVEN PLYWOOD' : 'CHEVRON PORCELAIN'}
              </span>
            </div>

            <div className="absolute bottom-2 left-2.5 right-2.5 text-left">
              <div className="text-[9px] uppercase tracking-wider text-[#D32F2F] font-bold">
                {reel4.property}
              </div>
              <div className="text-xs font-bold text-white truncate font-mono">
                {reel4.specs}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Brutalist Telemetry HUD & Calibration Gauge */}
      <div className="relative z-20 max-w-3xl w-full mx-auto px-4 pb-6">
        <div className="p-4 sm:p-5 bg-[#121316] border-2 border-white/20 shadow-2xl">
          
          {/* Header Telemetry Row */}
          <div className="flex items-center justify-between text-xs text-[#8B949E] mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-[#D32F2F] animate-ping" />
              <span className="text-white font-bold tracking-wider">
                ISAAC STONE AND TILE LLC
              </span>
              <span className="text-white/40">|</span>
              <span className="text-[#D32F2F] font-semibold">@jafettile____com</span>
            </div>
            <div className="flex items-center gap-1 text-[#D32F2F]">
              <Ruler className="w-3.5 h-3.5" />
              <span>DEFLECTION L/720 &bull; &plusmn;0.2mm MITERS</span>
            </div>
          </div>

          {/* Counter & Progress Row */}
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-3xl sm:text-4xl font-black text-white flex items-baseline tracking-tight">
              <span>{progress}</span>
              <span className="text-[#D32F2F] text-xl ml-1 font-mono">%</span>
            </div>
            <div className="text-[11px] uppercase tracking-widest text-[#A0A6B2] flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>PREPARING ARCHITECTURAL SLAB HANDOFF</span>
            </div>
          </div>

          {/* Brutalist Progress Bar with Sharp Laser Edge */}
          <div className="relative h-2.5 w-full bg-black border border-white/20 overflow-hidden mb-2.5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#991B1B] via-[#D32F2F] to-[#FF2E2E] relative transition-all duration-75"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white shadow-[0_0_10px_#FFFFFF]" />
            </motion.div>
          </div>

          {/* Dynamic Telemetry Step Message */}
          <div className="flex items-center justify-between text-[11px] text-[#A1A7B0]">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#D32F2F] font-black">&gt;&gt;</span>
              <span className="truncate">{telemetrySteps[stepIndex]}</span>
            </div>
            <span className="text-[10px] text-[#717885] hidden sm:inline flex-shrink-0 ml-2">
              BRENTWOOD &bull; NASSAU COUNTY, NY
            </span>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
