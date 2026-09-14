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
const escapeHtml = (value?: string) => (value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
const clean = (value?: string) => value?.trim() || 'Not provided';
const nyTime = (date: string) => new Date(date).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' });

interface EstimateRange {
  area?: number;
  low?: number;
  high?: number;
  lines: Array<{ service: string; rate: string }>;
  ready: boolean;
}

/**
 * A transparent, conservative helper based only on the rate card supplied by
 * Isaac Stone & Tile. It refuses to produce a range without an area, and every
 * result is marked preliminary in the email — never a quote or invoice.
 */
function estimateRange(lead: LeadRecord): EstimateRange {
  const source = `${lead.projectType ?? ''} ${lead.notes ?? ''}`.toLowerCase();
  const areaMatch = source.match(/\b(\d{1,5}(?:\.\d+)?)\s*(?:sq\.?\s*(?:ft|feet)|square\s*(?:feet|foot))\b/i);
  const area = areaMatch ? Number(areaMatch[1]) : undefined;
  const lines: Array<{ service: string; rate: string; low: number; high: number }> = [];
  if (/porcelain|tile/.test(source)) lines.push({ service: 'Tile installation', rate: /porcelain/.test(source) ? '$20–$30 / sq ft' : '$14 / sq ft', low: /porcelain/.test(source) ? 20 : 14, high: /porcelain/.test(source) ? 30 : 14 });
  if (/demolition|demo\b|remove existing|tear.?out/.test(source)) lines.push({ service: 'Demolition', rate: '$2 / sq ft', low: 2, high: 2 });
  if (/waterproof/.test(source)) lines.push({ service: 'Waterproofing', rate: '$5 / sq ft', low: 5, high: 5 });
  if (/prep|surface|grind|level/.test(source)) lines.push({ service: 'Surface preparation', rate: '$5–$7 / sq ft', low: 5, high: 7 });
  if (!area || !lines.length) return { area, lines: lines.map(({ service, rate }) => ({ service, rate })), ready: false };
  return {
    area,
    low: Math.round(area * lines.reduce((total, item) => total + item.low, 0)),
    high: Math.round(area * lines.reduce((total, item) => total + item.high, 0)),
    lines: lines.map(({ service, rate }) => ({ service, rate })),
    ready: true,
  };
}

const money = (amount?: number) => amount === undefined ? 'Pending' : amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const actionButton = (href: string, label: string, accent = false) => `<a href="${href}" style="display:inline-block;margin:0 6px 8px 0;padding:12px 14px;border:1px solid ${accent ? '#a1563f' : '#49463f'};background:${accent ? '#a1563f' : '#fffdf8'};color:${accent ? '#fff' : '#292824'};font:700 12px Arial,sans-serif;letter-spacing:.7px;text-decoration:none">${label}</a>`;

function ownerEmailHtml(lead: LeadRecord): string {
  const estimate = estimateRange(lead);
  const baseUrl = (process.env.SITE_URL || 'https://isaac-stone-and-tile.vercel.app').replace(/\/$/, '');
  const call = `tel:${phone(lead.phone) || lead.phone.replace(/\D/g, '')}`;
  const text = `sms:${phone(lead.phone) || lead.phone.replace(/\D/g, '')}`;
  const query = encodeURIComponent([lead.projectType, lead.notes].filter(Boolean).join(' — ') || `${lead.name} estimate request`);
  const map = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const rows = (label: string, content: string) => `<tr><td style="padding:8px 10px;border-bottom:1px solid #e4ddd2;color:#716b61;font:700 10px Arial,sans-serif;letter-spacing:1px">${label}</td><td style="padding:8px 10px;border-bottom:1px solid #e4ddd2;color:#292824;font:16px Georgia,serif">${escapeHtml(content)}</td></tr>`;
  const rateRows = estimate.lines.length ? estimate.lines.map((line) => `<tr><td style="padding:7px 10px;border-bottom:1px solid #e4ddd2">${escapeHtml(line.service)}</td><td style="padding:7px 10px;border-bottom:1px solid #e4ddd2;text-align:right">${escapeHtml(line.rate)}</td></tr>`).join('') : '<tr><td style="padding:9px 10px" colspan="2">Wamy needs approximate square footage and a clearer scope before a range can be calculated.</td></tr>';
  const range = estimate.ready ? `${money(estimate.low)} – ${money(estimate.high)}` : 'RANGE PENDING';
  return `<!doctype html><html><body style="margin:0;background:#eee9e1;color:#292824"><div style="max-width:760px;margin:0 auto;padding:22px 12px;font-family:Arial,sans-serif"><div style="background:#fffdf8;border-top:5px solid #a1563f;padding:28px"><img src="${baseUrl}/assets/design/img13.png" alt="Isaac Stone and Tile" width="150" style="display:block;width:150px;height:auto;margin-bottom:20px"><div style="border-bottom:2px solid #292824;padding-bottom:16px"><p style="margin:0 0 8px;color:#a1563f;font:700 11px Arial,sans-serif;letter-spacing:1.5px">NEW LEAD · NEEDS REVIEW</p><h1 style="margin:0;font:700 36px Georgia,serif;letter-spacing:-1px">WAMY ESTIMATE REQUEST</h1></div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0;background:#f2eee7"><tr><td style="padding:12px"><b>LEAD ID</b><br>${escapeHtml(lead.id)}</td><td style="padding:12px"><b>RECEIVED</b><br>${nyTime(lead.createdAt)} ET</td><td style="padding:12px"><b>SOURCE</b><br>${lead.source === 'chat' ? 'Wamy conversation' : 'Website form'}</td></tr></table><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="50%" valign="top" style="padding-right:8px"><h2 style="margin:0;background:#292824;color:#fff;padding:10px;font:700 14px Georgia,serif;letter-spacing:1px">CLIENT DETAILS</h2><table width="100%" cellspacing="0" cellpadding="0">${rows('NAME', lead.name)}${rows('PHONE', lead.phone)}${rows('EMAIL', clean(lead.email))}${rows('PREFERRED CONTACT', lead.customerSmsConsent ? 'Call or text' : 'Call or email')}${rows('SMS CONSENT', lead.customerSmsConsent ? 'Yes' : 'No')}</table></td><td width="50%" valign="top" style="padding-left:8px"><h2 style="margin:0;background:#292824;color:#fff;padding:10px;font:700 14px Georgia,serif;letter-spacing:1px">PROJECT DETAILS</h2><table width="100%" cellspacing="0" cellpadding="0">${rows('PROJECT', clean(lead.projectType))}${rows('APPROX. AREA', estimate.area ? `${estimate.area.toLocaleString()} sq ft` : 'Not provided')}${rows('PREFERRED VISIT', clean(lead.preferredCallTime))}${rows('APPOINTMENT', 'Requested only — team must confirm')}</table></td></tr></table><div style="margin-top:18px;border:2px solid #a1563f"><div style="background:#a1563f;color:#fff;padding:10px;font:700 14px Georgia,serif;letter-spacing:1px">PRELIMINARY ESTIMATE RANGE</div><div style="padding:18px"><div style="color:#9b4b34;text-align:center;font:700 32px Georgia,serif">${range}</div><p style="margin:7px 0 14px;text-align:center;color:#655f55">Labor + captured scope only · materials, delivery, tax, permits and disposal excluded unless stated in the final estimate.</p><table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e4ddd2;font-size:14px"><tr style="background:#f2eee7"><th align="left" style="padding:8px 10px">SERVICE</th><th align="right" style="padding:8px 10px">STANDARD RATE</th></tr>${rateRows}</table><p style="margin:14px 0 0;font-size:12px;line-height:1.5"><b>PRICING CONFIDENCE: ${estimate.ready ? 'NEEDS SITE REVIEW' : 'RANGE PENDING'}</b><br>Preliminary range only. Not a contract, invoice, or final written estimate. Final pricing depends on verified measurements, substrate condition, material selection, access, and site inspection.</p></div></div><h2 style="margin:18px 0 0;background:#292824;color:#fff;padding:10px;font:700 14px Georgia,serif;letter-spacing:1px">WAMY SUMMARY</h2><p style="margin:0;padding:14px;background:#f7f3ea;font:16px/1.5 Georgia,serif">${escapeHtml(clean(lead.notes))}</p><div style="margin-top:18px">${actionButton(call, 'CALL CUSTOMER', true)}${actionButton(text, 'TEXT CUSTOMER')}${actionButton(map, 'OPEN IN MAPS')}<span style="display:inline-block;padding:12px 14px;border:1px solid #49463f;font:700 12px Arial,sans-serif;letter-spacing:.7px">MARK CONTACTED (CRM)</span></div><p style="margin:20px 0 0;border-top:1px solid #ddd4c8;padding-top:14px;color:#716b61;font-size:11px;text-align:center">Captured by Wamy for Isaac Stone and Tile. Appointment is not booked until the team confirms availability.</p></div></div></body></html>`;
}

/**
 * The customer version intentionally mirrors Wamy's promise: a request has
 * been received, not an appointment booked. It only shows a preliminary range
 * when the captured details support one, so we never manufacture a price.
 */
function customerEmailHtml(lead: LeadRecord): string {
  const estimate = estimateRange(lead);
  const baseUrl = (process.env.SITE_URL || 'https://isaac-stone-and-tile.vercel.app').replace(/\/$/, '');
  const customerName = escapeHtml(lead.name.split(/\s+/)[0] || 'there');
  const project = escapeHtml(clean(lead.projectType));
  const visit = escapeHtml(clean(lead.preferredCallTime));
  const range = estimate.ready ? `${money(estimate.low)} – ${money(estimate.high)}` : 'Range pending';
  const rangeCopy = estimate.ready
    ? 'Based on the information you shared. Final pricing follows an on-site review and verified measurements.'
    : 'We will prepare a preliminary range after the team reviews your project details.';
  const row = (icon: string, label: string, content: string) => `<tr><td width="54" style="padding:16px 8px 16px 18px;color:#a4472c;font:700 20px Arial,sans-serif">${icon}</td><td style="padding:16px 10px;border-bottom:1px solid #ded8cf"><div style="color:#6d665d;font:700 10px Arial,sans-serif;letter-spacing:1.5px">${label}</div><div style="padding-top:4px;color:#202522;font:20px Georgia,serif">${content}</div></td></tr>`;
  const call = 'tel:+16315305883';
  const request = `${baseUrl}/#contact`;

  return `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;background:#eeeae3;color:#202522"><div style="max-width:680px;margin:0 auto;padding:22px 10px"><div style="background:#fffdf9;overflow:hidden"><div style="padding:30px 30px 18px;background:linear-gradient(135deg,#fffdf9 0%,#f2eee7 100%)"><img src="${baseUrl}/assets/design/img13.png" alt="Isaac Stone and Tile" width="185" style="display:block;width:185px;height:auto;max-width:100%;margin-bottom:28px"><p style="margin:0;color:#a4472c;font:700 10px Arial,sans-serif;letter-spacing:2px">WAMY · PROJECT REQUEST CONFIRMATION</p><h1 style="margin:18px 0 0;color:#1f2522;font:700 46px/1 Georgia,serif;letter-spacing:-1.5px">WE’VE GOT<br>YOUR PROJECT</h1><div style="width:58px;height:3px;background:#a4472c;margin-top:20px"></div></div><div style="padding:8px 30px 32px"><p style="margin:20px 0 8px;font:30px Georgia,serif">Hi ${customerName},</p><p style="margin:0 0 24px;color:#333a36;font:19px/1.5 Georgia,serif">Wamy received your request and sent it to the Isaac Stone and Tile team. A team member will review it and follow up shortly.</p><div style="background:#f3f0e9;border:1px solid #e2ddd4"><div style="padding:15px 18px;border-bottom:1px solid #ded8cf;text-align:center;color:#242925;font:700 12px Arial,sans-serif;letter-spacing:3px">REQUEST AT A GLANCE</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${row('⌂', 'PROJECT', project)}${row('▣', 'REQUESTED VISIT', visit)}${row('◷', 'CURRENT STATUS', 'Awaiting team confirmation')}</table></div><div style="margin-top:18px;padding:22px 18px;border:1px solid #c8bdb0;background:#f6f1e9 url('${baseUrl}/assets/design/img1.png') center/cover no-repeat"><div style="background:rgba(255,253,249,.91);padding:18px;text-align:center"><p style="margin:0;color:#242925;font:700 11px Arial,sans-serif;letter-spacing:3px">PRELIMINARY INVESTMENT</p><p style="margin:14px 0 8px;color:#a4472c;font:700 40px Georgia,serif">${range}</p><p style="margin:0;color:#4e504b;font:15px/1.45 Georgia,serif">${rangeCopy}</p></div></div><div style="margin-top:24px;border-top:1px solid #ded8cf;border-bottom:1px solid #ded8cf;padding:18px 0"><p style="margin:0 0 15px;text-align:center;color:#242925;font:700 11px Arial,sans-serif;letter-spacing:2px">WHAT HAPPENS NEXT</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" width="33%" style="padding:0 7px;color:#444942;font:14px/1.35 Georgia,serif"><b style="color:#a4472c;font-size:22px">1</b><br>Team reviews<br>your request</td><td align="center" width="33%" style="padding:0 7px;color:#444942;font:14px/1.35 Georgia,serif;border-left:1px solid #ded8cf"><b style="color:#a4472c;font-size:22px">2</b><br>We confirm<br>availability</td><td align="center" width="33%" style="padding:0 7px;color:#444942;font:14px/1.35 Georgia,serif;border-left:1px solid #ded8cf"><b style="color:#a4472c;font-size:22px">3</b><br>You receive a<br>written estimate</td></tr></table></div><p style="margin:22px 0 12px;text-align:center;color:#4e504b;font:16px Georgia,serif">Questions? We’re here to help.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:7px"><a href="${call}" style="display:block;padding:15px 8px;background:#a4472c;color:#fff;text-decoration:none;font:700 13px Arial,sans-serif;letter-spacing:1px">CALL (631) 530-5883</a></td><td align="center" style="padding:7px"><a href="${request}" style="display:block;padding:14px 8px;border:1px solid #a4472c;color:#8b3c27;text-decoration:none;font:700 13px Arial,sans-serif;letter-spacing:1px">VIEW MY REQUEST</a></td></tr></table></div><div style="padding:22px 30px;background:#2a302d;color:#f6f1e9;text-align:center"><p style="margin:0;font:700 10px Arial,sans-serif;letter-spacing:2px">ISAAC STONE AND TILE</p><p style="margin:8px 0 0;color:#d8d1c7;font:11px Arial,sans-serif;letter-spacing:1px">QUALITY WORK · BUILT TO LAST</p></div></div><p style="margin:13px 12px 0;color:#6d665d;text-align:center;font:11px/1.4 Arial,sans-serif">This is a request confirmation — not a booked appointment, invoice, or final quote.</p></div></body></html>`;
}

function customerSmsText(lead: LeadRecord): string {
  const estimate = estimateRange(lead);
  const customerName = lead.name.split(/\s+/)[0] || 'there';
  const project = clean(lead.projectType);
  const visit = clean(lead.preferredCallTime);
  const range = estimate.ready ? ` Preliminary range: ${money(estimate.low)}–${money(estimate.high)}; final pricing follows site review.` : '';
  return `Isaac Stone & Tile: Hi ${customerName}—Wamy received your request for ${project}. Requested visit: ${visit} (awaiting team confirmation).${range} We’ll follow up shortly. Questions? Call (631) 530-5883. Reply STOP to opt out.`;
}

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

async function resend(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from || !to) return false;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text, ...(html ? { html } : {}) }),
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
  const customerText = customerSmsText(lead);
  const result: LeadNotificationResult = { ownerEmail: 'skipped', customerEmail: 'skipped', ownerSms: 'skipped', customerSms: 'skipped' };
  const send = async (key: keyof LeadNotificationResult, job: () => Promise<boolean>) => {
    try { result[key] = await job() ? 'sent' : 'skipped'; }
    catch (error) { result[key] = 'failed'; console.error(`[LEAD] ${key} notification failed`, error); }
  };

  await Promise.all([
    send('ownerEmail', () => resend(process.env.OWNER_EMAIL ?? '', `New Wamy estimate request — ${lead.name}`, ownerText, ownerEmailHtml(lead))),
    send('customerEmail', () => lead.email ? resend(lead.email, 'We’ve got your project — Isaac Stone and Tile', customerText, customerEmailHtml(lead)) : Promise.resolve(false)),
    send('ownerSms', () => twilio(process.env.TWILIO_OWNER_TO_NUMBER ?? '', `NEW LEAD: ${lead.name} · ${lead.phone}${lead.projectType ? ` · ${lead.projectType}` : ''}`)),
    send('customerSms', () => lead.customerSmsConsent ? twilio(lead.phone, customerText) : Promise.resolve(false)),
  ]);
  return result;
}

/** A hosted lead must have a durable destination before we tell the visitor it was received. */
export function hasHostedLeadSink(): boolean {
  return Boolean(process.env.LEAD_WEBHOOK_URL || (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.OWNER_EMAIL));
}
