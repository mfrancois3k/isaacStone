/** Server-only token minting. The permanent API key never reaches the browser. */
const attempts = new Map<string, { count: number; expires: number }>();

export async function createVoiceSession(ip: string) {
  const key = process.env.XAI_API_KEY;
  const agentId = process.env.XAI_AGENT_ID;
  if (!key || !agentId) return { status: 503, body: { error: 'Voice is unavailable. Please type below or call (631) 530-5883.' } };
  const now = Date.now();
  for (const [id, entry] of attempts) if (entry.expires <= now) attempts.delete(id);
  const entry = attempts.get(ip) ?? { count: 0, expires: now + 60_000 };
  if (entry.count >= 5) return { status: 429, body: { error: 'Please wait a minute before starting another voice conversation.' } };
  entry.count++;
  attempts.set(ip, entry);
  try {
    const response = await fetch('https://api.x.ai/v1/realtime/client_secrets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expires_after: { seconds: 60 } }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = await response.json();
    if (!response.ok || typeof data.value !== 'string') {
      console.error('[Voice] token request failed', response.status);
      return { status: 502, body: { error: 'Voice could not connect. Please try again or type below.' } };
    }
    return { status: 200, body: { token: data.value, expiresAt: data.expires_at, agentId } };
  } catch {
    return { status: 502, body: { error: 'Voice could not connect. Please try again or type below.' } };
  }
}
