import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { GEMINI_MODEL, SYSTEM_PROMPT, keywordFallback } from "./shared/consultant.js";
import {
  LEAD_ACCEPTED_MESSAGE,
  LEAD_FAILED_MESSAGE,
  LeadRecord,
  buildLead,
  missingFieldsMessage,
  missingLeadFields,
} from "./shared/leads.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client lazily with safety check
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Leads are also appended to disk. An in-memory array alone loses every request
// made since the last restart, and a lost lead is a lost customer.
const LEADS_FILE = path.resolve(process.cwd(), "data", "leads.jsonl");
const leadsStore: LeadRecord[] = [];

function loadLeadsFromDisk(): void {
  try {
    const raw = fs.readFileSync(LEADS_FILE, "utf8");
    for (const line of raw.split("\n")) {
      if (!line.trim()) continue;
      try {
        leadsStore.push(JSON.parse(line) as LeadRecord);
      } catch {
        console.warn("[LEADS] skipping unreadable line in", LEADS_FILE);
      }
    }
    leadsStore.reverse(); // newest first, matching the API's contract
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      console.error("[LEADS] could not read", LEADS_FILE, error?.message);
    }
  }
}

async function appendLeadToDisk(lead: LeadRecord): Promise<void> {
  await fs.promises.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await fs.promises.appendFile(LEADS_FILE, JSON.stringify(lead) + "\n", "utf8");
}

loadLeadsFromDisk();

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "isaac-stone-voice-api", leadsCount: leadsStore.length });
});

/**
 * Estimate request. Takes what the visitor gave us and stores it — that is all.
 *
 * It deliberately does NOT price the job. The site's published position is that
 * price depends on the material, the square footage and the state of the
 * substrate, and that the range is given on the phone before anyone drives out.
 * An earlier version of this route invented a project type, a material, a square
 * footage and a per-square-foot quote for every lead, then reported the estimate
 * as "dispatched" by an email that was never sent. None of that is coming back.
 */
app.post("/api/leads/book-call", async (req, res) => {
  try {
    const missing = missingLeadFields(req.body);
    if (missing.length > 0) {
      return res.status(400).json({ error: missingFieldsMessage(missing), missing });
    }
    const lead = buildLead(req.body);

    // Persist before replying — telling someone we have their request when the
    // write failed is the one outcome worse than an error message.
    await appendLeadToDisk(lead);
    leadsStore.unshift(lead);

    console.log(`[LEAD] ${lead.source} request from ${lead.name} (${lead.phone}) stored as ${lead.id}`);

    return res.json({
      success: true,
      id: lead.id,
      message: LEAD_ACCEPTED_MESSAGE
    });
  } catch (error: any) {
    console.error("[LEAD] failed to store request:", error);
    return res.status(500).json({
      error: LEAD_FAILED_MESSAGE,
      details: error?.message || "Internal error"
    });
  }
});

/**
 * Lead pipeline. This returns customers' names and phone numbers, so it is not
 * public: it needs the LEADS_TOKEN secret, and is disabled entirely when that
 * secret is not configured.
 */
app.get("/api/leads", (req, res) => {
  const expected = process.env.LEADS_TOKEN;
  if (!expected) {
    return res.status(404).json({ error: "Not found." });
  }
  const provided = req.get("x-leads-token") ?? "";
  if (provided !== expected) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  return res.json({ totalLeads: leadsStore.length, leads: leadsStore });
});

// Voice / Chat API endpoint
app.post("/api/voice-consultant", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "A message string is required." });
    }

    const ai = getGenAI();

    // Fallback if no API key is set in environment yet
    if (!ai) {
      const fallbackAnswer = keywordFallback(message);

      return res.json({
        reply: fallbackAnswer,
        audioText: fallbackAnswer,
        source: "expert-knowledge-base"
      });
    }

    // Convert conversation history into contents format
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(conversationHistory)) {
      for (const item of conversationHistory.slice(-6)) {
        if (item.sender === 'user' && item.text) {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'bot' && item.text) {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    // Add current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 250,
      },
    });

    const reply = response.text || "Sorry — I did not catch that. Tell me the room and the material you have in mind, or call (631) 530-5883 and Jonathan will pick up.";

    // Clean up any remaining asterisks or markdown to ensure smooth speech synthesis
    const cleanedReply = reply
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    res.json({
      reply: cleanedReply,
      audioText: cleanedReply,
      source: GEMINI_MODEL
    });
  } catch (error: any) {
    console.error("Gemini voice assistant error:", error);
    res.status(500).json({
      error: "Failed to generate consultant response.",
      details: error?.message || "Internal server error"
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ISAAC STONE API] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
