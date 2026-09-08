import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_MODEL, SYSTEM_PROMPT, keywordFallback } from '../shared/consultant';

interface HistoryItem {
  sender?: string;
  text?: string;
}

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { message, conversationHistory = [] } = (req.body ?? {}) as {
    message?: unknown;
    conversationHistory?: HistoryItem[];
  };

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'A message string is required.' });
  }

  const ai = getGenAI();

  // No key configured: the keyword replies are held to the same standard as
  // the system prompt, so this path is safe to serve to a real visitor.
  if (!ai) {
    const fallbackAnswer = keywordFallback(message);
    return res.status(200).json({
      reply: fallbackAnswer,
      audioText: fallbackAnswer,
      source: 'expert-knowledge-base',
    });
  }

  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  if (Array.isArray(conversationHistory)) {
    for (const item of conversationHistory.slice(-6)) {
      if (item?.sender === 'user' && item.text) {
        contents.push({ role: 'user', parts: [{ text: item.text }] });
      } else if (item?.sender === 'bot' && item.text) {
        contents.push({ role: 'model', parts: [{ text: item.text }] });
      }
    }
  }
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 250,
      },
    });

    // Strip markdown so the reply reads cleanly through speech synthesis.
    const cleaned = (response.text ?? '')
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    // An empty model reply is a failure, not an answer — fall back rather than
    // inventing something reassuring to say on the company's behalf.
    const reply = cleaned || keywordFallback(message);

    return res.status(200).json({
      reply,
      audioText: reply,
      source: cleaned ? GEMINI_MODEL : 'expert-knowledge-base',
    });
  } catch (error) {
    console.error('Gemini voice assistant error:', error);
    return res.status(500).json({
      error: 'Failed to generate consultant response.',
      details: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
