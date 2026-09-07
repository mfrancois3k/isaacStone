import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  Gem, 
  Compass, 
  Check, 
  ArrowUpRight, 
  ShieldCheck 
} from 'lucide-react';

interface ServiceItem {
  id: string;
  index: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  image: string;
}

export const Services: React.FC = () => {
  const [activeService, setActiveService] = useState<number>(0);

  const services: ServiceItem[] = [
    {
      id: 'tiling',
      index: '01',
      title: 'PRECISION TILE & PORCELAIN SLAB',
      tagline: 'Large-Format 48x48, Chevron, Steam Showers & Schluter Ditra',
      icon: <Layers className="w-5 h-5 text-[#DC2626]" />,
      description: 'Zero-lippage tile installations engineered for luxury master bathrooms, open-concept residences, and high-traffic commercial spaces. Calibrated with laser leveling spacers and waterproofed to ANSI standards.',
      highlights: [
        'Curbless zero-threshold showers with hidden linear drains',
        'Large-format Italian porcelain slabs up to 5ft x 10ft',
        'Intricate herringbone, chevron, and micro-mosaic patterns',
        'Schluter-Kerdi certified 100% waterproof vapor envelope'
      ],
      specs: [
        { label: 'Standard Laying', value: 'Laser Zero-Lippage' },
        { label: 'Substrate Spec', value: 'Vapor-shield & self-level' },
        { label: 'Plane Tolerance', value: '±0.2mm Zero-Lippage' },
        { label: 'Warranty', value: '5-Year Structural' }
      ],
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'granite-marble',
      index: '02',
      title: 'GRANITE & BOOKMATCHED MARBLE',
      tagline: 'Custom Waterfall Islands, Apron Edges & Formia Stone Blocks',
      icon: <Gem className="w-5 h-5 text-[#DC2626]" />,
      description: 'Monolithic full-slab stone setting. In strategic alliance with Formia Marble & Stone, we hand-select first-choice quarried Calacatta, Nero Marquina, and Taj Mahal Quartzite with vein-continuous waterfall gables.',
      highlights: [
        'Continuous bookmatched marble vein alignment down waterfalls',
        'Seamless flush-mount cooktop and undermount sink cutouts',
        'Custom 2.5" to 3" mitered apron edge profiles',
        'Diamond-honed, leathered, and high-gloss micro-finishes'
      ],
      specs: [
        { label: 'Slab Install', value: 'Bookmatched Veins' },
        { label: 'Quarry Partner', value: 'Formia Stone Direct' },
        { label: 'Miter Profile', value: '45° Epoxy Color-Matched' },
        { label: 'Penetrating Seal', value: '15-Year Fluoro-Polymer' }
      ],
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'custom-stonework',
      index: '03',
      title: 'ARCHITECTURAL MASONRY & ACCENTS',
      tagline: 'Fireplace Mantels, Fluted Wall Cladding & Grand Foyers',
      icon: <Compass className="w-5 h-5 text-[#DC2626]" />,
      description: 'Full-structural masonry and architectural stone accents. From floor-to-ceiling fireplace hearths in quartzite to large-format chevron interior foyers designed with laser-calibrated plumb accuracy.',
      highlights: [
        'Floor-to-ceiling slab fireplace walls with hidden thermal joints',
        'Hand-laid chevron and herringbone foyer stone tile patterns',
        'Integrated LED reveal channels and mitered returns',
        'Leica 3D spatial laser scanning for flawless fitment'
      ],
      specs: [
        { label: 'Fireplace Slabs', value: 'Custom CAD Quoted' },
        { label: 'Interior Stone', value: 'Full Calibrated Spec' },
        { label: 'Laser Survey', value: 'Leica 3D Spatial Scan' },
        { label: 'Licensing', value: 'Suffolk & Nassau Co.' }
      ],
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  const consultationSteps = [
    { step: '01', title: 'Schedule Discovery Call', desc: 'Select your preferred morning, midday, or afternoon call window. Our field director reviews your architectural plans.' },
    { step: '02', title: 'AI Architectural Estimate', desc: 'Our AI Estimator analyzes your material and dimensions, dispatching a formal itemized quote to your email within seconds.' },
    { step: '03', title: 'On-Site 3D Laser Templating', desc: 'We visit your property in Suffolk, Nassau, or NYC to perform high-precision Leica 3D spatial scanning with zero lippage.' },
    { step: '04', title: 'Formia Stone Quarry Reservation', desc: 'A standard 50% mobilization deposit locks your quarried slab reservation and CNC diamond-miter cutting schedule.' },
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-white text-[#0F172A] relative border-b border-[#CBD5E1] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
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
              <span>[ 03 // ARCHITECTURAL PILLARS ]</span>
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2 
                initial={{ y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tighter uppercase"
              >
                STONEWORK <span className="text-[#DC2626]">CAPABILITIES</span>
              </motion.h2>
            </div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm text-[#475569] max-w-md font-sans leading-relaxed"
          >
            Every bevel, miter, and joint is executed to &plusmn;0.2mm architectural tolerances. Serving discerning Long Island and New York homeowners, architects, and master builders.
          </motion.p>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => {
            const isActive = activeService === index;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.85, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActiveService(index)}
                className={`p-6 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-[#DC2626] shadow-[0_15px_30px_rgba(0,0,0,0.08)] ring-1 ring-[#DC2626]'
                    : 'bg-[#F8F9FA] border-[#CBD5E1] hover:border-[#0F172A] hover:bg-white'
                }`}
              >
                <div>
                  {/* Top Index & Icon */}
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-[#DC2626] font-mono">{service.index}</span>
                      <span className="text-[#CBD5E1]">//</span>
                      <span className="text-xs font-bold text-[#0F172A] uppercase">{service.id}</span>
                    </div>
                    <div className="p-2 bg-white border border-[#CBD5E1] shadow-xs">
                      {service.icon}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-tight mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[11px] text-[#DC2626] font-bold uppercase tracking-wider mb-3">
                    {service.tagline}
                  </p>
                  <p className="text-xs text-[#475569] font-sans leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    {service.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                        <span className="text-[#334155] font-sans text-[11px]">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Spec Sheet Grid */}
                <div className="border-t border-[#E2E8F0] pt-4 bg-[#F1F5F9] -mx-6 -mb-6 p-4">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {service.specs.map((sp, i) => (
                      <div key={i} className="p-1.5 bg-white border border-[#CBD5E1]">
                        <div className="text-[#64748B] uppercase">{sp.label}</div>
                        <div className="text-[#0F172A] font-bold">{sp.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BESPOKE CONSULTATION & AI ESTIMATE WORKFLOW */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="border-2 border-[#0F172A] bg-[#F8F9FA] p-6 sm:p-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#CBD5E1] pb-4 mb-6 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#DC2626] font-bold">
                PRECISION CLIENT PIPELINE
              </div>
              <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tight">
                BOOK A CALL &amp; RECEIVE YOUR CUSTOM AI ESTIMATE
              </h3>
            </div>
            <div className="text-xs text-[#475569] flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Suffolk &amp; Nassau Certified Masons</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {consultationSteps.map((c) => (
              <div key={c.step} className="p-4 bg-white border border-[#CBD5E1]">
                <div className="text-xs font-mono font-bold text-[#DC2626] mb-1">[ STEP {c.step} ]</div>
                <h4 className="text-xs font-black text-[#0F172A] uppercase mb-1.5">{c.title}</h4>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#CBD5E1] flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <span className="text-[#64748B] font-sans">
              No generic automated pricing. Our AI agent compiles an itemized estimate sent to your email, and our project director confirms your on-site survey.
            </span>
            <a
              href="#book-consultation"
              className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs shrink-0"
            >
              <span>BOOK A CALL &amp; GET ESTIMATE</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
