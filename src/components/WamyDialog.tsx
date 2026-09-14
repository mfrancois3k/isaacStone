import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Keyboard,
  Send,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useVoiceAgent } from "../hooks/useVoiceAgent";
import { MarbleSphere } from "./MarbleSphere";
import { captureDetails } from "./VoiceChatBot";
import "./wamy.css";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}
interface RequestDraft {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  preferredCallTime: string;
  notes: string;
  customerSmsConsent: boolean;
}
export function WamyDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [request, setRequest] = useState<RequestDraft>({
    name: '', phone: '', email: '', projectType: '', preferredCallTime: '', notes: '', customerSmsConsent: false,
  });
  const [note, setNote] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const abort = useRef<AbortController | null>(null);
  const modalAnimation = useRef<Animation | null>(null);
  const closing = useRef(false);
  const voice = useVoiceAgent((id, sender, text) =>
    setMessages((old) =>
      old.some((m) => m.id === id)
        ? old.map((m) => (m.id === id ? { ...m, text } : m))
        : [...old, { id, sender, text }],
    ),
  );
  const show = useCallback(() => {
    if (closing.current) return;
    opener.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    voice.stop();
    abort.current?.abort();
    setBusy(false);
    const element = dialog.current;
    // Read before cancelling the entrance so dismissal continues from what is visible.
    const current = element ? getComputedStyle(element) : null;
    const from = { opacity: current?.opacity || "1", transform: current?.transform || "none" };
    modalAnimation.current?.cancel();
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }
    const mobile = matchMedia("(max-width:600px)").matches;
    const animation = element.animate(
      [
        from,
        {
          opacity: mobile ? 1 : 0,
          transform: mobile ? "translateY(100%)" : "scale(.96)",
        },
      ],
      { duration: 250, easing: "cubic-bezier(.23,1,.32,1)", fill: "forwards" },
    );
    modalAnimation.current = animation;
    animation.finished
      .then(() => {
        setOpen(false);
        animation.cancel();
      })
      .catch(() => {});
  };
  useEffect(() => {
    window.addEventListener("open-voice-bot", show);
    return () => window.removeEventListener("open-voice-bot", show);
  }, [show]);
  useEffect(() => {
    if (!open) {
      closing.current = false;
      dialog.current?.close();
      opener.current?.focus();
      return;
    }
    dialog.current?.showModal();
    if (
      dialog.current &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const mobile = matchMedia("(max-width:600px)").matches;
      modalAnimation.current = dialog.current.animate(
        [
          {
            opacity: mobile ? 1 : 0,
            transform: mobile ? "translateY(100%)" : "scale(.96)",
          },
          { opacity: 1, transform: "none" },
        ],
        { duration: 250, easing: "cubic-bezier(.23,1,.32,1)" },
      );
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      modalAnimation.current?.cancel();
    };
  }, [open]);
  useEffect(() => {
    if (typing) input.current?.focus();
  }, [typing]);
  useEffect(() => () => abort.current?.abort(), []);
  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    if (voice.active) {
      if (voice.sendText(text)) setDraft("");
      return;
    }
    setDraft("");
    setMessages((old) => [
      ...old,
      { id: crypto.randomUUID(), sender: "user", text },
    ]);
    setBusy(true);
    const controller = new AbortController();
    abort.current = controller;
    try {
      const response = await fetch("/api/voice-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-8),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.reply) throw new Error();
      setMessages((old) => [
        ...old,
        { id: crypto.randomUUID(), sender: "bot", text: data.reply },
      ]);
    } catch (error) {
      if (!controller.signal.aborted)
        setNote(
          "Could not get a reply. Please try again or call (631) 530-5883.",
        );
    } finally {
      setBusy(false);
    }
  };
  const details = captureDetails(
    messages.filter((m) => m.sender === "user").map((m) => m.text),
  );
  const lastBot = [...messages].reverse().find((m) => m.sender === "bot");
  const status = voice.error
    ? "Voice needs attention"
    : voice.notice
      ? "Conversation complete"
    : busy
      ? "Thinking…"
      : voice.state === "speaking"
        ? "Wamy is speaking…"
        : voice.muted
          ? "Microphone paused"
          : {
              idle: "Ready when you are",
              connecting: "Connecting…",
              listening: "Listening…",
              thinking: "Thinking…",
              speaking: "Wamy is speaking…",
            }[voice.state];
  const sphereState = voice.error
    ? "paused"
    : busy
      ? "thinking"
      : voice.muted && voice.state !== "speaking"
        ? "paused"
        : voice.state;
  const start = () => {
    setNote("");
    setReview(false);
    setTyping(false);
    void voice.start();
  };
  const openReview = () => {
    const transcript = messages
      .map((m) => `${m.sender === "bot" ? "Wamy" : "You"}: ${m.text}`)
      .join("\n\n");
    setRequest({
      name: details.name ?? '',
      phone: details.phone ?? '',
      email: details.email ?? '',
      projectType: details.project ?? '',
      preferredCallTime: details.timing ?? '',
      notes: transcript,
      customerSmsConsent: false,
    });
    setNote('');
    setReview(true);
  };
  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request.name.trim() || !request.phone.trim() || sendingRequest) {
      setNote('Please add your name and a number the team can call.');
      return;
    }
    setSendingRequest(true);
    setNote('');
    try {
      const response = await fetch('/api/leads/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...request, source: 'chat' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : 'Could not send your request.');
      setNote(typeof data?.message === 'string' ? data.message : 'Your request is with the team.');
      setReview(false);
    } catch (error) {
      setNote(error instanceof Error ? error.message : 'Could not send your request. Please call (631) 530-5883.');
    } finally {
      setSendingRequest(false);
    }
  };
  return (
    <>
      <button
        className="wamy-launcher"
        onClick={show}
        aria-haspopup="dialog"
        aria-label="Talk with Wamy"
      >
        <img src="/assets/wamy/idle.png" alt="" width="58" height="58" />
        <span className="wamy-launcher-particles" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
        </span>
        <span>
          Talk with Wamy<small>LET’S TALK ABOUT YOUR SPACE</small>
        </span>
        <ArrowUpRight size={18} />
      </button>
      <dialog
        ref={dialog}
        className="wamy-dialog"
        aria-labelledby="wamy-title"
        aria-describedby="wamy-subtitle"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="wamy-sheet">
          <header className="wamy-header">
            <img src="/assets/design/img13.png" alt="Isaac Stone and Tile" />
            <button
              className="wamy-icon-button"
              aria-label="Close Wamy"
              onClick={close}
            >
              <X size={22} />
            </button>
          </header>
          <div className="wamy-body">
            <h2 id="wamy-title">Talk with Wamy</h2>
            <p id="wamy-subtitle" className="wamy-eyebrow">
              AI VOICE ASSISTANT
            </p>
            <span className="wamy-rule" />
            <p className="wamy-invitation">Tell me about your project.</p>
            {open && (
              <MarbleSphere
                state={sphereState}
                getAudioLevel={voice.getAudioLevel}
                onActivate={voice.active ? voice.toggleMute : start}
                label={voice.active ? (voice.muted ? "Resume microphone with Wamy marble" : "Mute microphone with Wamy marble") : "Start conversation with Wamy marble"}
                disabled={!voice.supported || voice.state === 'connecting'}
              />
            )}
            <p className="wamy-status" role="status">
              {status}
            </p>
            {(voice.error || voice.notice) && (
              <p className="wamy-note" role={voice.error ? "alert" : "status"}>
                {voice.error || voice.notice}
              </p>
            )}
            <div key={lastBot?.id ?? "welcome"} className="wamy-current wamy-message-in" aria-live="off">
              {lastBot?.text ||
                "A beautiful space begins with a conversation. Share your ideas, ask a question, or plan an estimate."}
            </div>
            {messages.some((m) => m.sender === "user") && !review && (
              <button className="wamy-request-cta" onClick={() => { voice.stop(); openReview(); }}>
                <span>Request an estimate</span>
                <small>Review the details, then send them to the team</small>
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            )}
            <div className="wamy-reveal" hidden={messages.length === 0} inert={messages.length === 0}>
              <details className="wamy-history">
                <summary>
                  Conversation <span>{messages.length} messages</span>
                </summary>
                <div aria-label="Conversation transcript">
                  {messages.map((m) => (
                    <p key={m.id}>
                      <b>{m.sender === "bot" ? "Wamy" : "You"}</b>
                      {m.text}
                    </p>
                  ))}
                </div>
              </details>
            </div>
            <div className="wamy-reveal" hidden={!review} inert={!review}>
              <form className="wamy-review" onSubmit={submitRequest}>
                <h3>Review your request</h3>
                <p>
                  Wamy included your conversation. Confirm the details below, then send the estimate request to the team. A team member confirms any appointment time.
                </p>
                <label>Name <input required value={request.name} onChange={(e) => setRequest((v) => ({ ...v, name: e.target.value }))} /></label>
                <label>Phone <input required type="tel" value={request.phone} onChange={(e) => setRequest((v) => ({ ...v, phone: e.target.value }))} /></label>
                <label>Email <input type="email" value={request.email} onChange={(e) => setRequest((v) => ({ ...v, email: e.target.value }))} /></label>
                <label>Project <input value={request.projectType} onChange={(e) => setRequest((v) => ({ ...v, projectType: e.target.value }))} /></label>
                <label>Best time to call <input value={request.preferredCallTime} onChange={(e) => setRequest((v) => ({ ...v, preferredCallTime: e.target.value }))} /></label>
                <label className="wamy-consent"><input type="checkbox" checked={request.customerSmsConsent} onChange={(e) => setRequest((v) => ({ ...v, customerSmsConsent: e.target.checked }))} /> Text me a confirmation about this request.</label>
                <button className="wamy-secondary" disabled={sendingRequest}>
                  {sendingRequest ? 'Sending…' : 'Send request to the team'} <ArrowUpRight size={16} />
                </button>
              </form>
            </div>
            {note && (
              <p className="wamy-note" role="status">
                {note}
              </p>
            )}
            <div className="wamy-reveal" hidden={!typing} inert={!typing}>
              <form className="wamy-input" onSubmit={send}>
                <label className="sr-only" htmlFor="wamy-message">
                  Your message
                </label>
                <input
                  ref={input}
                  id="wamy-message"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Tell Wamy about your space…"
                  maxLength={3000}
                />
                <button
                  aria-label="Send message"
                  disabled={busy || !draft.trim()}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
          <footer className="wamy-controls">
            <div className="wamy-actions">
              {voice.active ? (
                <button className="wamy-primary" onClick={() => { voice.stop(); if (messages.some((m) => m.sender === "user")) openReview(); }}>
                  <PhoneOff size={17} />
                  Review request
                </button>
              ) : (
                <button
                  className="wamy-primary"
                  disabled={!voice.supported}
                  onClick={start}
                >
                  <Mic size={17} />
                  Start conversation
                </button>
              )}
              <button
                className="wamy-secondary"
                onClick={() => {
                  voice.stop();
                  setTyping(!typing);
                }}
              >
                <Keyboard size={18} />
                {typing ? "Hide keyboard" : "Type instead"}
              </button>
            </div>
            <div className="wamy-utilities">
              {voice.active && (
                <button onClick={voice.toggleMute} aria-pressed={voice.muted}>
                  {voice.muted ? <MicOff size={15} /> : <Mic size={15} />}{" "}
                  {voice.muted ? "Resume microphone" : "Mute microphone"}
                </button>
              )}
              <a href="tel:+16315305883">Call the team ↗</a>
            </div>
            <small>
              Start conversation or tap the marble to speak. During a call, tap it to mute or resume your microphone.
            </small>
          </footer>
        </div>
      </dialog>
    </>
  );
}
