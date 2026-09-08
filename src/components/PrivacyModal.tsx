import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS } from '../data/site';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Policy text below is unchanged from the previous version of this file — only
 * the styling and the dialog semantics were rebuilt. It has NOT been reviewed
 * by a lawyer; several claims in it are not backed by src/data/site.ts.
 */
export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const trigger = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    (focusables()[0] ?? panelRef.current)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus?.();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-deep/70"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 my-8 w-full max-w-2xl bg-ink text-paper outline-none"
          >
            <span className="absolute inset-x-0 top-0 h-0.5 bg-brand" aria-hidden="true" />

            {/* Header */}
            <div className="flex items-start justify-between gap-6 border-b border-ink-line px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-2">
                <span className="label text-brand">[ PRIVACY &amp; DATA ]</span>
                <h2 id="privacy-title" className="display m-0 text-[clamp(26px,4vw,38px)] leading-[1]">
                  Client privacy and data protection
                </h2>
                <span className="label text-mute">{BUSINESS.legalName}</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="min-h-11 min-w-11 cursor-pointer border border-ink-line-2 bg-transparent font-sans text-lg text-paper transition-colors hover:border-brand hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                ✕
              </button>
            </div>

            {/* Policy body */}
            <div className="max-h-[65vh] space-y-8 overflow-y-auto px-6 py-7 font-sans text-[15px] leading-[1.6] text-sand-3 sm:px-8">
              <section className="space-y-3">
                <h3 className="label m-0 text-mute-light">01 // WHAT WE COLLECT</h3>
                <p className="m-0">
                  If you send an estimate request through this site, or hand your details to
                  the estimate helper, we receive only what you typed into it:
                </p>
                <ul className="m-0 list-disc space-y-1.5 pl-5 marker:text-brand">
                  <li>Your name and phone number.</li>
                  <li>Your email address, if you chose to give one.</li>
                  <li>
                    What you told us about the job — the kind of work, and anything you wrote
                    in the message box.
                  </li>
                </ul>
                <p className="m-0">
                  We do not ask for payment details on this site, and there is nowhere on it
                  to enter them.
                </p>
              </section>

              <div className="h-px bg-ink-line" aria-hidden="true" />

              <section className="space-y-3">
                <h3 className="label m-0 text-mute-light">02 // WHAT WE DO WITH IT</h3>
                <ul className="m-0 list-disc space-y-1.5 pl-5 marker:text-brand">
                  <li>
                    We use it to get back to you about your request, and for nothing else.
                  </li>
                  <li>
                    We do not sell it, rent it, or pass it to advertisers or lead brokers.
                  </li>
                  <li>
                    Your request is stored on the server behind this website so we do not
                    lose it before we can call you.
                  </li>
                </ul>
              </section>

              <div className="h-px bg-ink-line" aria-hidden="true" />

              <section className="space-y-3">
                <h3 className="label m-0 text-mute-light">03 // HOW WE REPLY</h3>
                <p className="m-0">
                  We reply by phone, or by email if that is what you gave us. Sending a
                  request does not sign you up for marketing messages of any kind, and there
                  is no mailing list attached to this form.
                </p>
              </section>

              <div className="h-px bg-ink-line" aria-hidden="true" />

              <section className="space-y-3">
                <h3 className="label m-0 text-mute-light">04 // ASKING US TO DELETE IT</h3>
                <ul className="m-0 list-disc space-y-1.5 pl-5 marker:text-brand">
                  <li>
                    You can ask us what we hold about you, ask us to correct it, or ask us to
                    delete it, at any time and for any reason.
                  </li>
                  <li>
                    Ask by phone at{' '}
                    <a
                      href={BUSINESS.phoneHref}
                      className="border-b border-brand text-paper no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                    >
                      {BUSINESS.phone}
                    </a>{' '}
                    or by email at{' '}
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="border-b border-brand text-paper no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                    >
                      {BUSINESS.email}
                    </a>
                    .
                  </li>
                </ul>
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-6 border-t border-ink-line px-6 py-5 sm:px-8">
              <span className="label text-mute">
                © {new Date().getFullYear()} {BUSINESS.legalName}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 cursor-pointer border-none bg-brand px-6 font-sans text-[15px] font-bold text-paper transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
