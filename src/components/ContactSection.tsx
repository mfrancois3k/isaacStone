import React from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Building2,
  Instagram,
  ExternalLink
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F8F9FA] text-[#0F172A] relative border-b border-[#CBD5E1] font-mono">
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
            <span>[ 07 // DIRECT DISPATCH &amp; FIELD SURVEY ]</span>
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tighter uppercase"
            >
              FIELD <span className="text-[#DC2626]">COMMUNICATIONS</span>
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <p className="text-base sm:text-lg text-[#0F172A] font-sans leading-relaxed mb-8">
              Whether you are an architect in Manhasset requiring custom miter shop drawings or a homeowner in Brentwood planning a full bathroom marble slab remodel, we provide direct communication without intermediary agents.
            </p>

            <div className="space-y-4 mb-8">
              {/* Phone Card */}
              <a
                href="tel:6315305883"
                className="flex items-center gap-4 p-4 bg-white border-2 border-[#CBD5E1] hover:border-[#DC2626] transition-all group cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="w-12 h-12 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DC2626] group-hover:text-white transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase text-[#64748B]">Direct Master Line</div>
                  <div className="text-lg font-black text-[#0F172A] font-mono">(631) 530-5883 / (347) 622-8386</div>
                </div>
                <span className="text-xs font-bold text-[#DC2626] group-hover:translate-x-1 transition-transform">
                  [ CALL NOW ] &rarr;
                </span>
              </a>

              {/* Instagram Card */}
              <a
                href="https://www.instagram.com/jafettile____com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white border-2 border-[#CBD5E1] hover:border-[#0F172A] transition-all group cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="w-12 h-12 bg-[#F8F9FA] border border-[#CBD5E1] text-[#DC2626] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase text-[#64748B]">Official Video Reels</div>
                  <div className="text-sm font-bold text-[#0F172A]">@jafettile____com</div>
                  <div className="text-[10px] text-[#64748B]">Before &amp; After Transformations</div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F172A]" />
              </a>

              {/* Service Territory Card */}
              <div className="flex items-center gap-4 p-4 bg-white border border-[#CBD5E1] shadow-xs">
                <div className="w-12 h-12 bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[#64748B]">Primary Territory</div>
                  <div className="text-sm font-bold text-[#0F172A]">Brentwood, Nassau County &amp; Greater NY Area</div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-4 p-4 bg-white border border-[#CBD5E1] shadow-xs">
                <div className="w-12 h-12 bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[#64748B]">Field Survey Schedule</div>
                  <div className="text-sm font-bold text-[#0F172A]">Monday – Saturday: 7:00 AM – 6:30 PM</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dispatch Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="p-6 sm:p-8 bg-white border-2 border-[#0F172A] shadow-md">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#DC2626] font-bold">
                    FIELD SURVEY PROTOCOL
                  </span>
                  <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tight">
                    DISPATCH YOUR PROJECT SPECS
                  </h3>
                </div>
                <div className="p-2 bg-[#F1F5F9] border border-[#CBD5E1] text-[#DC2626]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-[#475569] font-sans leading-relaxed mb-6">
                Fill out the estimate form or message our master installer directly. We offer on-site visits with stone sample boards across Long Island within 24–48 hours.
              </p>

              <div className="p-4 bg-[#F8F9FA] border border-[#CBD5E1] mb-6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Entity Name:</span>
                  <span className="text-[#0F172A] font-bold">ISAAC STONE AND TILE LLC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Headquarters:</span>
                  <span className="text-[#0F172A]">Brentwood, Suffolk County, NY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Fabrication Alliance:</span>
                  <span className="text-[#DC2626] font-bold">Formia Marble &amp; Stone</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Emergency Dispatch:</span>
                  <span className="text-emerald-600 font-bold">ACTIVE (24/7 Field SMS)</span>
                </div>
              </div>

              <a
                href="#quote-form"
                className="w-full py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs uppercase tracking-widest transition-all text-center block shadow-sm"
              >
                REQUEST ON-SITE TEMPLATING &rarr;
              </a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
