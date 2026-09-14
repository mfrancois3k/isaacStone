import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createVoiceSession } from '../shared/voice-session.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const host = req.headers.host;
  if (!host || req.headers.origin !== `https://${host}`) return res.status(403).json({ error: 'Origin not allowed.' });
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || 'unknown';
  const result = await createVoiceSession(ip);
  return res.status(result.status).json(result.body);
}
