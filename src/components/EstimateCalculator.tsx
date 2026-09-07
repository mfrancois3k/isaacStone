import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Ruler, 
  ArrowRight, 
  Clock, 
  FileText,
  Copy,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectOption {
  id: string;
  name: string;
  desc: string;
}

const PROJECT_OPTIONS: ProjectOption[] = [
  { id: 'master-bath', name: 'Master Bath & Steam Shower', desc: 'Curbless linear drain, bookmatched walls & niche' },
  { id: 'waterfall-island', name: 'Monolithic Waterfall Kitchen Island', desc: '3" mitered drop aprons & synchronized veining' },
  { id: 'fireplace-slab', name: 'Floor-to-Ceiling Fireplace Hearth', desc: 'Bookmatched slabs & fluted architectural cladding' },
  { id: 'chevron-flooring', name: 'Precision Chevron / Foyer Flooring', desc: 'Large format porcelain & zero-lippage leveling' },
  { id: 'custom-masonry', name: 'Custom Architectural Stonework', desc: 'Feature walls, bar tops & luxury accents' },
];

const MATERIAL_OPTIONS = [
  { id: 'calacatta-marble', name: 'Italian Calacatta / Carrara Marble', tier: 'Ultra-Luxury Quarried Slab' },
  { id: 'taj-quartzite', name: 'Taj Mahal Quartzite', tier: 'High-Density Acid Resistant' },
  { id: 'porcelain-slabs', name: 'Large-Format Porcelain Slabs (up to 5x10\')', tier: 'Zero-Porosity Italian Spec' },
  { id: 'granite-slab', name: 'Natural Quarried Granite', tier: 'Heavy-Duty Exterior & Counter' },
  { id: 'artisan-tile', name: 'Handcrafted Zellige & Architectural Tile', tier: 'Precision Hand-Laid Matrix' },
];

const SQFT_RANGES = [
  'Under 150 sq ft (Powder / Fireplace)',
  '150 - 350 sq ft (Standard Bath / Island)',
  '350 - 650 sq ft (Master Suite / Main Living)',
  '650+ sq ft (Full Residence / Estate)'
];

const CALL_WINDOWS = [
  'Morning (8:00 AM - 11:00 AM)',
  'Midday (11:00 AM - 2:00 PM)',
  'Afternoon (2:00 PM - 5:00 PM)',
  'Evening (5:00 PM - 7:30 PM)',
  'Urgent 24-Hour Field Survey'
];

