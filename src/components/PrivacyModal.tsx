import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, FileCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-mono">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-2xl bg-white border-2 border-[#0F172A] shadow-2xl overflow-hidden my-8"
          >
            {/* Header */}
            <div className="bg-[#0F172A] px-6 py-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#DC2626] text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Client Privacy &amp; Data Protection Policy
                  </h3>
                  <p className="text-[11px] font-mono text-white/70">
                    ISAAC STONE AND TILE LLC &bull; Last updated: 2026
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-white/70 hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean, bulleted Privacy Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-[#334155] leading-relaxed">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] mb-2 flex items-center gap-1.5 font-mono">
                  <Lock className="w-4 h-4 text-[#DC2626]" />
                  <span>1. Scope of Collected Information</span>
                </h4>
                <p className="mb-2">
                  When you request an estimate, invoice, or field verification from ISAAC STONE AND TILE LLC, we only collect essential project identifiers:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[#475569]">
                  <li>Client Contact Information (Full Name, verified phone number, email address).</li>
                  <li>Job site location and project specifications (approximate square footage, stone material preferences, architectural blueprints).</li>
                  <li>Transaction and deposit confirmation records for accounting and warranty verification.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0F172A] mb-2 flex items-center gap-1.5 font-mono">
                  <FileCheck className="w-4 h-4 text-[#DC2626]" />
                  <span>2. Data Retention &amp; Storage Protocols</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-[#475569]">
                  <li><strong>Active Projects:</strong> Contact and templating records are retained for the duration of the installation plus the active 5-year structural warranty period.</li>
                  <li><strong>Invoicing Data:</strong> Retained strictly in compliance with New York State construction accounting guidelines and tax statutes.</li>
                  <li><strong>Zero Third-Party Marketing:</strong> We never sell, rent, monetize, or lease your phone number or email to third-party telemarketers or ad networks.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0F172A] mb-2 font-mono">
                  3. SMS &amp; Mobile Text-to-Invoice Communications
                </h4>
                <p className="text-[#475569]">
                  By providing your mobile telephone number (such as for estimate calculations or invoice generation), you consent to receive direct transactional text updates regarding scheduled field surveys, slab arrival notifications, and electronic invoices from our project coordination team at (631) 530-5883 / (347) 622-8386. You may reply STOP at any time to opt out.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0F172A] mb-2 font-mono">
                  4. Your Statutory Consumer Rights
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-[#475569]">
                  <li>You maintain the right to inspect, correct, or request the deletion of your personal contact records upon project completion.</li>
                  <li>To exercise any privacy rights, reach out directly to ISAAC STONE AND TILE LLC administration via phone at (631) 530-5883 / (347) 622-8386 or at our Brentwood, NY headquarters.</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#F8F9FA] px-6 py-4 border-t border-[#CBD5E1] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#64748B]">
                &copy; {new Date().getFullYear()} ISAAC STONE AND TILE LLC
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider"
              >
                Acknowledge &amp; Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
