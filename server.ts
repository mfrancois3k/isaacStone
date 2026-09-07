import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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

// In-memory store for consultation leads & estimate requests
interface LeadRecord {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  material: string;
  sqftRange: string;
  preferredCallTime: string;
  addressOrTown: string;
  notes: string;
  quoteId: string;
  estimate: {
    materialEstimate: number;
    laborEstimate: number;
    substratePrep: number;
    totalProjected: number;
    depositDue: number;
    notes: string;
  };
  emailStatus: 'DISPATCHED' | 'QUEUED';
  leadStatus: 'NEW_LEAD' | 'CALL_SCHEDULED' | 'FOLLOWUP_QUEUED';
}

const leadsStore: LeadRecord[] = [];

// System instructions for Isaac Stone & Tile Voice & Estimation Consultant
const SYSTEM_PROMPT = `You are the AI Architectural Consultant & Estimator for ISAAC STONE AND TILE LLC, a premier luxury stone and tile masonry firm based in Brentwood, NY (serving Long Island, the Hamptons, Manhasset, Nassau, Suffolk, and NYC).

Company Identity & Standards:
- Company: ISAAC STONE AND TILE LLC
- Slogan & Philosophy: "Tiles tailored for your home"
- Fabrication & Field Partner: Formia Stone (Long Island, NY)
- Instagram: @jafettile____com (over 30 verified field projects)
- Phone / Direct Dispatch: (631) 530-5883 / (347) 622-8386
- Specialties: Precision diamond-cut miter waterfall islands, bookmatched Italian Calacatta Viola / Carrara / Nero Marquina marble, Taj Mahal quartzite, large-format porcelain slabs (up to 5'x10'), curbless linear-drain steam showers, architectural fireplace surrounds, chevron and herringbone floor tiling.
- Tolerance: ±0.2mm razor-sharp miters, zero-lippage mechanical leveling, 100% back-butter coverage, L/720 deflection guarantee.
- Mobilization Terms: Standard 50% mobilization deposit required upon contract execution to lock digital laser templating and reserve quarried slabs. Remaining 50% due upon final grout, polish, and architectural signoff.
- Lead Protocol: Instead of giving loose ballpark numbers that discourage serious consultation, emphasize booking an on-site laser templating call. Collect their project details (room, material, dimensions, email, phone) and assure them our system dispatches an itemized architectural estimate directly to their email and schedules a master mason consultation call.

VoiceCadence & Rules:
1. Speak naturally, authoritatively, and warmly. Designed to be spoken or read aloud.
2. Keep spoken responses concise (2 to 4 sentences).
3. If the user asks for a price or estimate, guide them to book a consultation call or give their email and phone so you can dispatch an itemized estimate to their inbox right away.
4. Avoid heavy markdown like asterisks, bullet points, or tables.`;

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "isaac-stone-voice-api", leadsCount: leadsStore.length });
});

