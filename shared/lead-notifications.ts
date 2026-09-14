import type { LeadRecord } from './leads.js';

type Delivery = 'sent' | 'skipped' | 'failed';
export interface LeadNotificationResult {
  ownerEmail: Delivery;
  customerEmail: Delivery;
  ownerSms: Delivery;
  customerSms: Delivery;
}

function phone(value?: string): string {
  const raw = value?.trim() ?? '';
  if (raw.startsWith('+')) return `+${raw.slice(1).replace(/\D/g, '')}`;
  const digits = raw.replace(/\D/g, '');
  // Isaac Stone & Tile serves Long Island. Normalising a typed local US number
  // avoids silently passing Twilio an invalid non-E.164 destination.
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return '';
}
const value = (label: string, content?: string) => content ? `${label}: ${content}` : undefined;

function leadLines(lead: LeadRecord): string[] {
  return [
    `New ${lead.source === 'chat' ? 'Wamy' : 'website'} estimate request`,
    `Lead ID: ${lead.id}`,
    value('Name', lead.name),
    value('Phone', lead.phone),
    value('Email', lead.email),
    value('Project', lead.projectType),
    value('Best time to call', lead.preferredCallTime),
    value('Notes', lead.notes),
    `Submitted: ${new Date(lead.createdAt).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' })} ET`,
  ].filter((line): line is string => Boolean(line));
}

async function resend(to: string, subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from || !to) return false;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (!response.ok) throw new Error(`Resend returned ${response.status}`);
  return true;
}

async function twilio(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = phone(process.env.TWILIO_FROM_NUMBER);
  const destination = phone(to);
  if (!sid || !token || !from || !destination) return false;
  const authorization = Buffer.from(`${sid}:${token}`).toString('base64');
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${authorization}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: destination, From: from, Body: body }).toString(),
  });
  if (!response.ok) throw new Error(`Twilio returned ${response.status}`);
  return true;
}

/**
 * Notifications never create a fake success. The caller must first persist the
 * lead (or, in the email-only fallback, await owner-email delivery). Alerts are
 * intentionally independent: one broken channel does not erase the lead.
 */
export async function notifyLead(lead: LeadRecord): Promise<LeadNotificationResult> {
  const lines = leadLines(lead);
  const ownerText = lines.join('\n');
  const customerName = lead.name.split(/\s+/)[0] || 'there';
  const customerText = `Hi ${customerName} — Isaac Stone and Tile received your request. We will follow up shortly. For immediate help, call (631) 530-5883.`;
  const result: LeadNotificationResult = { ownerEmail: 'skipped', customerEmail: 'skipped', ownerSms: 'skipped', customerSms: 'skipped' };
  const send = async (key: keyof LeadNotificationResult, job: () => Promise<boolean>) => {
    try { result[key] = await job() ? 'sent' : 'skipped'; }
    catch (error) { result[key] = 'failed'; console.error(`[LEAD] ${key} notification failed`, error); }
  };

  await Promise.all([
    send('ownerEmail', () => resend(process.env.OWNER_EMAIL ?? '', `New estimate request — ${lead.name}`, ownerText)),
    send('customerEmail', () => lead.email ? resend(lead.email, 'We received your request — Isaac Stone and Tile', customerText) : Promise.resolve(false)),
    send('ownerSms', () => twilio(process.env.TWILIO_OWNER_TO_NUMBER ?? '', `NEW LEAD: ${lead.name} · ${lead.phone}${lead.projectType ? ` · ${lead.projectType}` : ''}`)),
    send('customerSms', () => lead.customerSmsConsent ? twilio(lead.phone, customerText) : Promise.resolve(false)),
  ]);
  return result;
}

/** A hosted lead must have a durable destination before we tell the visitor it was received. */
export function hasHostedLeadSink(): boolean {
  return Boolean(process.env.LEAD_WEBHOOK_URL || (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.OWNER_EMAIL));
}
