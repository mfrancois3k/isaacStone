import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Phone,
  ExternalLink,
  Instagram
} from 'lucide-react';

export const AboutCraftsmanship: React.FC = () => {
  const guarantees = [
    {
      code: 'SPEC_01',
      title: 'FORMIA STONE DIRECT QUARRY SOURCING',
      desc: 'Direct block-level selection of Italian Calacatta marble, Brazilian Taj Mahal quartzite, and dense quarried granite with full chain-of-custody documentation.'
    },
    {
      code: 'SPEC_02',
      title: 'DIGITAL 3D LASER TEMPLATING',
      desc: 'We physically survey Long Island and NYC job sites using millimeter-accurate digital optical templating to guarantee zero miscut slab gables.'
    },
    {
      code: 'SPEC_03',
      title: 'ZERO-LIPPAGE MECHANICAL LEVELING',
      desc: 'All porcelain and marble tile setting utilizes tensioned leveling clips to prevent curing drift, ensuring an optically flat ±0.2mm plane.'
    },
    {
      code: 'SPEC_04',
      title: 'HYDROSTATIC FLOOD TESTING (24HR)',
      desc: 'Every curbless shower pan, bench, and wet area undergoes continuous 24-hour hydrostatic flood testing before stone cladding begins.'
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white text-[#0F172A] relative border-b border-[#CBD5E1] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="border-b-2 border-[#CBD5E1] pb-6 mb-12">
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
            <span>[ 06 // HERITAGE &amp; FORMIA ALLIANCE ]</span>
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tighter uppercase"
            >
              UNCOMPROMISING <span className="text-[#DC2626]">CRAFTSMANSHIP</span>
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Architectural Photo Block */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="border-2 border-[#CBD5E1] bg-[#F8F9FA] relative overflow-hidden shadow-md">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80"
                  alt="Master Stone Mason Diamond Cutting Granite Slab"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Corner registration */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#DC2626]" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#DC2626]" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#DC2626]" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#DC2626]" />

                {/* Bottom Overlay Stamp */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/95 border border-[#CBD5E1] shadow-sm">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#DC2626] font-bold">BRENTWOOD &bull; NASSAU HQ</span>
                    <span className="text-[#0F172A] font-bold">EST. 2011</span>
                  </div>
                  <div className="text-sm font-bold text-[#0F172A] font-mono">
                    ISAAC STONE AND TILE LLC
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    Authorized Formia Marble &amp; Stone Partner
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-card: Deflection rating */}
            <div className="mt-4 p-3.5 bg-[#F8F9FA] border border-[#CBD5E1] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>DEFLECTION SPEC: L/720</span>
              </div>
              <span className="text-[#64748B] font-bold">ZERO-CRACK GUARANTEE</span>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Technical Specifications */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            
            <p className="text-base sm:text-lg text-[#0F172A] font-sans font-normal leading-relaxed mb-4">
              At <strong className="text-[#0F172A] font-bold">ISAAC STONE AND TILE LLC</strong>, stonework is approached not as commodity subcontracting, but as architectural masonry engineering. Every slab is inspected for geological grain density, structural cleavage planes, and natural veining flow before diamond tooling commences.
            </p>

            <p className="text-xs sm:text-sm text-[#475569] font-sans leading-relaxed mb-8">
              Operating out of Brentwood, NY, and dispatching crews across Nassau, Suffolk, and the Hamptons, we bridge old-world European stone masonry with laser-guided digital execution in direct alliance with <strong>Formia Marble and Stone</strong>.
            </p>

            {/* Guarantees List */}
            <div className="space-y-3 mb-8">
              {guarantees.map((item, idx) => (
                <motion.div 
                  key={item.code}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="p-3.5 bg-[#F8F9FA] border border-[#CBD5E1] hover:border-[#0F172A] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#DC2626] font-bold text-xs">{item.code}</span>
                      <span className="text-[#CBD5E1]">//</span>
                      <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-[#475569] font-sans leading-relaxed pl-6">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Contact Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="tel:6315305883"
                className="px-6 py-3.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>DIRECT FIELD LINE: (631) 530-5883</span>
              </a>

              <a
                href="https://www.instagram.com/jafettile____com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-white hover:bg-[#F1F5F9] text-[#0F172A] font-bold text-xs uppercase tracking-wider border-2 border-[#CBD5E1] transition-colors flex items-center gap-2 shadow-xs"
              >
                <Instagram className="w-4 h-4 text-[#DC2626]" />
                <span>FOLLOW @jafettile____com</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8]" />
              </a>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
