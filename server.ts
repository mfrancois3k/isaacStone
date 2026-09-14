import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createVoiceSession } from './shared/voice-session.js';
import { XAI_MODEL, askWamy, keywordFallback, toChatTurns } from "./shared/consultant.js";
import {
  LEAD_ACCEPTED_MESSAGE,
  LEAD_FAILED_MESSAGE,
  LeadRecord,
  buildLead,
  missingFieldsMessage,
  missingLeadFields,
} from "./shared/leads.js";
import { notifyLead } from './shared/lead-notifications.js';

dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/voice-session', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.get('origin') !== `${req.protocol}://${req.get('host')}`) return res.status(403).json({ error: 'Origin not allowed.' });
  const result = await createVoiceSession(req.ip || 'unknown');
  return res.status(result.status).json(result.body);
});

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

    // Local development has the JSONL lead inbox as its durable store. Alerts
    // are best effort here, as the record is already safely written.
    const notifications = await notifyLead(lead);

    console.log(`[LEAD] ${lead.source} request from ${lead.name} (${lead.phone}) stored as ${lead.id}`, notifications);

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
  const { message, conversationHistory } = req.body ?? {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "A message string is required." });
  }

  try {
    const reply = await askWamy(toChatTurns(conversationHistory, message));
    if (reply) {
      return res.json({ reply, audioText: reply, source: XAI_MODEL });
    }
  } catch (error) {
    console.error("[WAMY] request failed:", error);
  }

  // Same fallback as the hosted function: no prices, no promises.
  const fallback = keywordFallback(message);
  return res.json({ reply: fallback, audioText: fallback, source: "expert-knowledge-base" });
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
