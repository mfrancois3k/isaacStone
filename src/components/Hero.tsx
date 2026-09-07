import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Ruler, 
  Calculator, 
  Hammer, 
  Send,
  Building2,
  Clock,
  Instagram,
  Eye,
  Video,
  ChevronDown,
  Mic
} from 'lucide-react';
import { ProjectType, QuoteFormData } from '../types';
import { HERO_SLAB } from '../data/videoReels';
import { VelocityMarquee } from './motion/VelocityMarquee';
import confetti from 'canvas-confetti';

interface HeroProps {
  onQuoteSuccess?: (data: QuoteFormData) => void;
  onOpenCalculator?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCalculator, onOpenVoiceAssistant }) => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // GreenSock / MotionSites style smooth, stately parallax
  const yHeroParallax = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yHeadline = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const opacityScrollCue = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    projectType: 'Tile Installation',
    sqft: '250',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showBeforeHero, setShowBeforeHero] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/leads/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType,
          sqftRange: `${formData.sqft} sq ft`,
          preferredCallTime: 'Morning (8:00 AM - 11:00 AM)',
          addressOrTown: 'Brentwood / Long Island, NY',
          notes: formData.message || 'Direct Hero Estimate Request'
        })
      });
    } catch {
      // continues gracefully
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // graceful fallback
      }
    }
  };

  const projectTypes: ProjectType[] = [
    'Tile Installation',
    'Granite Countertops',
    'Custom Masonry/Stone',
    'Marble Bathroom Remodel',
    'Fireplace Slabs & Accents'
  ];

  return (
    <section ref={heroRef} id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-white text-[#0F172A]">
      {/* Precision Stone Grid Overlay & Registration Mark */}
      <div className="absolute inset-0 bg-stone-grid opacity-60 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#DC2626] via-[#E2E8F0] to-transparent" />

      {/* Structural Crosshair Marks (MotionSites architectural cues) */}
      <motion.div 
        style={{ y: yHeadline }}
        className="hidden lg:block absolute top-32 left-8 text-[11px] font-mono text-[#94A3B8] select-none"
      >
        [+ 40.7818° N, 73.1973° W | BRENTWOOD_HQ ]
      </motion.div>
      <motion.div 
        style={{ y: yHeadline }}
        className="hidden lg:block absolute top-32 right-8 text-[11px] font-mono text-[#94A3B8] select-none"
      >
        [ SPEC: ASTM C615 &bull; DEFLECTION: L/720 ]
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* STATELY KINETIC TYPOGRAPHIC BANNER (MotionSites & GreenSock inspired) */}
        <div className="mb-10 border-b-2 border-[#E2E8F0] pb-8">
          
          {/* Top Banner Row: Alliance & Instagram Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#F8F9FA] border border-[#CBD5E1] text-xs font-mono text-[#334155] shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full bg-[#DC2626] opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-[#DC2626]" />
              </span>
              <span className="text-[#475569]">
                FABRICATION ALLIANCE WITH <strong className="text-[#0F172A] font-bold">FORMIA MARBLE &amp; STONE</strong>
              </span>
              <span className="text-[#DC2626] font-bold hidden sm:inline">| 35+ ESTATES DELIVERED</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenVoiceAssistant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-xs font-mono text-[#DC2626] transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-bold">AI VOICE CONSULTANT</span>
              </button>

              <a 
                href="https://www.instagram.com/jafettile____com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] hover:bg-[#0F172A] hover:text-white border border-[#CBD5E1] text-xs font-mono text-[#475569] transition-all group"
              >
                <Instagram className="w-3.5 h-3.5 text-[#DC2626] group-hover:text-white" />
                <span>@jafettile____com</span>
                <span className="text-[10px] bg-[#E2E8F0] group-hover:bg-white/20 px-1 py-0.5 text-[#0F172A] group-hover:text-white font-bold">142K+ VIEWS</span>
              </a>
            </div>
          </div>

          {/* Monumental Masked Headline Reveal (Smooth MotionSites & GSAP easing: [0.16, 1, 0.3, 1]) */}
          <motion.div style={{ y: yHeadline }}>
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-[#0F172A] leading-[0.92] uppercase select-none font-mono">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="inline-block mr-3 sm:mr-6 text-[#0F172A]"
                >
                  ISAAC
                </motion.span>
                <motion.span
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                  className="inline-block text-[#DC2626] mr-3 sm:mr-6"
                >
                  STONE
                </motion.span>
              </span>
              <span className="block overflow-hidden pt-1">
                <motion.span
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
                  className="inline-block text-3xl sm:text-5xl lg:text-7xl text-[#64748B] font-medium tracking-normal"
                >
                  &amp; TILE LLC
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* Calm, Gentle Architectural Marquee Ticker */}
          <div className="mt-6 py-3 bg-[#F8F9FA] border-y border-[#CBD5E1] overflow-hidden">
            <VelocityMarquee baseVelocity={0.35} className="text-xs font-mono text-[#64748B]">
              <div className="flex items-center gap-6 pr-6">
                <span className="flex items-center gap-2 text-[#DC2626] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>TILES TAILORED TO YOUR HOME</span>
                </span>
                <span className="text-[#CBD5E1]">//</span>
                <span className="flex items-center gap-2 text-[#0F172A] font-bold">
                  <span>ISAAC STONE AND TILE LLC</span>
                </span>
                <span className="text-[#CBD5E1]">//</span>
                <span className="text-[#0F172A] font-semibold">WATERFALL QUARTZITE ISLANDS</span>
                <span className="text-[#CBD5E1]">//</span>
                <span className="text-[#DC2626] font-bold">BOOKMATCHED CALACATTA MARBLE</span>
                <span className="text-[#CBD5E1]">//</span>
                <span className="text-[#0F172A] font-semibold">LARGE-FORMAT PORCELAIN SLABS</span>
                <span className="text-[#CBD5E1]">//</span>
                <span>BRENTWOOD &bull; NASSAU COUNTY &bull; THE HAMPTONS</span>
                <span className="text-[#CBD5E1]">//</span>
                <span className="text-emerald-600 font-bold">ZERO-LIPPAGE GUARANTEE</span>
                <span className="text-[#CBD5E1]">//</span>
                <span className="text-[#0F172A] font-bold">DIRECT FIELD SURVEY PIPELINE</span>
                <span className="text-[#CBD5E1]">//</span>
              </div>
            </VelocityMarquee>
          </div>

        </div>

        {/* HERO SHOWCASE & DOCKED TRANSITION IMAGE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Master Craftsmanship & Hero Image Showcase */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* SHARED TRANSITION HERO IMAGE with scroll parallax depth and museum framing */}
            <motion.div 
              style={{ y: yHeroParallax }}
              className="relative w-full border-2 border-[#0F172A] shadow-[0_20px_40px_rgba(0,0,0,0.08)] bg-white mb-6 group overflow-hidden"
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                {/* Image */}
                <motion.img
                  layoutId="main-image-1"
                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
                  src={showBeforeHero ? HERO_SLAB.beforeUrl : HERO_SLAB.afterUrl}
                  alt={HERO_SLAB.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />

                {/* Corner Registration L-Brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#DC2626] pointer-events-none" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#DC2626] pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#DC2626] pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#DC2626] pointer-events-none" />

                {/* Live Specification & Before/After Toggle Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#0F172A]/90 border border-white/20 text-[10px] font-mono text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#DC2626] animate-pulse" />
                      <span>{HERO_SLAB.reelNumber}</span>
                    </span>
                    <span className="px-2 py-1 bg-[#DC2626] text-white text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline">
                      &plusmn;0.2mm MITER PRECISION
                    </span>
                  </div>

                  {/* Interactive Before/After Flip Control */}
                  <button
                    type="button"
                    onClick={() => setShowBeforeHero(!showBeforeHero)}
                    className="px-2.5 py-1 bg-[#0F172A]/90 hover:bg-[#DC2626] border border-white/30 text-white text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-[#DC2626] group-hover:text-white" />
                    <span>VIEW:</span>
                    <span className="font-bold underline">
                      {showBeforeHero ? 'RAW SUBFLOOR DEMO' : 'FINISHED STONE SLAB'}
                    </span>
                  </button>
                </div>

                {/* Bottom Spec Details Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-end justify-between font-mono">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#DC2626] font-bold">
                      {HERO_SLAB.property}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white">
                      {HERO_SLAB.title}
                    </div>
                    <div className="text-xs text-white/80 mt-0.5 font-sans">
                      {HERO_SLAB.specs} &bull; Formia Marble Quarried Slab
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-emerald-400">100% VEIN SYNCHRONIZED</div>
                    <div className="text-[10px] text-white/70">Zero Deflection Underlayment</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Architectural Narrative Paragraph */}
            <p className="text-base sm:text-lg text-[#334155] font-normal leading-relaxed mb-6 font-sans">
              Precision tile setting, quarried granite, and bookmatched marble installations engineered with uncompromising masonry standards by <strong className="text-[#0F172A] font-bold">ISAAC STONE AND TILE LLC</strong>. Serving <span className="text-[#0F172A] font-semibold">Brentwood</span>, <span className="text-[#0F172A] font-semibold">Nassau County</span>, <span className="text-[#0F172A] font-semibold">The Hamptons</span>, and premier residences across Greater NY.
            </p>

            {/* Action Buttons: Clean Architectural Blocks */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8 font-mono">
              <a
                href="#quote-form"
                className="px-6 py-3.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 border-2 border-[#DC2626] flex items-center gap-2 shadow-sm"
              >
                <span>REQUEST FIELD ESTIMATE</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenVoiceAssistant}
                className="px-5 py-3.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 border-2 border-[#FECACA] flex items-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4 animate-pulse" />
                <span>VOICE AGENT</span>
              </button>

              <a
                href="#transformations"
                className="px-5 py-3.5 bg-[#F8F9FA] hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 border-2 border-[#CBD5E1] flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-[#DC2626]" />
                <span>BEFORE / AFTER</span>
              </a>

              {onOpenCalculator && (
                <button
                  onClick={onOpenCalculator}
                  className="px-4 py-3 bg-white hover:bg-[#F8F9FA] border border-[#CBD5E1] text-xs font-mono text-[#475569] hover:text-[#0F172A] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-[#DC2626]" />
                  <span>BOOK A CALL &amp; ESTIMATE &rarr;</span>
                </button>
              )}
            </div>

            {/* Technical Trust Strip: Crisp White Cards */}
            <div className="border-t-2 border-[#E2E8F0] pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-3.5 bg-[#F8F9FA] border border-[#CBD5E1]">
                <div className="flex items-center gap-2 text-[#DC2626] mb-1">
                  <Ruler className="w-4 h-4" />
                  <span className="text-xs font-bold text-[#64748B]">TOLERANCE</span>
                </div>
                <div className="text-lg font-black text-[#0F172A]">&plusmn;0.2mm</div>
                <div className="text-[11px] text-[#64748B]">Diamond Mitered Edges</div>
              </div>

              <div className="p-3.5 bg-[#F8F9FA] border border-[#CBD5E1]">
                <div className="flex items-center gap-2 text-[#DC2626] mb-1">
                  <Hammer className="w-4 h-4" />
                  <span className="text-xs font-bold text-[#64748B]">EXPERIENCE</span>
                </div>
                <div className="text-lg font-black text-[#0F172A]">15+ YEARS</div>
                <div className="text-[11px] text-[#64748B]">Master NY Masonry</div>
              </div>

              <div className="p-3.5 bg-[#F8F9FA] border border-[#CBD5E1] col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold text-[#64748B]">WARRANTY</span>
                </div>
                <div className="text-lg font-black text-[#0F172A]">ZERO DEFECT</div>
                <div className="text-[11px] text-[#64748B]">Substrate Deflection L/720</div>
              </div>
            </div>
          </div>

          {/* RIGHT: High-Converting Quote Form with Light Architectural Styling */}
          <div id="quote-form" className="lg:col-span-5 font-mono">
            <div className="relative bg-white border-2 border-[#0F172A] p-6 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.06)]">
              
              {/* Corner Registration Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 bg-[#DC2626]" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#DC2626]" />

              <div className="flex items-center justify-between mb-5 border-b border-[#E2E8F0] pb-3">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
                    <span>DIRECT ESTIMATE DISPATCH</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 font-sans">
                    Field verification scheduled within 2 hours
                  </p>
                </div>
                <span className="px-2 py-1 bg-[#DC2626] text-white text-[10px] font-bold uppercase tracking-wider">
                  2026 RATES LIVE
                </span>
              </div>

              {submitted ? (
                <div className="py-6 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-[#0F172A] mb-2">Estimate Request Dispatched</h4>
                  <p className="text-xs text-[#475569] mb-5 max-w-xs font-sans">
                    Thank you, <strong className="text-[#0F172A]">{formData.name || 'valued client'}</strong>. 
                    Our field supervisor at ISAAC STONE AND TILE LLC will inspect your {formData.sqft} sq ft {formData.projectType} specifications.
                  </p>
                  
                  <div className="w-full p-3 bg-[#F8F9FA] border border-[#CBD5E1] text-left text-xs space-y-1.5 mb-5 font-mono">
                    <div className="text-[#64748B] flex justify-between">
                      <span>Dispatch Phone:</span>
                      <span className="text-[#0F172A] font-semibold">{formData.phone || '(631) 530-5883'}</span>
                    </div>
                    <div className="text-[#64748B] flex justify-between">
                      <span>Territory:</span>
                      <span className="text-[#DC2626]">Brentwood &amp; Nassau, NY</span>
                    </div>
                    <div className="text-[#64748B] flex justify-between">
                      <span>Status:</span>
                      <span className="text-emerald-600 font-bold">DISPATCH QUEUED</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        projectType: 'Tile Installation',
                        sqft: '250',
                        message: ''
                      });
                    }}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] underline cursor-pointer font-mono"
                  >
                    [ Submit another project ]
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robert Rossi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs focus:outline-none focus:border-[#DC2626] transition-colors font-sans"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="robert@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs focus:outline-none focus:border-[#DC2626] transition-colors font-sans"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(631) 530-5883"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs focus:outline-none focus:border-[#DC2626] transition-colors font-sans"
                      />
                    </div>
                  </div>

                  {/* Project Type Dropdown & Estimated Sq Footage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1">
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value as ProjectType })}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#DC2626] transition-colors font-sans"
                      >
                        {projectTypes.map((pt) => (
                          <option key={pt} value={pt} className="bg-white text-[#0F172A]">
                            {pt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1">
                        Square Footage
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="20"
                          max="10000"
                          placeholder="250"
                          value={formData.sqft}
                          onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs focus:outline-none focus:border-[#DC2626] transition-colors font-mono"
                        />
                        <span className="absolute right-3 top-2.5 text-[11px] text-[#64748B]">
                          sq ft
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1">
                      Project Notes &amp; Quarry Preferences
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Master bathroom slab walls, curbless drain, or 3-inch mitered waterfall island..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs focus:outline-none focus:border-[#DC2626] transition-colors resize-none font-sans"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs tracking-widest uppercase transition-all duration-150 border-2 border-[#DC2626] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 shadow-xs"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin" />
                        <span>PROCESSING ESTIMATE...</span>
                      </span>
                    ) : (
                      <>
                        <span>SUBMIT ESTIMATE &amp; DISPATCH</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {/* Form Footer Stamp */}
                  <div className="pt-2 flex items-center justify-between text-[10px] text-[#64748B] border-t border-[#E2E8F0]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#DC2626]" />
                      <span>Same-Day Field Survey</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-emerald-600" />
                      <span>Suffolk / Nassau Licensed</span>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* MotionSites Scroll Down Indicator */}
        <motion.div
          style={{ opacity: opacityScrollCue }}
          className="mt-12 pt-8 border-t border-[#E2E8F0] hidden md:flex items-center justify-between font-mono text-xs text-[#64748B]"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
            <span className="text-[#0F172A] uppercase font-bold tracking-wider">LIVE REEL TRANSFORMATIONS</span>
          </div>

          <a
            href="#transformations"
            className="flex items-center gap-2 text-[#475569] hover:text-[#DC2626] transition-colors group cursor-pointer"
          >
            <span className="tracking-widest uppercase text-[11px]">[ SCROLL TO EXPLORE ARCHIVE ]</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-4 h-4 text-[#DC2626]" />
            </motion.div>
          </a>

          <div className="text-[11px] text-[#94A3B8]">
            GRID: 12-COL &bull; MITER: 45° CHISEL
          </div>
        </motion.div>

      </div>
    </section>
  );
};
