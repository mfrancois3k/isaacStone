import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BUSINESS, CONTACT } from '../data/site';

const EASE = [0.16, 1, 0.3, 1] as const;

type FieldKey = 'name' | 'phone' | 'email';
type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
  'min-h-12 w-full border-0 border-b-[1.5px] border-mute-light bg-transparent px-0 py-3 font-sans text-[17px] text-ink outline-none focus:border-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand aria-[invalid=true]:border-brand';

const LABEL_CLASS = 'font-sans text-[15px] font-semibold text-ink';

/** Mono-keyed row in the contact definition list. */
function InfoRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-4">
      <dt className="label w-16 shrink-0 text-mute">{term}</dt>
      <dd className="m-0 min-w-0">{children}</dd>
    </div>
  );
}

export function ContactSection() {
  const reduced = useReducedMotion();

  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    jobType: CONTACT.jobTypes[0] as string,
    preferredCallTime: '',
    message: '',
    smsConsent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLInputElement | null>>>({});

  const set = (key: keyof typeof values, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  function validate() {
    const next: Partial<Record<FieldKey, string>> = {};
    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (values.phone.replace(/\D/g, '').length < 10)
      next.phone = 'Please enter a phone number we can call you back on.';
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim()))
      next.email = 'Please enter an email address so we can send the estimate.';
    return next;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    const found = validate();
    setErrors(found);
    const firstInvalid = (['name', 'phone', 'email'] as FieldKey[]).find((k) => found[k]);
    if (firstInvalid) {
      setStatus('idle');
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/leads/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          projectType: values.jobType,
          preferredCallTime: values.preferredCallTime.trim(),
          notes: values.message.trim(),
          customerSmsConsent: values.smsConsent,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setValues((v) => ({ ...v, name: '', phone: '', email: '', preferredCallTime: '', message: '', smsConsent: false }));
    } catch {
      setStatus('error');
    }
  }

  const sending = status === 'sending';
  const phoneParts = BUSINESS.phone.split(/[\s-]+/);

  const rise = {
    initial: { opacity: 0, y: reduced ? 0 : 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-blueprint relative bg-ink py-[clamp(100px,14vw,180px)] text-paper"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(40px,5vw,72px)] px-7">
        {/* Header — headline over the phone number set very large */}
        <motion.div className="flex flex-col gap-5" {...rise} transition={{ duration: 0.9, ease: EASE }}>
          <span className="label flex items-center gap-2.5 text-brand">
            <span className="h-0.5 w-[26px] bg-brand" aria-hidden="true" />
            {CONTACT.label}
          </span>
          <h2
            id="contact-heading"
            className="display m-0 text-[clamp(28px,3vw,44px)] leading-[1.1] text-mute-light-2"
          >
            {CONTACT.headline}
          </h2>
          <a
            href={BUSINESS.phoneHref}
            className="display flex flex-wrap text-[clamp(52px,10.4vw,160px)] leading-[0.86] tracking-[-0.05em] text-paper no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            <span className="sr-only">{`Call ${BUSINESS.phone}`}</span>
            {phoneParts.map((part, i) => (
              <span
                key={part}
                aria-hidden="true"
                className={`block overflow-hidden pb-[0.08em] ${i > 0 ? 'ml-[0.22em]' : ''}`}
              >
                <motion.span
                  className="block"
                  initial={{ y: reduced ? 0 : '110%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: EASE }}
                >
                  {part}
                </motion.span>
              </span>
            ))}
          </a>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-[clamp(34px,5vw,90px)] border-t border-ink-line pt-[clamp(34px,4vw,56px)] lg:grid-cols-2">
          {/* Left — the details */}
          <motion.div
            className="flex min-w-0 flex-col gap-7"
            {...rise}
            transition={{ duration: 1, ease: EASE }}
          >
            <p className="m-0 max-w-[42ch] font-sans text-[19px] leading-[1.6] text-sand-3">
              {CONTACT.body}
            </p>

            <dl className="m-0 flex flex-col gap-[18px]">
              <InfoRow term="JONATHAN">
                <a
                  href={BUSINESS.ownerPhoneHref}
                  className="display text-[30px] text-paper no-underline hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  {BUSINESS.ownerPhone}
                </a>
              </InfoRow>
              <InfoRow term="EMAIL">
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="display [overflow-wrap:anywhere] text-[26px] text-paper no-underline hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  {BUSINESS.email}
                </a>
              </InfoRow>
              <InfoRow term="HOURS">
                <span className="font-sans text-[17px] leading-[1.45] text-sand-3">
                  {BUSINESS.hours}
                </span>
              </InfoRow>
              <InfoRow term="AREA">
                <span className="font-sans text-[17px] leading-[1.45] text-sand-3">
                  {BUSINESS.areas}
                </span>
              </InfoRow>
              <InfoRow term="MAP">
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-brand font-sans text-[17px] leading-[1.45] text-sand-3 no-underline hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  Directions on Google Maps →
                </a>
              </InfoRow>
            </dl>

            <p className="m-0 max-w-[42ch] border-l-2 border-brand py-4 pl-[18px] font-sans text-[16px] leading-[1.55] text-mute-light-2">
              {CONTACT.pricingNote}
            </p>
          </motion.div>

          {/* Right — estimate request form */}
          <motion.form
            noValidate
            onSubmit={handleSubmit}
            aria-labelledby="estimate-form-heading"
            className="relative flex min-w-0 flex-col gap-4 bg-paper p-[clamp(24px,3vw,40px)] text-ink"
            {...rise}
            transition={{ duration: 1, delay: 0.12, ease: EASE }}
          >
            <span className="absolute left-0 top-0 h-3 w-3 bg-brand" aria-hidden="true" />
            <span className="absolute right-0 top-0 h-3 w-3 bg-brand" aria-hidden="true" />

            <h3 id="estimate-form-heading" className="label m-0 text-brand">
              {CONTACT.form.label}
            </h3>
            <p className="m-0 font-sans text-[14px] text-mute-3">
              <span aria-hidden="true" className="text-brand">
                *
              </span>{' '}
              Required
            </p>

            <div className="flex flex-col gap-[7px]">
              <label htmlFor="ct-name" className={LABEL_CLASS}>
                Your name <span aria-hidden="true" className="text-brand">*</span>
              </label>
              <input
                id="ct-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                ref={(el) => {
                  fieldRefs.current.name = el;
                }}
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'ct-name-err' : undefined}
                className={INPUT_CLASS}
              />
              {errors.name && (
                <p id="ct-name-err" className="m-0 font-sans text-[14px] text-brand-deep">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-[7px]">
                <label htmlFor="ct-phone" className={LABEL_CLASS}>
                  Phone <span aria-hidden="true" className="text-brand">*</span>
                </label>
                <input
                  id="ct-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  ref={(el) => {
                    fieldRefs.current.phone = el;
                  }}
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'ct-phone-err' : undefined}
                  className={INPUT_CLASS}
                />
                {errors.phone && (
                  <p id="ct-phone-err" className="m-0 font-sans text-[14px] text-brand-deep">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-[7px]">
                <label htmlFor="ct-email" className={LABEL_CLASS}>
                  Email <span className="font-normal text-mute-2">(optional)</span>
                </label>
                <input
                  id="ct-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  ref={(el) => {
                    fieldRefs.current.email = el;
                  }}
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'ct-email-err' : undefined}
                  className={INPUT_CLASS}
                />
                {errors.email && (
                  <p id="ct-email-err" className="m-0 font-sans text-[14px] text-brand-deep">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[7px]">
              <label htmlFor="ct-callback" className={LABEL_CLASS}>
                Best time to call <span className="font-normal text-mute-2">(optional)</span>
              </label>
              <input
                id="ct-callback"
                name="preferredCallTime"
                type="text"
                autoComplete="off"
                placeholder="e.g. Weekdays after 4 PM"
                value={values.preferredCallTime}
                onChange={(e) => set('preferredCallTime', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            <div className="flex flex-col gap-[7px]">
              <label htmlFor="ct-service" className={LABEL_CLASS}>
                What do you need?
              </label>
              <select
                id="ct-service"
                name="service"
                value={values.jobType}
                onChange={(e) => set('jobType', e.target.value)}
                className={INPUT_CLASS}
              >
                {CONTACT.jobTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-start gap-3 pt-1 font-sans text-[13px] leading-[1.45] text-mute-3">
              <input
                name="smsConsent"
                type="checkbox"
                checked={values.smsConsent}
                onChange={(e) => setValues((v) => ({ ...v, smsConsent: e.target.checked }))}
                className="mt-0.5 h-4 w-4 accent-brand"
              />
              <span>Text me a confirmation about this request. Message and data rates may apply.</span>
            </label>

            <div className="flex flex-col gap-[7px]">
              <label htmlFor="ct-details" className={LABEL_CLASS}>
                Tell us about the job{' '}
                <span className="font-normal text-mute-2">(optional)</span>
              </label>
              <textarea
                id="ct-details"
                name="details"
                rows={3}
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
                className={`${INPUT_CLASS} resize-y`}
              />
            </div>

            <p className="m-0 border-l-2 border-sand-2 pl-3 font-sans text-[13px] leading-[1.45] text-mute-3">
              Have photos? Mention it in the details. The team will text you so you can send them directly.
            </p>

            <button
              type="submit"
              disabled={sending}
              aria-busy={sending}
              className="min-h-14 cursor-pointer border-none bg-brand p-[18px] font-sans text-[17px] font-bold text-paper transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-70"
            >
              {sending ? CONTACT.form.submitPending : CONTACT.form.submit}
            </button>

            <p
              role="status"
              aria-live="polite"
              className="m-0 min-h-[1.5em] font-sans text-[14px] leading-[1.45] text-mute-3"
            >
              {status === 'idle' && Object.keys(errors).length > 0 && (
                <span className="text-brand-deep">
                  Check the highlighted fields and send again.
                </span>
              )}
              {status === 'sent' && CONTACT.form.success}
              {status === 'error' && (
                <>
                  {CONTACT.form.failure}{' '}
                  <a
                    href={BUSINESS.phoneHref}
                    className="border-b border-brand text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  >
                    {BUSINESS.phone}
                  </a>
                </>
              )}
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
