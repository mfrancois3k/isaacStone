import type { VercelRequest, VercelResponse } from '@vercel/node';
import { XAI_MODEL, askWamy, keywordFallback, toChatTurns } from '../shared/consultant.js';

/**
 * Best-effort per-IP limit so a bot cannot run up the xAI bill.
 * ponytail: in-memory, so it only holds per warm function instance — a
 * determined abuser spread across cold starts gets through. Move to Vercel KV
 * or Upstash if usage ever shows it.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  hits.set(ip, [...recent, now]);
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many messages. Call us at (631) 530-5883.' });
  }

  const { message, conversationHistory } = (req.body ?? {}) as {
    message?: unknown;
    conversationHistory?: unknown;
  };

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'A message string is required.' });
  }

  try {
    const reply = await askWamy(toChatTurns(conversationHistory, message));
    if (reply) {
      return res.status(200).json({ reply, audioText: reply, source: XAI_MODEL });
    }
  } catch (error) {
    console.error('[WAMY] request failed:', error);
  }

  // Unconfigured or failing model: the keyword replies make no promises and
  // quote no prices, so they are safe to serve rather than an error.
  const fallback = keywordFallback(message);
  return res.status(200).json({ reply: fallback, audioText: fallback, source: 'expert-knowledge-base' });
}
