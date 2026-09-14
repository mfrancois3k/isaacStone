import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  LEAD_ACCEPTED_MESSAGE,
  LEAD_FAILED_MESSAGE,
  buildLead,
  missingFieldsMessage,
  missingLeadFields,
} from '../../shared/leads.js';
import { hasHostedLeadSink, notifyLead } from '../../shared/lead-notifications.js';

/**
 * Estimate requests, on the hosted deployment.
 *
 * The local server appends leads to data/leads.jsonl. That cannot work here:
 * a serverless filesystem is ephemeral, so a lead written to disk is gone the
 * moment the function is recycled. Rather than accept a request and quietly
 * drop it, this handler requires either a webhook lead list or a successfully
 * delivered owner email, and refuses honestly when neither is configured.
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
  if (!hasHostedLeadSink()) {
    console.error('[LEAD] no durable delivery destination is configured — request refused.');
    return res.status(503).json({
      error:
        'Our online form is not taking requests right now. Please call (631) 530-5883 — we answer the phone ourselves, Monday to Saturday.',
    });
  }

  try {
    // A webhook is the durable source of truth when configured. If the owner
    // email inbox is the chosen MVP inbox, Resend delivery below is the sink.
    if (sink) {
      const response = await fetch(sink, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      if (!response.ok) throw new Error(`lead sink responded ${response.status}`);
    }

    const notifications = await notifyLead(lead);
    if (!sink && notifications.ownerEmail !== 'sent') {
      throw new Error('owner email could not be delivered');
    }

    console.log(`[LEAD] ${lead.source} request from ${lead.name} accepted as ${lead.id}`, notifications);
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