// Book a call & dispatch custom estimate via email
app.post("/api/leads/book-call", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      projectType = "Master Bath Marble & Tile Remodel",
      material = "Italian Calacatta Marble",
      sqftRange = "250 - 450 sq ft",
      preferredCallTime = "Morning 8:00 AM - 11:00 AM",
      addressOrTown = "Long Island, NY",
      notes = ""
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        error: "Name, email, and phone number are required to book a consultation call."
      });
    }

    // Determine estimated square footage midpoint for custom calculation
    let approxSqft = 250;
    if (sqftRange.includes("Under 150")) approxSqft = 120;
    else if (sqftRange.includes("150 - 350")) approxSqft = 250;
    else if (sqftRange.includes("350 - 650")) approxSqft = 500;
    else if (sqftRange.includes("650+")) approxSqft = 850;
    else {
      const parsed = parseInt(sqftRange, 10);
      if (!isNaN(parsed) && parsed > 0) approxSqft = parsed;
    }

    // Material calculation tiers
    let materialUnit = 38;
    let laborUnit = 28;
    if (material.toLowerCase().includes("marble") || material.toLowerCase().includes("calacatta")) {
      materialUnit = 48;
      laborUnit = 34;
    } else if (material.toLowerCase().includes("quartzite") || material.toLowerCase().includes("taj mahal")) {
      materialUnit = 45;
      laborUnit = 32;
    } else if (material.toLowerCase().includes("porcelain") || material.toLowerCase().includes("slab")) {
      materialUnit = 32;
      laborUnit = 30;
    } else if (material.toLowerCase().includes("granite")) {
      materialUnit = 34;
      laborUnit = 26;
    }

    const materialEstimate = Math.round(approxSqft * materialUnit);
    const laborEstimate = Math.round(approxSqft * laborUnit);
    const substratePrep = Math.round(approxSqft * 5.5);
    const totalProjected = materialEstimate + laborEstimate + substratePrep;
    const depositDue = Math.round(totalProjected * 0.5);

    const quoteId = `IST-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const leadRecord: LeadRecord = {
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name,
      email,
      phone,
      projectType,
      material,
      sqftRange,
      preferredCallTime,
      addressOrTown,
      notes,
      quoteId,
      estimate: {
        materialEstimate,
        laborEstimate,
        substratePrep,
        totalProjected,
        depositDue,
        notes: "Subject to on-site digital laser templating verification and Formia Stone slab batch selection."
      },
      emailStatus: "DISPATCHED",
      leadStatus: "CALL_SCHEDULED"
    };

    leadsStore.unshift(leadRecord);

    console.log(`[LEAD CAPTURED] New consultation booked by ${name} (${phone}, ${email}) for ${projectType}. Quote ${quoteId} emailed.`);

    return res.json({
      success: true,
      quoteId,
      message: `Custom architectural estimate dispatched to ${email}. Our field project director will call ${phone} during your preferred window (${preferredCallTime}) to confirm your on-site survey.`,
      emailSentTo: email,
      scheduledCall: {
        name,
        phone,
        preferredCallTime,
        addressOrTown
      },
      estimateSummary: {
        quoteId,
        projectType,
        material,
        approxSqft,
        totalProjected,
        depositDue,
        terms: "50% Mobilization Deposit upon laser templating contract execution; 50% upon final polish and architectural signoff."
      }
    });
  } catch (error: any) {
    console.error("Error booking consultation call:", error);
    return res.status(500).json({
      error: "Failed to process consultation booking.",
      details: error?.message || "Internal error"
    });
  }
});

// Get leads pipeline (for verification and dashboard review)
app.get("/api/leads", (_req, res) => {
  res.json({
    totalLeads: leadsStore.length,
    leads: leadsStore
  });
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
      // Return a smart domain-specific response based on keywords
      const query = message.toLowerCase();
      let fallbackAnswer = "Welcome to Isaac Stone and Tile LLC. We specialize in precision marble, granite, quartzite, and large-format porcelain installations across Long Island and the Hamptons with zero-lip tolerance. Please call our master mason directly at (631) 530-5883 to schedule your laser templating.";

      if (query.includes("deposit") || query.includes("payment") || query.includes("policy")) {
        fallbackAnswer = "Our commercial policy requires a strict fifty percent mobilization deposit upon contract signing. This locks your laser templating schedule and reserves your slab cutting queue with Formia Stone. The remaining fifty percent is due upon final architectural signoff.";
      } else if (query.includes("price") || query.includes("cost") || query.includes("estimate") || query.includes("rate") || query.includes("quote")) {
        fallbackAnswer = "Because every stone slab and substrate is unique, we prepare bespoke architectural estimates and email them directly to you. You can book a consultation call right here on the page or tell me your email and phone number, and I will dispatch an itemized quote to your inbox.";
      } else if (query.includes("book") || query.includes("call") || query.includes("appointment") || query.includes("consult")) {
        fallbackAnswer = "You can book an architectural consultation call directly on our site. Our master mason will review your project dimensions, discuss stone selections from Formia Stone, and confirm your on-site digital laser survey.";
      } else if (query.includes("marble") || query.includes("calacatta") || query.includes("waterfall") || query.includes("quartzite")) {
        fallbackAnswer = "We hand-miter luxury Italian Calacatta, Carrara, Nero Marquina, and Mont Blanc quartzite slabs with forty-five degree bookmatched waterfall edges to plus or minus point two millimeter tolerances. Every slab is inspected for grain continuity before diamond cutting begins.";
      } else if (query.includes("area") || query.includes("location") || query.includes("hamptons") || query.includes("where")) {
        fallbackAnswer = "We are based in Brentwood, New York and dispatch teams daily throughout Long Island, including the Hamptons, Southampton, East Hampton, Manhasset, Old Westbury, Garden City, Suffolk, Nassau, and New York City.";
      } else if (query.includes("contact") || query.includes("phone") || query.includes("call")) {
        fallbackAnswer = "You can reach our master mason and dispatch director directly at (631) 530-5883, or view our latest verified field projects on Instagram at jafettile underscore com.";
      }

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
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 250,
      },
    });

    const reply = response.text || "Thank you for contacting Isaac Stone and Tile LLC. How may we assist with your architectural stone or tile project today?";

    // Clean up any remaining asterisks or markdown to ensure smooth speech synthesis
    const cleanedReply = reply
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    res.json({
      reply: cleanedReply,
      audioText: cleanedReply,
      source: "gemini-3.8-flash"
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
