/**
 * Lead normalisation, shared by the Express server and the Vercel function.
 *
 * A lead is what a real person typed. Nothing is inferred, priced or defaulted
 * into it: this record is the only trace of someone asking for work.
 */

export interface LeadRecord {
  id: string;
  createdAt: string;
  /** 'form' = the estimate request form, 'chat' = handed off from the AI helper. */
  source: 'form' | 'chat';
  name: string;
  phone: string;
  email?: string;
  /** One of the job types offered on the site, in the visitor's words. */
  projectType?: string;
  preferredCallTime?: string;
  notes?: string;
  /** The visitor explicitly asked for a transactional SMS confirmation. */
  customerSmsConsent: boolean;
  /** Kept intentionally simple for the MVP; the team works the new-lead inbox. */
  status: 'new';
}

const str = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

/**
 * A name and a phone number are the minimum needed to call someone back.
 * Email stays optional: the site tells people we answer the phone ourselves.
 *
 * Returned as a plain list rather than a discriminated union — this project
 * compiles without `strict`, so `ok: true | false` unions do not narrow.
 */
export function missingLeadFields(body: unknown): string[] {
  const raw = (body ?? {}) as Record<string, unknown>;
  const missing: string[] = [];
  if (!str(raw.name)) missing.push('name');
  if (!str(raw.phone)) missing.push('phone');
  return missing;
}

export function missingFieldsMessage(missing: string[]): string {
  return `Please include your ${missing.join(' and ')} so we can call you back.`;
}

/** Only call this once `missingLeadFields` has come back empty. */
export function buildLead(body: unknown): LeadRecord {
  const raw = (body ?? {}) as Record<string, unknown>;
  const email = str(raw.email);
  const projectType = str(raw.projectType);
  const preferredCallTime = str(raw.preferredCallTime);
  const notes = str(raw.notes);

  return {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    source: raw.source === 'chat' ? 'chat' : 'form',
    status: 'new',
    name: str(raw.name),
    phone: str(raw.phone),
    ...(email ? { email } : {}),
    ...(projectType ? { projectType } : {}),
    ...(preferredCallTime ? { preferredCallTime } : {}),
    ...(notes ? { notes } : {}),
    customerSmsConsent: raw.customerSmsConsent === true,
  };
}

export const LEAD_ACCEPTED_MESSAGE =
  'Thanks — your request is in. We reply the same day, Monday to Saturday. If you have not heard back today, call (631) 530-5883.';

export const LEAD_FAILED_MESSAGE =
  'We could not save your request. Please call (631) 530-5883 and we will take the details over the phone.';