export const EstimateCalculator: React.FC = () => {
  // Form state
  const [selectedProject, setSelectedProject] = useState<string>(PROJECT_OPTIONS[0].name);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(MATERIAL_OPTIONS[0].name);
  const [selectedSqft, setSelectedSqft] = useState<string>(SQFT_RANGES[1]);
  const [selectedCallWindow, setSelectedCallWindow] = useState<string>(CALL_WINDOWS[0]);
  
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientTown, setClientTown] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      setErrorMessage('Please provide your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/leads/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          projectType: selectedProject,
          material: selectedMaterial,
          sqftRange: selectedSqft,
          preferredCallTime: selectedCallWindow,
          addressOrTown: clientTown || 'Long Island / NY',
          notes: clientNotes,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Could not process request.');
      }

      setSubmittedData(data);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Failed to submit. Please call directly at (631) 530-5883.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyQuote = (quoteId: string) => {
    navigator.clipboard.writeText(`ISAAC STONE & TILE LLC Quote Ref: ${quoteId}`);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <section id="book-consultation" className="py-24 bg-[#F8F9FA] text-[#0F172A] relative border-b border-[#CBD5E1] font-mono">
      {/* Hidden anchor alias for backwards compatibility with #calculator links */}
      <div id="calculator" className="absolute -top-10 left-0" />
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-stone-grid opacity-35 pointer-events-none" />

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
              <span>[ 05 // ARCHITECTURAL CONSULTATION &amp; LEAD PIPELINE ]</span>
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2 
                initial={{ y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tighter uppercase"
              >
                BOOK A CALL &amp; <span className="text-[#DC2626]">GET AN AI ESTIMATE</span>
              </motion.h2>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm text-[#475569] max-w-md font-sans leading-relaxed"
          >
            No generic calculators. Tell us about your project and our AI Agent will compile an itemized architectural estimate sent directly to your email, followed by a dedicated phone consultation with our master mason.
          </motion.div>
        </div>

        {/* Main Interface */}
        <AnimatePresence mode="wait">
          {submittedData ? (
            /* SUCCESS & CONFIRMATION VIEW */
            <motion.div
              key="submitted-view"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-2 border-[#0F172A] p-6 sm:p-10 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-3 h-3 bg-[#DC2626]" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#DC2626]" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#CBD5E1] pb-6 mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs text-[#DC2626] font-bold uppercase tracking-wider">
                      CONSULTATION CALL QUEUED // AI ESTIMATE DISPATCHED
                    </div>
                    <h3 className="text-2xl font-black text-[#0F172A] uppercase tracking-tight">
                      THANK YOU, {submittedData.scheduledCall?.name || 'VALUED CLIENT'}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopyQuote(submittedData.quoteId)}
                    className="px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#DC2626]" />}
                    <span>{copiedRef ? 'COPIED REF' : `REF: ${submittedData.quoteId}`}</span>
                  </button>
                  <span className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase">
                    EMAIL DISPATCHED
                  </span>
                </div>
              </div>

              {/* Estimate Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Col 1: Project & Material */}
                <div className="p-5 bg-[#F8F9FA] border border-[#CBD5E1] flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#DC2626] font-bold uppercase tracking-wider mb-2">
                      01 // PROJECT SPECIFICATIONS
                    </div>
                    <h4 className="text-base font-bold text-[#0F172A] mb-1">
                      {submittedData.estimateSummary?.projectType}
                    </h4>
                    <p className="text-xs text-[#64748B] font-sans mb-3">
                      Selected Material: <strong className="text-[#0F172A]">{submittedData.estimateSummary?.material}</strong>
                    </p>
                    <div className="text-xs text-[#475569] space-y-1 font-mono">
                      <div>Approx Footprint: {submittedData.estimateSummary?.approxSqft} sq ft</div>
                      <div>Location: {submittedData.scheduledCall?.addressOrTown}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] text-[#64748B]">
                    Formia Stone slab reservation queue locked for review.
                  </div>
                </div>

                {/* Col 2: Projected Cost & Deposit Breakdown */}
                <div className="p-5 bg-white border-2 border-[#0F172A] flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="text-[10px] text-[#DC2626] font-bold uppercase tracking-wider mb-2">
                      02 // ESTIMATE BREAKDOWN
                    </div>
                    <div className="text-xs text-[#64748B] mb-1">Estimated Architectural Total:</div>
                    <div className="text-3xl font-black text-[#0F172A] font-mono tracking-tight mb-3">
                      ${submittedData.estimateSummary?.totalProjected?.toLocaleString()}
                    </div>
                    
                    <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] mb-2">
                      <div className="text-xs text-[#DC2626] font-bold">50% MOBILIZATION DEPOSIT:</div>
                      <div className="text-xl font-black text-[#DC2626] font-mono">
                        ${submittedData.estimateSummary?.depositDue?.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#7F1D1D] mt-0.5 font-sans">
                        Locks digital laser templating &amp; quarry slab cut queue.
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#64748B] font-sans">
                    Remaining 50% due upon final grout, polish, and signoff.
                  </div>
                </div>

                {/* Col 3: Scheduled Phone Consultation */}
                <div className="p-5 bg-[#F8F9FA] border border-[#CBD5E1] flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#DC2626] font-bold uppercase tracking-wider mb-2">
                      03 // NEXT STEP: PHONE CONSULTATION
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] mb-1">
                      <Clock className="w-4 h-4 text-[#DC2626]" />
                      <span>Requested Window:</span>
                    </div>
                    <div className="text-sm font-black text-[#0F172A] mb-3 bg-white p-2 border border-[#CBD5E1]">
                      {submittedData.scheduledCall?.preferredCallTime}
                    </div>
                    <p className="text-xs text-[#475569] font-sans leading-relaxed mb-3">
                      Our field director will call <strong className="text-[#0F172A]">{submittedData.scheduledCall?.phone}</strong> to verify project blueprints and finalize your on-site survey time.
                    </p>
                  </div>

                  <a
                    href="tel:6315305883"
                    className="w-full py-2 px-3 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Or Call Us Directly (631) 530-5883</span>
                  </a>
                </div>

              </div>

              {/* Reset / Submit Another Project */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#CBD5E1] text-xs text-[#64748B] gap-4">
                <span>
                  Check your inbox at <strong className="text-[#0F172A]">{submittedData.emailSentTo}</strong> for your complete PDF-formatted estimate package.
                </span>
                <button
                  onClick={() => setSubmittedData(null)}
                  className="text-[#DC2626] hover:text-[#0F172A] font-bold underline cursor-pointer"
                >
                  [ Book another project consultation ]
                </button>
              </div>

            </motion.div>
          ) : (
            /* LEAD GENERATION & BOOKING FORM */
            <motion.form
              key="lead-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-2 border-[#0F172A] p-6 sm:p-10 shadow-lg relative"
            >
              <div className="absolute top-0 left-0 w-3 h-3 bg-[#DC2626]" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#DC2626]" />

              {/* Notification Banner */}
              <div className="mb-8 p-4 bg-[#FEF2F2] border-l-4 border-[#DC2626] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#DC2626] shrink-0" />
                  <div className="text-xs text-[#991B1B] font-sans">
                    <strong className="font-bold font-mono">AUTOMATED AI ESTIMATE DISPATCH:</strong> Select your space and materials below. Our AI consultant generates a detailed architectural quote sent to your email, and schedules your field templating call.
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-[#0F172A] bg-white px-2.5 py-1 border border-[#FECACA] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>±0.2mm Precision</span>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              {/* STEP 1: Select Space / Room */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
                  <label className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                    <span className="text-[#DC2626]">[ STEP 01 ]</span>
                    <span>SELECT YOUR SPACE &amp; SCOPE</span>
                  </label>
                  <span className="text-[11px] text-[#64748B]">Choose primary installation</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PROJECT_OPTIONS.map((proj) => {
                    const isSelected = selectedProject === proj.name;
                    return (
                      <button
                        type="button"
                        key={proj.id}
                        onClick={() => setSelectedProject(proj.name)}
                        className={`text-left p-3.5 border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#DC2626] shadow-sm ring-1 ring-[#DC2626]'
                            : 'bg-[#F8F9FA] border-[#CBD5E1] hover:border-[#0F172A]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#0F172A]">{proj.name}</span>
                          {isSelected && <span className="w-2 h-2 bg-[#DC2626] rounded-full" />}
                        </div>
                        <p className="text-[11px] text-[#64748B] font-sans">{proj.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Select Stone Material & Approximate Size */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* Material Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
                    <label className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                      <span className="text-[#DC2626]">[ STEP 02 ]</span>
                      <span>STONE OR TILE PREFERENCE</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    {MATERIAL_OPTIONS.map((mat) => {
                      const isSelected = selectedMaterial === mat.name;
                      return (
                        <button
                          type="button"
                          key={mat.id}
                          onClick={() => setSelectedMaterial(mat.name)}
                          className={`w-full text-left p-3 border-2 transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-white border-[#DC2626] shadow-xs ring-1 ring-[#DC2626]'
                              : 'bg-[#F8F9FA] border-[#CBD5E1] hover:border-[#0F172A]'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-[#0F172A]">{mat.name}</div>
                            <div className="text-[10px] text-[#64748B] font-sans">{mat.tier}</div>
                          </div>
                          {isSelected ? (
                            <span className="text-[#DC2626] text-xs font-bold">[SELECTED]</span>
                          ) : (
                            <span className="text-[10px] text-[#94A3B8]">Select &rarr;</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footprint & Time Window Selection */}
                <div className="space-y-6">
                  
                  {/* Footprint */}
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
                      <label className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                        <span className="text-[#DC2626]">[ STEP 03 ]</span>
                        <span>APPROXIMATE SQUARE FOOTAGE</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SQFT_RANGES.map((range) => {
                        const isSelected = selectedSqft === range;
                        return (
                          <button
                            type="button"
                            key={range}
                            onClick={() => setSelectedSqft(range)}
                            className={`p-3 text-left border-2 text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white border-[#DC2626] font-bold text-[#0F172A] shadow-xs'
                                : 'bg-[#F8F9FA] border-[#CBD5E1] text-[#475569] hover:border-[#0F172A]'
                            }`}
                          >
                            {range}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Call Window */}
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
                      <label className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                        <span className="text-[#DC2626]">[ STEP 04 ]</span>
                        <span>PREFERRED CALL WINDOW</span>
                      </label>
                    </div>
                    <select
                      value={selectedCallWindow}
                      onChange={(e) => setSelectedCallWindow(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F8F9FA] border-2 border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
                    >
                      {CALL_WINDOWS.map((win) => (
                        <option key={win} value={win}>{win}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              {/* STEP 5: Contact Details for Estimate Delivery */}
              <div className="mb-8 pt-6 border-t border-[#CBD5E1]">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                    <span className="text-[#DC2626]">[ STEP 05 ]</span>
                    <span>WHERE SHOULD WE EMAIL YOUR ESTIMATE &amp; CALL YOU?</span>
                  </label>
                  <span className="text-xs text-[#DC2626] font-bold">* Required for Dispatch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Vance"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] text-xs font-sans text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                      Email Address (For Estimate Delivery) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="david@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] text-xs font-sans text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                      Phone Number (For Call &amp; SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(631) 530-5883"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] text-xs font-sans text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                      Property Town / County
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Brentwood, Manhasset, Southampton"
                      value={clientTown}
                      onChange={(e) => setClientTown(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] text-xs font-sans text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Special Architectural Notes / Blueprints (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Double mitered waterfall return on both ends, curbless linear shower pan with niche, need demolition of old tile."
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#CBD5E1] text-xs font-sans text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
                  />
                </div>
              </div>

              {/* Submit & Policy Footer */}
              <div className="pt-6 border-t-2 border-[#CBD5E1] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-xs text-[#64748B] font-sans max-w-md">
                  <div className="flex items-center gap-1.5 text-[#0F172A] font-bold font-mono mb-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>50% MOBILIZATION POLICY &amp; PRIVACY ASSURED</span>
                  </div>
                  Your contact details are used exclusively by ISAAC STONE AND TILE LLC for estimate delivery and field appointment scheduling.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 bg-[#DC2626] hover:bg-[#B91C1C] disabled:bg-[#94A3B8] text-white font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 border-2 border-[#DC2626] cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>DISPATCHING ESTIMATE...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>BOOK CALL &amp; DISPATCH ESTIMATE TO EMAIL</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </motion.form>
          )}
        </AnimatePresence>

        {/* Live Field Pipeline Ticker */}
        <div className="mt-8 p-4 bg-white border border-[#CBD5E1] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-[#0F172A]">FIELD PIPELINE ACTIVE:</span>
            <span>48 consultation calls scheduled this month across Long Island &amp; NYC</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Direct Dispatch: <strong className="text-[#0F172A]">(631) 530-5883</strong></span>
            <span>Allied Quarry: <strong className="text-[#0F172A]">Formia Stone</strong></span>
          </div>
        </div>

      </div>
    </section>
  );
};
