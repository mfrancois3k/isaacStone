import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  LEAD_ACCEPTED_MESSAGE,
  LEAD_FAILED_MESSAGE,
  buildLead,
  missingFieldsMessage,
  missingLeadFields,
} from '../../shared/leads.js';

/**
 * Estimate requests, on the hosted deployment.
 *
 * The local server appends leads to data/leads.jsonl. That cannot work here:
 * a serverless filesystem is ephemeral, so a lead written to disk is gone the
 * moment the function is recycled. Rather than accept a request and quietly
 * drop it, this handler forwards to LEAD_WEBHOOK_URL, and refuses honestly
 * when no sink is configured — a visitor who is told to call gets their job
 * quoted; a visitor who is told "thanks, we have it" does not.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const missing = missingLeadFields(req.body);
  if (missing.length > 0) {
    return res.status(400).json({ error: missingFieldsMessage(missing), missing });
  }
  const lead = buildLead(req.body);

  const sink = process.env.LEAD_WEBHOOK_URL;
  if (!sink) {
    console.error('[LEAD] LEAD_WEBHOOK_URL is not configured — request refused, nothing stored.');
    return res.status(503).json({
      error:
        'Our online form is not taking requests right now. Please call (631) 530-5883 — we answer the phone ourselves, Monday to Saturday.',
    });
  }

  try {
    const response = await fetch(sink, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      throw new Error(`lead sink responded ${response.status}`);
    }

    console.log(`[LEAD] ${lead.source} request from ${lead.name} forwarded as ${lead.id}`);
    return res.status(200).json({
      success: true,
      id: lead.id,
      message: LEAD_ACCEPTED_MESSAGE,
    });
  } catch (error) {
    console.error('[LEAD] failed to forward request:', error);
    return res.status(500).json({
      error: LEAD_FAILED_MESSAGE,
      details: error instanceof Error ? error.message : 'Internal error',
    });
  }
}
