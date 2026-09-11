import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS } from '../data/site';

/**
 * The estimate helper. It asks four things — name, phone, room/material and
 * rough timing — then hands them to Jonathan.
 *
 * Everything it *claims* about the business comes from the server prompt in
 * server.ts, which is held to src/data/site.ts. Nothing in this file should ever
 * put a price, a deposit or a timeline on the screen.
 */

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

// Wamy introduces itself by name, matching the persona in shared/wamy-prompt.ts.
// Kept free of any promise that details are sent: only the Send button does that.
const GREETING =
  "Hi, I'm Wamy. Tell me about the project — the room and the material you have in mind — and I'll help you get a free on-site estimate.";

/** Launcher teases. Rotated on a timer while the drawer is closed. */
const HINTS = [
  { tag: 'ESTIMATE', text: 'Want a free on-site visit? Tell me the room and I will pass it on.' },
  { tag: 'SERVICES', text: 'Not sure whether you need granite or marble? Tell me the room.' },
  { tag: 'THE CREW', text: 'Want Jonathan to call you instead? Tell me the best time.' },
  { tag: 'CONTACT', text: 'I can take your details in about thirty seconds. Want to try?' },
];

// ---------------------------------------------------------------------------
// What the visitor has told us. Read straight out of their own messages, so the
// summary block can only ever show words they typed.
//
// ponytail: keyword + regex capture, deliberately conservative. It misses
// phrasings it does not know, which is why the drawer prints what is still
// missing rather than pretending it has everything. Move this server-side if
// the miss rate starts costing leads.
// ---------------------------------------------------------------------------

const PHONE_RE = /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
const NAME_RE = /\b(?:my name is|i am|i'm|this is|it's)\s+([A-Za-z][\w'-]+(?: [A-Za-z][\w'-]+)?)/i;
const NAME_STOPWORDS = new Set([
  'looking', 'thinking', 'trying', 'just', 'not', 'interested', 'wondering',
  'hoping', 'planning', 'calling', 'in', 'at', 'a', 'the', 'doing', 'after',
  'about', 'going', 'redoing', 'ready',
]);
const MATERIALS = ['tile', 'granite', 'marble', 'foundation', 'superstructure', 'stone'];
const ROOMS = [
  'kitchen', 'bathroom', 'bath', 'shower', 'floor', 'patio', 'basement',
  'hallway', 'entryway', 'countertop', 'backsplash', 'fireplace', 'stairs',
  'laundry', 'porch', 'deck', 'foyer',
];
const TIMING_WORDS = [
  'asap', 'as soon as', 'right away', 'this week', 'next week', 'this month',
  'next month', 'spring', 'summer', 'autumn', 'fall', 'winter', 'january',
  'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
  'october', 'november', 'december', 'no rush', 'flexible',
];
const TIMING_RE = /\b\d+\s*(?:day|week|month)s?\b/i;

export interface CapturedDetails {
  name?: string;
  phone?: string;
  email?: string;
  project?: string;
  timing?: string;
}

/** Pure — exported so it can be checked without rendering anything. */
export function captureDetails(userMessages: readonly string[]): CapturedDetails {
  const found: CapturedDetails = {};
  const project = new Set<string>();

  for (const raw of userMessages) {
    const text = raw.trim();
    const lower = text.toLowerCase();

    const phone = found.phone ?? text.match(PHONE_RE)?.[0].trim();
    if (phone) found.phone = phone;
    const email = found.email ?? text.match(EMAIL_RE)?.[0].trim();
    if (email) found.email = email;

    if (!found.name) {
      const candidate = text.match(NAME_RE)?.[1]?.trim();
      if (candidate && !NAME_STOPWORDS.has(candidate.split(' ')[0].toLowerCase())) {
        found.name = candidate;
      }
    }

    for (const word of [...ROOMS, ...MATERIALS]) {
      if (lower.includes(word)) project.add(word);
    }

    const timing =
      found.timing ??
      TIMING_WORDS.find((w) => lower.includes(w)) ??
      text.match(TIMING_RE)?.[0].toLowerCase();
    if (timing) found.timing = timing;
  }

  if (project.size) found.project = [...project].join(', ');
  return found;
}

