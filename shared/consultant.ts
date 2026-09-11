/**
 * Shared between the local Express server (server.ts) and the Vercel
 * serverless functions in api/. One copy, so the two deployments cannot drift
 * into saying different things on a real business's behalf.
 */

import { WAMY_SYSTEM_PROMPT } from './wamy-prompt.js';

/** Verified against GET https://api.x.ai/v1/models on 2026-09-11. */
export const XAI_MODEL = process.env.XAI_MODEL || 'grok-4.6';

/**
 * Rules that depend on how this site is wired, appended to Wamy's authored
 * prompt rather than edited into it.
 *
 * Wamy's prompt tells the visitor "Jonathan will follow up the same business
 * day" once it has their details. But the chat cannot deliver anything by
 * itself: details only reach Jonathan when the visitor presses "Send this to
 * Jonathan", and that endpoint refuses unless a lead webhook is configured.
 * Promising a callback the system has no record of is the one failure a
 * contractor's site cannot afford, so the chat hands off instead of promising.
 */
const SITE_HANDOFF_RULES = `

How this website works (these rules override step 4 above):
- You cannot send, save or forward anything yourself. Nothing the visitor types here reaches Jonathan unless they press the "Send this to Jonathan" button below the chat, or call.
- Once you have their details, confirm them back in one short summary, then tell them to press "Send this to Jonathan" below, or call (631) 530-5883 if they would rather talk now.
- Never say that Jonathan will follow up, call them, or be in touch, and never say their details have been sent or received.
- Reply in plain sentences with no markdown, bullet points or asterisks. Replies may be read aloud.`;

export const SYSTEM_PROMPT = WAMY_SYSTEM_PROMPT + SITE_HANDOFF_RULES;

/** Cost guards. A public chatbot is an open tab on the xAI bill. */
const MAX_OUTPUT_TOKENS = 300;
const MAX_TURNS = 12;
const MAX_CHARS_PER_TURN = 2000;

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

/** The site's widget sends `{sender: 'user' | 'bot', text}`; xAI wants roles. */
export function toChatTurns(history: unknown, message: string): ChatTurn[] {
  const turns: ChatTurn[] = [];
  if (Array.isArray(history)) {
    for (const item of history) {
      const text = typeof item?.text === 'string' ? item.text : '';
      if (!text) continue;
      if (item.sender === 'user') turns.push({ role: 'user', content: text });
      else if (item.sender === 'bot') turns.push({ role: 'assistant', content: text });
    }
  }
  turns.push({ role: 'user', content: message });
  return turns
    .slice(-MAX_TURNS)
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, MAX_CHARS_PER_TURN) }));
}

/**
 * Ask Wamy. Returns the reply text, or null when xAI is not configured, errors,
 * or returns nothing usable — the caller then serves `keywordFallback`, which is
 * held to the same no-prices, no-promises standard.
 */
export async function askWamy(turns: ChatTurn[]): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.x.ai/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: XAI_MODEL,
      instructions: SYSTEM_PROMPT,
      input: turns,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      stream: false,
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    console.error('[WAMY] xAI error', response.status, JSON.stringify(data)?.slice(0, 300));
    return null;
  }

  const text: unknown =
    data?.output_text ??
    data?.output
      ?.flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content ?? [])
      .find((part: { type?: string }) => part.type === 'output_text')?.text;

  if (typeof text !== 'string') return null;

  // Strip markdown so the reply reads cleanly through speech synthesis.
  const cleaned = text.replace(/[*_#`~[\]]/g, '').replace(/\n+/g, ' ').trim();
  return cleaned || null;
}

/**
 * What a visitor gets when XAI_API_KEY is unset or xAI fails. Held to exactly the same
 * standard as SYSTEM_PROMPT: no prices, no deposits, no timelines, no invented
 * partners or materials.
 */
export function keywordFallback(message: string): string {
  const query = message.toLowerCase();
  let fallbackAnswer = "This is the estimate helper for Isaac Stone and Tile in Brentwood, New York. We do tile, granite and marble installation, plus superstructure and foundation work, across Long Island, New York City and South Florida. Tell me the room and the material you have in mind, or call (631) 530-5883.";

  if (query.includes("deposit") || query.includes("payment") || query.includes("policy")) {
    fallbackAnswer = "I do not have anything on payment terms, and I am not going to guess at it. Jonathan can tell you exactly how it works — call (631) 530-5883. The on-site visit and the written estimate are free either way.";
  } else if (
    query.includes("price") || query.includes("cost") || query.includes("estimate") ||
    query.includes("rate") || query.includes("quote") || query.includes("how much") ||
    query.includes("charge") || query.includes("per square") || query.includes("sq ft") ||
    query.includes("square foot") || query.includes("budget") || query.includes("expensive")
  ) {
    fallbackAnswer = "I cannot give you a price. It depends on the material, the square footage, and the state of the floor or wall underneath. We give you the range on the phone before anyone drives out, so call (631) 530-5883, or leave me the room, the material and your number and Jonathan will call you.";
  } else if (query.includes("book") || query.includes("call") || query.includes("appointment") || query.includes("consult")) {
    fallbackAnswer = "Happy to set that up. The visit is free and there is no obligation. Give me your name, a phone number, the room and material, and roughly when you want it done — or call (631) 530-5883, Monday to Saturday, seven in the morning to half past six.";
  } else if (query.includes("marble") || query.includes("granite") || query.includes("tile") || query.includes("foundation")) {
    fallbackAnswer = "We do tile, granite and marble installation, and superstructure and foundation work. Which room are you thinking about? If you have a specific material in mind, Jonathan is the one to ask — (631) 530-5883.";
  } else if (query.includes("hour") || query.includes("open") || query.includes("saturday")) {
    fallbackAnswer = "We are open Monday to Saturday, seven in the morning to half past six. The number is (631) 530-5883 and someone here answers it.";
  } else if (query.includes("area") || query.includes("location") || query.includes("hamptons") || query.includes("where")) {
    fallbackAnswer = "We are in Brentwood, New York. We work across Long Island — Suffolk, Nassau and the Hamptons — as well as New York City and South Florida.";
  } else if (query.includes("contact") || query.includes("phone") || query.includes("email")) {
    fallbackAnswer = "The number is (631) 530-5883. Jonathan, the owner, is on (347) 622-8386, and the email is jafet.tile@gmail.com. Monday to Saturday, seven in the morning to half past six.";
  }

  return fallbackAnswer;
}
