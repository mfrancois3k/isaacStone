import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Maximize2, 
  X, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  Instagram,
  CheckCircle2
} from 'lucide-react';
import { PortfolioItem } from '../types';

export const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Curated research projects matching @jafettile____com's Long Island & NY installations
  const portfolioItems: PortfolioItem[] = [
    {
      id: 'p1',
      title: 'Bookmatched Calacatta Gold Master Bath',
      category: 'Bathrooms',
      location: 'Brentwood, Suffolk County, NY',
      material: 'Calacatta Gold Italian Marble & Porcelain Slabs',
      sqft: '280 sq ft',
      completionTime: '7 Days',
      description: 'Full-height slab walls with synchronized vein flow across dual vanity niche, walk-in steam shower, and freestanding soaking tub backdrop.',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=85',
      features: [
        'Curbless zero-threshold shower entry with linear drain',
        'Continuous vein bookmatching from floor to 10ft ceiling',
        'Mitered 45° shampoo niches with LED channel lighting',
        'Schluter-Kerdi waterproof containment warranty'
      ]
    },
    {
      id: 'p2',
      title: 'Monolithic Waterfall Quartzite Kitchen Island',
      category: 'Countertops',
      location: 'Roslyn Harbor, Nassau County, NY',
      material: 'Taj Mahal Quartzite (Formia Stone Selection)',
      sqft: '340 sq ft',
      completionTime: '5 Days',
      description: 'Massive 134" x 58" kitchen island with 3-inch mitered drop-down waterfall legs. Continuous vein flowing from horizontal surface down both vertical gables.',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85',
      features: [
        '3-inch double mitered edge profile with seamless resin epoxy',
        'Undermount workstation sink cutout with diamond-polished edges',
        'Subfloor reinforced to L/720 deflection to prevent stress cracks',
        'Formia Marble & Stone quarried block provenance'
      ]
    },
    {
      id: 'p3',
      title: '18-Foot Fluted Porcelain Slab Fireplace',
      category: 'Fireplaces',
      location: 'Garden City, Nassau County, NY',
      material: 'Nero Marquina & Italian Large-Format Porcelain',
      sqft: '240 sq ft',
      completionTime: '4 Days',
      description: 'Floor-to-ceiling monumental fireplace facade featuring bookmatched black marble slabs framed by precision fluted architectural stone cladding.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      features: [
        'Heavy-gauge structural steel support bracketry',
        'Heat-resistant high-polymer bonding mortar',
        'Cantilevered floating honed granite hearth bench',
        'Laser-calibrated vertical plumb line (±0.1° accuracy)'
      ]
    },
    {
      id: 'p4',
      title: 'French Chevron Porcelain Foyer & Grand Hall',
      category: 'Flooring',
      location: 'Manhasset North Shore Manor, NY',
      material: 'Large-Format 24"x48" Italian Porcelain',
      sqft: '850 sq ft',
      completionTime: '8 Days',
      description: 'Expansive entrance foyer featuring laser-leveled chevron floor pattern with continuous bronze inlay transition borders and perimeter stone aprons.',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
      features: [
        'Zero-lippage mechanical clip system across all 850 sq ft',
        'Self-leveling cementitious underlayment poured to laser grade',
        'Custom architectural brass expansion transition joints',
        'Stain-proof epoxy resin color-matched grouting'
      ]
    },
    {
      id: 'p5',
      title: 'Bespoke Marble Wet Room & Spa Steam Shower',
      category: 'Bathrooms',
      location: 'Southampton Estate, Long Island, NY',
      material: 'Italian Carrara Marble Wall Slabs & Subway Tile',
      sqft: '420 sq ft',
      completionTime: '9 Days',
      description: 'Luxury residential wet room featuring floor-to-ceiling honed Carrara marble wall tiles, custom carved vanity, and curbless steam enclosure.',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=85',
      features: [
        'Floor-to-ceiling bookmatched honed marble panels',
        'Custom floating marble double vanity with undermount basins',
        'Zero-pitch steam shower envelope with hidden linear channel',
        'Deep-penetrating fluoropolymer impregnating sealant'
      ]
    },
    {
      id: 'p6',
      title: 'Gourmet Kitchen Marble Tile Backsplash & Island',
      category: 'Countertops',
      location: 'Dix Hills, Suffolk County, NY',
      material: 'Calacatta Marble & Hand-Laid Tile Backsplash',
      sqft: '260 sq ft',
      completionTime: '5 Days',
      description: 'High-end chef kitchen remodel featuring seamless Calacatta waterfall island accompanied by precision-aligned subway marble tile backsplash and stone trim.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
      features: [
        'Mitered return waterfall edges on island ends',
        'Precision hand-laid marble tile backsplash with epoxy grout',
        'Anti-etch clear coat protection for heavy kitchen service',
        'Laser-cut custom appliance and rangehood stone returns'
      ]
    }
  ];

  const categories = ['All', 'Bathrooms', 'Countertops', 'Fireplaces', 'Flooring'];

  const filteredItems = activeCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-[#F8F9FA] text-[#0F172A] relative border-b border-[#CBD5E1] font-mono">
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
              <span>[ 04 // VERIFIED FIELD PORTFOLIO ]</span>
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2 
                initial={{ y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tighter uppercase"
              >
                DELIVERED <span className="text-[#DC2626]">PROPERTIES</span>
              </motion.h2>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <a
              href="https://www.instagram.com/jafettile____com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white hover:bg-[#0F172A] hover:text-white border-2 border-[#CBD5E1] text-xs font-bold text-[#0F172A] transition-all flex items-center gap-2 shadow-xs"
            >
              <Instagram className="w-4 h-4 text-[#DC2626] group-hover:text-white" />
              <span>@jafettile____com ARCHIVE</span>
              <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
            </a>
          </motion.div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-sm'
                    : 'bg-white border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] hover:border-[#0F172A]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedProject(item)}
              className="bg-white border-2 border-[#CBD5E1] hover:border-[#0F172A] transition-all duration-200 cursor-pointer group flex flex-col overflow-hidden shadow-xs hover:shadow-md"
            >
              {/* Image Container with Video HUD */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Corner registration */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#DC2626]" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#DC2626]" />

                {/* Top Category Stamp */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-black/80 border border-white/20 text-[10px] text-white uppercase font-bold">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 bg-[#DC2626] text-white text-[10px] font-bold">
                    {item.sqft}
                  </span>
                </div>

                <div className="absolute top-3 right-3 p-1.5 bg-black/80 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-[#DC2626]" />
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[10px] uppercase text-[#DC2626] font-bold mb-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between border-t border-[#E2E8F0] bg-white">
                <p className="text-xs text-[#475569] font-sans line-clamp-2 mb-3">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="truncate max-w-[180px]">{item.material}</span>
                  <span className="text-[#DC2626] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>SPECS</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
              className="relative w-full max-w-3xl bg-white border-2 border-[#0F172A] p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto font-mono shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#DC2626] hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-[10px] text-[#DC2626] font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                <span>PROJECT RECORD // {selectedProject.location}</span>
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] mb-4 uppercase tracking-tight">
                {selectedProject.title}
              </h3>

              {/* Large Image View */}
              <div className="relative aspect-[16/9] overflow-hidden border border-[#CBD5E1] mb-6 bg-black">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/85 border border-white/20 px-2.5 py-1 text-xs text-white">
                  {selectedProject.material}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs">
                <div className="p-2.5 bg-[#F8F9FA] border border-[#CBD5E1]">
                  <div className="text-[#64748B] text-[10px]">CATEGORY</div>
                  <div className="text-[#0F172A] font-bold">{selectedProject.category}</div>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] border border-[#CBD5E1]">
                  <div className="text-[#64748B] text-[10px]">TOTAL SQ FT</div>
                  <div className="text-[#0F172A] font-bold">{selectedProject.sqft}</div>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] border border-[#CBD5E1]">
                  <div className="text-[#64748B] text-[10px]">EXECUTION</div>
                  <div className="text-[#0F172A] font-bold">{selectedProject.completionTime}</div>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] border border-[#CBD5E1]">
                  <div className="text-[#64748B] text-[10px]">WARRANTY</div>
                  <div className="text-emerald-600 font-bold">5-Year Structural</div>
                </div>
              </div>

              {/* Architectural Description */}
              <div className="mb-6">
                <div className="text-xs uppercase text-[#64748B] font-bold mb-2">
                  PROJECT SPECIFICATION &amp; METHODOLOGY
                </div>
                <p className="text-xs sm:text-sm text-[#334155] font-sans leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Key Features Bullet List */}
              <div className="mb-6 border-t border-[#E2E8F0] pt-4">
                <div className="text-xs uppercase text-[#64748B] font-bold mb-3">
                  STRUCTURAL &amp; FABRICATION HIGHLIGHTS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedProject.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
                      <span className="text-[#334155] font-sans text-xs">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Call to Action */}
              <div className="border-t border-[#E2E8F0] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href="https://www.instagram.com/jafettile____com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#F8F9FA] hover:bg-[#0F172A] hover:text-white border border-[#CBD5E1] text-xs font-bold text-[#0F172A] flex items-center justify-center gap-2 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#DC2626]" />
                  <span>VIEW REEL ON INSTAGRAM</span>
                </a>

                <a
                  href="#quote-form"
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>REQUEST SIMILAR SPECIFICATION</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