function summarise(details: CapturedDetails): string {
  return [details.name, details.phone, details.email, details.project, details.timing]
    .filter(Boolean)
    .join(' · ');
}

const LABEL = 'font-mono text-[9px] uppercase tracking-[0.16em]';
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

export function VoiceChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'greeting', sender: 'bot', text: GREETING },
  ]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micError, setMicError] = useState('');
  const [speakOn, setSpeakOn] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [handoff, setHandoff] = useState<{ state: 'idle' | 'sending' | 'sent' | 'error'; note: string }>(
    { state: 'idle', note: '' },
  );

  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ start: () => void; stop: () => void; abort: () => void } | null>(null);
  const speakOnRef = useRef(speakOn);
  speakOnRef.current = speakOn;

  const details = useMemo(
    () => captureDetails(messages.filter((m) => m.sender === 'user').map((m) => m.text)),
    [messages],
  );
  const summary = summarise(details);
  const missing = (['name', 'phone', 'email'] as const).filter((k) => !details[k]);

  const speak = useCallback((text: string) => {
    if (!speakOnRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }, []);

  const pushMessage = useCallback((sender: 'user' | 'bot', text: string) => {
    setMessages((prev) => [...prev, { id: `${sender}-${Date.now()}-${prev.length}`, sender, text }]);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || isLoading) return;

      const history = messages.slice(-5).map((m) => ({ sender: m.sender, text: m.text }));
      pushMessage('user', content);
      setDraft('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/voice-consultant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, conversationHistory: history }),
        });
        const data = await response.json();
        const reply =
          typeof data.reply === 'string' && data.reply.trim()
            ? data.reply
            : `I did not catch that. You can always call ${BUSINESS.phone}.`;
        pushMessage('bot', reply);
        speak(reply);
      } catch {
        const reply = `Something went wrong on our end — sorry. Call ${BUSINESS.phone} and Jonathan will pick up, Monday to Saturday.`;
        pushMessage('bot', reply);
        speak(reply);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, pushMessage, speak],
  );

  // Latest sender, so the recognition instance below is built once and never
  // torn down mid-utterance just because a message arrived.
  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  // --- Web Speech API. Absent in Firefox and elsewhere; the drawer stays a text chat.
  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => {
      setMicError('');
      setIsListening(true);
    };
    recognition.onresult = (event: any) => {
      const result = event.results[event.resultIndex];
      setDraft(result[0].transcript);
      if (result.isFinal) {
        setIsListening(false);
        void sendMessageRef.current(result[0].transcript);
      }
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      setMicError(
        event.error === 'not-allowed' || event.error === 'service-not-allowed'
          ? 'No microphone access — type your answer instead, or just call us.'
          : 'The microphone did not catch that. Try again, or type it below.',
      );
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  // Opened from the navbar / hero CTA.
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('open-voice-bot', open);
    return () => window.removeEventListener('open-voice-bot', open);
  }, []);

  // ponytail: hints rotate on a timer. The prototype keyed them to the section
  // in view; that needs an observer over sections this component does not own.
  useEffect(() => {
    if (isOpen || hintDismissed) return;
    const id = window.setInterval(() => setHintIndex((i) => (i + 1) % HINTS.length), 7000);
    return () => window.clearInterval(id);
  }, [isOpen, hintDismissed]);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) transcriptEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [messages, isOpen, isLoading]);

  const closeDrawer = () => {
    recognitionRef.current?.abort();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsListening(false);
    setIsOpen(false);
    launcherRef.current?.focus();
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    try {
      recognitionRef.current.start();
    } catch {
      setMicError('The microphone is already running. Give it a moment.');
    }
  };

  const sendToJonathan = async () => {
    setHandoff({ state: 'sending', note: '' });
    try {
      const response = await fetch('/api/leads/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: details.name ?? '',
          email: details.email ?? '',
          phone: details.phone ?? '',
          projectType: details.project ?? '',
          preferredCallTime: details.timing ?? '',
          notes: `From the AI agent: ${summary}`,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setHandoff({
          state: 'error',
          note:
            typeof data?.error === 'string'
              ? `${data.error} Or call ${BUSINESS.phone}.`
              : `That did not go through. Please call ${BUSINESS.phone}.`,
        });
        return;
      }
      // Deliberately not echoing the server's own message back — it describes an
      // email dispatch this build does not perform.
      setHandoff({
        state: 'sent',
        note: `Sent. If you have not heard back today, call ${BUSINESS.phone}.`,
      });
    } catch {
      setHandoff({
        state: 'error',
        note: `That did not go through — no connection. Please call ${BUSINESS.phone}.`,
      });
    }
  };

  const hint = HINTS[hintIndex];

  return (
    <div className="fixed bottom-[72px] right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {!isOpen && !hintDismissed && (
          <motion.button
            key="hint"
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => {
              setHintDismissed(true);
              setIsOpen(true);
            }}
            className={`relative hidden max-w-[min(340px,calc(100vw-40px))] items-start gap-3 border border-ink-deep bg-paper px-4 py-3.5 text-left text-ink shadow-[0_18px_44px_rgba(0,0,0,.28)] md:flex ${FOCUS}`}
          >
            <span className="absolute inset-x-0 top-0 h-0.5 bg-brand" />
            <span className="mt-0.5 flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-ink-deep">
              <span className="h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className={`${LABEL} text-brand`}>AI AGENT · {hint.tag}</span>
              <span className="font-sans text-[16px] leading-[1.35]">{hint.text}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute-2">
                TAP TO ANSWER →
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="false"
            aria-label="Wamy, the estimate helper"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-h-[calc(100vh-92px)] w-[min(352px,calc(100vw-32px))] min-h-0 flex-col border border-ink-deep bg-paper shadow-[0_22px_58px_rgba(0,0,0,.28)]"
          >
            <div className="relative flex flex-none items-center justify-between gap-2.5 bg-ink-deep px-4 py-3 text-paper">
              <span className="absolute inset-x-0 top-0 h-0.5 bg-brand" />
              <span className="flex flex-col gap-0.5">
                <span className={`${LABEL} text-brand`}>AI VOICE AGENT</span>
                <span className="font-display text-[20px] leading-none">Wamy</span>
              </span>
              <span className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setSpeakOn((on) => !on);
                  }}
                  aria-pressed={speakOn}
                  className={`h-[34px] border border-ink-line-2 px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper ${FOCUS} ${speakOn ? 'bg-brand' : 'bg-transparent'}`}
                >
                  {speakOn ? 'Voice on' : 'Voice off'}
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close Wamy"
                  className={`flex h-[34px] w-[34px] items-center justify-center border border-ink-line-2 text-[17px] leading-none text-paper ${FOCUS}`}
                >
                  ✕
                </button>
              </span>
            </div>

            <div
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="flex min-h-[140px] flex-1 flex-col gap-2.5 overflow-y-auto p-4"
            >
              {messages.map((msg) => (
                <p
                  key={msg.id}
                  className={`max-w-[86%] px-3.5 py-2.5 font-sans text-[15px] leading-[1.45] ${
                    msg.sender === 'user'
                      ? 'self-end bg-ink text-paper'
                      : 'self-start bg-paper-2 text-ink'
                  }`}
                >
                  <span className="sr-only">{msg.sender === 'user' ? 'You said: ' : 'Agent: '}</span>
                  {msg.text}
                </p>
              ))}
              {isLoading && (
                <p className="self-start bg-paper-2 px-3.5 py-2.5 font-sans text-[15px] text-mute-3">
                  Typing…
                </p>
              )}
              <div ref={transcriptEndRef} />
            </div>

            {summary && (
              <div className="mx-4 flex flex-none flex-col gap-1.5 border-l-[3px] border-brand bg-paper-2 px-3.5 py-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-mute-2">
                  Captured so far
                </span>
                <span className="font-sans text-[16px] leading-[1.45]">{summary}</span>
              </div>
            )}

            <div className="flex flex-none flex-col gap-3 px-4 pb-4 pt-3.5">
              {speechSupported ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleMic}
                    aria-label={isListening ? 'Stop listening' : 'Start talking'}
                    aria-pressed={isListening}
                    className={`relative flex h-12 w-12 flex-none items-center justify-center rounded-full text-white ${FOCUS} ${isListening ? 'bg-brand' : 'bg-ink'}`}
                  >
                    <span className="text-[15px] leading-none">●</span>
                  </button>
                  <span className="min-w-0 flex-1 font-sans text-[15px] leading-[1.35] text-mute-3">
                    {micError ||
                      (isListening ? (
                        <span className="font-medium text-brand">● listening — speak now, or tap again to stop.</span>
                      ) : (
                        'Tap to talk, or type below. Nothing is recorded until you tap.'
                      ))}
                  </span>
                </div>
              ) : (
                <p className="font-sans text-[15px] leading-[1.35] text-mute-3">
                  This browser does not support voice input, so type your answer below — it works
                  exactly the same. Or call {BUSINESS.phone}.
                </p>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage(draft);
                }}
                className="flex gap-2"
              >
                <label htmlFor="voice-agent-input" className="sr-only">
                  Type your answer
                </label>
                <input
                  id="voice-agent-input"
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="or type your answer"
                  autoComplete="off"
                  className={`min-h-[46px] min-w-0 flex-1 border-[1.5px] border-mute-light bg-white px-3.5 font-sans text-[15px] text-ink ${FOCUS}`}
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || isLoading}
                  className={`min-h-[46px] bg-ink px-4 font-sans text-[15px] font-bold text-white disabled:opacity-40 ${FOCUS}`}
                >
                  Send
                </button>
              </form>

              <div className="flex flex-col gap-2.5 border-t border-sand pt-2.5">
                <button
                  type="button"
                  onClick={sendToJonathan}
                  disabled={handoff.state === 'sending'}
                  className={`flex min-h-12 items-center justify-center bg-brand px-3 font-sans text-[15px] font-bold text-white disabled:opacity-60 ${FOCUS}`}
                >
                  {handoff.state === 'sending' ? 'Sending…' : 'Send this to Jonathan'}
                </button>
                {handoff.state === 'idle' && missing.length > 0 && (
                  <p className="font-sans text-[13px] leading-snug text-mute-3">
                    Still needed before this can go through: {missing.join(', ')}. Type it above and
                    I will add it.
                  </p>
                )}
                {handoff.note && (
                  <p
                    role="status"
                    className={`font-sans text-[13px] leading-snug ${handoff.state === 'error' ? 'text-brand' : 'text-mute-3'}`}
                  >
                    {handoff.note}
                  </p>
                )}
                <a
                  href={BUSINESS.phoneHref}
                  className={`flex min-h-12 items-center justify-center border-[1.5px] border-ink px-3 font-sans text-[15px] font-bold text-ink no-underline ${FOCUS}`}
                >
                  Or call {BUSINESS.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? closeDrawer() : setIsOpen(true))}
        aria-expanded={isOpen}
        className={`flex min-h-[50px] items-center gap-2.5 bg-ink-deep px-5 py-3.5 font-sans text-[16px] font-bold text-paper shadow-[0_8px_24px_rgba(0,0,0,.26)] ${FOCUS}`}
      >
        <span className="h-2.5 w-2.5 flex-none rounded-full bg-brand" />
        <span>{isOpen ? 'Hide the agent' : 'Talk to our AI agent'}</span>
      </button>
    </div>
  );
}
